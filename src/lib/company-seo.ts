import type { Json } from "@/integrations/supabase/types";
import { slugifyTaxonomyValue } from "@/lib/site";

export type CompanySeoFaqItem = {
  question: string;
  answer: string;
};

export type CompanySeoExternalLink = {
  label: string;
  url: string;
};

export type CompanySeoGenerationStatus = "generated" | "insufficient_data";

export type CompanySeoSourceSnapshot = {
  reviewCount: number;
  salaryCount: number;
  interviewCount: number;
  averageRating: number | null;
  recommendationRate: number | null;
  topDepartments: string[];
  topSalaryTitles: string[];
  topInterviewPositions: string[];
};

export type CompanySeoProfileContent = {
  introSummary: string | null;
  cultureSummary: string | null;
  salarySummary: string | null;
  interviewSummary: string | null;
  prosSummary: string | null;
  consSummary: string | null;
  candidateTakeaway: string | null;
  faqItems: CompanySeoFaqItem[];
  externalLinks: CompanySeoExternalLink[];
  keywords: string[];
  wordCount: number;
  generationStatus: CompanySeoGenerationStatus;
  sourceSnapshot: CompanySeoSourceSnapshot;
};

export type CompanySeoRenderableProfile = {
  intro_summary: string | null;
  culture_summary: string | null;
  salary_summary: string | null;
  interview_summary: string | null;
  pros_summary: string | null;
  cons_summary: string | null;
  candidate_takeaway: string | null;
  faq_items_json: Json | null;
  external_links_json: Json | null;
  keywords_json: Json | null;
  word_count: number | null;
  generation_status: string | null;
  source_snapshot_json: Json | null;
};

type CompanyCore = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sector: string | null;
  city: string | null;
  size: string | null;
  company_type: string | null;
};

type ReviewInput = {
  title: string | null;
  pros: string | null;
  cons: string | null;
  rating: number | null;
  recommends: boolean | null;
  reviewer_relationship: string | null;
  department: string | null;
  work_model: string | null;
  created_at: string | null;
};

type SalaryInput = {
  job_title: string | null;
  salary_amount: number | null;
  currency: string | null;
  salary_basis: string | null;
  seniority_level: string | null;
  department: string | null;
  location_city: string | null;
  work_model: string | null;
};

type InterviewInput = {
  position: string | null;
  experience: string | null;
  difficulty: string | null;
  result: string | null;
  interview_year: number | null;
  interview_type: string | null;
  stage_count: number | null;
  response_time_days: number | null;
  salary_discussed: boolean | null;
};

const sectorReferenceMap: Record<string, CompanySeoExternalLink> = {
  teknoloji: {
    label: "Teknoloji sektörü özeti",
    url: "https://en.wikipedia.org/wiki/Information_technology",
  },
  finans: {
    label: "Finans sektörü özeti",
    url: "https://en.wikipedia.org/wiki/Financial_services",
  },
  saglik: {
    label: "Sağlık sektörü özeti",
    url: "https://en.wikipedia.org/wiki/Health_care",
  },
  enerji: {
    label: "Enerji sektörü özeti",
    url: "https://en.wikipedia.org/wiki/Energy_industry",
  },
  lojistik: {
    label: "Lojistik sektörü özeti",
    url: "https://en.wikipedia.org/wiki/Logistics",
  },
  otomotiv: {
    label: "Otomotiv sektörü özeti",
    url: "https://en.wikipedia.org/wiki/Automotive_industry",
  },
  medya: {
    label: "Medya sektörü özeti",
    url: "https://en.wikipedia.org/wiki/Media_(communication)",
  },
  insaat: {
    label: "İnşaat sektörü özeti",
    url: "https://en.wikipedia.org/wiki/Construction",
  },
  egitim: {
    label: "Eğitim sektörü özeti",
    url: "https://en.wikipedia.org/wiki/Education",
  },
};

const capitalizeSentence = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

const countWords = (sections: Array<string | null | undefined>) =>
  sections
    .filter(Boolean)
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

const average = (values: number[]) =>
  values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : null;

