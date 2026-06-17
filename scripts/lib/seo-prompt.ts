import type { CompanySeoSourceSnapshot } from "../../src/lib/company-seo";

export type CompanyPromptInput = {
  name: string;
  description: string | null;
  sector: string | null;
  city: string | null;
  size: string | null;
  company_type: string | null;
  snapshot: CompanySeoSourceSnapshot;
};

const formatList = (values: string[]) => (values.length > 0 ? values.join(", ") : "veri yok");

/**
 * Builds a deterministic prompt from the aggregate snapshot. The model is
 * instructed to use ONLY the provided numbers (no invented statistics), write
 * in Turkish, and lead each section with a direct, citable answer sentence for
 * GEO (AI answer engines).
 */
export const buildCompanySeoPrompt = (input: CompanyPromptInput): string => {
  const { snapshot } = input;

  const facts = [
    `Şirket adı: ${input.name}`,
    `Sektör: ${input.sector || "belirtilmemiş"}`,
    `Şehir: ${input.city || "belirtilmemiş"}`,
    `Çalışan sayısı: ${input.size || "belirtilmemiş"}`,
    `Şirket türü: ${input.company_type || "belirtilmemiş"}`,
    `Resmi açıklama: ${input.description || "yok"}`,
    `Yorum sayısı: ${snapshot.reviewCount}`,
    `Maaş girdisi sayısı: ${snapshot.salaryCount}`,
    `Mülakat kaydı sayısı: ${snapshot.interviewCount}`,
    `Ortalama puan (5 üzerinden): ${snapshot.averageRating ?? "veri yok"}`,
    `Tavsiye oranı (%): ${snapshot.recommendationRate ?? "veri yok"}`,
    `En çok geri bildirim gelen departmanlar: ${formatList(snapshot.topDepartments)}`,
    `En sık maaş paylaşılan pozisyonlar: ${formatList(snapshot.topSalaryTitles)}`,
    `En çok mülakat paylaşılan pozisyonlar: ${formatList(snapshot.topInterviewPositions)}`,
  ].join("\n");

  return `Sen, Türkiye odaklı bir şirket değerlendirme platformu (firmascope) için SEO ve GEO (yapay zeka cevap motorları) odaklı içerik üreten bir editörsün.

Aşağıdaki DOĞRULANMIŞ VERİLERİ kullanarak ${input.name} şirketi için Türkçe bir SEO profili üret.

KURALLAR:
- SADECE aşağıda verilen sayıları ve bilgileri kullan. Verilmeyen hiçbir istatistik veya rakam UYDURMA.
- Tarafsız, bilgilendirici ve adaylara yardımcı bir ton kullan.
- Her bölüme, o bölümün ana sorusunu doğrudan yanıtlayan tek bir net cümleyle başla (GEO için alıntılanabilir olmalı).
- Veri yetersizse bunu dürüstçe belirt; abartma.
- Tüm metin Türkçe olmalı.

DOĞRULANMIŞ VERİLER:
${facts}

ÇIKTI FORMATI:
Yalnızca aşağıdaki alanlara sahip geçerli bir JSON nesnesi döndür (markdown veya açıklama YOK):
{
  "introSummary": "string (2-4 cümle, şirketi tanıtan genel özet)",
  "cultureSummary": "string veya null (şirket kültürü; yorum yoksa null)",
  "salarySummary": "string veya null (maaş tablosu; maaş verisi yoksa null)",
  "interviewSummary": "string veya null (mülakat süreci; mülakat verisi yoksa null)",
  "prosSummary": "string veya null (öne çıkan artılar)",
  "consSummary": "string veya null (dikkat edilmesi gerekenler)",
  "candidateTakeaway": "string (adaylar için özet çıkarım, 2-3 cümle)",
  "faqItems": [{ "question": "string", "answer": "string" }] (3-5 adet sık sorulan soru),
  "keywords": ["string"] (5-8 adet Türkçe SEO anahtar kelimesi)
}`;
};
