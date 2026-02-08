import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Check, X, Eye } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Report {
  id: string;
  target_id: string;
  target_type: string;
  reason: string;
  details: string | null;
  status: string;
  admin_note: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber/20 text-amber-foreground border-amber/30",
  resolved: "bg-alm-green/20 text-foreground border-alm-green/30",
  dismissed: "bg-muted text-muted-foreground border-border",
};

const statusLabels: Record<string, string> = {
  pending: "Bekliyor",
  resolved: "Çözüldü",
  dismissed: "Reddedildi",
};

const targetTypeLabels: Record<string, string> = {
  review: "Yorum",
  salary: "Maaş",
  interview: "Mülakat",
};

const AdminReports = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [adminNote, setAdminNote] = useState("");

  const fetchReports = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("reports" as any)
      .select("*")
      .order("created_at", { ascending: false });
    setReports((data as unknown as Report[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAction = async (id: string, status: "resolved" | "dismissed", note?: string) => {
    const updatePayload: any = { status };
    if (note) updatePayload.admin_note = note;

    const { error } = await supabase
      .from("reports" as any)
      .update(updatePayload)
      .eq("id", id);

    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Güncellendi", description: `Rapor ${statusLabels[status].toLowerCase()}.` });
      setDetailOpen(false);
      fetchReports();
    }
  };

  const handleDeleteTarget = async (report: Report) => {
    const tableName = report.target_type === "review" ? "reviews"
      : report.target_type === "salary" ? "salaries"
      : "interviews";

    const { error } = await supabase.from(tableName).delete().eq("id", report.target_id);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      await handleAction(report.id, "resolved", "İçerik silindi.");
      toast({ title: "İçerik silindi", description: "Raporlanan içerik kaldırıldı." });
    }
  };

  const pendingCount = reports.filter((r) => r.status === "pending").length;

  if (loading) return <p className="text-muted-foreground text-center py-8">Yükleniyor...</p>;

  return (
    <div className="space-y-4">
      {pendingCount > 0 && (
        <div className="rounded-lg border border-alm-orange/30 bg-alm-orange/10 p-3 text-sm text-foreground">
          <strong>{pendingCount}</strong> bekleyen rapor var.
        </div>
      )}
      <div className="card-elevated overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tür</TableHead>
              <TableHead>Sebep</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead className="text-right">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Henüz rapor yok.
                </TableCell>
              </TableRow>
            ) : (
              reports.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <Badge variant="outline">{targetTypeLabels[r.target_type] || r.target_type}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{r.reason}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[r.status] || ""} variant="outline">
                      {statusLabels[r.status] || r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {new Date(r.created_at).toLocaleDateString("tr-TR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedReport(r);
                          setAdminNote(r.admin_note || "");
                          setDetailOpen(true);
                        }}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      {r.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-alm-green hover:text-alm-green"
                            onClick={() => handleAction(r.id, "resolved")}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-muted-foreground"
                            onClick={() => handleAction(r.id, "dismissed")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rapor Detayı</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Tür:</span>{" "}
                  <span className="font-medium">{targetTypeLabels[selectedReport.target_type]}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Durum:</span>{" "}
                  <Badge className={statusColors[selectedReport.status]} variant="outline">
                    {statusLabels[selectedReport.status]}
                  </Badge>
                </div>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Sebep:</span>{" "}
                <span className="font-medium">{selectedReport.reason}</span>
              </div>
              {selectedReport.details && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Detay:</span>{" "}
                  <span>{selectedReport.details}</span>
                </div>
              )}
              <div className="space-y-2">
                <Label>Admin Notu</Label>
                <Textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Not ekleyin..."
                  rows={2}
                />
              </div>
              <div className="flex gap-2">
                {selectedReport.status === "pending" && (
                  <>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDeleteTarget(selectedReport)}
                    >
                      İçeriği Sil & Çöz
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAction(selectedReport.id, "resolved", adminNote)}
                    >
                      Çözüldü
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleAction(selectedReport.id, "dismissed", adminNote)}
                    >
                      Reddet
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReports;
