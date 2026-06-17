/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil } from "lucide-react";
import {
  slugify, provenanceLabels, provenanceColors, createdViaLabels,
} from "@/lib/admin/constants";

const EMPTY_FORM = {
  name: "", slug: "", initials: "", sector: "", city: "", size: "", company_type: "A.S.", description: "",
  logo_url: "", banner_url: "",
  website_url: "", linkedin_url: "", twitter_url: "", instagram_url: "", facebook_url: "",
};

export default function AdminCompanies() {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<any[]>([]);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingCompany, setSavingCompany] = useState(false);

  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [companyForm, setCompanyForm] = useState({ ...EMPTY_FORM });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [uploadingAssets, setUploadingAssets] = useState(false);

  const [sqlImportFile, setSqlImportFile] = useState<File | null>(null);
  const [sqlImporting, setSqlImporting] = useState(false);
  const [sqlImportResult, setSqlImportResult] = useState<any>(null);

  const fetchCompanies = async () => {
    setLoading(true);
    const [compRes, profRes] = await Promise.all([
      supabase.from("companies").select("*").order("name"),
      supabase.from("profiles").select("user_id, display_name"),
    ]);
    const names: Record<string, string> = {};
    for (const p of profRes.data || []) {
      if (p.user_id) names[p.user_id] = p.display_name || p.user_id.slice(0, 8);
    }
    setUserNames(names);
    setCompanies(compRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const getUserDisplayName = (targetUserId: string | null | undefined) => {
    if (!targetUserId) return "-";
    return userNames[targetUserId] || targetUserId.slice(0, 8);
  };

  const openCompanyCreate = () => {
    setEditingCompany(null);
    setCompanyForm({ ...EMPTY_FORM });
    setLogoFile(null); setBannerFile(null); setCompanyDialogOpen(true);
  };

  const openCompanyEdit = (c: any) => {
    setEditingCompany(c);
    setCompanyForm({
      name: c.name, slug: c.slug, initials: c.initials || "",
      sector: c.sector || "", city: c.city || "", size: c.size || "",
      company_type: c.company_type || "A.S.", description: c.description || "",
      logo_url: c.logo_url || "", banner_url: c.banner_url || "",
      website_url: c.website_url || "", linkedin_url: c.linkedin_url || "",
      twitter_url: c.twitter_url || "", instagram_url: c.instagram_url || "",
      facebook_url: c.facebook_url || "",
    });
    setLogoFile(null); setBannerFile(null); setCompanyDialogOpen(true);
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
      toast({ title: "Hata", description: "Ad ve slug zorunludur.", variant: "destructive" }); return;
    }
    setSavingCompany(true);
    const initials = companyForm.initials || companyForm.name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
    const payload = {
      ...companyForm, initials,
      description: companyForm.description?.trim() || null,
      sector: companyForm.sector?.trim() || null,
      city: companyForm.city?.trim() || null,
      size: companyForm.size?.trim() || null,
      company_type: companyForm.company_type?.trim() || null,
      logo_url: companyForm.logo_url?.trim() || null,
      banner_url: companyForm.banner_url?.trim() || null,
      website_url: companyForm.website_url?.trim() || null,
      linkedin_url: companyForm.linkedin_url?.trim() || null,
      twitter_url: companyForm.twitter_url?.trim() || null,
      instagram_url: companyForm.instagram_url?.trim() || null,
      facebook_url: companyForm.facebook_url?.trim() || null,
    };
    let saved: any = null; let error: any = null;
    if (editingCompany) {
      ({ data: saved, error } = await supabase.from("companies").update(payload).eq("id", editingCompany.id).select("*").single());
    } else {
      ({ data: saved, error } = await supabase.rpc("create_company_admin", {
        p_name: payload.name,
        p_slug: payload.slug,
        p_initials: payload.initials,
        p_sector: payload.sector,
        p_city: payload.city,
        p_size: payload.size,
        p_company_type: payload.company_type,
        p_description: payload.description,
        p_logo_url: payload.logo_url,
        p_banner_url: payload.banner_url,
        p_provenance_tag: "admin_manual",
        p_created_via: "admin_panel",
      }));
    }
    if (error) {
      setSavingCompany(false);
      toast({ title: "Hata", description: error.message, variant: "destructive" });
      return;
    }
    const companyId = saved?.id || editingCompany?.id;
    // create_company_admin RPC does not accept social links; persist them on create via a follow-up update.
    if (companyId && !editingCompany) {
      const { error: socialErr } = await supabase.from("companies").update({
        website_url: payload.website_url,
        linkedin_url: payload.linkedin_url,
        twitter_url: payload.twitter_url,
        instagram_url: payload.instagram_url,
        facebook_url: payload.facebook_url,
      }).eq("id", companyId);
      if (socialErr) toast({ title: "Sosyal link kaydedilemedi", description: socialErr.message, variant: "destructive" });
    }
    if (companyId && (logoFile || bannerFile)) {
      setUploadingAssets(true);
      try {
        const updates: any = {};
        if (logoFile) updates.logo_url = await uploadCompanyAsset(companyId, "logo", logoFile);
        if (bannerFile) updates.banner_url = await uploadCompanyAsset(companyId, "banner", bannerFile);
        const { error: assetErr } = await supabase.from("companies").update(updates).eq("id", companyId);
        if (assetErr) throw assetErr;
        setLogoFile(null); setBannerFile(null);
      } catch (e: any) {
        toast({ title: "Gorsel yukleme hatasi", description: e?.message || "Bilinmeyen hata", variant: "destructive" });
      } finally { setUploadingAssets(false); }
    }
    setSavingCompany(false);
    toast({ title: "Başarılı", description: editingCompany ? "Şirket güncellendi." : "Şirket oluşturuldu." });
    setCompanyDialogOpen(false); fetchCompanies();
  };

  const handleSqlFileChange = (file: File | null) => {
    setSqlImportResult(null);
    setSqlImportFile(file);
  };

  const handleSqlImport = async () => {
    if (!sqlImportFile) {
      toast({ title: "Hata", description: "Lutfen bir SQL dosyasi secin.", variant: "destructive" });
      return;
    }
    if (!sqlImportFile.name.toLowerCase().endsWith(".sql")) {
      toast({ title: "Hata", description: "Yalnizca .sql uzantili dosyalar kabul edilir.", variant: "destructive" });
      return;
    }
    setSqlImporting(true);
    setSqlImportResult(null);
    try {
      const sqlText = await sqlImportFile.text();
      const { data, error } = await supabase.rpc("execute_company_import_sql", { sql_text: sqlText });
      if (error) {
        toast({ title: "Hata", description: error.message, variant: "destructive" });
        return;
      }
      setSqlImportResult(data);
      toast({ title: "Basarili", description: "SQL import tamamlandi." });
      setSqlImportFile(null);
      fetchCompanies();
    } catch (error: any) {
      toast({ title: "Hata", description: error?.message || "SQL dosyasi okunurken hata olustu.", variant: "destructive" });
    } finally {
      setSqlImporting(false);
    }
  };

  if (loading) {
    return <p className="text-muted-foreground py-8 text-center">Yükleniyor...</p>;
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted-foreground">
          Yeni şirketler guvenli admin RPC uzerinden eklenir. Mevcut legacy 101 kayit `before` etiketi ile korunur.
        </div>
        <Button size="sm" onClick={openCompanyCreate}><Plus className="h-4 w-4 mr-1" /> SQL Destekli Sirket Ekle</Button>
      </div>
      <div className="mb-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground">SQL Dosyasi Yukle</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Once 100 sirketlik listenizi deep search ile cikarin, sonra ornek formatta `.sql` dosyasi hazirlayip yukleyin.
            Logo ve banner zorunlu degil; sonradan eklenebilir.
          </p>
          <div className="mt-4 space-y-3">
            <div>
              <Label>SQL dosyasi</Label>
              <Input type="file" accept=".sql,text/sql" onChange={(e) => handleSqlFileChange(e.target.files?.[0] || null)} />
            </div>
            <Button onClick={handleSqlImport} disabled={!sqlImportFile || sqlImporting} className="w-full">
              {sqlImporting ? "Yukleniyor..." : "SQL Dosyasini Calistir"}
            </Button>
          </div>
          {sqlImportResult && (
            <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
              <div className="grid gap-2 sm:grid-cols-3">
                <div>
                  <div className="text-xs text-muted-foreground">Statement</div>
                  <div className="font-semibold text-foreground">{sqlImportResult.total_statements ?? 0}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Eklenen</div>
                  <div className="font-semibold text-foreground">{sqlImportResult.successful_rows ?? 0}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Atlanan</div>
                  <div className="font-semibold text-foreground">{sqlImportResult.skipped_rows ?? 0}</div>
                </div>
              </div>
              {Array.isArray(sqlImportResult.errors) && sqlImportResult.errors.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hatalar</div>
                  {sqlImportResult.errors.map((item: any, index: number) => (
                    <div key={index} className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-foreground">
                      Statement {item.statement_number || index + 1}: {item.message || "Bilinmeyen hata"}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground">Calisma Notu</h3>
          <div className="mt-2 space-y-2 text-sm text-muted-foreground">
            <p>1. Ucunuz de deep search ile once kendi 100 sirketlik listenizi cikarin.</p>
            <p>2. 300 sirket senin tarafindan 100-100-100 paylastirilacak.</p>
            <p>3. Her admin kendi SQL dosyasini bu alandan yukleyecek.</p>
            <p>4. Mevcut sirketler placeholder kabul edilmeli; duplicate kontrolu SQL tarafinda korunuyor.</p>
          </div>
        </div>
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
              <TableHead>Kaynak</TableHead>
              <TableHead>Ekleyen Admin</TableHead>
              <TableHead className="text-right">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{c.slug}</TableCell>
                <TableCell>{c.sector || "-"}</TableCell>
                <TableCell>{c.city || "-"}</TableCell>
                <TableCell>{c.company_type || "-"}</TableCell>
                <TableCell><Badge variant="outline">{c.status || "Aktif"}</Badge></TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <Badge className={provenanceColors[c.provenance_tag] || ""} variant="outline">
                      {provenanceLabels[c.provenance_tag] || c.provenance_tag || "-"}
                    </Badge>
                    <Badge variant="outline">
                      {createdViaLabels[c.created_via] || c.created_via || "-"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {getUserDisplayName(c.created_by_admin_user_id)}
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" onClick={() => openCompanyEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={companyDialogOpen} onOpenChange={setCompanyDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCompany ? "Şirket Düzenle" : "Yeni Şirket"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {!editingCompany && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
                Bu form veriyi backend tarafinda kontrollu SQL insert ile olusturur. Ayni slug varsa kayit yapilmaz.
              </div>
            )}
            <div><Label>Ad *</Label><Input value={companyForm.name} onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value, slug: slugify(e.target.value) })} /></div>
            <div><Label>Slug *</Label><Input value={companyForm.slug} onChange={(e) => setCompanyForm({ ...companyForm, slug: e.target.value })} /></div>
            <div><Label>Kisaltma</Label><Input value={companyForm.initials} onChange={(e) => setCompanyForm({ ...companyForm, initials: e.target.value })} placeholder="FS" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Sektör</Label><Input value={companyForm.sector} onChange={(e) => setCompanyForm({ ...companyForm, sector: e.target.value })} /></div>
              <div><Label>Şehir</Label><Input value={companyForm.city} onChange={(e) => setCompanyForm({ ...companyForm, city: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Büyüklük</Label><Input value={companyForm.size} onChange={(e) => setCompanyForm({ ...companyForm, size: e.target.value })} placeholder="51-200" /></div>
              <div><Label>Tür</Label><Input value={companyForm.company_type} onChange={(e) => setCompanyForm({ ...companyForm, company_type: e.target.value })} /></div>
            </div>
            <div><Label>Açıklama</Label><Textarea value={companyForm.description} onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })} rows={4} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Logo URL</Label><Input value={companyForm.logo_url} onChange={(e) => setCompanyForm({ ...companyForm, logo_url: e.target.value })} placeholder="https://..." /></div>
              <div><Label>Banner URL</Label><Input value={companyForm.banner_url} onChange={(e) => setCompanyForm({ ...companyForm, banner_url: e.target.value })} placeholder="https://..." /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Logo (opsiyonel)</Label><Input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} /></div>
              <div><Label>Banner (opsiyonel)</Label><Input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Web Sitesi</Label><Input value={companyForm.website_url} onChange={(e) => setCompanyForm({ ...companyForm, website_url: e.target.value })} placeholder="https://..." /></div>
              <div><Label>LinkedIn</Label><Input value={companyForm.linkedin_url} onChange={(e) => setCompanyForm({ ...companyForm, linkedin_url: e.target.value })} placeholder="https://linkedin.com/company/..." /></div>
              <div><Label>Twitter / X</Label><Input value={companyForm.twitter_url} onChange={(e) => setCompanyForm({ ...companyForm, twitter_url: e.target.value })} placeholder="https://x.com/..." /></div>
              <div><Label>Instagram</Label><Input value={companyForm.instagram_url} onChange={(e) => setCompanyForm({ ...companyForm, instagram_url: e.target.value })} placeholder="https://instagram.com/..." /></div>
              <div><Label>Facebook</Label><Input value={companyForm.facebook_url} onChange={(e) => setCompanyForm({ ...companyForm, facebook_url: e.target.value })} placeholder="https://facebook.com/..." /></div>
            </div>
            <Button onClick={handleCompanySave} className="w-full" disabled={uploadingAssets || savingCompany}>
              {uploadingAssets || savingCompany ? "Yükleniyor..." : (editingCompany ? "Güncelle" : "Oluştur")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
