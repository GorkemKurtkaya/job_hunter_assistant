import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "../config/supabase.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Profil ve iş ilanını çekerek AI analizi yap
async function analyzeJobFit(userId, jobId) {
  try {
    // Kullanıcı profilini çek
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select(`
        *,
        experiences (*),
        educations (*),
        certifications (*)
      `)
      .eq("id", userId)
      .single();

    if (profileError) throw new Error(`Profil çekilemedi: ${profileError.message}`);

    // İş ilanını çek
    const { data: job, error: jobError } = await supabase
      .from("job_applications")
      .select("*")
      .eq("id", jobId)
      .single();

    if (jobError) throw new Error(`İş ilanı çekilemedi: ${jobError.message}`);

    // AI analizi yap
    const analysisResult = await performAIAnalysis(profile, job.description);
    
    // Yüzdelik değeri çıkar
    const percentageMatch = analysisResult.match(/Yüzdelik: %(\d+)/);
    const percentage = percentageMatch ? parseInt(percentageMatch[1]) : 0;

    // Sonucu job_applications tablosuna kaydet
    const { error: updateError } = await supabase
      .from("job_applications")
      .update({ analysis_percentage: percentage })
      .eq("id", jobId);

    if (updateError) throw new Error(`Analiz sonucu kaydedilemedi: ${updateError.message}`);

    return { percentage, analysis_result: analysisResult };
  } catch (error) {
    throw new Error(`AI analizi hatası: ${error.message}`);
  }
}

// AI analizi fonksiyonu
async function performAIAnalysis(profile, jobDescription) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Sen bir iş uyum analiz uzmanısın. Aşağıdaki kişisel bilgileri ve iş ilanını analiz ederek, başarı olasılığını hesapla.

KİŞİSEL BİLGİLER:
${JSON.stringify(profile, null, 2)}

İŞ İLANI AÇIKLAMASI:
${jobDescription}

GÖREV:
Bu iş ilanı ile kullanıcının uyum yüzdesini hesapla. Şu kriterleri değerlendir:

1. TEKNOLOJİ UYUMU (%40 ağırlık):
   - Kullanıcının bildiği teknolojiler vs. iş ilanında istenenler
   - Her eşleşen teknoloji +10 puan
   - Her eksik teknoloji -5 puan

2. DENEYİM SEVİYESİ (%30 ağırlık):
   - İstenen deneyim yılı vs. kullanıcının deneyimi
   - Staj deneyimi de değerli, ama tam zamanlı deneyimden daha düşük
   - Proje deneyimleri de hesaba kat

3. EĞİTİM UYUMU (%20 ağırlık):
   - Mühendislik eğitimi varsa +20 puan
   - Bilgisayar mühendisliği varsa +10 puan ekstra
   - Diğer mühendislik +5 puan

4. GENEL BECERİ UYUMU (%10 ağırlık):
   - Mikroservis, Docker gibi modern teknolojiler
   - Proje yönetimi becerileri

ÖNEMLİ: Staj deneyimini de değerli say, sadece tam zamanlı deneyim arama. Teknoloji uyumuna daha fazla ağırlık ver.

SADECE şu formatta yanıt ver:
Yüzdelik: %XX

Not: Sadece sayı formatında yanıt ver, açıklama ekleme.
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export { analyzeJobFit };