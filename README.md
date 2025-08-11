# Job Hunter Assistant

Bu proje, iş arayanların başvurularını takip etmelerine ve kariyer gelişimlerini yönetmelerine yardımcı olan bir web uygulamasıdır.

## Özellikler

- **Authentication Sistemi**: Kullanıcı kaydı ve girişi
- **Dashboard**: İş başvuru istatistikleri ve genel bakış
- **Profil Yönetimi**: Kullanıcı profil bilgileri, deneyim, eğitim ve sertifikalar
- **İş Başvuru Takibi**: Başvuru durumları ve detayları
- **AI Destekli Özellikler**: CV analizi ve iş önerileri

## Kurulum

### Backend

1. Backend klasörüne gidin:
```bash
cd backend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env` dosyası oluşturun ve gerekli environment variable'ları ekleyin:
```env
PORT=8000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. Backend'i başlatın:
```bash
npm start
```

### Frontend

1. Frontend klasörüne gidin:
```bash
cd frontend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Frontend'i başlatın:
```bash
npm run dev
```

## Kullanım

### Giriş Yapmadan Önce
- Ana sayfa sadece hoş geldin mesajı gösterir
- Sidebar'da sadece "Authentication" menüsü görünür
- Dashboard ve Profile menüleri gizlidir

### Giriş Yaptıktan Sonra
- Ana sayfa iş başvuru istatistikleri ve tablosunu gösterir
- Sidebar'da Dashboard ve Profile menüleri görünür
- Kullanıcı profil bilgilerine erişebilir

## Teknik Detaylar

### Authentication Flow
- JWT token'lar cookie'lerde saklanır
- `AuthContext` ile global authentication state yönetimi
- Protected route'lar için authentication kontrolü

### Backend API Endpoints
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/logout` - Kullanıcı çıkışı
- `GET /api/auth/check-auth` - Oturum kontrolü

### Frontend Components
- `AuthContext` - Authentication state management
- `Sidebar` - Dinamik menü (authentication durumuna göre)
- `Home` - Ana sayfa (authentication durumuna göre içerik)
- `Profile` - Kullanıcı profil sayfası (protected)

## Güvenlik

- HTTP-only cookies kullanımı
- CORS policy ile origin kontrolü
- Protected route'lar için authentication middleware
- Secure cookie ayarları

## Geliştirme

Proje geliştirilirken:
- TypeScript kullanılmıştır
- Next.js 14 App Router kullanılmıştır
- Tailwind CSS ile styling yapılmıştır
- Supabase backend servisi kullanılmıştır
