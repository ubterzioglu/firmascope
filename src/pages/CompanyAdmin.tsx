import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Building2, Star, Banknote, UserCheck, BarChart3 } from "lucide-react";

interface CompanyAssignment {
  company_id: string;
  companies: { name: string; slug: string; sector: string | null; city: string | null };
}

const CompanyAdmin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [assignments, setAssignments] = useState<CompanyAssignment[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [salaries, setSalaries] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/giris", { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchAssignments();
  }, [user]);

  const fetchAssignments = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("company_admins")
      .select("company_id, companies(name, slug, sector, city)")
      .eq("user_id", user.id);

    const parsed = (data || []) as unknown as CompanyAssignment[];
    setAssignments(parsed);

    if (parsed.length === 0) {
      setLoadingData(false);
      return;
    }

    setSelectedCompany(parsed[0].company_id);
  };

  useEffect(() => {
    if (selectedCompany) fetchCompanyData(selectedCompany);
  }, [selectedCompany]);

  const fetchCompanyData = async (companyId: string) => {
    setLoadingData(true);
    const [revRes, salRes, intRes] = await Promise.all([
      supabase.from("reviews_public" as any).select("*").eq("company_id", companyId).order("created_at", { ascending: false }),
      supabase.from("salaries_public" as any).select("*").eq("company_id", companyId).order("created_at", { ascending: false }),
      supabase.from("interviews_public" as any).select("*").eq("company_id", companyId).order("created_at", { ascending: false }),
    ]);
    setReviews((revRes.data as any[]) || []);
    setSalaries((salRes.data as any[]) || []);
    setInterviews((intRes.data as any[]) || []);
    setLoadingData(false);
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </Layout>
    );
  }

  if (assignments.length === 0 && !loadingData) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
          <Building2 className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h2 className="font-display text-xl font-bold text-foreground">Şirket Admini Değilsiniz</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Henüz yönettiğiniz bir şirket bulunmuyor. Şirket sahiplenme talebinde bulunarak yönetici olabilirsiniz.
          </p>
          <Button className="mt-4" onClick={() => navigate("/sirketler")}>Şirketlere Göz At</Button>
        </div>
      </Layout>
    );
  }

  const currentCompany = assignments.find((a) => a.company_id === selectedCompany);
  const avgRating = reviews.length > 0 ? (reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1) : "–";

  return (
    <Layout>
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="h-6 w-6 text-primary" />
            <h1 className="font-display text-2xl font-bold text-foreground">Şirket Yönetimi</h1>
          </div>

          {/* Company selector */}
          {assignments.length > 1 && (
            <div className="flex gap-2 mb-6 flex-wrap">
              {assignments.map((a) => (
                <Button
                  key={a.company_id}
                  variant={selectedCompany === a.company_id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCompany(a.company_id)}
                >
                  {a.companies.name}
                </Button>
              ))}
            </div>
          )}

          {currentCompany && (
            <div className="card-elevated p-4 mb-6">
              <h2 className="font-display text-lg font-bold text-foreground">{currentCompany.companies.name}</h2>
              <div className="flex gap-3 mt-1 text-sm text-muted-foreground">
                {currentCompany.companies.sector && <span>{currentCompany.companies.sector}</span>}
                {currentCompany.companies.city && <span>• {currentCompany.companies.city}</span>}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card-elevated p-4 text-center">
              <Star className="h-5 w-5 text-alm-yellow mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">{avgRating}</p>
              <p className="text-xs text-muted-foreground">Ort. Puan</p>
            </div>
            <div className="card-elevated p-4 text-center">
              <BarChart3 className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">{reviews.length}</p>
              <p className="text-xs text-muted-foreground">Yorum</p>
            </div>
            <div className="card-elevated p-4 text-center">
              <Banknote className="h-5 w-5 text-alm-green mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">{salaries.length}</p>
              <p className="text-xs text-muted-foreground">Maaş Bilgisi</p>
            </div>
            <div className="card-elevated p-4 text-center">
              <UserCheck className="h-5 w-5 text-alm-orange mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">{interviews.length}</p>
              <p className="text-xs text-muted-foreground">Mülakat</p>
            </div>
          </div>

          {loadingData ? (
            <p className="text-muted-foreground text-center py-8">Yükleniyor...</p>
          ) : (
            <Tabs defaultValue="reviews" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="reviews"><Star className="h-3.5 w-3.5 mr-1" />Yorumlar</TabsTrigger>
                <TabsTrigger value="salaries"><Banknote className="h-3.5 w-3.5 mr-1" />Maaşlar</TabsTrigger>
                <TabsTrigger value="interviews"><UserCheck className="h-3.5 w-3.5 mr-1" />Mülakatlar</TabsTrigger>
              </TabsList>

              <TabsContent value="reviews">
                <div className="card-elevated overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Başlık</TableHead>
                        <TableHead>Puan</TableHead>
                        <TableHead>Tavsiye</TableHead>
                        <TableHead>Tarih</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews.length === 0 ? (
                        <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Henüz yorum yok.</TableCell></TableRow>
                      ) : reviews.map((r: any) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium max-w-[250px] truncate">{r.title}</TableCell>
                          <TableCell>{r.rating}/5</TableCell>
                          <TableCell>
                            {r.recommends === true && <Badge className="bg-alm-green/20 text-foreground border-alm-green/30" variant="outline">Evet</Badge>}
                            {r.recommends === false && <Badge className="bg-alm-orange/20 text-foreground border-alm-orange/30" variant="outline">Hayır</Badge>}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">{new Date(r.created_at).toLocaleDateString("tr-TR")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="salaries">
                <div className="card-elevated overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pozisyon</TableHead>
                        <TableHead>Maaş</TableHead>
                        <TableHead>Deneyim</TableHead>
                        <TableHead>Tarih</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salaries.length === 0 ? (
                        <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Henüz maaş bilgisi yok.</TableCell></TableRow>
                      ) : salaries.map((s: any) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{s.job_title}</TableCell>
                          <TableCell className="text-alm-green font-semibold">{s.salary_amount?.toLocaleString("tr-TR")} {s.currency || "TRY"}</TableCell>
                          <TableCell>{s.experience_years != null ? `${s.experience_years} yıl` : "–"}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">{new Date(s.created_at).toLocaleDateString("tr-TR")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="interviews">
                <div className="card-elevated overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pozisyon</TableHead>
                        <TableHead>Zorluk</TableHead>
                        <TableHead>Sonuç</TableHead>
                        <TableHead>Tarih</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {interviews.length === 0 ? (
                        <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Henüz mülakat bilgisi yok.</TableCell></TableRow>
                      ) : interviews.map((i: any) => (
                        <TableRow key={i.id}>
                          <TableCell className="font-medium">{i.position}</TableCell>
                          <TableCell>{i.difficulty || "–"}</TableCell>
                          <TableCell>{i.result || "–"}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">{new Date(i.created_at).toLocaleDateString("tr-TR")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CompanyAdmin;
