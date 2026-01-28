# Supabase Setup Instructions

## 1. Database Migration Çalıştır

Supabase Dashboard'a git: https://app.supabase.com/

1. Doğru project'i seç (feafcmvulxsrjrdxosyt)
2. **SQL Editor** → **New Query** aç
3. Aşağıdaki dosyanın içeriğini kopyala ve yapıştır:
   - `supabase/migrations/001_initial_schema.sql`
4. **RUN** butonuna tıkla

Bu işlem:
- `profiles` tablosu (users için)
- `companies`, `contacts`, `projects`, `activities` tabloları
- Row Level Security (RLS) policies
- Triggers oluşturur

## 2. Google OAuth Provider'ı Etkinleştir

1. **Authentication** → **Providers** → **Google** aç
2. Aşağıdakileri ekle:
   - **Authorized Client ID**: Google Cloud Console'dan al
   - **Authorized Client Secret**: Google Cloud Console'dan al
3. **Save** butonuna tıkla

### Google Cloud Console Setup:
1. https://console.cloud.google.com adresine git
2. Yeni proje oluştur (veya mevcut kullan)
3. **OAuth 2.0 Client ID** oluştur (Web Application)
4. **Authorized redirect URIs** ekle:
   ```
   https://feafcmvulxsrjrdxosyt.supabase.co/auth/v1/callback
   ```
5. Client ID ve Secret'i Supabase'e yapıştır

## 3. Kontrol Et

Login sayfasında test et:
- Email/Password ile kayıt + giriş
- Google ile giriş

---

**Environment Variables** zaten ayarlanmış:
- `.env` dosyasında Supabase credentials var
- React uygulaması hazır
- AuthContext otomatik session'ları yönetiyor

Supabase dashboard'da SQL script'i çalıştırdıktan sonra uygulama tamamen işlevsel olacak!
