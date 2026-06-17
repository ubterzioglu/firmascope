/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import {
  CURRENCIES, SALARY_BASES, EMPLOYMENT_TYPES, SENIORITY_LEVELS, WORK_MODELS, BENEFIT_OPTIONS,
  normalizeEmptyToNull, normalizeEmptyToArray, parseNumericOrNull,
} from "@/lib/form-options";

export default function AdminSalaries() {
  const { toast } = useToast();
  const [salaries, setSalaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    job_title: "", salary_amount: 0, currency: "TRY", experience_years: "",
    salary_basis: "", employment_type: "", seniority_level: "",
    department: "", work_model: "", location_city: "",
    bonus_amount_yearly: "", equity_or_stock: "", benefits: [] as string[],
  });

  const fetchSalaries = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("salaries")
      .select("*, companies(name)")
      .order("created_at", { ascending: false });
    setSalaries(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("salaries").delete().eq("id", id);
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else { toast({ title: "Silindi" }); fetchSalaries(); }
  };

  const openEdit = (s: any) => {
    setEditing(s);
    setForm({
      job_title: s.job_title || "", salary_amount: s.salary_amount || 0,
      currency: s.currency || "TRY", experience_years: s.experience_years?.toString() || "",
      salary_basis: s.salary_basis || "", employment_type: s.employment_type || "",
      seniority_level: s.seniority_level || "",
      department: s.department || "", work_model: s.work_model || "",
      location_city: s.location_city || "",
      bonus_amount_yearly: s.bonus_amount_yearly?.toString() || "",
      equity_or_stock: s.equity_or_stock || "",
      benefits: s.benefits || [],
    });
    setDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!form.job_title.trim() || !form.salary_amount) { toast({ title: "Hata", description: "Pozisyon ve maaş zorunludur.", variant: "destructive" }); return; }
    const { error } = await supabase.from("salaries").update({
      job_title: form.job_title.trim(),
      salary_amount: Number(form.salary_amount),
      currency: form.currency || "TRY",
      experience_years: form.experience_years ? Number(form.experience_years) : null,
      salary_basis: form.salary_basis || null,
      employment_type: form.employment_type || null,
      seniority_level: form.seniority_level || null,
      department: normalizeEmptyToNull(form.department),
      work_model: form.work_model || null,
      location_city: normalizeEmptyToNull(form.location_city),
      bonus_amount_yearly: parseNumericOrNull(form.bonus_amount_yearly),
      equity_or_stock: normalizeEmptyToNull(form.equity_or_stock),
      benefits: normalizeEmptyToArray(form.benefits),
    }).eq("id", editing.id);
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else { toast({ title: "Güncellendi" }); setDialogOpen(false); fetchSalaries(); }
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
                <TableCell className="font-medium">{s.companies?.name || "-"}</TableCell>
                <TableCell>{s.job_title}</TableCell>
                <TableCell>{s.salary_amount?.toLocaleString("tr-TR")} {s.currency || "TRY"}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{new Date(s.created_at).toLocaleDateString("tr-TR")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(s)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(s.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Maaş Bilgisini Düzenle</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div><Label>Pozisyon *</Label><Input value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} /></div>
            <div><Label>Maaş *</Label><Input type="number" value={form.salary_amount} onChange={(e) => setForm({ ...form, salary_amount: Number(e.target.value) })} /></div>
            <div>
              <Label>Para Birimi</Label>
              <Select value={form.currency} onValueChange={(v) => setForm({ ...form, currency: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Net / Brüt</Label>
              <Select value={form.salary_basis} onValueChange={(v) => setForm({ ...form, salary_basis: v })}>
                <SelectTrigger><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                <SelectContent>
                  {SALARY_BASES.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Deneyim (Yıl)</Label><Input type="number" value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: e.target.value })} placeholder="0" /></div>
            <div>
              <Label>Çalışma Tipi</Label>
              <Select value={form.employment_type} onValueChange={(v) => setForm({ ...form, employment_type: v })}>
                <SelectTrigger><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_TYPES.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Seniority</Label>
              <Select value={form.seniority_level} onValueChange={(v) => setForm({ ...form, seniority_level: v })}>
                <SelectTrigger><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                <SelectContent>
                  {SENIORITY_LEVELS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
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
            <div><Label>Şehir</Label><Input value={form.location_city} onChange={(e) => setForm({ ...form, location_city: e.target.value })} /></div>
            <div><Label>Yıllık Bonus</Label><Input type="number" value={form.bonus_amount_yearly} onChange={(e) => setForm({ ...form, bonus_amount_yearly: e.target.value })} placeholder="0" /></div>
            <div><Label>Hisse / Equity</Label><Input value={form.equity_or_stock} onChange={(e) => setForm({ ...form, equity_or_stock: e.target.value })} /></div>
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
