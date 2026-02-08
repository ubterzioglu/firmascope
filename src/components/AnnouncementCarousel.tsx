import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Announcement {
  id: string;
  title: string;
  description: string | null;
  link_url: string | null;
  sort_order: number;
}

const placeholderAnnouncements: Announcement[] = [
  { id: "p1", title: "Teknoloji sektöründe maaşlar %18 arttı", description: "2026 ilk çeyrek verilerine göre yazılım mühendisleri en çok artışı gördü.", link_url: null, sort_order: 0 },
  { id: "p2", title: "En çok değerlendirilen şirket: FinansPro", description: "Bu ay 47 yeni değerlendirme ile FinansPro A.Ş. zirveye oturdu.", link_url: null, sort_order: 1 },
  { id: "p3", title: "Mülakat deneyimi paylaşımları 2 katına çıktı", description: "Kullanıcılar artık daha detaylı mülakat süreçlerini aktarıyor.", link_url: null, sort_order: 2 },
  { id: "p4", title: "Uzaktan çalışma oranı %62'ye ulaştı", description: "Teknoloji şirketlerinde hibrit ve uzaktan modeller hâlâ baskın.", link_url: null, sort_order: 3 },
  { id: "p5", title: "Yeni özellik: Şirket karşılaştırma", description: "İki şirketi yan yana kıyaslayarak maaş, kültür ve mülakat verilerini karşılaştır.", link_url: null, sort_order: 4 },
  { id: "p6", title: "Sağlık sektöründe çalışan memnuniyeti düştü", description: "Son 3 ayda sağlık sektörü değerlendirmeleri ortalama 3.1'e geriledi.", link_url: null, sort_order: 5 },
  { id: "p7", title: "En yüksek tavsiye oranı: EduTech Academy", description: "Çalışanların %91'i EduTech Academy'yi tavsiye ediyor.", link_url: null, sort_order: 6 },
  { id: "p8", title: "Stajyer maaşları ilk kez açıklandı", description: "Stajyer pozisyonları için sektörel maaş verileri artık platformda.", link_url: null, sort_order: 7 },
  { id: "p9", title: "İstanbul dışı şirketlere ilgi arttı", description: "Ankara ve İzmir merkezli şirketlere yapılan aramalar %35 yükseldi.", link_url: null, sort_order: 8 },
  { id: "p10", title: "Anonim paylaşım güvencesi güçlendirildi", description: "Gelişmiş şifreleme ile kimlik bilgilerin artık daha güvende.", link_url: null, sort_order: 9 },
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
          style={{ width: `${doubled.length * 240}px` }}
        >
          {doubled.map((item, i) => {
            const content = (
              <div className="flex-shrink-0 w-[220px] rounded-xl overflow-hidden border border-border bg-card transition-shadow hover:shadow-lg group">
                <div className="p-5">
                  <h3 className="font-display text-sm font-semibold text-foreground leading-tight">
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
