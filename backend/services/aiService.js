import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeJobFit(profile, jobDescription) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Sen bir iş uyum analiz uzmanısın. Aşağıdaki kişisel bilgileri ve iş ilanını analiz ederek, başarı olasılığını hesapla.

KİŞİSEL BİLGİLER:
${profile}

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