import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface InterviewFormProps {
  companyId: string;
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const difficulties = ["Kolay", "Orta", "Zor", "Çok Zor"];
const results = ["Teklif Aldım", "Reddedildi", "Beklemede", "Katılmadım"];

const InterviewForm = ({ companyId, userId, onSuccess, onCancel }: InterviewFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState("");
  const [experience, setExperience] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!position.trim()) {
      toast({ title: "Hata", description: "Pozisyon zorunludur.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("interviews").insert({
      company_id: companyId,
      user_id: userId,
      position: position.trim(),
      experience: experience.trim() || null,
      difficulty: difficulty || null,
      result: result || null,
    });

    setLoading(false);
    if (error) {
      toast({ title: "Hata", description: "Mülakat deneyimi gönderilemedi.", variant: "destructive" });
    } else {
      toast({ title: "Başarılı!", description: "Mülakat deneyimi anonim olarak eklendi." });
      onSuccess();
    }
  };

  return (
    <div className="card-elevated p-6">
      <h3 className="font-display text-lg font-bold text-foreground mb-4">Mülakat Deneyimi Paylaş</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="interview-position">Pozisyon *</Label>
          <Input id="interview-position" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Frontend Developer" maxLength={200} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="interview-experience">Mülakat Deneyimi</Label>
          <Textarea id="interview-experience" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Mülakat sürecini anlat..." rows={4} maxLength={3000} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="interview-difficulty">Zorluk</Label>
            <select
              id="interview-difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Seçiniz</option>
              {difficulties.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="interview-result">Sonuç</Label>
            <select
              id="interview-result"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Seçiniz</option>
              {results.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading} className="flex-1 bg-amber text-amber-foreground hover:bg-amber/90">
            {loading ? "Gönderiliyor..." : "Mülakat Bilgisini Gönder"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>İptal</Button>
        </div>
      </form>
    </div>
  );
};

export default InterviewForm;
