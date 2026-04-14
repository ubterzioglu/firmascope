import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import {
  REVIEWER_RELATIONSHIPS,
  POSITION_LEVELS,
  WORK_MODELS,
  DETAIL_RATING_GROUPS,
  BENEFIT_OPTIONS,
  generateReviewTitle,
  normalizeEmptyToNull,
  normalizeEmptyToArray,
  type DetailRatingKey,
} from "@/lib/form-options";

interface ReviewFormProps {
  companyId: string;
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const StarRating = ({ value, onChange, size = "md" }: { value: number; onChange: (v: number) => void; size?: "sm" | "md" }) => {
  const [hover, setHover] = useState(0);
  const iconClass = size === "sm" ? "h-5 w-5" : "h-7 w-7";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
          className="p-0.5"
        >
          <Star
            className={`${iconClass} transition-colors ${
              s <= (hover || value)
                ? "fill-alm-yellow text-alm-yellow"
                : "fill-muted text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const STEP_LABELS = ["Bağlam", "Detay Puanlar", "Yorum"];

const ReviewForm = ({ companyId, userId, onSuccess, onCancel }: ReviewFormProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [recommends, setRecommends] = useState<boolean | null>(null);
  const [reviewerRelationship, setReviewerRelationship] = useState("");
  const [positionLevel, setPositionLevel] = useState("");
  const [department, setDepartment] = useState("");
  const [workModel, setWorkModel] = useState("");

  const [detailRatings, setDetailRatings] = useState<Record<DetailRatingKey, number>>({
    rating_work_atmosphere: 0,
    rating_communication: 0,
    rating_team_spirit: 0,
    rating_work_life_balance: 0,
    rating_manager_behavior: 0,
    rating_tasks: 0,
    rating_compensation_benefits: 0,
    rating_career_growth: 0,
  });

  const [title, setTitle] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);

  const toggleBenefit = (val: string) => {
    setSelectedBenefits((prev) =>
      prev.includes(val) ? prev.filter((b) => b !== val) : [...prev, val]
    );
  };

  const canAdvanceStep0 = rating > 0 && recommends !== null && reviewerRelationship !== "";

  const handleNext = () => {
    if (step === 0 && !canAdvanceStep0) {
      toast({ title: "Eksik alan", description: "Puan, tavsiye durumu ve ilişki tipi zorunludur.", variant: "destructive" });
      return;
    }
    setStep((s) => Math.min(s + 1, 2));
  };

  const handleSubmit = async () => {
    const finalTitle = title.trim() || generateReviewTitle(reviewerRelationship, rating);

    const detailPayload: Record<string, number | null> = {};
    for (const [key, val] of Object.entries(detailRatings)) {
      detailPayload[key] = val > 0 ? val : null;
    }

    setLoading(true);
    const { error } = await supabase.from("reviews").insert({
      company_id: companyId,
      user_id: userId,
      title: finalTitle,
      pros: normalizeEmptyToNull(pros),
      cons: normalizeEmptyToNull(cons),
      rating,
      recommends,
      reviewer_relationship: reviewerRelationship || null,
      position_level: positionLevel || null,
      department: normalizeEmptyToNull(department),
      work_model: workModel || null,
      ...detailPayload,
      benefits: normalizeEmptyToArray(selectedBenefits),
    });

    setLoading(false);
    if (error) {
      toast({ title: "Hata", description: "Değerlendirme gönderilemedi.", variant: "destructive" });
    } else {
      toast({ title: "Başarılı!", description: "Değerlendirmeniz anonim olarak eklendi." });
      onSuccess();
    }
  };

  const renderStars = (
    value: number,
    onChange: (v: number) => void,
    size: "sm" | "md" = "md"
  ) => (
    <StarRating value={value} onChange={onChange} size={size} />
  );

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

  const BenefitChips = () => (
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
  );

  return (
    <div className="card-elevated p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display text-lg font-bold text-foreground">Değerlendirme Yaz</h3>
        <span className="text-xs text-muted-foreground">
          Adım {step + 1}/3
        </span>
      </div>

      <div className="flex gap-1 mb-5">
        {STEP_LABELS.map((label, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Genel Puan *</Label>
            {renderStars(rating, setRating)}
          </div>

          <div className="space-y-2">
            <Label>Bu şirketi tavsiye eder misiniz? *</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRecommends(true)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  recommends === true
                    ? "border-alm-green bg-alm-green/20 text-alm-green"
                    : "border-border text-muted-foreground hover:border-alm-green/50"
                }`}
              >
                ✓ Tavsiye Ederim
              </button>
              <button
                type="button"
                onClick={() => setRecommends(false)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  recommends === false
                    ? "border-alm-orange bg-alm-orange/20 text-alm-orange"
                    : "border-border text-muted-foreground hover:border-alm-orange/50"
                }`}
              >
                ✗ Tavsiye Etmem
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>İlişki Tipiniz *</Label>
            <ChipGroup options={REVIEWER_RELATIONSHIPS} value={reviewerRelationship} onChange={setReviewerRelationship} />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Pozisyon Seviyesi <span className="text-xs">(opsiyonel)</span></Label>
            <ChipGroup options={POSITION_LEVELS} value={positionLevel} onChange={setPositionLevel} />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Departman <span className="text-xs">(opsiyonel)</span></Label>
            <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Mühendislik, Pazarlama..." maxLength={100} />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Çalışma Modeli <span className="text-xs">(opsiyonel)</span></Label>
            <ChipGroup options={WORK_MODELS} value={workModel} onChange={setWorkModel} />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <p className="text-xs text-muted-foreground">Tüm alanlar opsiyoneldir. Boyutleri puanlayarak detaylı karşılaştırma verisi oluşturun.</p>
          {DETAIL_RATING_GROUPS.map((group) => (
            <div key={group.groupLabel}>
              <h4 className="text-sm font-semibold text-foreground mb-3">{group.groupLabel}</h4>
              <div className="space-y-3">
                {group.fields.map((field) => (
                  <div key={field.key} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{field.label}</span>
                    {renderStars(detailRatings[field.key as DetailRatingKey], (v) =>
                      setDetailRatings((prev) => ({
                        ...prev,
                        [field.key]: prev[field.key as DetailRatingKey] === v ? 0 : v,
                      })),
                    "sm")}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Başlık <span className="text-xs">(opsiyonel — boş bırakılırsa otomatik oluşturulur)</span></Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Kısa bir özet" maxLength={200} />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Artılar <span className="text-xs">(opsiyonel)</span></Label>
            <Textarea value={pros} onChange={(e) => setPros(e.target.value)} placeholder="Şirketin iyi yönleri..." rows={3} maxLength={2000} />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Eksiler <span className="text-xs">(opsiyonel)</span></Label>
            <Textarea value={cons} onChange={(e) => setCons(e.target.value)} placeholder="Şirketin geliştirilecek yönleri..." rows={3} maxLength={2000} />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Yan Haklar <span className="text-xs">(opsiyonel)</span></Label>
            <BenefitChips />
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-6">
        {step > 0 && (
          <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Geri
          </Button>
        )}
        <div className="flex-1" />
        {step < 2 ? (
          <Button type="button" onClick={handleNext}>
            Devam <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? "Gönderiliyor..." : "Değerlendirmeyi Gönder"}
          </Button>
        )}
        <Button type="button" variant="ghost" onClick={onCancel}>İptal</Button>
      </div>
    </div>
  );
};

export default ReviewForm;
