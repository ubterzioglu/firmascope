import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  EMPLOYMENT_TYPES,
  SENIORITY_LEVELS,
  SALARY_BASES,
  CURRENCIES,
  WORK_MODELS,
  BENEFIT_OPTIONS,
  normalizeEmptyToNull,
  normalizeEmptyToArray,
  parseNumericOrNull,
} from "@/lib/form-options";

interface SalaryFormProps {
  companyId: string;
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const SalaryForm = ({ companyId, userId, onSuccess, onCancel }: SalaryFormProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [jobTitle, setJobTitle] = useState("");
  const [salaryAmount, setSalaryAmount] = useState("");
  const [currency, setCurrency] = useState("TRY");
  const [salaryBasis, setSalaryBasis] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [seniorityLevel, setSeniorityLevel] = useState("");

  const [department, setDepartment] = useState("");
  const [workModel, setWorkModel] = useState("");
  const [locationCity, setLocationCity] = useState("");
  const [bonusAmountYearly, setBonusAmountYearly] = useState("");
  const [equityOrStock, setEquityOrStock] = useState("");
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);

  const toggleBenefit = (val: string) => {
    setSelectedBenefits((prev) =>
      prev.includes(val) ? prev.filter((b) => b !== val) : [...prev, val]
    );
  };

  const canAdvanceStep0 =
    jobTitle.trim() !== "" &&
    salaryAmount !== "" &&
    !isNaN(parseInt(salaryAmount)) &&
    parseInt(salaryAmount) > 0 &&
    salaryBasis !== "" &&
    experienceYears !== "" &&
    !isNaN(parseInt(experienceYears)) &&
    employmentType !== "" &&
    seniorityLevel !== "";

  const handleNext = () => {
    if (!canAdvanceStep0) {
      toast({ title: "Eksik alan", description: "Tüm zorunlu alanları doldurun.", variant: "destructive" });
      return;
    }
    setStep(1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { error } = await supabase.from("salaries").insert({
      company_id: companyId,
      user_id: userId,
      job_title: jobTitle.trim(),
      salary_amount: parseInt(salaryAmount),
      currency,
      salary_basis: salaryBasis,
      experience_years: parseInt(experienceYears),
      employment_type: employmentType,
      seniority_level: seniorityLevel,
      department: normalizeEmptyToNull(department),
      work_model: workModel || null,
      location_city: normalizeEmptyToNull(locationCity),
      bonus_amount_yearly: parseNumericOrNull(bonusAmountYearly),
      equity_or_stock: normalizeEmptyToNull(equityOrStock),
      benefits: normalizeEmptyToArray(selectedBenefits),
    });

    setLoading(false);
    if (error) {
      toast({ title: "Hata", description: "Maaş bilgisi gönderilemedi.", variant: "destructive" });
    } else {
      toast({ title: "Başarılı!", description: "Maaş bilgisi anonim olarak eklendi." });
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
        <h3 className="font-display text-lg font-bold text-foreground">Maaş Bilgisi Ekle</h3>
        <span className="text-xs text-muted-foreground">Adım {step + 1}/2</span>
      </div>

      <div className="flex gap-1 mb-5">
        {[0, 1].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-alm-orange" : "bg-border"
            }`}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Pozisyon *</Label>
            <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Yazılım Mühendisi" maxLength={200} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Aylık Maaş *</Label>
              <Input type="number" value={salaryAmount} onChange={(e) => setSalaryAmount(e.target.value)} placeholder="50000" min={1} />
            </div>
            <div className="space-y-2">
              <Label>Para Birimi</Label>
              <div className="flex gap-2">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCurrency(c.value)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors flex-1 ${
                      currency === c.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Net / Brüt *</Label>
            <ChipGroup options={SALARY_BASES} value={salaryBasis} onChange={setSalaryBasis} />
          </div>

          <div className="space-y-2">
            <Label>Deneyim Yılı *</Label>
            <Input type="number" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} placeholder="3" min={0} max={50} />
          </div>

          <div className="space-y-2">
            <Label>Çalışma Tipi *</Label>
            <ChipGroup options={EMPLOYMENT_TYPES} value={employmentType} onChange={setEmploymentType} />
          </div>

          <div className="space-y-2">
            <Label>Seniority *</Label>
            <ChipGroup options={SENIORITY_LEVELS} value={seniorityLevel} onChange={setSeniorityLevel} />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <p className="text-xs text-muted-foreground">Tüm alanlar opsiyoneldir. Daha iyi karşılaştırma için doldurun.</p>

          <div className="space-y-2">
            <Label>Departman</Label>
            <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Mühendislik, Pazarlama..." maxLength={100} />
          </div>

          <div className="space-y-2">
            <Label>Çalışma Modeli</Label>
            <ChipGroup options={WORK_MODELS} value={workModel} onChange={setWorkModel} />
          </div>

          <div className="space-y-2">
            <Label>Şehir</Label>
            <Input value={locationCity} onChange={(e) => setLocationCity(e.target.value)} placeholder="İstanbul" maxLength={100} />
          </div>

          <div className="space-y-2">
            <Label>Yıllık Bonus</Label>
            <Input type="number" value={bonusAmountYearly} onChange={(e) => setBonusAmountYearly(e.target.value)} placeholder="50000" min={0} />
          </div>

          <div className="space-y-2">
            <Label>Hisse / Equity</Label>
            <Input value={equityOrStock} onChange={(e) => setEquityOrStock(e.target.value)} placeholder="Var / Yok detayı" maxLength={200} />
          </div>

          <div className="space-y-2">
            <Label>Yan Haklar</Label>
            <div className="flex flex-wrap gap-2">
              {BENEFIT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleBenefit(opt.value)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedBenefits.includes(opt.value)
                      ? "border-alm-green bg-alm-green/20 text-alm-green"
                      : "border-border bg-card text-muted-foreground hover:border-alm-green/50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
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
          <>
            <Button type="button" onClick={handleNext} className="bg-alm-orange hover:bg-alm-orange/90">
              Devam <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </>
        ) : (
          <Button type="button" onClick={handleSubmit} disabled={loading} className="bg-alm-orange hover:bg-alm-orange/90">
            {loading ? "Gönderiliyor..." : "Maaş Bilgisini Gönder"}
          </Button>
        )}
        <Button type="button" variant="ghost" onClick={onCancel}>İptal</Button>
      </div>
    </div>
  );
};

export default SalaryForm;
