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
  INTERVIEW_DIFFICULTIES, INTERVIEW_RESULTS, INTERVIEW_TYPES, CURRENCIES,
  normalizeEmptyToNull, parseNumericOrNull,
} from "@/lib/form-options";

export default function AdminInterviews() {
  const { toast } = useToast();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    position: "", experience: "", difficulty: "Orta", result: "Belirsiz",
    interview_year: "", interview_type: "",
    stage_count: "", has_case_study: null as boolean | null,
    response_time_days: "", salary_discussed: null as boolean | null,
    offered_salary_amount: "", offered_salary_currency: "TRY",
  });

  const fetchInterviews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("interviews")
      .select("*, companies(name)")
      .order("created_at", { ascending: false });
    setInterviews(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("interviews").delete().eq("id", id);
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else { toast({ title: "Silindi" }); fetchInterviews(); }
  };

  const openEdit = (i: any) => {
    setEditing(i);
    setForm({
      position: i.position || "", experience: i.experience || "",
      difficulty: i.difficulty || "Orta", result: i.result || "Belirsiz",
      interview_year: i.interview_year?.toString() || "",
      interview_type: i.interview_type || "",
      stage_count: i.stage_count?.toString() || "",
      has_case_study: i.has_case_study ?? null,
      response_time_days: i.response_time_days?.toString() || "",
      salary_discussed: i.salary_discussed ?? null,
      offered_salary_amount: i.offered_salary_amount?.toString() || "",
      offered_salary_currency: i.offered_salary_currency || "TRY",
    });
    setDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!form.position.trim()) { toast({ title: "Hata", description: "Pozisyon zorunludur.", variant: "destructive" }); return; }
    const showOffered = form.result === "Teklif Aldım";
    const { error } = await supabase.from("interviews").update({
      position: form.position.trim(),
      experience: normalizeEmptyToNull(form.experience),
      difficulty: form.difficulty || null,
      result: form.result || null,
      interview_year: parseNumericOrNull(form.interview_year),
      interview_type: form.interview_type || null,
      stage_count: parseNumericOrNull(form.stage_count),
      has_case_study: form.has_case_study,
      response_time_days: parseNumericOrNull(form.response_time_days),
      salary_discussed: form.salary_discussed,
      offered_salary_amount: showOffered ? parseNumericOrNull(form.offered_salary_amount) : null,
      offered_salary_currency: showOffered && form.offered_salary_amount ? form.offered_salary_currency : null,
    }).eq("id", editing.id);
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else { toast({ title: "Güncellendi" }); setDialogOpen(false); fetchInterviews(); }
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
                <TableCell className="font-medium">{i.companies?.name || "-"}</TableCell>
                <TableCell>{i.position}</TableCell>
                <TableCell>{i.difficulty || "-"}</TableCell>
                <TableCell>{i.result || "-"}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{new Date(i.created_at).toLocaleDateString("tr-TR")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(i)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(i.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Mülakat Bilgisini Düzenle</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div><Label>Pozisyon *</Label><Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} /></div>
            <div><Label>Deneyim</Label><Textarea value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} rows={3} /></div>
            <div>
              <Label>Zorluk</Label>
              <Select value={form.difficulty} onValueChange={(v) => setForm({ ...form, difficulty: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {INTERVIEW_DIFFICULTIES.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Sonuç</Label>
              <Select value={form.result} onValueChange={(v) => setForm({ ...form, result: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {INTERVIEW_RESULTS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  <SelectItem value="Olumlu">Olumlu</SelectItem>
                  <SelectItem value="Olumsuz">Olumsuz</SelectItem>
                  <SelectItem value="Belirsiz">Belirsiz</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Mülakat Yılı</Label><Input type="number" value={form.interview_year} onChange={(e) => setForm({ ...form, interview_year: e.target.value })} placeholder="2025" /></div>
            <div>
              <Label>Mülakat Türü</Label>
              <Select value={form.interview_type} onValueChange={(v) => setForm({ ...form, interview_type: v })}>
                <SelectTrigger><SelectValue placeholder="Seçiniz" /></SelectTrigger>
                <SelectContent>
                  {INTERVIEW_TYPES.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Aşama Sayısı</Label><Input type="number" value={form.stage_count} onChange={(e) => setForm({ ...form, stage_count: e.target.value })} placeholder="3" /></div>
            <div className="flex items-center gap-2">
              <Checkbox id="has_case_study" checked={form.has_case_study === true} onCheckedChange={(v) => setForm({ ...form, has_case_study: v ? true : null })} />
              <Label htmlFor="has_case_study">Case Study / Ödev Var</Label>
            </div>
            <div><Label>Geri Dönüş Süresi (gün)</Label><Input type="number" value={form.response_time_days} onChange={(e) => setForm({ ...form, response_time_days: e.target.value })} placeholder="7" /></div>
            <div className="flex items-center gap-2">
              <Checkbox id="salary_discussed" checked={form.salary_discussed === true} onCheckedChange={(v) => setForm({ ...form, salary_discussed: v ? true : null })} />
              <Label htmlFor="salary_discussed">Maaş Konuşuldu</Label>
            </div>
            {form.result === "Teklif Aldım" && (
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Teklif Edilen Maaş</Label><Input type="number" value={form.offered_salary_amount} onChange={(e) => setForm({ ...form, offered_salary_amount: e.target.value })} /></div>
                <div>
                  <Label>Para Birimi</Label>
                  <Select value={form.offered_salary_currency} onValueChange={(v) => setForm({ ...form, offered_salary_currency: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <Button onClick={handleUpdate} className="w-full">Güncelle</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
