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

const placeholderAnnouncements: Announcement[] = Array.from({ length: 10 }, (_, i) => ({
  id: `placeholder-${i + 1}`,
  title: `Duyuru ${i + 1}`,
  description: `Bu bir örnek duyuru içeriğidir. Gerçek duyurular admin panelinden eklenebilir.`,
  link_url: null,
  sort_order: i,
}));

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
