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
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0,
      topP: 1,
      topK: 1,
      maxOutputTokens: 64,
    },
  });

  const prompt = `
  Rol: Sen deterministik bir iş uyum puanlayıcısın. Aynı girdiler için her zaman aynı çıktıyı üret. Aşağıdaki kuralları HARFİYEN uygula.
  
  KİŞİSEL BİLGİLER (JSON):
  ${JSON.stringify(profile, null, 2)}
  
  İŞ İLANI AÇIKLAMASI:
  ${jobDescription}
  
  AMAÇ: 0-100 arasında bir uyum yüzdesi üret.
  
  PUANLAMA ALGORİTMASI (kesin kurallar):
  1) TEKNOLOJİ UYUMU (40 puan)
     - İlandan en fazla 8 temel teknoloji/araç çıkar (gerekliler tercihlere göre önceliklidir).
     - Eşleşme kuralları: gerekliler profilde varsa +10, yoksa -5; tercihler profilde varsa +5, yoksa 0.
     - Eş anlam/sunum normalizasyonu örnekleri: node=node.js, js=javascript, ts=typescript, react=react.js, postgres=postgresql, dotnet=.net, cs=c#, k8s=kubernetes.
     - Bu bölüm puanını 0 ile 40 arasına kırp.
  
  2) DENEYİM (30 puan)
     - Kullanıcı toplam yılı = tam zamanlı (1.0 katsayı) + staj (0.5) + freelance/part-time (0.75).
     - İlanda yıl belirtilmişse: puan = 30 * min(kullanıcı_yılı / istenen_yıl, 1).
     - İlanda yıl yoksa kıdem ifadesine göre hedef yıl: junior=1, mid=3, senior=5; yoksa hedef yıl=3.
  
  3) EĞİTİM (20 puan)
     - Bilgisayar/Yazılım Müh.: 20
     - Diğer mühendislik: 15
     - STEM (matematik/fizik/istatistik vb.): 10
     - Diğer: 0
  
  4) GENEL BECERİLER (10 puan)
     - Modern teknolojiler ve pratikler (ör. microservices, docker, kubernetes, ci/cd, aws/azure/gcp, terraform), proje yönetimi (scrum/jira): her biri +2, en çok 10.
  
  KURALLAR:
  - Veri yoksa tahmin etme; eksik alanlar 0 puan sayılır.
  - İyimser tamamlama yapma; sadece veriye dayalı puan ver.
  - Ara adımları açıklama, sadece sonuç ver.
  - Nihai puan = (1)+(2)+(3)+(4), 0-100 aralığına kırp, en yakın 5'e yuvarla.
  
  ÇIKTI FORMATı (tek satır, başka metin ekleme):
  Yüzdelik: %NN
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export { analyzeJobFit };