/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Check, X } from "lucide-react";
import { statusColors, statusLabels } from "@/lib/admin/constants";

export default function AdminClaims() {
  const { toast } = useToast();
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("company_claims")
      .select("*, companies(name)")
      .order("created_at", { ascending: false });
    setClaims(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleClaimAction = async (
    id: string,
    status: "approved" | "rejected",
    userId?: string,
    companyId?: string,
  ) => {
    const { error } = await supabase.from("company_claims").update({ status }).eq("id", id);
    if (error) { toast({ title: "Hata", description: error.message, variant: "destructive" }); return; }
    if (status === "approved" && userId && companyId) {
      await supabase.from("user_roles").upsert({ user_id: userId, role: "company_admin" as any }, { onConflict: "user_id,role" });
      await supabase.from("company_admins").upsert({ user_id: userId, company_id: companyId }, { onConflict: "user_id,company_id" });
    }
    toast({ title: "Başarılı", description: `Talep ${statusLabels[status].toLowerCase()}.` });
    fetchClaims();
  };

  if (loading) {
    return <p className="text-muted-foreground py-8 text-center">Yükleniyor...</p>;
  }

  return (
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
              <TableCell className="font-medium">{c.companies?.name || "-"}</TableCell>
              <TableCell className="max-w-[200px] truncate">{c.message || "-"}</TableCell>
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
  );
}
