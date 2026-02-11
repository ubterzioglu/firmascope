import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";

interface ReviewFormProps {
  companyId: string;
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const ReviewForm = ({ companyId, userId, onSuccess, onCancel }: ReviewFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [recommends, setRecommends] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({ title: "Hata", description: "Başlık zorunludur.", variant: "destructive" });
      return;
    }
    if (rating === 0) {
      toast({ title: "Hata", description: "Puan seçiniz.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("reviews").insert({
      company_id: companyId,
      user_id: userId,
      title: title.trim(),
      pros: pros.trim() || null,
      cons: cons.trim() || null,
      rating,
      recommends,
    });

    setLoading(false);
    if (error) {
      toast({ title: "Hata", description: "Değerlendirme gönderilemedi.", variant: "destructive" });
    } else {
      toast({ title: "Başarılı!", description: "Değerlendirmeniz anonim olarak eklendi." });
      onSuccess();
    }
  };

  return (
    <div className="card-elevated p-6">
      <h3 className="font-display text-lg font-bold text-foreground mb-4">Değerlendirme Yaz</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Puan *</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(s)}
                className="p-0.5"
              >
                <Star
                  className={`h-7 w-7 transition-colors ${
                    s <= (hoverRating || rating)
                      ? "fill-alm-yellow text-alm-yellow"
                      : "fill-muted text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="review-title">Başlık *</Label>
          <Input id="review-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Kısa bir özet" maxLength={200} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="review-pros">Artılar</Label>
          <Textarea id="review-pros" value={pros} onChange={(e) => setPros(e.target.value)} placeholder="Şirketin iyi yönleri..." rows={3} maxLength={2000} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="review-cons">Eksiler</Label>
          <Textarea id="review-cons" value={cons} onChange={(e) => setCons(e.target.value)} placeholder="Şirketin geliştirilecek yönleri..." rows={3} maxLength={2000} />
        </div>

        <div className="flex items-center gap-2">
          <Switch checked={recommends} onCheckedChange={setRecommends} id="recommends" />
          <Label htmlFor="recommends">Bu şirketi tavsiye ederim</Label>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Gönderiliyor..." : "Değerlendirmeyi Gönder"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>İptal</Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
