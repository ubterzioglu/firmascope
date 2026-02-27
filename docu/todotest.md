# firmascope — Test Listesi ve Kontrol Planı

> **Son Güncelleme:** 2026-02-27  
> **Amaç:** Platformun tüm kritik fonksiyonlarının test edilmesi ve kalite güvencesi

---

## 🔐 Kimlik Doğrulama ve Yetkilendirme Testleri

### Auth Temel İşlemleri
| ID | Test Senaryosu | Beklenen Sonuç | Öncelik | Durum |
|----|----------------|----------------|---------|-------|
| AUTH-01 | Geçerli email/şifre ile giriş | Başarılı giriş, ana sayfaya yönlendirme | 🔴 Kritik | ⬜ |
| AUTH-02 | Hatalı şifre ile giriş | "E-posta veya şifre hatalı" mesajı | 🔴 Kritik | ⬜ |
| AUTH-03 | Kayıtlı olmayan email ile giriş | Giriş başarısız uyarısı | 🔴 Kritik | ⬜ |
| AUTH-04 | Geçersiz email formatı | Validasyon hatası | 🟡 Yüksek | ⬜ |
| AUTH-05 | 6 karakterden kısa şifre | "Şifre en az 6 karakter" uyarısı | 🟡 Yüksek | ⬜ |
| AUTH-06 | Yeni kayıt oluşturma | Başarılı kayıt, onay email'i gönderimi | 🔴 Kritik | ⬜ |
| AUTH-07 | Mevcut email ile kayıt | "Bu e-posta zaten kayıtlı" uyarısı | 🟡 Yüksek | ⬜ |
| AUTH-08 | Google OAuth ile giriş | Başarılı giriş, profil oluşumu | 🔴 Kritik | ⬜ |
| AUTH-09 | Google OAuth iptal (popup kapama) | Hatasız geri dönüş | 🟡 Yüksek | ⬜ |
| AUTH-10 | Email onaylama linki | Hesap aktifleştirme | 🔴 Kritik | ⬜ |
| AUTH-11 | Onaylanmamış hesapla giriş | "E-posta onaylanmadı" mesajı + tekrar gönderme seçeneği | 🔴 Kritik | ⬜ |
| AUTH-12 | Şifremi unuttum akışı | Reset email'i gönderimi | 🟡 Yüksek | ⬜ |
| AUTH-13 | Çıkış yapma | Session temizlenmesi, anonim görünüm | 🔴 Kritik | ⬜ |
| AUTH-14 | Token yenileme (refresh) | Sessiz token yenileme | 🟡 Yüksek | ⬜ |
| AUTH-15 | Session süresi dolması | Login sayfasına yönlendirme | 🟡 Yüksek | ⬜ |

### Rol ve Yetki Testleri
| ID | Test Senaryosu | Beklenen Sonüç | Öncelik | Durum |
|----|----------------|----------------|---------|-------|
| ROLE-01 | Admin kullanıcı admin paneli erişimi | Başarılı erişim | 🔴 Kritik | ⬜ |
| ROLE-02 | Normal kullanıcı admin paneli erişimi | Anasayfaya yönlendirme | 🔴 Kritik | ⬜ |
| ROLE-03 | Company admin şirket yönetimi erişimi | Kendi şirketi için erişim | 🔴 Kritik | ⬜ |
| ROLE-04 | Company admin başka şirket yönetimi | Erişim reddi | 🔴 Kritik | ⬜ |
| ROLE-05 | Misafir kullanıcı korumalı sayfalar | Login sayfasına yönlendirme | 🔴 Kritik | ⬜ |
| ROLE-06 | Yetki değişikliği sonrası anında etki | Sayfa refresh gerektirmeden yeni yetkiler | 🟡 Yüksek | ⬜ |

---

## 🏢 Şirket Yönetimi Testleri

