import Layout from "@/components/Layout";
import { useParams, Link } from "react-router-dom";
import { Star, Building2, MapPin, Users, MessageSquare, DollarSign, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockReviews = [
  { id: "1", rating: 4, title: "İyi bir çalışma ortamı", text: "Genel olarak memnunum. Yönetim ekibi destekleyici ve açık iletişim kuruluyor. Work-life balance konusunda iyileştirmeler yapılabilir.", date: "2 gün önce", upvotes: 12, downvotes: 2 },
  { id: "2", rating: 3, title: "Ortalama bir deneyim", text: "Maaşlar piyasa ortalamasının altında kalıyor ama ekip çalışması güçlü. Kariyer gelişimi için fırsatlar sınırlı olabiliyor.", date: "1 hafta önce", upvotes: 8, downvotes: 1 },
  { id: "3", rating: 5, title: "Harika bir şirket kültürü", text: "Remote çalışma imkanı, esnek çalışma saatleri ve sürekli eğitim fırsatları sunuluyor. Kesinlikle tavsiye ederim.", date: "2 hafta önce", upvotes: 24, downvotes: 0 },
];

const tabs = [
  { id: "overview", label: "Genel Bakış", icon: Building2 },
  { id: "reviews", label: "Yorumlar", icon: MessageSquare },
  { id: "salaries", label: "Maaşlar", icon: DollarSign },
  { id: "interviews", label: "Mülakatlar", icon: Briefcase },
];

const CompanyDetail = () => {
  const { slug } = useParams();

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10 font-display text-2xl font-bold" style={{ color: 'hsl(210 30% 95%)' }}>
                T
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold md:text-3xl" style={{ color: 'hsl(210 30% 95%)' }}>Teknoloji A.Ş.</h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm" style={{ color: 'hsl(210 20% 75%)' }}>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> İstanbul</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> 201-1000 çalışan</span>
                  <span className="rounded-full bg-primary-foreground/10 px-3 py-0.5 text-xs">Teknoloji</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <Star className="h-6 w-6 fill-warning text-warning" />
                  <span className="font-display text-3xl font-bold" style={{ color: 'hsl(210 30% 95%)' }}>4.2</span>
                </div>
                <p className="mt-0.5 text-xs" style={{ color: 'hsl(210 20% 75%)' }}>128 değerlendirme</p>
              </div>
              <Button variant="hero" asChild>
                <Link to="/yorum-yaz">Yorum Yaz</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto flex gap-1 overflow-x-auto px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                tab.id === "reviews"
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl space-y-4">
            {mockReviews.map((review) => (
              <div key={review.id} className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-4 w-4 ${s <= review.rating ? "fill-warning text-warning" : "text-muted-foreground/30"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <h3 className="mt-3 font-display text-base font-semibold text-foreground">{review.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{review.text}</p>
                <div className="mt-4 flex items-center gap-4">
                  <button className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted">
                    👍 {review.upvotes}
                  </button>
                  <button className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted">
                    👎 {review.downvotes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CompanyDetail;
