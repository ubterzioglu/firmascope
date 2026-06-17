/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import {
  REVIEWER_RELATIONSHIPS, POSITION_LEVELS, WORK_MODELS, BENEFIT_OPTIONS,
  normalizeEmptyToNull, normalizeEmptyToArray,
} from "@/lib/form-options";

const RATING_KEYS = [
  "rating_work_atmosphere", "rating_communication", "rating_team_spirit",
  "rating_work_life_balance", "rating_manager_behavior", "rating_tasks",
  "rating_compensation_benefits", "rating_career_growth",
] as const;

export default function AdminReviews() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    title: "", pros: "", cons: "", rating: 5, recommends: false,
    reviewer_relationship: "", position_level: "", department: "", work_model: "",
    rating_work_atmosphere: 0, rating_communication: 0, rating_team_spirit: 0,
    rating_work_life_balance: 0, rating_manager_behavior: 0, rating_tasks: 0,
    rating_compensation_benefits: 0, rating_career_growth: 0,
    benefits: [] as string[],
  });

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("reviews")
      .select("*, companies(name)")
      .order("created_at", { ascending: false });
    setReviews(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else { toast({ title: "Silindi" }); fetchReviews(); }
  };

  const openEdit = (r: any) => {
    setEditing(r);
    setForm({
      title: r.title || "", pros: r.pros || "", cons: r.cons || "",
      rating: r.rating || 5, recommends: r.recommends || false,
      reviewer_relationship: r.reviewer_relationship || "",
      position_level: r.position_level || "",
      department: r.department || "",
      work_model: r.work_model || "",
      rating_work_atmosphere: r.rating_work_atmosphere || 0,
      rating_communication: r.rating_communication || 0,
      rating_team_spirit: r.rating_team_spirit || 0,
      rating_work_life_balance: r.rating_work_life_balance || 0,
      rating_manager_behavior: r.rating_manager_behavior || 0,
      rating_tasks: r.rating_tasks || 0,
      rating_compensation_benefits: r.rating_compensation_benefits || 0,
      rating_career_growth: r.rating_career_growth || 0,
      benefits: r.benefits || [],
    });
    setDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!form.title.trim()) { toast({ title: "Hata", description: "Başlık zorunludur.", variant: "destructive" }); return; }
    const detailFields: Record<string, number | null> = {};
    for (const key of RATING_KEYS) {
      detailFields[key] = (form as any)[key] > 0 ? (form as any)[key] : null;
    }
    const { error } = await supabase.from("reviews").update({
      title: form.title.trim(),
      pros: normalizeEmptyToNull(form.pros),
      cons: normalizeEmptyToNull(form.cons),
      rating: Number(form.rating),
      recommends: form.recommends,
      reviewer_relationship: form.reviewer_relationship || null,
      position_level: form.position_level || null,
      department: normalizeEmptyToNull(form.department),
      work_model: form.work_model || null,
      ...detailFields,
      benefits: normalizeEmptyToArray(form.benefits),
    }).eq("id", editing.id);
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else { toast({ title: "Güncellendi" }); setDialogOpen(false); fetchReviews(); }
  };

  if (loading) {
    return <p className="text-muted-foreground py-8 text-center">Yükleniyor...</p>;
  }

  return (
    <>
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
                <TableCell className="font-medium">{r.companies?.name || "-"}</TableCell>
                <TableCell className="max-w-[200px] truncate">{r.title}</TableCell>
                <TableCell>{r.rating}/5</TableCell>
                <TableCell className="text-muted-foreground text-xs">{new Date(r.created_at).toLocaleDateString("tr-TR")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(r)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Yorumu Düzenle</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div><Label>Başlık *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Olumlu Yönler</Label><Textarea value={form.pros} onChange={(e) => setForm({ ...form, pros: e.target.value })} rows={3} /></div>
            <div><Label>Olumsuz Yönler</Label><Textarea value={form.cons} onChange={(e) => setForm({ ...form, cons: e.target.value })} rows={3} /></div>
            <div><Label>Puan (1-5)</Label><Input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} /></div>
            <div className="flex items-center gap-2">
              <Checkbox id="recommends" checked={form.recommends} onCheckedChange={(v) => setForm({ ...form, recommends: Boolean(v) })} />
              <Label htmlFor="recommends">Şirketi tavsiye eder</Label>
            </div>
            <div>
              <Label>İlişki Tipi</Label>
              <Select value={form.reviewer_relationship} onValueChange={(v) => setForm({ ...form, reviewer_relationship: v })}>
                <SelectTrigger><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                <SelectContent>
                  {REVIEWER_RELATIONSHIPS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Pozisyon Seviyesi</Label>
              <Select value={form.position_level} onValueChange={(v) => setForm({ ...form, position_level: v })}>
                <SelectTrigger><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                <SelectContent>
                  {POSITION_LEVELS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Departman</Label><Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></div>
            <div>
              <Label>Çalışma Modeli</Label>
              <Select value={form.work_model} onValueChange={(v) => setForm({ ...form, work_model: v })}>
                <SelectTrigger><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                <SelectContent>
                  {WORK_MODELS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Çalışma Ortamı (1-5)</Label><Input type="number" min={0} max={5} value={form.rating_work_atmosphere} onChange={(e) => setForm({ ...form, rating_work_atmosphere: Number(e.target.value) })} /></div>
              <div><Label>İletişim (1-5)</Label><Input type="number" min={0} max={5} value={form.rating_communication} onChange={(e) => setForm({ ...form, rating_communication: Number(e.target.value) })} /></div>
              <div><Label>Takım Ruhu (1-5)</Label><Input type="number" min={0} max={5} value={form.rating_team_spirit} onChange={(e) => setForm({ ...form, rating_team_spirit: Number(e.target.value) })} /></div>
              <div><Label>İş-Hayat Dengesi (1-5)</Label><Input type="number" min={0} max={5} value={form.rating_work_life_balance} onChange={(e) => setForm({ ...form, rating_work_life_balance: Number(e.target.value) })} /></div>
              <div><Label>Yönetici Tutumu (1-5)</Label><Input type="number" min={0} max={5} value={form.rating_manager_behavior} onChange={(e) => setForm({ ...form, rating_manager_behavior: Number(e.target.value) })} /></div>
              <div><Label>Görevler (1-5)</Label><Input type="number" min={0} max={5} value={form.rating_tasks} onChange={(e) => setForm({ ...form, rating_tasks: Number(e.target.value) })} /></div>
              <div><Label>Ücret ve Yan Haklar (1-5)</Label><Input type="number" min={0} max={5} value={form.rating_compensation_benefits} onChange={(e) => setForm({ ...form, rating_compensation_benefits: Number(e.target.value) })} /></div>
              <div><Label>Kariyer Gelişimi (1-5)</Label><Input type="number" min={0} max={5} value={form.rating_career_growth} onChange={(e) => setForm({ ...form, rating_career_growth: Number(e.target.value) })} /></div>
            </div>
            <div>
              <Label>Yan Haklar</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {BENEFIT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({
                      ...form,
                      benefits: form.benefits.includes(opt.value)
                        ? form.benefits.filter((b: string) => b !== opt.value)
                        : [...form.benefits, opt.value],
                    })}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      form.benefits.includes(opt.value)
                        ? "border-alm-green bg-alm-green/20 text-alm-green"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={handleUpdate} className="w-full">Güncelle</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
