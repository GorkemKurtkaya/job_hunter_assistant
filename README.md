<div align="center">
  <img src="frontend/public/images/android-chrome-512x512.png" alt="Job Hunter Assistant Logo" width="250" height="250">
  <h1>🚀 Job Hunter Assistant</h1>
  <p><strong>İş arayanlar için akıllı kariyer yönetim platformu</strong></p>
  
  [![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
  [![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database-orange.svg)](https://supabase.com/)
  [![Google Gemini](https://img.shields.io/badge/Google-Gemini%20AI-blue.svg)](https://ai.google.dev/)
</div>

---

## 📋 İçindekiler

- [🎯 Proje Hakkında](#-proje-hakkında)
- [💡 Proje Hikayesi](#-proje-hikayesi)
- [✨ Özellikler](#-özellikler)
- [🏗️ Mimari](#️-mimari)
- [🚀 Kurulum](#-kurulum)
- [🔧 Kullanım](#-kullanım)
- [📱 Chrome Extension](#-chrome-extension)
- [🛠️ Teknik Detaylar](#️-teknik-detaylar)
- [📊 API Endpoints](#-api-endpoints)
- [🔒 Güvenlik](#-güvenlik)
- [🤝 Katkıda Bulunma](#-katkıda-bulunma)
- [📄 Lisans](#-lisans)

---

## 🎯 Proje Hakkında

**Job Hunter Assistant**, iş arayanların kariyer yolculuklarını kolaylaştırmak için tasarlanmış kapsamlı bir web uygulamasıdır. LinkedIn iş ilanlarından otomatik veri toplama, başvuru takibi, AI destekli CV analizi ve profesyonel profil yönetimi özelliklerini bir arada sunar.

### 🎨 Tasarım Felsefesi

- **Kullanıcı Dostu**: Modern ve sezgisel arayüz tasarımı
- **Responsive**: Tüm cihazlarda mükemmel deneyim
- **Glassmorphism**: Şık ve modern görsel tasarım
- **Accessibility**: Erişilebilirlik standartlarına uygun

---

## 💡 Proje Hikayesi

Bu proje, benim de içinde bulunduğum zorlu iş arama sürecinden doğdu. Başta sadece kendim için kullanmak istediğim basit bir araç olarak başladı, ancak fark ettim ki benim gibi birçok Türk genci iş ararken benzer zorluklarla karşılaşıyor.

### 🎯 **Ana Amaç**

Projenin temel amacı çok basit: Chrome extension üzerinden LinkedIn'de yaptığınız iş başvurularını otomatik olarak veritabanına kaydediyor ve yapay zeka ile profilinizi (CV formatında düzenlenmiş) iş ilanıyla karşılaştırarak uyum yüzdesi veriyor.

### 🚀 **Gelecek Planları**

İlk versiyonun ardından geliştirmek istediğim özellikler:

- **Detaylı Analiz Çıktıları**: Eksik noktaların ve geliştirilmesi gereken alanların kullanıcıya vurgulanması
- **İletişim Bilgileri**: Şirketlerdeki işe alım yetkililerine ulaşmak için gerekli iletişim adreslerinin toplanması
- **Gelişmiş AI Özellikleri**: Daha kapsamlı CV analizi ve kariyer önerileri

### 🤝 **Topluluk Desteği**

Geliştirme konusunda topluluğun yardımına ihtiyacım var! Bu projeye sadece kod olarak değil, fikir olarak da katkıda bulunursanız çok sevinirim. Şu anda kendi özel GCP serverımda bu sistemi kullanıyorum, eğer ilgi toplarsa topluluğa hizmet amaçlı public olarak yayınlamayı da düşünüyorum.

---

## ✨ Özellikler

### 🔐 Kimlik Doğrulama Sistemi
- Güvenli kullanıcı kaydı ve girişi
- JWT token tabanlı oturum yönetimi
- Şifre sıfırlama ve profil güvenliği

### 📊 Akıllı Dashboard
- İş başvuru istatistikleri ve grafikleri
- Başvuru durumu takibi
- Performans metrikleri ve analizler
- Gerçek zamanlı güncellemeler

### 👤 Profil Yönetimi
- Detaylı kullanıcı profil bilgileri
- Deneyim ve eğitim geçmişi
- Sertifika ve yetenek yönetimi
- Sosyal medya entegrasyonu

### 🤖 AI Destekli Özellikler
- **Google Gemini AI** ile CV analizi ve optimizasyon önerileri
- İş eşleştirme algoritmaları
- Kariyer gelişim tavsiyeleri
- Başvuru başarı tahminleri

### 🔄 Otomatik Veri Toplama
- LinkedIn iş ilanlarından otomatik veri çekme
- Chrome extension entegrasyonu
- Gerçek zamanlı başvuru takibi
- Veri senkronizasyonu

---

## 🏗️ Mimari

### 🏢 Genel Sistem Mimarisi

Job Hunter Assistant, **3 ana bileşenden** oluşan modern bir full-stack web uygulamasıdır:

```
┌─────────────────────────────────────────────────────────────────┐
│                    🌐 Web Uygulaması                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   🎨 Frontend   │  │   🖥️ Backend    │  │   🔌 Extension │ │
│  │  (Next.js 14)   │  │  (Node.js/Exp)  │  │   (Chrome)     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌─────────────────────────┐
                    │    🗄️ Supabase DB      │
                    │    (PostgreSQL)        │
                    └─────────────────────────┘
```

### 🖥️ Backend Mimarisi (Node.js + Express)

**Katmanlı Mimari (Layered Architecture)** kullanılarak tasarlanmıştır:

```
backend/
├── 📁 config/                    # Konfigürasyon dosyaları
│   ├── supabase.js              # Supabase bağlantı ayarları
│   └── database.js              # Veritabanı konfigürasyonu
├── 📁 controllers/               # İş mantığı katmanı
│   ├── aiController.js          # AI servisleri kontrolü
│   ├── authController.js        # Kimlik doğrulama işlemleri
│   ├── jobApplicationController.js # İş başvuru yönetimi
│   └── userController.js        # Kullanıcı profil yönetimi
├── 📁 services/                  # Veri işleme katmanı
│   ├── aiService.js             # Google Gemini AI entegrasyonu
│   ├── authService.js           # JWT token yönetimi
│   ├── jobApplicationService.js # Başvuru veri işlemleri
│   └── userService.js           # Kullanıcı veri işlemleri
├── 📁 middleware/                # Ara yazılım katmanı
│   └── authMiddleware.js        # Kimlik doğrulama kontrolü
├── 📁 routes/                    # API endpoint tanımları
│   ├── aiRoute.js               # AI servis endpoint'leri
│   ├── authRoute.js             # Kimlik doğrulama endpoint'leri
│   ├── jobApplicationRoute.js   # Başvuru endpoint'leri
│   └── userRoute.js             # Kullanıcı endpoint'leri
├── 📁 utils/                     # Yardımcı fonksiyonlar
├── app.js                        # Ana uygulama dosyası
├── package.json                  # Bağımlılık yönetimi
└── Dockerfile                    # Container yapılandırması
```

**Backend Teknoloji Stack'i:**
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT + HTTP-only cookies
- **AI Integration**: Google Gemini AI API
- **Validation**: Joi schema validation
- **CORS**: Cross-origin resource sharing

### 🎨 Frontend Mimarisi (Next.js 14 + TypeScript)

**App Router** ve **Component-Based Architecture** kullanılarak tasarlanmıştır:

```
frontend/
├── 📁 public/                    # Statik dosyalar
│   ├── images/                   # Görsel varlıklar
│   ├── favicon.ico              # Site ikonu
│   └── js/                      # JavaScript dosyaları
├── 📁 src/
│   ├── 📁 app/                   # Next.js App Router
│   │   ├── (home)/              # Ana sayfa route grubu
│   │   │   ├── _components/     # Sayfa özel bileşenleri
│   │   │   ├── fetch.ts         # API çağrıları
│   │   │   └── page.tsx         # Ana sayfa bileşeni
│   │   ├── auth/                # Kimlik doğrulama sayfaları
│   │   │   └── sign-in/         # Giriş sayfası
│   │   ├── profile/             # Profil yönetimi
│   │   │   ├── _components/     # Profil bileşenleri
│   │   │   ├── fetch.ts         # Profil API çağrıları
│   │   │   ├── layout.tsx       # Profil layout'u
│   │   │   └── page.tsx         # Profil sayfası
│   │   ├── layout.tsx           # Ana layout
│   │   ├── providers.tsx        # Context provider'ları
│   │   └── favicon.ico          # Site ikonu
│   ├── 📁 components/            # Yeniden kullanılabilir bileşenler
│   │   ├── Auth/                # Kimlik doğrulama bileşenleri
│   │   ├── Breadcrumbs/         # Breadcrumb navigasyonu
│   │   ├── FormElements/        # Form bileşenleri
│   │   ├── Layouts/             # Layout bileşenleri
│   │   │   ├── header/          # Üst menü
│   │   │   ├── sidebar/         # Yan menü
│   │   │   └── showcase-section.tsx # Vitrin bölümü
│   │   ├── ui/                  # Temel UI bileşenleri
│   │   └── ui-elements/         # Gelişmiş UI bileşenleri
│   ├── 📁 contexts/             # React Context API
│   │   └── AuthContext.tsx      # Kimlik doğrulama durumu
│   ├── 📁 hooks/                # Custom React hooks
│   ├── 📁 lib/                  # Yardımcı kütüphaneler
│   ├── 📁 services/             # API servisleri
│   ├── 📁 types/                # TypeScript tip tanımları
│   ├── 📁 utils/                # Yardımcı fonksiyonlar
│   ├── 📁 css/                  # Stil dosyaları
│   └── 📁 fonts/                # Font dosyaları
├── tailwind.config.ts            # Tailwind CSS konfigürasyonu
├── tsconfig.json                 # TypeScript konfigürasyonu
├── next.config.mjs               # Next.js konfigürasyonu
└── package.json                  # Bağımlılık yönetimi
```

**Frontend Teknoloji Stack'i:**
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API


### 🔌 Chrome Extension Mimarisi

**Manifest V3** standardında tasarlanmış modern Chrome extension:

```
extension/
├── 📁 manifest.json              # Extension manifest dosyası
├── 📁 popup/                     # Popup arayüzü
│   ├── popup.html               # Ana popup HTML'i
│   ├── popup.css                # Popup stilleri
│   └── popup.js                 # Popup işlevselliği
├── 📁 content-scripts/           # Sayfa içi script'ler
│   └── content.js               # LinkedIn DOM manipülasyonu
├── 📁 background/                # Arka plan script'leri
│   └── background.js            # Veri işleme ve API iletişimi
├── 📁 assets/                    # Görsel varlıklar
│   ├── icons/                   # Extension ikonları
│   └── logo.png                 # Logo
└── 📁 utils/                     # Yardımcı fonksiyonlar
```

**Extension Teknoloji Stack'i:**
- **Manifest**: Manifest V3
- **Content Scripts**: LinkedIn DOM manipulation
- **Popup Interface**: HTML + CSS + JavaScript
- **Storage**: Chrome Storage API
- **Communication**: Fetch API ile backend

### 🔄 Veri Akışı Mimarisi

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Chrome    │    │   Frontend  │    │   Backend   │
│  Extension  │    │  (Next.js)  │    │ (Node.js)   │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       │ LinkedIn'den     │ Kullanıcı        │ API
       │ veri toplama     │ arayüzü          │ işlemleri
       │                  │                  │
       └──────────────────┼──────────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │  Supabase   │
                   │ PostgreSQL  │
                   └─────────────┘
```

### 🏗️ Mimari Prensipleri

1. **Separation of Concerns**: Her katmanın belirli bir sorumluluğu var
2. **Single Responsibility**: Her bileşen tek bir işi yapıyor
3. **Dependency Injection**: Bağımlılıklar dışarıdan enjekte ediliyor
4. **RESTful API**: Standart HTTP metodları kullanılıyor
5. **Type Safety**: TypeScript ile tip güvenliği sağlanıyor
6. **Scalability**: Modüler yapı ile ölçeklenebilirlik

---

## 🚀 Kurulum

### 📋 Ön Gereksinimler

- **Node.js** 18+ ([İndir](https://nodejs.org/))
- **npm** veya **yarn**
- **Supabase** hesabı ([Kayıt ol](https://supabase.com/))
- **Google Gemini AI** API anahtarı ([Al](https://ai.google.dev/))
- **Chrome** tarayıcısı

### 🔧 Backend Kurulumu

1. **Repository'yi klonlayın:**
```bash
git clone https://github.com/GorkemKurtkaya/job_hunter_assistant.git
cd job_hunter_assistant/backend
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Environment dosyası oluşturun:**
```bash
cp .env.example .env
```

4. **Gerekli API anahtarlarını ekleyin:**
```env
PORT=8000
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

5. **Veritabanını başlatın:**
```bash
npm run db:setup
```

6. **Backend'i başlatın:**
```bash
npm start
```

### 🎨 Frontend Kurulumu

1. **Frontend klasörüne gidin:**
```bash
cd ../frontend
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Environment dosyası oluşturun:**
```bash
cp .env.example .env.local
```

4. **Backend URL'ini ekleyin:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

5. **Frontend'i başlatın:**
```bash
npm run dev
```

### 🔌 Chrome Extension Kurulumu

1. **Extension repository'sini klonlayın:**
```bash
git clone https://github.com/GorkemKurtkaya/job_hunter_assistant_extension.git
cd job_hunter_assistant_extension
```

2. **Chrome'da extension'ı yükleyin:**
   - `chrome://extensions/` adresine gidin
   - "Developer mode"u açın
   - "Load unpacked" butonuna tıklayın
   - Extension klasörünü seçin

3. **Backend URL'ini güncelleyin:**
   - `content.js` dosyasında localhost URL'ini kontrol edin
   - Backend'in 8000 portunda çalıştığından emin olun

---

## 🔧 Kullanım

### 🚀 İlk Kurulum

1. **Backend ve Frontend'i başlatın**
2. **Chrome extension'ı yükleyin**
3. **Supabase veritabanını hazırlayın**
4. **Google Gemini API anahtarını ekleyin**
5. **İlk kullanıcı hesabını oluşturun**

### 📱 Web Uygulaması

- **Ana Sayfa**: İş başvuru istatistikleri ve genel bakış
- **Dashboard**: Detaylı analizler ve metrikler
- **Profil**: Kullanıcı bilgileri ve ayarlar
- **Başvurular**: Tüm iş başvurularının listesi

### 🖼️ Web Uygulaması Görselleri

#### Dashboard Sayfası
| Tema | Görsel |
|------|--------|
| **Açık Tema** | <img width="800" height="400" alt="Screenshot_7" src="https://github.com/user-attachments/assets/0615f774-3ce3-476d-85b7-b7e362519a60" /> |
| **Koyu Tema** | <img width="800" height="400" alt="Dashboard - Açık Tema" src="https://github.com/user-attachments/assets/09f4d8cf-b5a4-4f75-a45e-73a21b7add45" /> |



**Özellikler:**
- İş başvuru istatistikleri ve grafikleri
- Başvuru durumu takibi
- Performans metrikleri ve analizler
- Gerçek zamanlı güncellemeler

#### Profil Sayfası
| Görsel |
|--------|
| <img width="800" height="400" alt="Profil Sayfası" src="https://github.com/user-attachments/assets/57d36496-6a87-46df-b48c-390103a9062e" /> |


**Özellikler:**
- Kullanıcı profil bilgileri
- Deneyim ve eğitim geçmişi
- Sertifika ve yetenek yönetimi
- Sosyal medya entegrasyonu

### 🔌 Chrome Extension

- **Veri Toplama**: LinkedIn'de otomatik veri çekme
- **Toggle Kontrolü**: Özelliği açıp kapatma
- **Veri Görüntüleme**: Toplanan verileri inceleme
- **Backend Senkronizasyonu**: Verileri otomatik kaydetme

---

## 📱 Chrome Extension

### 🎯 Özellikler

- **Otomatik Veri Toplama**: LinkedIn iş ilanlarından veri çekme
- **Toggle Kontrolü**: Veri toplama özelliğini açıp kapatma
- **Modern UI**: Glassmorphism tasarım ile şık arayüz
- **API Entegrasyonu**: Backend'e otomatik veri gönderimi

### 🖼️ Extension Görselleri

#### Ana Popup Arayüzü
<img width="319" height="292" alt="image" src="https://github.com/user-attachments/assets/cadf9c48-3ba2-4f2f-b9a4-23e441ea488c" />


**Özellikler:**
- Modern glassmorphism tasarım
- Logo ve başlık
- Veri toplama toggle switch'i
- "Veriyi Göster" butonu

#### Veri Görüntüleme Ekranı
<img width="321" height="596" alt="Screenshot_10" src="https://github.com/user-attachments/assets/cd25a329-cfac-41c6-a908-ef7b49c21cb5" />


**Özellikler:**
- Geri dönüş butonu
- İş ilanı detayları
- Şirket ve pozisyon bilgileri
- Açıklama ve işe alım yapanlar

### 🔗 Gerekli Bağlantılar

- **Extension Repository**: [GitHub](https://github.com/GorkemKurtkaya/job_hunter_assistant_extension)
- **Backend API**: `http://localhost:8000/api/job-applications`

### ⚠️ Önemli Notlar

- Extension'ın çalışması için backend'in aktif olması gerekir
- LinkedIn iş ilanı sayfalarında otomatik veri toplama
- "Uygula" butonuna tıklandığında veri çekme
- Chrome storage'da toggle durumu saklama

---

## 🛠️ Teknik Detaylar

### 🖥️ Backend Teknolojileri

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **AI Service**: Google Gemini AI API
- **Authentication**: JWT + HTTP-only cookies
- **Validation**: Joi schema validation
- **CORS**: Cross-origin resource sharing

### 🎨 Frontend Teknolojileri

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Authentication**: Custom AuthContext
- **UI Components**: Custom component library

### 🔌 Extension Teknolojileri

- **Manifest**: Manifest V3
- **Content Scripts**: LinkedIn DOM manipulation
- **Popup Interface**: HTML + CSS + JavaScript
- **Storage**: Chrome Storage API
- **Communication**: Fetch API ile backend

---

## 📊 API Endpoints

### 🔐 Authentication

```http
POST /api/auth/register     # Kullanıcı kaydı
POST /api/auth/login        # Kullanıcı girişi
POST /api/auth/logout       # Kullanıcı çıkışı
GET  /api/auth/check-auth   # Oturum kontrolü
GET  /api/auth/check-admin  # Admin yetki kontrolü
```

### 👤 User Management

```http
# Profil İşlemleri
GET    /api/users/profile                    # Profil bilgileri
PUT    /api/users/profile                    # Profil güncelleme

# Sertifika İşlemleri
POST   /api/users/certifications             # Yeni sertifika ekle
PUT    /api/users/certifications/:id         # Sertifika güncelleme
DELETE /api/users/certifications/:id         # Sertifika silme

# Eğitim İşlemleri
POST   /api/users/educations                 # Yeni eğitim bilgisi ekle
PUT    /api/users/educations/:id             # Eğitim bilgisi güncelleme
DELETE /api/users/educations/:id             # Eğitim bilgisi silme

# İş Deneyimi İşlemleri
POST   /api/users/experiences                # Yeni iş deneyimi ekle
PUT    /api/users/experiences/:id            # İş deneyimi güncelleme
DELETE /api/users/experiences/:id            # İş deneyimi silme
```

### 💼 Job Applications

```http
GET    /api/job-applications        # Tüm başvuruları listele
POST   /api/job-applications        # Yeni başvuru oluştur
GET    /api/job-applications/:id    # Belirli başvuruyu getir
PUT    /api/job-applications/:id    # Başvuru güncelleme
DELETE /api/job-applications/:id    # Başvuru silme
```

### 🤖 AI Services (Google Gemini)

```http
POST /api/ai/analyze               # CV ve iş ilanı uyum analizi
```

---

## 🔒 Güvenlik

### 🛡️ Güvenlik Önlemleri

- **JWT Authentication**: Güvenli token tabanlı kimlik doğrulama
- **HTTP-only Cookies**: XSS saldırılarına karşı koruma
- **CORS Policy**: Origin kontrolü ve güvenli API erişimi
- **Input Validation**: Tüm kullanıcı girdilerinin doğrulanması
- **Rate Limiting**: API abuse koruması
- **SQL Injection Protection**: Parametreli sorgular

### 🔐 Veri Güvenliği

- **Encryption**: Hassas verilerin şifrelenmesi
- **Secure Headers**: Güvenlik başlıkları
- **Environment Variables**: Hassas bilgilerin güvenli saklanması
- **Database Security**: Supabase güvenlik özellikleri
- **API Key Security**: Gemini API anahtarının güvenli saklanması

---

## 🤝 Katkıda Bulunma

### 📋 Katkı Süreci

1. **Repository'yi fork edin**
2. **Feature branch oluşturun** (`git checkout -b feature/amazing-feature`)
3. **Değişikliklerinizi commit edin** (`git commit -m 'Add amazing feature'`)
4. **Branch'inizi push edin** (`git push origin feature/amazing-feature`)
5. **Pull Request oluşturun**

### 🧪 Geliştirme Ortamı

```bash
# Backend development
cd backend
npm run dev

# Frontend development
cd frontend
npm run dev

# Extension development
# Chrome'da extension'ı yeniden yükleyin
```

### 📝 Kod Standartları

- **TypeScript**: Strict mode kullanımı
- **ESLint**: Kod kalitesi kontrolü
- **Prettier**: Kod formatı standardizasyonu
- **Conventional Commits**: Commit mesaj formatı

### 💡 Fikir Katkısı

Bu proje sadece kod katkısı değil, **fikir katkısı** da bekliyor! İş arayanlar için hangi özelliklerin faydalı olacağını, nasıl daha iyi bir deneyim sunabileceğimizi düşünüyorsanız, GitHub Discussions'da fikirlerinizi paylaşabilirsiniz.

---

## 📄 Lisans

Bu proje [ISC License](LICENSE) altında lisanslanmıştır.

---

## 📞 İletişim

- **Proje**: [GitHub Repository](https://github.com/GorkemKurtkaya/job_hunter_assistant)
- **Extension**: [Extension Repository](https://github.com/GorkemKurtkaya/job_hunter_assistant_extension)
- **Sorular**: [GitHub Issues](https://github.com/GorkemKurtkaya/job_hunter_assistant/issues)
- **Öneriler**: [GitHub Discussions](https://github.com/GorkemKurtkaya/job_hunter_assistant/discussions)

---

<div align="center">
  <p><strong>⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!</strong></p>
  <p>Made by Görkem Kurtkaya</p>
  <p><em>İş arayanların yanında, kariyer yolculuklarında!</em></p>
</div>