const summarizeCounts = (items: Array<string | null | undefined>) => {
  const counter = new Map<string, number>();
  for (const item of items) {
    if (!item) continue;
    const key = item.trim();
    if (!key) continue;
    counter.set(key, (counter.get(key) ?? 0) + 1);
  }

  return Array.from(counter.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([value]) => value);
};

const formatCurrency = (value: number, currency: string | null) =>
  `${value.toLocaleString("tr-TR")} ${currency || "TRY"}`;

const buildExternalLinks = (company: CompanyCore): CompanySeoExternalLink[] => {
  const links: CompanySeoExternalLink[] = [
    {
      label: `${company.name} LinkedIn araması`,
      url: `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(company.name)}`,
    },
  ];

  if (company.sector) {
    const sectorLink = sectorReferenceMap[slugifyTaxonomyValue(company.sector)];
    if (sectorLink) {
      links.push(sectorLink);
    }
  }

  if (company.city) {
    links.push({
      label: `${company.city} iş pazarı bağlamı`,
      url: `https://tr.wikipedia.org/wiki/${encodeURIComponent(company.city)}`,
    });
  }

  return links.slice(0, 3);
};

const buildFaqItems = (company: CompanyCore, snapshot: CompanySeoSourceSnapshot): CompanySeoFaqItem[] => {
  const faqItems: CompanySeoFaqItem[] = [
    {
      question: `${company.name} nasıl bir şirket olarak görülüyor?`,
      answer:
        snapshot.reviewCount > 0
          ? `${company.name} için platformda ${snapshot.reviewCount} yorum bulunuyor. Ortalama puan ve tekrar eden yorum temaları, kültür ve beklenti yönetimi konusunda ilk sinyali veriyor.`
          : `${company.name} için henüz yeterli yorum birikimi bulunmuyor. Sayfa yine de sektör, şehir ve pozisyon bazlı ilk araştırma için temel bir başlangıç sunuyor.`,
    },
    {
      question: `${company.name} maaş beklentisi nasıl değerlendirilmeli?`,
      answer:
        snapshot.salaryCount > 0
          ? `${company.name} için kayıtlı maaş girdileri pozisyon ve kıdem bazlı dağılımı gösteriyor. Tek bir rakama odaklanmak yerine kıdem, departman ve çalışma modelini birlikte okumak daha sağlıklı olur.`
          : `${company.name} için maaş verisi sınırlı olduğunda benzer sektör ve şehirdeki rollerle kıyaslama yapmak gerekir. Bu sayfa, topluluk verisi geldikçe daha net bantlar sunmak üzere tasarlandı.`,
    },
    {
      question: `${company.name} mülakat süreci zor mu?`,
      answer:
        snapshot.interviewCount > 0
          ? `${company.name} sayfasındaki mülakat kayıtları sürecin kaç aşamalı olduğu, hangi formatta ilerlediği ve geri dönüş hızının nasıl olduğu konusunda somut fikir verir.`
          : `${company.name} için mülakat verisi sınırlıysa adayların pozisyon bazlı beklentilerini sektör ortalaması ve benzer roller üzerinden kurması gerekir.`,
    },
  ];

  if (company.sector || company.city) {
    faqItems.push({
      question: `${company.name} hangi aday profiline daha uygun olabilir?`,
      answer: `${company.sector || "ilgili"} sektöründe ${company.city || "Türkiye"} bağlamında iş arayan adaylar için bu sayfa; kültür, ücret ve süreç beklentisini aynı yerde toplar. En doğru okuma, yorum sayısı, maaş girdisi ve mülakat ayrıntılarını birlikte değerlendirmekle yapılır.`,
    });
  }

  return faqItems;
};

type DatedRecord = { created_at?: string | null };

/**
 * Returns the freshest YYYY-MM-DD date across the company and its dated content
 * (reviews/salaries/interviews), falling back to the company creation date and
 * finally to a stable default. Used for an accurate schema.org `dateModified`
 * instead of "today", which would falsely signal a daily-changing page.
 */
