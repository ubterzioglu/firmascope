import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  INTERVIEW_DIFFICULTIES,
  INTERVIEW_RESULTS,
  INTERVIEW_TYPES,
  normalizeEmptyToNull,
  parseNumericOrNull,
} from "@/lib/form-options";

interface InterviewFormProps {
  companyId: string;
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const InterviewForm = ({ companyId, userId, onSuccess, onCancel }: InterviewFormProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [position, setPosition] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [result, setResult] = useState("");
  const [interviewYear, setInterviewYear] = useState("");
  const [interviewType, setInterviewType] = useState("");

  const [stageCount, setStageCount] = useState("");
  const [hasCaseStudy, setHasCaseStudy] = useState<boolean | null>(null);
  const [responseTimeDays, setResponseTimeDays] = useState("");
  const [salaryDiscussed, setSalaryDiscussed] = useState<boolean | null>(null);
  const [offeredSalaryAmount, setOfferedSalaryAmount] = useState("");
  const [offeredSalaryCurrency, setOfferedSalaryCurrency] = useState("TRY");
  const [experience, setExperience] = useState("");

  const canAdvanceStep0 =
    position.trim() !== "" &&
    difficulty !== "" &&
    result !== "";

  const showOfferedSalary = result === "Teklif Aldım";

  const handleNext = () => {
    if (!canAdvanceStep0) {
      toast({ title: "Eksik alan", description: "Pozisyon, zorluk ve sonuç zorunludur.", variant: "destructive" });
      return;
    }
    setStep(1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { error } = await supabase.from("interviews").insert({
      company_id: companyId,
      user_id: userId,
      position: position.trim(),
      difficulty: difficulty || null,
      result: result || null,
      interview_year: parseNumericOrNull(interviewYear),
      interview_type: interviewType || null,
      stage_count: parseNumericOrNull(stageCount),
      has_case_study: hasCaseStudy,
      response_time_days: parseNumericOrNull(responseTimeDays),
      salary_discussed: salaryDiscussed,
      offered_salary_amount: showOfferedSalary ? parseNumericOrNull(offeredSalaryAmount) : null,
      offered_salary_currency: showOfferedSalary && offeredSalaryAmount ? offeredSalaryCurrency : null,
      experience: normalizeEmptyToNull(experience),
    });

    setLoading(false);
    if (error) {
      toast({ title: "Hata", description: "Mülakat deneyimi gönderilemedi.", variant: "destructive" });
    } else {
      toast({ title: "Başarılı!", description: "Mülakat deneyimi anonim olarak eklendi." });
      onSuccess();
    }
  };

  const ChipGroup = ({
    options,
    value,
    onChange,
  }: {
    options: readonly { value: string; label: string }[];
    value: string;
    onChange: (v: string) => void;
  }) => (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(value === opt.value ? "" : opt.value)}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
            value === opt.value
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-primary/50"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display text-lg font-bold text-foreground">Mülakat Deneyimi Paylaş</h3>
        <span className="text-xs text-muted-foreground">Adım {step + 1}/2</span>
      </div>

      <div className="flex gap-1 mb-5">
        {[0, 1].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-amber" : "bg-border"
            }`}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Pozisyon *</Label>
            <Input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Frontend Developer" maxLength={200} />
          </div>

          <div className="space-y-2">
            <Label>Zorluk *</Label>
            <ChipGroup options={INTERVIEW_DIFFICULTIES} value={difficulty} onChange={setDifficulty} />
          </div>

          <div className="space-y-2">
            <Label>Sonuç *</Label>
            <ChipGroup options={INTERVIEW_RESULTS} value={result} onChange={setResult} />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Mülakat Yılı <span className="text-xs">(opsiyonel)</span></Label>
            <Input type="number" value={interviewYear} onChange={(e) => setInterviewYear(e.target.value)} placeholder="2025" min={2000} max={2030} />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Mülakat Türü <span className="text-xs">(opsiyonel)</span></Label>
            <ChipGroup options={INTERVIEW_TYPES} value={interviewType} onChange={setInterviewType} />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <p className="text-xs text-muted-foreground">Tüm alanlar opsiyoneldir. Daha detaylı paylaşım için doldurun.</p>

          <div className="space-y-2">
            <Label>Aşama Sayısı</Label>
            <Input type="number" value={stageCount} onChange={(e) => setStageCount(e.target.value)} placeholder="3" min={1} max={20} />
          </div>

          <div className="space-y-2">
            <Label>Case Study / Ödev Var mı?</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setHasCaseStudy(hasCaseStudy === true ? null : true)}
                className={`rounded-lg border px-4 py-2 text-xs font-medium transition-colors ${
                  hasCaseStudy === true
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                Evet
              </button>
              <button
                type="button"
                onClick={() => setHasCaseStudy(hasCaseStudy === false ? null : false)}
                className={`rounded-lg border px-4 py-2 text-xs font-medium transition-colors ${
                  hasCaseStudy === false
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                Hayır
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Geri Dönüş Süresi (gün)</Label>
            <Input type="number" value={responseTimeDays} onChange={(e) => setResponseTimeDays(e.target.value)} placeholder="7" min={0} max={365} />
          </div>

          <div className="space-y-2">
            <Label>Maaş Konuşuldu mu?</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSalaryDiscussed(salaryDiscussed === true ? null : true)}
                className={`rounded-lg border px-4 py-2 text-xs font-medium transition-colors ${
                  salaryDiscussed === true
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                Evet
              </button>
              <button
                type="button"
                onClick={() => setSalaryDiscussed(salaryDiscussed === false ? null : false)}
                className={`rounded-lg border px-4 py-2 text-xs font-medium transition-colors ${
                  salaryDiscussed === false
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                Hayır
              </button>
            </div>
          </div>

          {showOfferedSalary && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Teklif Edilen Maaş</Label>
                <Input type="number" value={offeredSalaryAmount} onChange={(e) => setOfferedSalaryAmount(e.target.value)} placeholder="50000" min={0} />
              </div>
              <div className="space-y-2">
                <Label>Para Birimi</Label>
                <div className="flex gap-2">
                  {(["TRY", "USD", "EUR"] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setOfferedSalaryCurrency(c)}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors flex-1 ${
                        offeredSalaryCurrency === c
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Mülakat Deneyimi</Label>
            <Textarea value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Mülakat sürecini anlat..." rows={4} maxLength={3000} />
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-6">
        {step > 0 && (
          <Button type="button" variant="outline" onClick={() => setStep(0)}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Geri
          </Button>
        )}
        <div className="flex-1" />
        {step === 0 ? (
          <Button type="button" onClick={handleNext} className="bg-amber text-amber-foreground hover:bg-amber/90">
            Devam <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit} disabled={loading} className="bg-amber text-amber-foreground hover:bg-amber/90">
            {loading ? "Gönderiliyor..." : "Mülakat Bilgisini Gönder"}
          </Button>
        )}
        <Button type="button" variant="ghost" onClick={onCancel}>İptal</Button>
      </div>
    </div>
  );
};

export default InterviewForm;