### Şirket CRUD
| ID | Test Senaryosu | Beklenen Sonuç | Öncelik | Durum |
|----|----------------|----------------|---------|-------|
| COMP-01 | Şirket listeleme | Tüm aktif şirketlerin görünmesi | 🔴 Kritik | ⬜ |
| COMP-02 | Şirket detay sayfası | Tüm sekmeler ve verilerin yüklenmesi | 🔴 Kritik | ⬜ |
| COMP-03 | Şehir filtresi | Seçilen şehirdeki şirketler | 🔴 Kritik | ⬜ |
| COMP-04 | Sektör filtresi | Seçilen sektördeki şirketler | 🔴 Kritik | ⬜ |
| COMP-05 | Arama fonksiyonu | İsme göre filtreleme | 🔴 Kritik | ⬜ |
| COMP-06 | Kombine filtreler (şehir + sektör + arama) | Doğru sonuçlar | 🟡 Yüksek | ⬜ |
| COMP-07 | Admin şirket ekleme | Yeni şirket oluşumu | 🔴 Kritik | ⬜ |
| COMP-08 | Admin şirket düzenleme | Güncelleme başarılı | 🔴 Kritik | ⬜ |
| COMP-09 | Admin logo/banner upload | Dosya yükleme ve görüntüleme | 🔴 Kritik | ⬜ |
| COMP-10 | Desteklenmeyen dosya formatı | Hata mesajı | 🟡 Yüksek | ⬜ |
| COMP-11 | Büyük dosya upload (>5MB) | Hata mesajı | 🟡 Yüksek | ⬜ |
| COMP-12 | Şirket silme | Soft delete veya kaskad silme | 🔴 Kritik | ⬜ |
| COMP-13 | Benzersiz slug kontrolü | Aynı slug ile ikinci şirket engellenmesi | 🟡 Yüksek | ⬜ |
| COMP-14 | Otomatik initials oluşturma | Doğru baş harfler | 🟢 Normal | ⬜ |
| COMP-15 | Sektöre göre otomatik banner | Doğru görseller | 🟢 Normal | ⬜ |

### Şirket Öneri ve Talep
| ID | Test Senaryosu | Beklenen Sonuç | Öncelik | Durum |
|----|----------------|----------------|---------|-------|
| SUGG-01 | Giriş yapmış kullanıcı şirket önerisi | Başarılı kayıt, admin'e bildirim | 🔴 Kritik | ⬜ |
| SUGG-02 | Misafir şirket önerisi | Login'e yönlendirme | 🔴 Kritik | ⬜ |
| SUGG-03 | Admin öneri onaylama | Şirket oluşumu, kullanıcıya bildirim | 🔴 Kritik | ⬜ |
| SUGG-04 | Admin öneri reddetme | Red mesajı, kullanıcıya bildirim | 🔴 Kritik | ⬜ |
| CLAIM-01 | Şirket sahiplenme talebi | Talep kaydı | 🟡 Yüksek | ⬜ |
| CLAIM-02 | Admin talep onaylama | Company admin rolü atanması | 🟡 Yüksek | ⬜ |

---

## 📝 Değerlendirme ve İçerik Testleri

### Review (Değerlendirme)
| ID | Test Senaryosu | Beklenen Sonuç | Öncelik | Durum |
|----|----------------|----------------|---------|-------|
| REV-01 | Yeni değerlendirme ekleme | Başarılı kayıt, anında görünme | 🔴 Kritik | ⬜ |
| REV-02 | Boş başlık ile ekleme | Validasyon hatası | 🔴 Kritik | ⬜ |
| REV-03 | 1-5 arası puanlama | Doğru kayıt | 🔴 Kritik | ⬜ |
| REV-04 | Artılar/Eksiler metni | Markdown/text kaydı | 🟡 Yüksek | ⬜ |
| REV-05 | Tavsiye eder/etmez seçimi | Boolean kaydı | 🟡 Yüksek | ⬜ |
| REV-06 | Rate limit (saatte 5+) | 6. denemede hata mesajı | 🔴 Kritik | ⬜ |
| REV-07 | Kendi değerlendirmesini görme | Profil/sayfada görünme | 🟡 Yüksek | ⬜ |
| REV-08 | Başkası review'unda user_id gizliği | Anonim görünüm | 🔴 Kritik | ⬜ |
| REV-09 | Review düzenleme | Update başarılı | 🟡 Yüksek | ⬜ |
| REV-10 | Review silme | Soft delete | 🟡 Yüksek | ⬜ |
| REV-11 | Admin review silme | Başarılı silme | 🔴 Kritik | ⬜ |
| REV-12 | Review raporlama | Rapor kaydı, admin bildirimi | 🟡 Yüksek | ⬜ |
| REV-13 | Ortalama puan hesaplama | Doğru matematiksel hesaplama | 🔴 Kritik | ⬜ |

