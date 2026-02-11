import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface SalaryFormProps {
  companyId: string;
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const SalaryForm = ({ companyId, userId, onSuccess, onCancel }: SalaryFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [salaryAmount, setSalaryAmount] = useState("");
  const [currency, setCurrency] = useState("TRY");
  const [experienceYears, setExperienceYears] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) {
      toast({ title: "Hata", description: "Pozisyon zorunludur.", variant: "destructive" });
      return;
    }
    const amount = parseInt(salaryAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Hata", description: "Geçerli bir maaş tutarı girin.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("salaries").insert({
      company_id: companyId,
      user_id: userId,
      job_title: jobTitle.trim(),
      salary_amount: amount,
      currency,
      experience_years: experienceYears ? parseInt(experienceYears) : null,
    });

    setLoading(false);
    if (error) {
      toast({ title: "Hata", description: "Maaş bilgisi gönderilemedi.", variant: "destructive" });
    } else {
      toast({ title: "Başarılı!", description: "Maaş bilgisi anonim olarak eklendi." });
      onSuccess();
    }
  };

  return (
    <div className="card-elevated p-6">
      <h3 className="font-display text-lg font-bold text-foreground mb-4">Maaş Bilgisi Ekle</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="job-title">Pozisyon *</Label>
          <Input id="job-title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Yazılım Mühendisi" maxLength={200} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="salary-amount">Aylık Maaş (net) *</Label>
            <Input id="salary-amount" type="number" value={salaryAmount} onChange={(e) => setSalaryAmount(e.target.value)} placeholder="50000" min={1} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Para Birimi</Label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="TRY">TRY</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience-years">Deneyim Yılı</Label>
          <Input id="experience-years" type="number" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} placeholder="3" min={0} max={50} />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading} className="flex-1 bg-alm-orange hover:bg-alm-orange/90">
            {loading ? "Gönderiliyor..." : "Maaş Bilgisini Gönder"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>İptal</Button>
        </div>
      </form>
    </div>
  );
};

export default SalaryForm;
