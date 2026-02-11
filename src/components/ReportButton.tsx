import { useState } from "react";
import { Flag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ReportButtonProps {
  targetId: string;
  targetType: "review" | "salary" | "interview";
}

const REPORT_REASONS = [
  "Spam veya reklam",
  "Yanlış bilgi",
  "Uygunsuz içerik",
  "Kişisel bilgi paylaşımı",
  "Diğer",
];

const ReportButton = ({ targetId, targetType }: ReportButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user || !reason) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("reports" as any).insert({
        user_id: user.id,
        target_id: targetId,
        target_type: targetType,
        reason,
        details: details.trim() || null,
      });

      if (error) {
        if (error.message.includes("rate_limit") || error.message.includes("5 gönderi")) {
          toast({ title: "Limit aşıldı", description: "Saatte en fazla 5 bildirim yapabilirsiniz.", variant: "destructive" });
        } else {
          throw error;
        }
      } else {
        toast({ title: "Bildirildi", description: "İçerik raporunuz alındı. Teşekkürler!" });
        setOpen(false);
        setReason("");
        setDetails("");
      }
    } catch {
      toast({ title: "Hata", description: "Rapor gönderilemedi.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          if (!user) {
            toast({ title: "Giriş yapın", description: "Bildirim yapmak için giriş yapmanız gerekiyor.", variant: "destructive" });
            return;
          }
          setOpen(true);
        }}
        className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        title="İçeriği bildir"
      >
        <Flag className="h-3 w-3" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>İçeriği Bildir</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Sebep</Label>
              <div className="flex flex-wrap gap-2">
                {REPORT_REASONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setReason(r)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                      reason === r
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ek detay (opsiyonel)</Label>
              <Textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Neden bildiriyorsunuz?"
                rows={3}
              />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!reason || loading}
              className="w-full"
            >
              {loading ? "Gönderiliyor..." : "Bildir"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReportButton;