### Salary (Maaş)
| ID | Test Senaryosu | Beklenen Sonuç | Öncelik | Durum |
|----|----------------|----------------|---------|-------|
| SAL-01 | Maaş bilgisi ekleme | Başarılı kayıt | 🔴 Kritik | ⬜ |
| SAL-02 | Maaş görme (give-to-get kuralı) | Önce paylaşma zorunluluğu | 🔴 Kritik | ⬜ |
| SAL-03 | Maaş görme (kendi paylaşmış) | Tüm maaşlar görünür | 🔴 Kritik | ⬜ |
| SAL-04 | Pozisyon adı zorunlu | Validasyon | 🔴 Kritik | ⬜ |
| SAL-05 | Geçersiz maaş miktarı (0, negatif) | Validasyon hatası | 🔴 Kritik | ⬜ |
| SAL-06 | Döviz seçimi (TRY/USD/EUR) | Doğru kayıt | 🟡 Yüksek | ⬜ |
| SAL-07 | Deneyim yılı seçimi | Doğru kayıt | 🟡 Yüksek | ⬜ |
| SAL-08 | Rate limit (saatte 5+) | 6. denemede hata | 🔴 Kritik | ⬜ |
| SAL-09 | Anonimlik (user_id gizli) | Public view'da görünmeme | 🔴 Kritik | ⬜ |
| SAL-10 | Para birimi formatı | Binlik ayraç, sembol | 🟢 Normal | ⬜ |

### Interview (Mülakat)
| ID | Test Senaryosu | Beklenen Sonuç | Öncelik | Durum |
|----|----------------|----------------|---------|-------|
| INT-01 | Mülakat deneyimi ekleme | Başarılı kayıt | 🔴 Kritik | ⬜ |
| INT-02 | Pozisyon adı zorunlu | Validasyon | 🔴 Kritik | ⬜ |
| INT-03 | Zorluk seviyesi seçimi (Kolay/Orta/Zor) | Doğru kayıt | 🟡 Yüksek | ⬜ |
| INT-04 | Sonuç seçimi (Teklif/Red/Olumlu/Olumsuz) | Doğru kayıt | 🟡 Yüksek | ⬜ |
| INT-05 | Deneyim metni | Kayıt başarılı | 🟡 Yüksek | ⬜ |
| INT-06 | Rate limit (saatte 5+) | 6. denemede hata | 🔴 Kritik | ⬜ |
| INT-07 | Anonimlik | Public view'da user_id yok | 🔴 Kritik | ⬜ |
| INT-08 | Boş pozisyon | Validasyon hatası | 🔴 Kritik | ⬜ |

### Oylama Sistemi
| ID | Test Senaryosu | Beklenen Sonuç | Öncelik | Durum |
|----|----------------|----------------|---------|-------|
| VOTE-01 | Thumbs up verme | Oy kaydı, sayı artışı | 🔴 Kritik | ⬜ |
| VOTE-02 | Thumbs down verme | Oy kaydı, sayı artışı | 🔴 Kritik | ⬜ |
| VOTE-03 | Aynı içeriğe tekrar oy | Toggle (kaldırma) | 🟡 Yüksek | ⬜ |
| VOTE-04 | Oy değiştirme (up -> down) | Update işlemi | 🟡 Yüksek | ⬜ |
| VOTE-05 | Oy sayıları doğru hesaplama | Doğru matematik | 🔴 Kritik | ⬜ |
| VOTE-06 | Misafir oy kullanma | Login'e yönlendirme | 🔴 Kritik | ⬜ |

---

## 🎨 UI/UX Testleri

### Responsive Tasarım
| ID | Test Senaryosu | Beklenen Sonüç | Öncelik | Durum |
|----|----------------|----------------|---------|-------|
| RESP-01 | Mobile (375px) ana sayfa | Düzgün görünüm | 🔴 Kritik | ⬜ |
| RESP-02 | Mobile şirket detay | Tab'lar erişilebilir | 🔴 Kritik | ⬜ |
| RESP-03 | Tablet (768px) görünüm | Düzgün grid düzeni | 🔴 Kritik | ⬜ |
| RESP-04 | Desktop (1440px) görünüm | Optimal kullanım | 🔴 Kritik | ⬜ |
| RESP-05 | FirmaPill menü mobile | Dokunmatik uyumlu | 🔴 Kritik | ⬜ |
| RESP-06 | Form alanları mobile | Klavye ile uyumlu | 🔴 Kritik | ⬜ |
| RESP-07 | Carousel mobile | Swipe desteği | 🟡 Yüksek | ⬜ |

### Tema ve Görünüm
| ID | Test Senaryosu | Beklenen Sonuç | Öncelik | Durum |
|----|----------------|----------------|---------|-------|
| THEME-01 | Light mode | Doğru renkler | 🔴 Kritik | ⬜ |
| THEME-02 | Dark mode | Doğlu renkler | 🔴 Kritik | ⬜ |
| THEME-03 | Sistem teması otomatik algılama | OS tercihine göre | 🟡 Yüksek | ⬜ |
| THEME-04 | Tema değiştirme | Anında uygulanma | 🟡 Yüksek | ⬜ |

