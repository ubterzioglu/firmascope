import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Check, X, Shield, Building2, Users, Lightbulb, FileCheck, Megaphone, Plus, Pencil, Trash2, Star, Banknote, UserCheck, Flag } from "lucide-react";
import AdminAnnouncements from "@/components/AdminAnnouncements";
import AdminReports from "@/components/AdminReports";

const slugify = (input: string) => {
  // ASCII-only slug for stable URLs.
  return input
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

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
  const [reviews, setReviews] = useState<any[]>([]);
  const [salaries, setSalaries] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Company form
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [companyForm, setCompanyForm] = useState({
    name: "", slug: "", initials: "", sector: "", city: "", size: "", company_type: "A.Ş.", description: "",
    logo_url: "", banner_url: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [uploadingAssets, setUploadingAssets] = useState(false);

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
    const [sugRes, claimRes, compRes, userRes, revRes, salRes, intRes] = await Promise.all([
      supabase.from("company_suggestions").select("*").order("created_at", { ascending: false }),
      supabase.from("company_claims").select("*, companies(name)").order("created_at", { ascending: false }),
      supabase.from("companies").select("*").order("name"),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("reviews").select("*, companies(name)").order("created_at", { ascending: false }),
      supabase.from("salaries").select("*, companies(name)").order("created_at", { ascending: false }),
      supabase.from("interviews").select("*, companies(name)").order("created_at", { ascending: false }),
    ]);
    setSuggestions(sugRes.data || []);
    setClaims(claimRes.data || []);
    setCompanies(compRes.data || []);
    setUsers(userRes.data || []);
    setReviews(revRes.data || []);
    setSalaries(salRes.data || []);
    setInterviews(intRes.data || []);
    setLoadingData(false);
  };

  const handleSuggestionAction = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("company_suggestions").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Başarılı", description: `Öneri ${statusLabels[status].toLowerCase()}.` });
      fetchAll();
    }
  };

  // Create company from suggestion
  const handleCreateFromSuggestion = async (suggestion: any) => {
    const slug = slugify(String(suggestion.company_name || ""));
    const initials = suggestion.company_name.split(" ").filter((w: string) => w.length > 0).slice(0, 2).map((w: string) => w[0].toUpperCase()).join("");

    const { error } = await supabase.from("companies").insert({
      name: suggestion.company_name,
      slug,
      initials,
      sector: suggestion.sector,
      city: suggestion.city,
      description: suggestion.description,
    });

    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      await supabase.from("company_suggestions").update({ status: "approved" }).eq("id", suggestion.id);
      toast({ title: "Başarılı", description: `${suggestion.company_name} şirketi oluşturuldu.` });
      fetchAll();
    }
  };

  const handleClaimAction = async (id: string, status: "approved" | "rejected", userId?: string, companyId?: string) => {
    const { error } = await supabase.from("company_claims").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
      return;
    }
    if (status === "approved" && userId && companyId) {
      await supabase.from("user_roles").upsert({ user_id: userId, role: "company_admin" as any }, { onConflict: "user_id,role" });
      await supabase.from("company_admins").upsert({ user_id: userId, company_id: companyId }, { onConflict: "user_id,company_id" });
    }
    toast({ title: "Başarılı", description: `Talep ${statusLabels[status].toLowerCase()}.` });
    fetchAll();
  };

  // Company CRUD
  const openCompanyCreate = () => {
    setEditingCompany(null);
    setCompanyForm({ name: "", slug: "", initials: "", sector: "", city: "", size: "", company_type: "A.Ş.", description: "", logo_url: "", banner_url: "" });
    setLogoFile(null);
    setBannerFile(null);
    setCompanyDialogOpen(true);
  };

  const openCompanyEdit = (c: any) => {
    setEditingCompany(c);
    setCompanyForm({
      name: c.name, slug: c.slug, initials: c.initials || "",
      sector: c.sector || "", city: c.city || "", size: c.size || "",
      company_type: c.company_type || "A.Ş.", description: c.description || "",
      logo_url: c.logo_url || "", banner_url: c.banner_url || "",
    });
    setLogoFile(null);
    setBannerFile(null);
    setCompanyDialogOpen(true);
  };

  const uploadCompanyAsset = async (companyId: string, kind: "logo" | "banner", file: File) => {
    const ext = (file.name.split(".").pop() || "png").toLowerCase();
    const path = `companies/${companyId}/${kind}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("company-assets")
      .upload(path, file, { upsert: true, contentType: file.type || "application/octet-stream" });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("company-assets").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleCompanySave = async () => {
    if (!companyForm.name.trim() || !companyForm.slug.trim()) {
      toast({ title: "Hata", description: "Ad ve slug zorunludur.", variant: "destructive" });
      return;
    }
    const initials = companyForm.initials || companyForm.name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
    const payload = {
      ...companyForm,
      initials,
      description: companyForm.description?.trim() || null,
      sector: companyForm.sector?.trim() || null,
      city: companyForm.city?.trim() || null,
      size: companyForm.size?.trim() || null,
      company_type: companyForm.company_type?.trim() || null,
      logo_url: companyForm.logo_url?.trim() || null,
      banner_url: companyForm.banner_url?.trim() || null,
    };

    let saved: any = null;
    let error: any = null;
    if (editingCompany) {
      ({ data: saved, error } = await supabase.from("companies").update(payload).eq("id", editingCompany.id).select("*").single());
    } else {
      ({ data: saved, error } = await supabase.from("companies").insert(payload).select("*").single());
    }

    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
      return;
    }

    const companyId = saved?.id || editingCompany?.id;
    if (companyId && (logoFile || bannerFile)) {
      setUploadingAssets(true);
      try {
        const updates: any = {};
        if (logoFile) updates.logo_url = await uploadCompanyAsset(companyId, "logo", logoFile);
        if (bannerFile) updates.banner_url = await uploadCompanyAsset(companyId, "banner", bannerFile);
        const { error: assetErr } = await supabase.from("companies").update(updates).eq("id", companyId);
        if (assetErr) throw assetErr;
        setLogoFile(null);
        setBannerFile(null);
      } catch (e: any) {
        toast({ title: "Görsel yükleme hatası", description: e?.message || "Bilinmeyen hata", variant: "destructive" });
      } finally {
        setUploadingAssets(false);
      }
    }

    toast({ title: "Başarılı", description: editingCompany ? "Şirket güncellendi." : "Şirket oluşturuldu." });
    setCompanyDialogOpen(false);
    fetchAll();
  };

  const handleDeleteReview = async (id: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else { toast({ title: "Silindi" }); fetchAll(); }
  };

  const handleDeleteSalary = async (id: string) => {
    const { error } = await supabase.from("salaries").delete().eq("id", id);
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else { toast({ title: "Silindi" }); fetchAll(); }
  };

  const handleDeleteInterview = async (id: string) => {
    const { error } = await supabase.from("interviews").delete().eq("id", id);
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else { toast({ title: "Silindi" }); fetchAll(); }
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
              <Star className="h-5 w-5 text-alm-yellow mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">{reviews.length}</p>
              <p className="text-xs text-muted-foreground">Toplam Yorum</p>
            </div>
          </div>

          <Tabs defaultValue="announcements" className="w-full">
            <TabsList className="mb-4 flex-wrap">
              <TabsTrigger value="announcements"><Megaphone className="h-3.5 w-3.5 mr-1" />Duyurular</TabsTrigger>
              <TabsTrigger value="suggestions"><Lightbulb className="h-3.5 w-3.5 mr-1" />Öneriler</TabsTrigger>
              <TabsTrigger value="claims"><FileCheck className="h-3.5 w-3.5 mr-1" />Talepler</TabsTrigger>
              <TabsTrigger value="companies"><Building2 className="h-3.5 w-3.5 mr-1" />Şirketler</TabsTrigger>
              <TabsTrigger value="reviews"><Star className="h-3.5 w-3.5 mr-1" />Yorumlar</TabsTrigger>
              <TabsTrigger value="salaries"><Banknote className="h-3.5 w-3.5 mr-1" />Maaşlar</TabsTrigger>
              <TabsTrigger value="interviews"><UserCheck className="h-3.5 w-3.5 mr-1" />Mülakatlar</TabsTrigger>
              <TabsTrigger value="users"><Users className="h-3.5 w-3.5 mr-1" />Kullanıcılar</TabsTrigger>
              <TabsTrigger value="reports"><Flag className="h-3.5 w-3.5 mr-1" />Raporlar</TabsTrigger>
            </TabsList>

            {/* Announcements */}
            <TabsContent value="announcements"><AdminAnnouncements /></TabsContent>

            {/* Suggestions */}
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
                      <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Henüz öneri yok.</TableCell></TableRow>
                    ) : suggestions.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.company_name}</TableCell>
                        <TableCell>{s.sector || "–"}</TableCell>
                        <TableCell>{s.city || "–"}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[s.status] || ""} variant="outline">{statusLabels[s.status]}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">{new Date(s.created_at).toLocaleDateString("tr-TR")}</TableCell>
                        <TableCell className="text-right">
                          {s.status === "pending" && (
                            <div className="flex justify-end gap-1">
                              <Button size="sm" variant="ghost" onClick={() => handleCreateFromSuggestion(s)} className="text-alm-blue hover:text-alm-blue text-xs">
                                <Plus className="h-3.5 w-3.5 mr-1" /> Şirket Oluştur
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleSuggestionAction(s.id, "rejected")} className="text-destructive hover:text-destructive">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Claims */}
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
                      <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Henüz talep yok.</TableCell></TableRow>
                    ) : claims.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.companies?.name || "–"}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{c.message || "–"}</TableCell>
                        <TableCell><Badge className={statusColors[c.status] || ""} variant="outline">{statusLabels[c.status]}</Badge></TableCell>
                        <TableCell className="text-muted-foreground text-xs">{new Date(c.created_at).toLocaleDateString("tr-TR")}</TableCell>
                        <TableCell className="text-right">
                          {c.status === "pending" && (
                            <div className="flex justify-end gap-1">
                              <Button size="sm" variant="ghost" onClick={() => handleClaimAction(c.id, "approved", c.user_id, c.company_id)} className="text-alm-green hover:text-alm-green"><Check className="h-4 w-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => handleClaimAction(c.id, "rejected")} className="text-destructive hover:text-destructive"><X className="h-4 w-4" /></Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Companies */}
            <TabsContent value="companies">
              <div className="flex justify-end mb-4">
                <Button size="sm" onClick={openCompanyCreate}><Plus className="h-4 w-4 mr-1" /> Şirket Ekle</Button>
              </div>
              <div className="card-elevated overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Adı</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Sektör</TableHead>
                      <TableHead>Şehir</TableHead>
                      <TableHead>Tür</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead className="text-right">İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companies.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{c.slug}</TableCell>
                        <TableCell>{c.sector || "–"}</TableCell>
                        <TableCell>{c.city || "–"}</TableCell>
                        <TableCell>{c.company_type || "–"}</TableCell>
                        <TableCell><Badge variant="outline">{c.status || "Aktif"}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" onClick={() => openCompanyEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Company Dialog */}
              <Dialog open={companyDialogOpen} onOpenChange={setCompanyDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingCompany ? "Şirket Düzenle" : "Yeni Şirket"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 mt-2">
                    <div><Label>Ad *</Label><Input value={companyForm.name} onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value, slug: slugify(e.target.value) })} /></div>
                    <div><Label>Slug *</Label><Input value={companyForm.slug} onChange={(e) => setCompanyForm({ ...companyForm, slug: e.target.value })} /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Sektör</Label><Input value={companyForm.sector} onChange={(e) => setCompanyForm({ ...companyForm, sector: e.target.value })} /></div>
                      <div><Label>Şehir</Label><Input value={companyForm.city} onChange={(e) => setCompanyForm({ ...companyForm, city: e.target.value })} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Büyüklük</Label><Input value={companyForm.size} onChange={(e) => setCompanyForm({ ...companyForm, size: e.target.value })} placeholder="51-200" /></div>
                      <div><Label>Tür</Label><Input value={companyForm.company_type} onChange={(e) => setCompanyForm({ ...companyForm, company_type: e.target.value })} /></div>
                    </div>
                    <div><Label>Açıklama</Label><Input value={companyForm.description} onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })} /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Logo (opsiyonel)</Label>
                        <Input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
                      </div>
                      <div>
                        <Label>Banner (opsiyonel)</Label>
                        <Input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} />
                      </div>
                    </div>
                    <Button onClick={handleCompanySave} className="w-full" disabled={uploadingAssets}>
                      {uploadingAssets ? "Yükleniyor..." : (editingCompany ? "Güncelle" : "Oluştur")}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Reviews moderation */}
            <TabsContent value="reviews">
              <div className="card-elevated overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Şirket</TableHead>
                      <TableHead>Başlık</TableHead>
                      <TableHead>Puan</TableHead>
                      <TableHead>Tarih</TableHead>
                      <TableHead className="text-right">İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Henüz yorum yok.</TableCell></TableRow>
                    ) : reviews.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.companies?.name || "–"}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{r.title}</TableCell>
                        <TableCell>{r.rating}/5</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{new Date(r.created_at).toLocaleDateString("tr-TR")}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDeleteReview(r.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Salaries moderation */}
            <TabsContent value="salaries">
              <div className="card-elevated overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Şirket</TableHead>
                      <TableHead>Pozisyon</TableHead>
                      <TableHead>Maaş</TableHead>
                      <TableHead>Tarih</TableHead>
                      <TableHead className="text-right">İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salaries.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Henüz maaş bilgisi yok.</TableCell></TableRow>
                    ) : salaries.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.companies?.name || "–"}</TableCell>
                        <TableCell>{s.job_title}</TableCell>
                        <TableCell>{s.salary_amount?.toLocaleString("tr-TR")} {s.currency || "TRY"}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{new Date(s.created_at).toLocaleDateString("tr-TR")}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDeleteSalary(s.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Interviews moderation */}
            <TabsContent value="interviews">
              <div className="card-elevated overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Şirket</TableHead>
                      <TableHead>Pozisyon</TableHead>
                      <TableHead>Zorluk</TableHead>
                      <TableHead>Sonuç</TableHead>
                      <TableHead>Tarih</TableHead>
                      <TableHead className="text-right">İşlem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {interviews.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Henüz mülakat bilgisi yok.</TableCell></TableRow>
                    ) : interviews.map((i) => (
                      <TableRow key={i.id}>
                        <TableCell className="font-medium">{i.companies?.name || "–"}</TableCell>
                        <TableCell>{i.position}</TableCell>
                        <TableCell>{i.difficulty || "–"}</TableCell>
                        <TableCell>{i.result || "–"}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{new Date(i.created_at).toLocaleDateString("tr-TR")}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDeleteInterview(i.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Users */}
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
                        <TableCell className="text-muted-foreground text-xs">{new Date(u.created_at).toLocaleDateString("tr-TR")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Reports */}
            <TabsContent value="reports"><AdminReports /></TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
