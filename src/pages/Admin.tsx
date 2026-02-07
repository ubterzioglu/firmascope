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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X, Shield, Building2, Users, Lightbulb, FileCheck } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-amber/20 text-amber-foreground border-amber/30",
  approved: "bg-alm-green/20 text-foreground border-alm-green/30",
  rejected: "bg-destructive/20 text-destructive border-destructive/30",
};

const statusLabels: Record<string, string> = {
  pending: "Bekliyor",
  approved: "Onaylandı",
  rejected: "Reddedildi",
};

const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/", { replace: true });
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) fetchAll();
  }, [isAdmin]);

  const fetchAll = async () => {
    setLoadingData(true);
    const [sugRes, claimRes, compRes, userRes] = await Promise.all([
      supabase.from("company_suggestions").select("*").order("created_at", { ascending: false }),
      supabase.from("company_claims").select("*, companies(name)").order("created_at", { ascending: false }),
      supabase.from("companies").select("*").order("name"),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    ]);
    setSuggestions(sugRes.data || []);
    setClaims(claimRes.data || []);
    setCompanies(compRes.data || []);
    setUsers(userRes.data || []);
    setLoadingData(false);
  };

  const handleSuggestionAction = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("company_suggestions")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Başarılı", description: `Öneri ${statusLabels[status].toLowerCase()}.` });
      fetchAll();
    }
  };

  const handleClaimAction = async (id: string, status: "approved" | "rejected", userId?: string, companyId?: string) => {
    const { error } = await supabase
      .from("company_claims")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
      return;
    }

    // If approved, add company_admin role and link
    if (status === "approved" && userId && companyId) {
      await supabase.from("user_roles").upsert({
        user_id: userId,
        role: "company_admin" as any,
      }, { onConflict: "user_id,role" });

      await supabase.from("company_admins").upsert({
        user_id: userId,
        company_id: companyId,
      }, { onConflict: "user_id,company_id" });
    }

    toast({ title: "Başarılı", description: `Talep ${statusLabels[status].toLowerCase()}.` });
    fetchAll();
  };

  if (authLoading || loadingData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="font-display text-2xl font-bold text-foreground">Yönetim Paneli</h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card-elevated p-4 text-center">
              <Building2 className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">{companies.length}</p>
              <p className="text-xs text-muted-foreground">Şirket</p>
            </div>
            <div className="card-elevated p-4 text-center">
              <Users className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">{users.length}</p>
              <p className="text-xs text-muted-foreground">Kullanıcı</p>
            </div>
            <div className="card-elevated p-4 text-center">
              <Lightbulb className="h-5 w-5 text-amber mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">{suggestions.filter(s => s.status === "pending").length}</p>
              <p className="text-xs text-muted-foreground">Bekleyen Öneri</p>
            </div>
            <div className="card-elevated p-4 text-center">
              <FileCheck className="h-5 w-5 text-alm-green mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">{claims.filter(c => c.status === "pending").length}</p>
              <p className="text-xs text-muted-foreground">Bekleyen Claim</p>
            </div>
          </div>

          <Tabs defaultValue="suggestions" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="suggestions">Şirket Önerileri</TabsTrigger>
              <TabsTrigger value="claims">Şirket Talepleri</TabsTrigger>
              <TabsTrigger value="companies">Şirketler</TabsTrigger>
              <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
            </TabsList>

            {/* Suggestions Tab */}
            <TabsContent value="suggestions">
              <div className="card-elevated overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Şirket Adı</TableHead>
                      <TableHead>Sektör</TableHead>
                      <TableHead>Şehir</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>Tarih</TableHead>
                      <TableHead className="text-right">İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suggestions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          Henüz öneri yok.
                        </TableCell>
                      </TableRow>
                    ) : (
                      suggestions.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{s.company_name}</TableCell>
                          <TableCell>{s.sector || "–"}</TableCell>
                          <TableCell>{s.city || "–"}</TableCell>
                          <TableCell>
                            <Badge className={statusColors[s.status] || ""} variant="outline">
                              {statusLabels[s.status]}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {new Date(s.created_at).toLocaleDateString("tr-TR")}
                          </TableCell>
                          <TableCell className="text-right">
                            {s.status === "pending" && (
                              <div className="flex justify-end gap-1">
                                <Button size="sm" variant="ghost" onClick={() => handleSuggestionAction(s.id, "approved")} className="text-alm-green hover:text-alm-green">
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleSuggestionAction(s.id, "rejected")} className="text-destructive hover:text-destructive">
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Claims Tab */}
            <TabsContent value="claims">
              <div className="card-elevated overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Şirket</TableHead>
                      <TableHead>Mesaj</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>Tarih</TableHead>
                      <TableHead className="text-right">İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {claims.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          Henüz talep yok.
                        </TableCell>
                      </TableRow>
                    ) : (
                      claims.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium">{c.companies?.name || "–"}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{c.message || "–"}</TableCell>
                          <TableCell>
                            <Badge className={statusColors[c.status] || ""} variant="outline">
                              {statusLabels[c.status]}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {new Date(c.created_at).toLocaleDateString("tr-TR")}
                          </TableCell>
                          <TableCell className="text-right">
                            {c.status === "pending" && (
                              <div className="flex justify-end gap-1">
                                <Button size="sm" variant="ghost" onClick={() => handleClaimAction(c.id, "approved", c.user_id, c.company_id)} className="text-alm-green hover:text-alm-green">
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleClaimAction(c.id, "rejected")} className="text-destructive hover:text-destructive">
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Companies Tab */}
            <TabsContent value="companies">
              <div className="card-elevated overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Adı</TableHead>
                      <TableHead>Sektör</TableHead>
                      <TableHead>Şehir</TableHead>
                      <TableHead>Tür</TableHead>
                      <TableHead>Durum</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companies.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell>{c.sector || "–"}</TableCell>
                        <TableCell>{c.city || "–"}</TableCell>
                        <TableCell>{c.company_type || "–"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{c.status || "Aktif"}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <div className="card-elevated overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>İsim</TableHead>
                      <TableHead>Kayıt Tarihi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.display_name || "–"}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {new Date(u.created_at).toLocaleDateString("tr-TR")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
