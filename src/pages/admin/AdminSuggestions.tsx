/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, X } from "lucide-react";
import { slugify, statusColors, statusLabels } from "@/lib/admin/constants";

export default function AdminSuggestions() {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("company_suggestions")
      .select("*")
      .order("created_at", { ascending: false });
    setSuggestions(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleSuggestionAction = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("company_suggestions").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Başarılı", description: `Öneri ${statusLabels[status].toLowerCase()}.` });
      fetchSuggestions();
    }
  };

  const handleCreateFromSuggestion = async (suggestion: any) => {
    const slug = slugify(String(suggestion.company_name || ""));
    const initials = suggestion.company_name
      .split(" ")
      .filter((w: string) => w.length > 0)
      .slice(0, 2)
      .map((w: string) => w[0].toUpperCase())
      .join("");
    const { error } = await supabase.rpc("create_company_admin", {
      p_name: suggestion.company_name,
      p_slug: slug,
      p_initials: initials,
      p_sector: suggestion.sector,
      p_city: suggestion.city,
      p_description: suggestion.description,
      p_provenance_tag: "admin_manual",
      p_created_via: "suggestion_approval",
    });
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      await supabase.from("company_suggestions").update({ status: "approved" }).eq("id", suggestion.id);
      toast({ title: "Başarılı", description: `${suggestion.company_name} şirketi oluşturuldu.` });
      fetchSuggestions();
    }
  };

  if (loading) {
    return <p className="text-muted-foreground py-8 text-center">Yükleniyor...</p>;
  }

  return (
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
              <TableCell>{s.sector || "-"}</TableCell>
              <TableCell>{s.city || "-"}</TableCell>
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
  );
}