### Navigasyon
| ID | Test Senaryosu | Beklenen Sonuç | Öncelik | Durum |
|----|----------------|----------------|---------|-------|
| NAV-01 | Tüm menü linkleri çalışıyor | Doğru sayfaya gitme | 🔴 Kritik | ⬜ |
| NAV-02 | 404 sayfası | Bilgilendirici mesaj | 🟡 Yüksek | ⬜ |
| NAV-03 | 404'ten ana sayfaya dönüş | Çalışan link | 🟡 Yüksek | ⬜ |
| NAV-04 | Geri butonu davranışı | Doğru history yönetimi | 🟡 Yüksek | ⬜ |
| NAV-05 | Deep link (doğrudan şirket sayfası) | Doğru yükleme | 🔴 Kritik | ⬜ |

---

## ⚡ Performans Testleri

| ID | Test Senaryosu | Beklenen Sonuç | Öncelik | Durum |
|----|----------------|----------------|---------|-------|
| PERF-01 | Ana sayfa ilk yüklenme | < 3 saniye | 🔴 Kritik | ⬜ |
| PERF-02 | Şirket listesi yükleme | < 2 saniye | 🔴 Kritik | ⬜ |
| PERF-03 | Şirket detay yükleme | < 2 saniye | 🔴 Kritik | ⬜ |
| PERF-04 | 100+ şirket listeleme | Sayfalama/scroll performansı | 🟡 Yüksek | ⬜ |
| PERF-05 | Image lazy loading | Görsel optimize yüklenme | 🟡 Yüksek | ⬜ |
| PERF-06 | Lighthouse skoru | > 80 (tüm kategoriler) | 🟡 Yüksek | ⬜ |
| PERF-07 | Time to Interactive | < 3.5 saniye | 🟡 Yüksek | ⬜ |

---

## 🔒 Güvenlik Testleri

| ID | Test Senaryosu | Beklenen Sonuç | Öncelik | Durum |
|----|----------------|----------------|---------|-------|
| SEC-01 | SQL Injection denemesi | Engel (prepared statements) | 🔴 Kritik | ⬜ |
| SEC-02 | XSS denemesi (script injection) | Escape/encoding | 🔴 Kritik | ⬜ |
| SEC-03 | CSRF koruması | Token doğrulama | 🔴 Kritik | ⬜ |
| SEC-04 | RLS politikaları çalışıyor | Yetkisiz veri erişimi engelleniyor | 🔴 Kritik | ⬜ |
| SEC-05 | Admin API rate limiting | Fazla istek engelleniyor | 🟡 Yüksek | ⬜ |
| SEC-06 | Şifre güvenliği (hash) | BCrypt/Argon2 kullanımı | 🔴 Kritik | ⬜ |
| SEC-07 | HTTPS zorunluluğu | HTTP yönlendirmesi | 🔴 Kritik | ⬜ |
| SEC-08 | CORS ayarları | Sadece izinli origin'ler | 🔴 Kritik | ⬜ |
| SEC-09 | JWT token güvenliği | İmza doğrulama, süre | 🔴 Kritik | ⬜ |
| SEC-10 | Dosya upload güvenliği | Tip kontrolü, boyut limiti | 🔴 Kritik | ⬜ |

---

## 🗄️ Veritabanı Testleri

| ID | Test Senaryosu | Beklenen Sonuç | Öncelik | Durum |
|----|----------------|----------------|---------|-------|
| DB-01 | Trigger çalışması (updated_at) | Otomatik güncelleme | 🔴 Kritik | ⬜ |
| DB-02 | Rate limit trigger'ı | Saatlik limit kontrolü | 🔴 Kritik | ⬜ |
| DB-03 | Yeni kullanıcı profil oluşumu | Auth trigger çalışması | 🔴 Kritik | ⬜ |
| DB-04 | Cascade delete (şirket silme) | İlişkili veriler siliniyor | 🔴 Kritik | ⬜ |
| DB-05 | Unique constraint (slug) | Yinelenen değer engelleniyor | 🔴 Kritik | ⬜ |
| DB-06 | Foreign key constraint | Geçersiz ID engelleniyor | 🔴 Kritik | ⬜ |
| DB-07 | NULL constraint | Zorunlu alanlar kontrolü | 🔴 Kritik | ⬜ |
| DB-08 | Index performansı | Sorgular hızlı çalışıyor | 🟡 Yüksek | ⬜ |

---

## 🧪 Entegrasyon ve E2E Testleri

