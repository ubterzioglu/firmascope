import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Announcement {
  id: string;
  title: string;
  description: string | null;
  link_url: string | null;
  sort_order: number;
  image_url?: string;
}

const placeholderAnnouncements: Announcement[] = [
  { id: "p1", title: "Teknoloji sektöründe maaşlar %18 arttı", description: "2026 ilk çeyrek verilerine göre yazılım mühendisleri en çok artışı gördü.", link_url: null, sort_order: 0, image_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=200&fit=crop&q=70" },
  { id: "p2", title: "En çok değerlendirilen şirket: FinansPro", description: "Bu ay 47 yeni değerlendirme ile FinansPro A.Ş. zirveye oturdu.", link_url: null, sort_order: 1, image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop&q=70" },
  { id: "p3", title: "Mülakat deneyimi paylaşımları 2 katına çıktı", description: "Kullanıcılar artık daha detaylı mülakat süreçlerini aktarıyor.", link_url: null, sort_order: 2, image_url: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=400&h=200&fit=crop&q=70" },
  { id: "p4", title: "Uzaktan çalışma oranı %62'ye ulaştı", description: "Teknoloji şirketlerinde hibrit ve uzaktan modeller hâlâ baskın.", link_url: null, sort_order: 3, image_url: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=400&h=200&fit=crop&q=70" },
  { id: "p5", title: "Yeni özellik: Şirket karşılaştırma", description: "İki şirketi yan yana kıyaslayarak maaş, kültür ve mülakat verilerini karşılaştır.", link_url: null, sort_order: 4, image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop&q=70" },
  { id: "p6", title: "Sağlık sektöründe çalışan memnuniyeti düştü", description: "Son 3 ayda sağlık sektörü değerlendirmeleri ortalama 3.1'e geriledi.", link_url: null, sort_order: 5, image_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=200&fit=crop&q=70" },
  { id: "p7", title: "En yüksek tavsiye oranı: EduTech Academy", description: "Çalışanların %91'i EduTech Academy'yi tavsiye ediyor.", link_url: null, sort_order: 6, image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=200&fit=crop&q=70" },
  { id: "p8", title: "Stajyer maaşları ilk kez açıklandı", description: "Stajyer pozisyonları için sektörel maaş verileri artık platformda.", link_url: null, sort_order: 7, image_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop&q=70" },
  { id: "p9", title: "İstanbul dışı şirketlere ilgi arttı", description: "Ankara ve İzmir merkezli şirketlere yapılan aramalar %35 yükseldi.", link_url: null, sort_order: 8, image_url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=200&fit=crop&q=70" },
  { id: "p10", title: "Anonim paylaşım güvencesi güçlendirildi", description: "Gelişmiş şifreleme ile kimlik bilgilerin artık daha güvende.", link_url: null, sort_order: 9, image_url: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=200&fit=crop&q=70" },
];

const AnnouncementCarousel = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data } = await supabase
        .from("announcements")
        .select("id, title, description, link_url, sort_order")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      setAnnouncements(data && data.length > 0 ? data : placeholderAnnouncements);
      setLoading(false);
    };
    fetchAnnouncements();
  }, []);

  if (loading) return null;

  // Double the items for infinite scroll illusion
  const doubled = [...announcements, ...announcements];

  return (
    <section className="py-12 overflow-hidden">
      <div className="relative">
        <div
          className="flex gap-5 animate-scroll-left"
          style={{ width: `${doubled.length * 260}px` }}
        >
          {doubled.map((item, i) => {
            const ann = item as Announcement;
            const imageUrl = ann.image_url || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=200&fit=crop&q=70";

            const content = (
              <div className="flex-shrink-0 w-[240px] h-[280px] rounded-xl overflow-hidden border border-border bg-card transition-shadow hover:shadow-lg group flex flex-col">
                {/* Image - top half */}
                <div className="h-[140px] flex-shrink-0 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                {/* Text - bottom half */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-display text-sm font-semibold text-foreground leading-tight line-clamp-2">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            );

            if (item.link_url) {
              return (
                <Link key={`${item.id}-${i}`} to={item.link_url} className="flex-shrink-0">
                  {content}
                </Link>
              );
            }

            return (
              <div key={`${item.id}-${i}`} className="flex-shrink-0">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AnnouncementCarousel;
