import Layout from "@/components/Layout";
import { useParams } from "react-router-dom";
import { MapPin, Building2, Users, Globe, Briefcase, MessageSquare, Banknote, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSalaryGate } from "@/hooks/useSalaryGate";
import ReviewForm from "@/components/ReviewForm";
import SalaryForm from "@/components/SalaryForm";
import InterviewForm from "@/components/InterviewForm";
import VoteButtons from "@/components/VoteButtons";
import SalaryGateOverlay from "@/components/SalaryGateOverlay";

interface Company {
  id: string;
  name: string;
  slug: string;
  initials: string;
  sector: string | null;
  city: string | null;
  size: string | null;
  company_type: string | null;
  status: string | null;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
}

interface ReviewPublic {
  id: string;
  company_id: string;
  title: string;
  pros: string | null;
  cons: string | null;
  rating: number;
  recommends: boolean | null;
  created_at: string;
}

interface SalaryPublic {
  id: string;
  company_id: string;
  job_title: string;
  salary_amount: number;
  currency: string | null;
  experience_years: number | null;
  created_at: string;
}

interface InterviewPublic {
  id: string;
  company_id: string;
  position: string;
  experience: string | null;
  difficulty: string | null;
  result: string | null;
  created_at: string;
}

const sectorBanners: Record<string, string> = {
  "Eğitim": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=300&fit=crop",
  "Finans": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=300&fit=crop",
  "İnşaat": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=300&fit=crop",
  "Lojistik": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=300&fit=crop",
  "Medya": "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&h=300&fit=crop",
  "Otomotiv": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=300&fit=crop",
  "Sağlık": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=300&fit=crop",
  "Teknoloji": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=300&fit=crop",
  "Enerji": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=300&fit=crop",
};

const defaultBanner = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=300&fit=crop";

const CompanyDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const { isGated: isSalaryGated } = useSalaryGate();
  const [activeTab, setActiveTab] = useState(0);
  const [company, setCompany] = useState<Company | null>(null);
  const [reviews, setReviews] = useState<ReviewPublic[]>([]);
  const [salaries, setSalaries] = useState<SalaryPublic[]>([]);
  const [interviews, setInterviews] = useState<InterviewPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showSalaryForm, setShowSalaryForm] = useState(false);
  const [showInterviewForm, setShowInterviewForm] = useState(false);

  const fetchCompanyData = async () => {
    if (!slug) return;
    setLoading(true);

    const { data: compData } = await supabase
      .from("companies")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!compData) {
      setLoading(false);
      return;
    }

    setCompany(compData as Company);

    const [revRes, salRes, intRes] = await Promise.all([
      supabase.from("reviews_public" as any).select("*").eq("company_id", compData.id).order("created_at", { ascending: false }),
      supabase.from("salaries_public" as any).select("*").eq("company_id", compData.id).order("created_at", { ascending: false }),
      supabase.from("interviews_public" as any).select("*").eq("company_id", compData.id).order("created_at", { ascending: false }),
    ]);

    setReviews((revRes.data as unknown as ReviewPublic[]) || []);
    setSalaries((salRes.data as unknown as SalaryPublic[]) || []);
    setInterviews((intRes.data as unknown as InterviewPublic[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanyData();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </Layout>
    );
  }

  if (!company) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-muted-foreground">Şirket bulunamadı.</p>
        </div>
      </Layout>
    );
  }

  const bannerUrl = company.banner_url || sectorBanners[company.sector || ""] || defaultBanner;
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  const recommendRate = reviews.length > 0 ? Math.round((reviews.filter((r) => r.recommends).length / reviews.length) * 100) : 0;

  const tabLabels = [
    "Genel Bakış",
    `Yorumlar (${reviews.length})`,
    `Maaşlar (${salaries.length})`,
    `Mülakatlar (${interviews.length})`,
  ];

  const metaItems = [
    { icon: Briefcase, label: "Şirket Türü", value: company.company_type || "–" },
    { icon: Globe, label: "Durum", value: company.status || "–" },
    { icon: Building2, label: "Sektör", value: company.sector || "–" },
    { icon: MapPin, label: "Merkez", value: company.city || "–" },
    { icon: Users, label: "Çalışan Sayısı", value: company.size || "–" },
  ];

  const handleFormSuccess = () => {
    setShowReviewForm(false);
    setShowSalaryForm(false);
    setShowInterviewForm(false);
    fetchCompanyData();
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`text-sm ${s <= Math.round(rating) ? "text-alm-yellow" : "text-muted-foreground/30"}`}>★</span>
      ))}
    </div>
  );

  return (
    <Layout>
      {/* Banner */}
      <div className="relative">
        <div className="h-36 md:h-44 overflow-hidden">
          <img src={bannerUrl} alt={`${company.name} banner`} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" />
        </div>
        <div className="container mx-auto px-4">
          <div className="absolute bottom-0 translate-y-1/2 flex items-center">
            <div className="z-20 relative">
              {company.logo_url ? (
                <img src={company.logo_url} alt={company.name} className="h-36 w-36 flex-shrink-0 rounded-3xl border-4 border-background object-cover shadow-lg" />
              ) : (
                <div className="flex h-36 w-36 flex-shrink-0 items-center justify-center rounded-3xl border-4 border-background bg-alm-yellow font-display text-4xl font-bold text-primary-foreground shadow-lg">
                  {company.initials}
                </div>
              )}
            </div>
            <div className="z-10 -ml-4 rounded-r-xl bg-alm-orange px-6 pl-8 py-3 shadow-md">
              <h1 className="font-display text-lg font-bold text-primary-foreground md:text-2xl">{company.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-28">
        {/* Meta */}
        <div className="mt-2 flex flex-wrap gap-1.5 items-start">
          {metaItems.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 rounded-lg border-2 border-border/80 bg-card px-2 py-1 shadow-md min-w-[120px]">
              <item.icon className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
              <div>
                <div className="text-[9px] leading-tight text-muted-foreground">{item.label}</div>
                <div className="text-xs font-semibold text-foreground">{item.value}</div>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-1.5 rounded-lg border-2 border-border/80 bg-card px-3 py-1 shadow-md min-w-[80px]">
            <MessageSquare className="h-3.5 w-3.5 flex-shrink-0 text-alm-blue" />
            <div>
              <div className="text-[9px] leading-tight text-muted-foreground">Yorum</div>
              <div className="text-xs font-semibold text-foreground">{reviews.length}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border-2 border-border/80 bg-card px-3 py-1 shadow-md min-w-[80px]">
            <Banknote className="h-3.5 w-3.5 flex-shrink-0 text-alm-green" />
            <div>
              <div className="text-[9px] leading-tight text-muted-foreground">Maaş</div>
              <div className="text-xs font-semibold text-foreground">{salaries.length}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border-2 border-border/80 bg-card px-3 py-1 shadow-md min-w-[80px]">
            <UserCheck className="h-3.5 w-3.5 flex-shrink-0 text-alm-orange" />
            <div>
              <div className="text-[9px] leading-tight text-muted-foreground">Mülakat</div>
              <div className="text-xs font-semibold text-foreground">{interviews.length}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-border">
          <div className="flex gap-0 overflow-x-auto">
            {tabLabels.map((label, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`whitespace-nowrap border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
                  activeTab === i ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="mt-8 grid gap-6 pb-16 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {/* Overview */}
            {activeTab === 0 && (
              <div className="card-elevated p-6">
                <h3 className="font-display text-lg font-bold text-foreground">Şirket Bilgileri</h3>
                <p className="mt-2 text-sm text-muted-foreground">{company.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    {company.name}, {company.city} merkezli {(company.sector || "").toLowerCase()} alanında faaliyet göstermektedir.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    Şirket bünyesinde {company.size} çalışan bulunmaktadır.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    firmascope üzerinde {reviews.length} değerlendirme ve {salaries.length} maaş bilgisi paylaşılmıştır.
                  </li>
                  {reviews.length > 0 && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                        Ortalama puan: {avgRating.toFixed(1)} / 5
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                        Çalışanların %{recommendRate}'i bu şirketi tavsiye etmektedir.
                      </li>
                    </>
                  )}
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    {interviews.length} mülakat deneyimi paylaşılmıştır.
                  </li>
                </ul>
              </div>
            )}

            {/* Reviews */}
            {activeTab === 1 && (
              <>
                {showReviewForm && user ? (
                  <ReviewForm companyId={company.id} userId={user.id} onSuccess={handleFormSuccess} onCancel={() => setShowReviewForm(false)} />
                ) : reviews.length === 0 ? (
                  <div className="card-elevated p-10 text-center">
                    <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/40" />
                    <h3 className="mt-4 font-display text-base font-bold text-foreground">İlk değerlendirmeyi sen yaz</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Bu şirket hakkında henüz yorum yapılmamış.</p>
                    <Button className="mt-5 w-full max-w-sm rounded-xl font-semibold text-sm h-11" onClick={() => setShowReviewForm(true)}>
                      Değerlendirme Yaz
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button className="w-full max-w-sm rounded-xl font-semibold text-sm h-11" onClick={() => setShowReviewForm(true)}>
                      Değerlendirme Yaz
                    </Button>
                    {reviews.map((r) => (
                      <div key={r.id} className="card-elevated p-5">
                        <div className="flex items-center justify-between">
                          <h4 className="font-display text-sm font-bold text-foreground">{r.title}</h4>
                          <div className="flex items-center gap-1">{renderStars(r.rating)}</div>
                        </div>
                        {r.pros && <p className="mt-2 text-sm text-muted-foreground"><span className="text-alm-green font-semibold">+</span> {r.pros}</p>}
                        {r.cons && <p className="mt-1 text-sm text-muted-foreground"><span className="text-alm-orange font-semibold">−</span> {r.cons}</p>}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{new Date(r.created_at).toLocaleDateString("tr-TR")}</span>
                            {r.recommends !== null && (
                              <span className={r.recommends ? "text-alm-green" : "text-alm-orange"}>
                                {r.recommends ? "✓ Tavsiye eder" : "✗ Tavsiye etmez"}
                              </span>
                            )}
                          </div>
                          <VoteButtons targetId={r.id} targetType="review" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Salaries */}
            {activeTab === 2 && (
              <>
                {showSalaryForm && user ? (
                  <SalaryForm companyId={company.id} userId={user.id} onSuccess={handleFormSuccess} onCancel={() => setShowSalaryForm(false)} />
                ) : isSalaryGated && salaries.length > 0 ? (
                  <SalaryGateOverlay onSubmitSalary={() => setShowSalaryForm(true)} />
                ) : salaries.length === 0 ? (
                  <div className="card-elevated p-10 text-center">
                    <Banknote className="mx-auto h-10 w-10 text-muted-foreground/40" />
                    <h3 className="mt-4 font-display text-base font-bold text-foreground">İlk maaş bilgisini sen ekle</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Bu şirket hakkında henüz maaş bilgisi eklenmemiş.</p>
                    <Button className="mt-5 w-full max-w-sm rounded-xl font-semibold text-sm h-11 bg-alm-orange text-primary-foreground hover:bg-alm-orange/90" onClick={() => setShowSalaryForm(true)}>
                      Maaş Bilgisi Ekle
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button className="w-full max-w-sm rounded-xl font-semibold text-sm h-11 bg-alm-orange text-primary-foreground hover:bg-alm-orange/90" onClick={() => setShowSalaryForm(true)}>
                      Maaş Bilgisi Ekle
                    </Button>
                    {salaries.map((s) => (
                      <div key={s.id} className="card-elevated p-5">
                        <div className="flex items-center justify-between">
                          <h4 className="font-display text-sm font-bold text-foreground">{s.job_title}</h4>
                          <span className="text-lg font-bold text-alm-green">
                            {s.salary_amount.toLocaleString("tr-TR")} {s.currency || "TRY"}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {s.experience_years !== null && <span>{s.experience_years} yıl deneyim</span>}
                            <span>{new Date(s.created_at).toLocaleDateString("tr-TR")}</span>
                          </div>
                          <VoteButtons targetId={s.id} targetType="salary" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Interviews */}
            {activeTab === 3 && (
              <>
                {showInterviewForm && user ? (
                  <InterviewForm companyId={company.id} userId={user.id} onSuccess={handleFormSuccess} onCancel={() => setShowInterviewForm(false)} />
                ) : interviews.length === 0 ? (
                  <div className="card-elevated p-10 text-center">
                    <UserCheck className="mx-auto h-10 w-10 text-muted-foreground/40" />
                    <h3 className="mt-4 font-display text-base font-bold text-foreground">İlk mülakat deneyimini sen paylaş</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Bu şirket hakkında henüz mülakat deneyimi paylaşılmamış.</p>
                    <Button className="mt-5 w-full max-w-sm rounded-xl font-semibold text-sm h-11 bg-amber text-amber-foreground hover:bg-amber/90" onClick={() => setShowInterviewForm(true)}>
                      Mülakat Bilgisi Ekle
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button className="w-full max-w-sm rounded-xl font-semibold text-sm h-11 bg-amber text-amber-foreground hover:bg-amber/90" onClick={() => setShowInterviewForm(true)}>
                      Mülakat Bilgisi Ekle
                    </Button>
                    {interviews.map((i) => (
                      <div key={i.id} className="card-elevated p-5">
                        <h4 className="font-display text-sm font-bold text-foreground">{i.position}</h4>
                        {i.experience && <p className="mt-2 text-sm text-muted-foreground">{i.experience}</p>}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {i.difficulty && <span>Zorluk: {i.difficulty}</span>}
                            {i.result && <span>Sonuç: {i.result}</span>}
                            <span>{new Date(i.created_at).toLocaleDateString("tr-TR")}</span>
                          </div>
                          <VoteButtons targetId={i.id} targetType="interview" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Button className="w-full rounded-xl font-semibold text-sm h-12" onClick={() => { setActiveTab(1); setShowReviewForm(true); }}>
              Değerlendirme Yaz
            </Button>
            <Button className="w-full rounded-xl font-semibold text-sm h-12 bg-alm-orange text-primary-foreground hover:bg-alm-orange/90" onClick={() => { setActiveTab(2); setShowSalaryForm(true); }}>
              Maaş Bilgisi Ekle
            </Button>
            <Button className="w-full rounded-xl font-semibold text-sm h-12 bg-amber text-amber-foreground hover:bg-amber/90" onClick={() => { setActiveTab(3); setShowInterviewForm(true); }}>
              Mülakat Bilgisi Ekle
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyDetail;