export const latestContentDate = (
  company: { created_at?: string | null },
  ...recordLists: Array<readonly DatedRecord[]>
): string => {
  const candidates: string[] = [];
  if (company.created_at) candidates.push(company.created_at);
  for (const list of recordLists) {
    for (const record of list) {
      if (record.created_at) candidates.push(record.created_at);
    }
  }

  const timestamps = candidates
    .map((value) => ({ value, time: Date.parse(value) }))
    .filter((entry) => !Number.isNaN(entry.time));

  if (timestamps.length === 0) {
    return "2026-01-01";
  }

  const newest = timestamps.reduce((latest, entry) => (entry.time > latest.time ? entry : latest));
  return newest.value.split("T")[0];
};

/**
 * Computes the aggregate source snapshot used both by the deterministic builder
 * and by the AI prompt builder, so AI generation and fallback share one data
 * source.
 */
export const computeCompanySnapshot = ({
  reviews,
  salaries,
  interviews,
}: {
  reviews: ReviewInput[];
  salaries: SalaryInput[];
  interviews: InterviewInput[];
}): CompanySeoSourceSnapshot => {
  const validRatings = reviews
    .map((review) => review.rating)
    .filter((rating): rating is number => typeof rating === "number");
  const averageRating = average(validRatings);
  const recommendationRate =
    reviews.length > 0
      ? Math.round((reviews.filter((review) => review.recommends).length / reviews.length) * 100)
      : null;
  const topDepartments = summarizeCounts([
    ...reviews.map((review) => review.department),
    ...salaries.map((salary) => salary.department),
  ]);
  const topSalaryTitles = summarizeCounts(salaries.map((salary) => salary.job_title));
  const topInterviewPositions = summarizeCounts(interviews.map((interview) => interview.position));

  return {
    reviewCount: reviews.length,
    salaryCount: salaries.length,
    interviewCount: interviews.length,
    averageRating: averageRating ? Number(averageRating.toFixed(1)) : null,
    recommendationRate,
    topDepartments,
    topSalaryTitles,
    topInterviewPositions,
  };
};