### Supabase Entegrasyonu
| ID | Test Senaryosu | Beklenen Sonuç | Öncelik | Durum |
|----|----------------|----------------|---------|-------|
| INT-01 | Realtime subscription | Anlık güncelleme | 🟡 Yüksek | ⬜ |
| INT-02 | Storage upload/download | Dosya işlemleri | 🔴 Kritik | ⬜ |
| INT-03 | Auth state persistence | Sayfa yenilemede oturum koruma | 🔴 Kritik | ⬜ |
| INT-04 | RPC fonksiyon çağrıları | is_admin, has_submitted_salary | 🔴 Kritik | ⬜ |

### E2E Kullanıcı Senaryoları
| ID | Senaryo | Adımlar | Öncelik | Durum |
|----|---------|---------|---------|-------|
| E2E-01 | Yeni kullanıcı kayıt-akışı | 1) Kayıt → 2) Email onay → 3) Giriş → 4) Profil görüntüleme | 🔴 Kritik | ⬜ |
| E2E-02 | Şirket değerlendirme akışı | 1) Şirket bul → 2) Değerlendirme yaz → 3) Yayınla → 4) Görüntüle | 🔴 Kritik | ⬜ |
| E2E-03 | Maaş paylaşım ve görme | 1) Giriş → 2) Maaş ekle → 3) Give-to-get aşılma → 4) Diğer maaşları gör | 🔴 Kritik | ⬜ |
| E2E-04 | Admin şirket yönetimi | 1) Admin giriş → 2) Admin panel → 3) Şirket ekle → 4) Logo upload → 5) Yayınla | 🔴 Kritik | ⬜ |
| E2E-05 | Şirket öneri akışı | 1) Kullanıcı giriş → 2) Öneride bulun → 3) Admin onay → 4) Bildirim | 🟡 Yüksek | ⬜ |

---

## 📱 Cross-Browser ve Cihaz Testleri

| Tarayıcı | Desktop | Mobile | Tablet | Durum |
|----------|---------|--------|--------|-------|
| Chrome | ⬜ | ⬜ | ⬜ | - |
| Firefox | ⬜ | ⬜ | ⬜ | - |
| Safari | ⬜ | ⬜ | ⬜ | - |
| Edge | ⬜ | ⬜ | ⬜ | - |
| iOS Safari | - | ⬜ | ⬜ | - |
| Android Chrome | - | ⬜ | ⬜ | - |

---

## 🔄 Regresyon Test Planı

Her deploy öncesi çalıştırılacak minimum test seti:

### Smoke Test (5 dk)
- [ ] Ana sayfa açılıyor
- [ ] Giriş yapılabiliyor
- [ ] Şirket listesi görünüyor
- [ ] Şirket detay açılıyor
- [ ] Yeni değerlendirme eklenebiliyor

### Critical Path Test (15 dk)
- [ ] AUTH-01, AUTH-08 (Giriş)
- [ ] COMP-03, COMP-04 (Filtreleme)
- [ ] REV-01, REV-06 (Değerlendirme)
- [ ] SAL-02, SAL-03 (Give-to-get)
- [ ] ROLE-01, ROLE-02 (Yetkilendirme)

---

## 📝 Test Ortamı ve Araçları

### Gereksinimler:
- **Unit Tests**: Vitest (mevcut)
- **E2E Tests**: Playwright önerilir
- **Mock Server**: MSW (Mock Service Worker)
- **Test Veritabanı**: Supabase local/şema

### Test Verileri:
```sql
-- Test kullanıcıları
INSERT INTO auth.users (id, email) VALUES 
  ('test-admin-id', 'test-admin@firmascope.com'),
  ('test-user-id', 'test-user@firmascope.com');

-- Test şirketleri
INSERT INTO companies (name, slug, status) VALUES
  ('Test Tech A.Ş.', 'test-tech', 'Aktif'),
  ('Demo Company', 'demo-company', 'Aktif');
```

---

## 🎯 Test Tamamlama Kriterleri

### MVP için Minimum:
- ✅ Tüm 🔴 Kritik testler geçiyor
- ✅ Tüm AUTH testleri geçiyor
- ✅ Tüm COMP (şirket) testleri geçiyor
- ✅ Tüm REV/SAL/INT testleri geçiyor
- ✅ Tüm SEC (güvenlik) testleri geçiyor

### Production için:
- ✅ Tüm testler geçiyor (%95+ coverage)
- ✅ Lighthouse skoru > 80
- ✅ Cross-browser uyumluluk
- ✅ Performans kriterleri karşılanıyor

---

*Bu liste canlı dokümandır, yeni özellikler eklendikçe güncellenmelidir.*
