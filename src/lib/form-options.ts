export const REVIEWER_RELATIONSHIPS = [
  { value: "current_employee", label: "Mevcut Çalışan" },
  { value: "former_employee", label: "Eski Çalışan" },
  { value: "applicant", label: "Aday" },
] as const;

export const POSITION_LEVELS = [
  { value: "individual_contributor", label: "Bireysel Katılımcı" },
  { value: "manager", label: "Yönetici" },
  { value: "executive", label: "Üst Düzey Yönetici" },
  { value: "intern", label: "Stajyer" },
  { value: "freelancer_or_contractor", label: "Freelancer / Sözleşmeli" },
] as const;

export const WORK_MODELS = [
  { value: "onsite", label: "Ofisten" },
  { value: "hybrid", label: "Hibrit" },
  { value: "remote", label: "Uzaktan" },
] as const;

export const DETAIL_RATING_GROUPS = [
  {
    groupLabel: "Kültür",
    fields: [
      { key: "rating_work_atmosphere", label: "Çalışma Ortamı" },
      { key: "rating_communication", label: "İletişim" },
      { key: "rating_team_spirit", label: "Takım Ruhu" },
    ],
  },
  {
    groupLabel: "Çalışma Hayatı",
    fields: [
      { key: "rating_work_life_balance", label: "İş- Hayat Dengesi" },
      { key: "rating_manager_behavior", label: "Yönetici Tutumu" },
      { key: "rating_tasks", label: "Görevler" },
    ],
  },
  {
    groupLabel: "Kariyer ve Ücret",
    fields: [
      { key: "rating_compensation_benefits", label: "Ücret ve Yan Haklar" },
      { key: "rating_career_growth", label: "Kariyer Gelişimi" },
    ],
  },
] as const;

export const BENEFIT_OPTIONS = [
  { value: "remote_work", label: "Uzaktan Çalışma" },
  { value: "flexible_hours", label: "Esnek Mesai" },
  { value: "meal_card", label: "Yemek Kartı" },
  { value: "private_healthcare", label: "Özel Sağlık Sigortası" },
  { value: "bonus", label: "Prim / Bonus" },
  { value: "transport_support", label: "Servis / Ulaşım Desteği" },
  { value: "education_budget", label: "Eğitim Bütçesi" },
  { value: "stock_or_equity", label: "Hisse / Equity" },
] as const;

export const EMPLOYMENT_TYPES = [
  { value: "full_time", label: "Tam Zamanlı" },
  { value: "part_time", label: "Yarı Zamanlı" },
  { value: "intern", label: "Stajyer" },
  { value: "contractor", label: "Sözleşmeli" },
] as const;

export const SENIORITY_LEVELS = [
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
  { value: "manager", label: "Manager" },
  { value: "director", label: "Director" },
] as const;

export const SALARY_BASES = [
  { value: "net", label: "Net" },
  { value: "gross", label: "Brüt" },
] as const;

export const CURRENCIES = [
  { value: "TRY", label: "TRY" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
] as const;

export const INTERVIEW_DIFFICULTIES = [
  { value: "Kolay", label: "Kolay" },
  { value: "Orta", label: "Orta" },
  { value: "Zor", label: "Zor" },
  { value: "Çok Zor", label: "Çok Zor" },
] as const;

export const INTERVIEW_RESULTS = [
  { value: "Teklif Aldım", label: "Teklif Aldım" },
  { value: "Reddedildi", label: "Reddedildi" },
  { value: "Beklemede", label: "Beklemede" },
  { value: "Katılmadım", label: "Katılmadım" },
] as const;

export const INTERVIEW_TYPES = [
  { value: "onsite", label: "Yüzyüze" },
  { value: "remote", label: "Online" },
  { value: "hybrid", label: "Hibrit" },
] as const;

export type DetailRatingKey =
  | "rating_work_atmosphere"
  | "rating_communication"
  | "rating_team_spirit"
  | "rating_work_life_balance"
  | "rating_manager_behavior"
  | "rating_tasks"
  | "rating_compensation_benefits"
  | "rating_career_growth";

export function generateReviewTitle(
  relationship: string | null,
  rating: number
): string {
  const relMap: Record<string, string> = {
    current_employee: "Mevcut çalışan görüşü",
    former_employee: "Eski çalışan görüşü",
    applicant: "Aday deneyimi",
  };
  const prefix = relMap[relationship || ""] || "Değerlendirme";
  return `${prefix} · ${rating}/5`;
}

export function normalizeEmptyToNull(val: string | null | undefined): string | null {
  if (!val) return null;
  return val.trim() === "" ? null : val.trim();
}

export function normalizeEmptyToArray(val: string[] | null | undefined): string[] | null {
  if (!val) return null;
  return val.length === 0 ? null : val;
}

export function parseNumericOrNull(val: string | number | null | undefined): number | null {
  if (val === null || val === undefined) return null;
  const n = typeof val === "string" ? parseInt(val, 10) : val;
  return isNaN(n) ? null : n;
}