export const buildCompanySeoContent = ({
  company,
  reviews,
  salaries,
  interviews,
}: {
  company: CompanyCore;
  reviews: ReviewInput[];
  salaries: SalaryInput[];
  interviews: InterviewInput[];
}): CompanySeoProfileContent => {
  const snapshot = computeCompanySnapshot({ reviews, salaries, interviews });
  const { recommendationRate, topDepartments, topSalaryTitles, topInterviewPositions } = snapshot;

  const dataSignals = reviews.length + salaries.length + interviews.length;
  const generationStatus: CompanySeoGenerationStatus =
    dataSignals >= 2 || !!company.description ? "generated" : "insufficient_data";

  const frequentPros = summarizeCounts(reviews.map((review) => review.pros));
  const frequentCons = summarizeCounts(reviews.map((review) => review.cons));
  const salaryValues = salaries
    .map((salary) => salary.salary_amount)
    .filter((salary): salary is number => typeof salary === "number");
  const averageSalary = average(salaryValues);
  const remoteShare =
    salaries.length > 0
      ? Math.round((salaries.filter((salary) => salary.work_model === "remote" || salary.work_model === "hybrid").length / salaries.length) * 100)
      : null;
  const interviewStageAverage = average(
    interviews
      .map((interview) => interview.stage_count)
      .filter((stageCount): stageCount is number => typeof stageCount === "number")
  );
  const responseDaysAverage = average(
    interviews
      .map((interview) => interview.response_time_days)
      .filter((value): value is number => typeof value === "number")
  );

  const introSummary = generationStatus === "generated"
    ? [
        `${company.name}, ${company.city || "Türkiye"} merkezli ${company.sector ? `${company.sector.toLowerCase()} alanında` : "farklı iş fonksiyonlarında"} konumlanan bir ${company.company_type || "şirket"} profili sunuyor. firmascope üzerindeki bu sayfa, adayların ve çalışanların tek tek yorumları yerine daha bütünlü bir resim görebilmesi için yorum, maaş ve mülakat verilerini aynı akışta bir araya getiriyor.`,
        company.description
          ? `${capitalizeSentence(company.description)} Bu tanım, topluluk verisiyle birlikte okunduğunda şirketin resmi anlatısı ile kullanıcı deneyiminin ne kadar örtüştüğünü anlamaya yardımcı olur.`
          : `${company.name} için resmi tanım sınırlı olsa da sayfadaki topluluk verisi, kültür ve beklenti yönetimi konusunda ilk sinyalleri sunar.`,
        reviews.length > 0 || salaries.length > 0 || interviews.length > 0
          ? `${reviews.length} yorum, ${salaries.length} maaş girdisi ve ${interviews.length} mülakat kaydı; bu sayfayı sadece bir şirket kartı olmaktan çıkarıp araştırma odaklı bir referans noktasına dönüştürüyor. Adaylar bu verileri roller, çalışma modeli ve kıdem beklentisiyle birlikte okumalı.`
          : `${company.name} için topluluk verisi henüz yeni oluşuyor. Sayfa yine de sektör, şehir ve işveren markası bağlamında temel araştırma için hazır bir iskelet sunuyor.`,
      ].join(" ")
    : null;

  const cultureSummary = reviews.length > 0
    ? [
        `${company.name} kültürünü okurken sadece ortalama puana bakmak yeterli değil. Sayfadaki yorumlar, ekip içi iletişim, yönetici yaklaşımı, görev netliği ve iş-özel hayat dengesi gibi başlıklarda tekrar eden ortak bir ton üretiyor.`,
        snapshot.averageRating
          ? `Mevcut yorumlara göre ortalama puan ${snapshot.averageRating}/5 seviyesinde. ${recommendationRate !== null ? `Tavsiye oranı ise yaklaşık %${recommendationRate}.` : ""} Bu iki veri birlikte, memnuniyetin sadece duygusal değil davranışsal olarak da ne kadar tutarlı olduğunu gösterir.`
          : `${company.name} için puan dağılımı sınırlı olsa da metin yorumlar, kültürel beklentiyi anlamak açısından rakamlardan daha zengin sinyal verir.`,
        topDepartments.length > 0
          ? `En çok geri bildirim gelen alanlar ${topDepartments.join(", ")} olarak öne çıkıyor. Bu durum, yorumların belirli ekiplerden yoğunlaştığını ve kültür analizinin departman bağlamıyla birlikte okunması gerektiğini gösterir.`
          : `${company.name} için departman dağılımı henüz net değil. Bu nedenle kültür okuması yaparken tekil deneyimlerin temsil gücünü dikkatli yorumlamak gerekir.`,
        frequentPros.length > 0 || frequentCons.length > 0
          ? `Pozitif tarafta ${frequentPros.join(", ")} gibi temalar sık tekrarlanıyor. Diğer yandan ${frequentCons.join(", ")} benzeri eleştiriler de karar sürecinde dikkate alınmalı.`
          : `${company.name} yorumlarında keskin şekilde ayrışan bir tema yoksa bu genellikle ya veri sayısının sınırlı olduğuna ya da deneyimlerin ekipten ekibe belirgin biçimde değiştiğine işaret eder.`,
      ].join(" ")
    : null;

  const salarySummary = salaries.length > 0
    ? [
        `${company.name} maaş verileri, adayların sadece tek bir rakam görmesi için değil; rol, kıdem ve çalışma modeli farklarını okuyabilmesi için yorumlanmalı. Bu sayfadaki maaş kayıtları, brüt-net tercihi, şehir etkisi ve hibrit ya da uzaktan çalışma gibi değişkenleri birlikte düşünmeyi gerektirir.`,
        averageSalary
          ? `Kayıtlı girdiler baz alındığında ortalama maaş seviyesi ${formatCurrency(Math.round(averageSalary), salaries[0]?.currency || "TRY")} civarında görünüyor. Bu rakam bir teklif standardı değil, topluluk tarafından paylaşılan örneklerin merkezi eğilimini temsil eder.`
          : `${company.name} için maaş kayıtları sayısal olarak sınırlı olsa da mevcut girdiler, beklenti bandını anlamak için yine de faydalı bir başlangıç noktası sunuyor.`,
        topSalaryTitles.length > 0
          ? `En sık karşılaşılan pozisyonlar ${topSalaryTitles.join(", ")} olarak göze çarpıyor. Bu da sayfada görülen maaş sinyallerinin hangi rol ailelerinde daha temsil güçlü olduğunu açıkça gösteriyor.`
          : `${company.name} maaş sayfasında pozisyon dağılımı henüz dağınık olabilir. Bu nedenle en doğru okuma, benzer kıdem ve departmandaki ilanlarla çapraz kontrol yapılarak yapılır.`,
        remoteShare !== null
          ? `Uzaktan veya hibrit kayıtların payı yaklaşık %${remoteShare} seviyesinde. Bu oran, aynı şirket içindeki paketlerin sadece taban maaşla değil, esneklik ve lokasyon tercihleriyle de değerlendirildiğini hatırlatıyor.`
          : `${company.name} için çalışma modeli dağılımı sınırlı olduğunda maaş verisini şehir ve ofis beklentileriyle birlikte okumak daha doğru olur.`,
      ].join(" ")
    : null;

  const interviewSummary = interviews.length > 0
    ? [
        `${company.name} mülakat süreci hakkındaki en değerli sinyal, adayların hangi aşamalardan geçtiğini ve ne kadar hızlı geri dönüş aldığını gösteriyor olması. Bu sayfadaki kayıtlar, sürecin sadece zor ya da kolay olup olmadığını değil, aday deneyiminin ne kadar tutarlı olduğunu anlamaya yardımcı olur.`,
        interviewStageAverage
          ? `Paylaşılan verilere göre ortalama aşama sayısı yaklaşık ${interviewStageAverage.toFixed(1)}. Bu, sürecin tek görüşmeli hızlı bir akış mı yoksa birden fazla filtreyle ilerleyen daha seçici bir yapı mı olduğunu anlamak için güçlü bir ipucu verir.`
          : `${company.name} için aşama sayısı bilgisi her kayıtta bulunmasa da mevcut deneyimler sürecin yapısı hakkında yönlendirici ipuçları sağlar.`,
        responseDaysAverage
          ? `Geri dönüş hızı ortalama ${responseDaysAverage.toFixed(1)} gün civarında görünüyor. Adaylar için bu veri, beklenti yönetimi ve paralel süreç planlaması açısından oldukça kritiktir.`
          : `${company.name} için geri dönüş hızı verisi eksik olsa bile yorum metinleri sürecin temposu ve iletişim kalitesi hakkında fikir verebilir.`,
        topInterviewPositions.length > 0
          ? `En çok paylaşım gelen roller ${topInterviewPositions.join(", ")} olduğu için mülakat okumasını bu pozisyonların temsil gücüyle birlikte değerlendirmek gerekir.`
          : `${company.name} için mülakat pozisyonları geniş bir yelpazeye yayılıyorsa tek bir deneyimi tüm organizasyona genellemek yerine rol bazlı okumak daha sağlıklıdır.`,
      ].join(" ")
    : null;

  const prosSummary = frequentPros.length > 0
    ? [
        `${company.name} için öne çıkan artı başlıkları genellikle çalışma deneyimini günlük hayatta hissedilen yönleriyle tarif ediyor. Topluluğun tekrar eden pozitif sinyalleri, resmi işveren markası mesajlarından daha güvenilir bir operasyonel resim sunabiliyor.`,
        `En sık vurgulanan güçlü taraflar ${frequentPros.join(", ")} şeklinde özetlenebilir. Bu temalar, adayların sadece unvan ya da paket değil; ekip ritmi, yönetim şekli ve öğrenme hızı konusunda da beklenti oluşturmasına yardımcı olur.`,
        `${company.name} benzeri şirketlerde artı olarak yazılan noktaların gerçek değeri, bunların farklı kullanıcılar tarafından bağımsız biçimde tekrar edilmesiyle artar. Bu nedenle aynı tema ne kadar çok tekrar ediyorsa karar sürecindeki ağırlığı da o kadar yükselir.`,
      ].join(" ")
    : null;

  const consSummary = frequentCons.length > 0
    ? [
        `${company.name} sayfasındaki eksi başlıkları, adayların gözden kaçırabileceği riskleri erken fark etmesi açısından en az pozitif yorumlar kadar değerlidir. Buradaki amaç tekil serzenişleri büyütmek değil, tekrar eden sorun alanlarını ayıklamaktır.`,
        `En çok tekrar eden eleştiriler ${frequentCons.join(", ")} etrafında toplanıyor. Bu sinyaller; iş yükü, iletişim kalitesi, rol netliği veya terfi beklentisinin ne kadar dengeli yönetildiğine dair erken uyarı görevi görebilir.`,
        `${company.name} için bu eksiler, teklif kabul edilmeden önce sorulacak mülakat sorularını da şekillendirebilir. Özellikle aynı tema farklı zamanlarda birden fazla kullanıcı tarafından aktarılıyorsa bunun sistematik olma ihtimali artar.`,
      ].join(" ")
    : null;

  const candidateTakeaway = [
    `${company.name} hakkında karar verirken en sağlıklı yaklaşım, yorum, maaş ve mülakat sinyallerini tek tek değil birlikte okumaktır. Tek bir yorum veya tek bir maaş girdisi şirket gerçeğini temsil etmeyebilir; ancak aynı yönde biriken sinyaller beklenti çizmek için oldukça faydalıdır.`,
    company.sector || company.city
      ? `${company.sector ? `${company.sector} sektöründe` : "Bu segmentte"} ${company.city ? `${company.city} merkezli` : "yer alan"} alternatiflerle kıyaslama yapmak, bu sayfadaki verinin anlamını daha da güçlendirir. Benzer rol ve kıdem düzeyindeki adaylar, teklif paketi kadar kültür ve iletişim kalitesini de sorgulamalı.`
      : `${company.name} için veri sayısı arttıkça bu sayfa daha güçlü bir karar aracına dönüşecek. Şimdilik mevcut sinyaller; beklenti kalibrasyonu, mülakat hazırlığı ve maaş pazarlığı için kullanılabilir bir temel sunuyor.`,
    `${company.name} sayfası bu nedenle sadece bilgi toplama noktası değil; teklif öncesi kontrol listesi olarak da kullanılabilir. Adayların rolü, ekip yapısını, yönetici beklentisini, ücret bandını ve sürecin hızını birlikte sorgulaması daha kaliteli kararlar doğurur.`,
  ].join(" ");

  const faqItems = buildFaqItems(company, snapshot);
  const externalLinks = buildExternalLinks(company);
  const keywords = [
    `${company.name} yorumları`,
    `${company.name} maaş`,
    `${company.name} mülakat`,
    `${company.name} çalışma koşulları`,
    company.sector ? `${company.sector} şirket yorumları` : null,
    company.city ? `${company.city} şirket yorumları` : null,
  ].filter((keyword): keyword is string => Boolean(keyword));

  const wordCount = countWords([
    introSummary,
    cultureSummary,
    salarySummary,
    interviewSummary,
    prosSummary,
    consSummary,
    candidateTakeaway,
    ...faqItems.map((item) => `${item.question} ${item.answer}`),
  ]);

  return {
    introSummary,
    cultureSummary,
    salarySummary,
    interviewSummary,
    prosSummary,
    consSummary,
    candidateTakeaway,
    faqItems,
    externalLinks,
    keywords,
    wordCount,
    generationStatus,
    sourceSnapshot: snapshot,
  };
};

const isRecord = (value: Json | null): value is Record<string, Json> =>
  !!value && typeof value === "object" && !Array.isArray(value);

export const parseFaqItemsJson = (value: Json | null): CompanySeoFaqItem[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is Record<string, Json> => isRecord(item))
    .map((item) => ({
      question: typeof item.question === "string" ? item.question : "",
      answer: typeof item.answer === "string" ? item.answer : "",
    }))
    .filter((item) => item.question && item.answer);
};

export const parseExternalLinksJson = (value: Json | null): CompanySeoExternalLink[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is Record<string, Json> => isRecord(item))
    .map((item) => ({
      label: typeof item.label === "string" ? item.label : "",
      url: typeof item.url === "string" ? item.url : "",
    }))
    .filter((item) => item.label && item.url);
};
