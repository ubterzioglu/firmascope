import { Link } from "react-router-dom";

const announcements = [
  {
    id: "1",
    title: "FirmaScope Yayında!",
    desc: "Türkiye'nin en şeffaf şirket değerlendirme platformu artık aktif.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=340&fit=crop",
  },
  {
    id: "2",
    title: "Anonim Maaş Paylaşımı",
    desc: "Maaşını anonim olarak paylaş, sektör ortalamalarını öğren.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=340&fit=crop",
  },
  {
    id: "3",
    title: "Mülakat Deneyimleri",
    desc: "Hangi sorular soruldu? Süreç nasıl işledi? Deneyimini paylaş.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=340&fit=crop",
  },
  {
    id: "4",
    title: "Şirket Kültürü Puanlama",
    desc: "Çalışma ortamı, yönetim, kariyer fırsatları — hepsini değerlendir.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=340&fit=crop",
  },
  {
    id: "5",
    title: "Yeni Şirketler Eklendi",
    desc: "50+ yeni şirket profili platformumuza eklendi. Hemen incele!",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=340&fit=crop",
  },
  {
    id: "6",
    title: "Topluluk Büyüyor",
    desc: "10.000+ anonim değerlendirme ile Türkiye'nin en güvenilir kaynağı.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=340&fit=crop",
  },
  {
    id: "7",
    title: "Mobil Deneyim",
    desc: "FirmaScope artık mobilde de kusursuz çalışıyor. Her yerden erişin.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=340&fit=crop",
  },
  {
    id: "8",
    title: "Veri Güvenliği",
    desc: "Tüm veriler şifrelenir, IP adresleri hashlenir. Gizliliğin bizim için öncelik.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f2?w=600&h=340&fit=crop",
  },
  {
    id: "9",
    title: "Sektör Karşılaştırması",
    desc: "Teknoloji, finans, perakende — sektörler arası karşılaştırma yapın.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=340&fit=crop",
  },
  {
    id: "10",
    title: "Geri Bildiriminiz Önemli",
    desc: "Platformu geliştirmemize yardımcı olun. Önerilerinizi bekliyoruz!",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=340&fit=crop",
  },
];

const AnnouncementCarousel = () => {
  // Double the items for infinite scroll illusion
  const doubled = [...announcements, ...announcements];

  return (
    <section className="py-12 overflow-hidden">
      <div className="relative">
        <div className="flex gap-5 animate-scroll-left" style={{ width: `${doubled.length * 240}px` }}>
          {doubled.map((item, i) => (
            <Link
              key={`${item.id}-${i}`}
              to={`/duyurular#${item.id}`}
              className="flex-shrink-0 w-[220px] rounded-xl overflow-hidden border border-border bg-card transition-shadow hover:shadow-lg group"
            >
              <div className="h-[140px] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="font-display text-sm font-semibold text-foreground leading-tight">{item.title}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnnouncementCarousel;
