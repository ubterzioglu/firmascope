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
    label: "Teknoloji sektoru ozeti",
    url: "https://en.wikipedia.org/wiki/Information_technology",
  },
  finans: {
    label: "Finans sektoru ozeti",
    url: "https://en.wikipedia.org/wiki/Financial_services",
  },
  saglik: {
    label: "Saglik sektoru ozeti",
    url: "https://en.wikipedia.org/wiki/Health_care",
  },
  enerji: {
    label: "Enerji sektoru ozeti",
    url: "https://en.wikipedia.org/wiki/Energy_industry",
  },
  lojistik: {
    label: "Lojistik sektoru ozeti",
    url: "https://en.wikipedia.org/wiki/Logistics",
  },
  otomotiv: {
    label: "Otomotiv sektoru ozeti",
    url: "https://en.wikipedia.org/wiki/Automotive_industry",
  },
  medya: {
    label: "Medya sektoru ozeti",
    url: "https://en.wikipedia.org/wiki/Media_(communication)",
  },
  insaat: {
    label: "Insaat sektoru ozeti",
    url: "https://en.wikipedia.org/wiki/Construction",
  },
  egitim: {
    label: "Egitim sektoru ozeti",
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
      label: `${company.name} LinkedIn aramasi`,
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
      label: `${company.city} is pazari baglami`,
      url: `https://tr.wikipedia.org/wiki/${encodeURIComponent(company.city)}`,
    });
  }

  return links.slice(0, 3);
};

const buildFaqItems = (company: CompanyCore, snapshot: CompanySeoSourceSnapshot): CompanySeoFaqItem[] => {
  const faqItems: CompanySeoFaqItem[] = [
    {
      question: `${company.name} nasil bir sirket olarak goruluyor?`,
      answer:
        snapshot.reviewCount > 0
          ? `${company.name} icin platformda ${snapshot.reviewCount} yorum bulunuyor. Ortalama puan ve tekrar eden yorum temalari, kultur ve beklenti yonetimi konusunda ilk sinyali veriyor.`
          : `${company.name} icin henuz yeterli yorum birikimi bulunmuyor. Sayfa yine de sektor, sehir ve pozisyon bazli ilk arastirma icin temel bir baslangic sunuyor.`,
    },
    {
      question: `${company.name} maas beklentisi nasil degerlendirilmeli?`,
      answer:
        snapshot.salaryCount > 0
          ? `${company.name} icin kayitli maas girdileri pozisyon ve kidem bazli dagilimi gosteriyor. Tek bir rakama odaklanmak yerine kidem, departman ve calisma modelini birlikte okumak daha saglikli olur.`
          : `${company.name} icin maas verisi sinirli oldugunda benzer sektor ve sehirdeki rollerle kiyaslama yapmak gerekir. Bu sayfa, topluluk verisi geldikce daha net bantlar sunmak uzere tasarlandi.`,
    },
    {
      question: `${company.name} mulakat sureci zor mu?`,
      answer:
        snapshot.interviewCount > 0
          ? `${company.name} sayfasindaki mulakat kayitlari surecin kac asamali oldugu, hangi formatta ilerledigi ve geri donus hizinin nasil oldugu konusunda somut fikir verir.`
          : `${company.name} icin mulakat verisi sinirliyse adaylarin pozisyon bazli beklentilerini sektor ortalamasi ve benzer roller uzerinden kurmasi gerekir.`,
    },
  ];

  if (company.sector || company.city) {
    faqItems.push({
      question: `${company.name} hangi aday profiline daha uygun olabilir?`,
      answer: `${company.sector || "ilgili"} sektorunde ${company.city || "Türkiye"} baglaminda is arayan adaylar icin bu sayfa; kultur, ucret ve surec beklentisini ayni yerde toplar. En dogru okuma, yorum sayisi, maas girdisi ve mulakat ayrintilarini birlikte degerlendirmekle yapilir.`,
    });
  }

  return faqItems;
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

  const snapshot: CompanySeoSourceSnapshot = {
    reviewCount: reviews.length,
    salaryCount: salaries.length,
    interviewCount: interviews.length,
    averageRating: averageRating ? Number(averageRating.toFixed(1)) : null,
    recommendationRate,
    topDepartments,
    topSalaryTitles,
    topInterviewPositions,
  };

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
        `${company.name}, ${company.city || "Türkiye"} merkezli ${company.sector ? `${company.sector.toLowerCase()} alaninda` : "farkli is fonksiyonlarinda"} konumlanan bir ${company.company_type || "sirket"} profili sunuyor. firmascope uzerindeki bu sayfa, adaylarin ve calisanlarin tek tek yorumlari yerine daha butunlu bir resim gorebilmesi icin yorum, maas ve mulakat verilerini ayni akista bir araya getiriyor.`,
        company.description
          ? `${capitalizeSentence(company.description)} Bu tanim, topluluk verisiyle birlikte okundugunda sirketin resmi anlatisi ile kullanici deneyiminin ne kadar ortustugunu anlamaya yardimci olur.`
          : `${company.name} icin resmi tanim sinirli olsa da sayfadaki topluluk verisi, kultur ve beklenti yonetimi konusunda ilk sinyalleri sunar.`,
        reviews.length > 0 || salaries.length > 0 || interviews.length > 0
          ? `${reviews.length} yorum, ${salaries.length} maas girdisi ve ${interviews.length} mulakat kaydi; bu sayfayi sadece bir sirket karti olmaktan cikarip arastirma odakli bir referans noktasina donusturuyor. Adaylar bu verileri roller, calisma modeli ve kidem beklentisiyle birlikte okumali.`
          : `${company.name} icin topluluk verisi henuz yeni olusuyor. Sayfa yine de sektor, sehir ve isveren markasi baglaminda temel arastirma icin hazir bir iskelet sunuyor.`,
      ].join(" ")
    : null;

  const cultureSummary = reviews.length > 0
    ? [
        `${company.name} kulturunu okurken sadece ortalama puana bakmak yeterli degil. Sayfadaki yorumlar, ekip ici iletisim, yonetici yaklasimi, gorev netligi ve is-ozel hayat dengesi gibi basliklarda tekrar eden ortak bir ton uretiyor.`,
        snapshot.averageRating
          ? `Mevcut yorumlara gore ortalama puan ${snapshot.averageRating}/5 seviyesinde. ${recommendationRate !== null ? `Tavsiye orani ise yaklasik %${recommendationRate}.` : ""} Bu iki veri birlikte, memnuniyetin sadece duygusal degil davranissal olarak da ne kadar tutarli oldugunu gosterir.`
          : `${company.name} icin puan dagilimi sinirli olsa da metin yorumlar, kulturel beklentiyi anlamak acisindan rakamlardan daha zengin sinyal verir.`,
        topDepartments.length > 0
          ? `En cok geri bildirim gelen alanlar ${topDepartments.join(", ")} olarak one cikiyor. Bu durum, yorumlarin belirli ekiplerden yogunlastigini ve kultur analizinin departman baglamiyla birlikte okunmasi gerektigini gosterir.`
          : `${company.name} icin departman dagilimi henuz net degil. Bu nedenle kultur okumasi yaparken tekil deneyimlerin temsil gucunu dikkatli yorumlamak gerekir.`,
        frequentPros.length > 0 || frequentCons.length > 0
          ? `Pozitif tarafta ${frequentPros.join(", ")} gibi temalar sik tekrarlaniyor. Diger yandan ${frequentCons.join(", ")} benzeri elestiriler de karar surecinde dikkate alinmali.`
          : `${company.name} yorumlarinda keskin sekilde ayrisan bir tema yoksa bu genellikle ya veri sayisinin sinirli olduguna ya da deneyimlerin ekipten ekibe belirgin bicimde degistigine isaret eder.`,
      ].join(" ")
    : null;

  const salarySummary = salaries.length > 0
    ? [
        `${company.name} maas verileri, adaylarin sadece tek bir rakam gormesi icin degil; rol, kidem ve calisma modeli farklarini okuyabilmesi icin yorumlanmali. Bu sayfadaki maas kayitlari, brut-net tercihi, sehir etkisi ve hibrit ya da uzaktan calisma gibi degiskenleri birlikte dusunmeyi gerektirir.`,
        averageSalary
          ? `Kayitli girdiler baz alindiginda ortalama maas seviyesi ${formatCurrency(Math.round(averageSalary), salaries[0]?.currency || "TRY")} civarinda gorunuyor. Bu rakam bir teklif standardi degil, topluluk tarafindan paylasilan orneklerin merkezi egilimini temsil eder.`
          : `${company.name} icin maas kayitlari sayisal olarak sinirli olsa da mevcut girdiler, beklenti bandini anlamak icin yine de faydali bir baslangic noktasi sunuyor.`,
        topSalaryTitles.length > 0
          ? `En sik karsilasilan pozisyonlar ${topSalaryTitles.join(", ")} olarak goze carpiyor. Bu da sayfada gorulen maas sinyallerinin hangi rol ailelerinde daha temsil guclu oldugunu acikca gosteriyor.`
          : `${company.name} maas sayfasinda pozisyon dagilimi henuz daginik olabilir. Bu nedenle en dogru okuma, benzer kidem ve departmandaki ilanlarla capraz kontrol yapilarak yapilir.`,
        remoteShare !== null
          ? `Uzaktan veya hibrit kayitlarin payi yaklasik %${remoteShare} seviyesinde. Bu oran, ayni sirket icindeki paketlerin sadece taban maasla degil, esneklik ve lokasyon tercihleriyle de degerlendirildigini hatirlatiyor.`
          : `${company.name} icin calisma modeli dagilimi sinirli oldugunda maas verisini sehir ve ofis beklentileriyle birlikte okumak daha dogru olur.`,
      ].join(" ")
    : null;

  const interviewSummary = interviews.length > 0
    ? [
        `${company.name} mulakat sureci hakkindaki en degerli sinyal, adaylarin hangi asamalardan gectigini ve ne kadar hizli geri donus aldigini gosteriyor olmasi. Bu sayfadaki kayitlar, surecin sadece zor ya da kolay olup olmadigini degil, aday deneyiminin ne kadar tutarli oldugunu anlamaya yardimci olur.`,
        interviewStageAverage
          ? `Paylasilan verilere gore ortalama asama sayisi yaklasik ${interviewStageAverage.toFixed(1)}. Bu, surecin tek gorusmeli hizli bir akis mi yoksa birden fazla filtreyle ilerleyen daha secici bir yapi mi oldugunu anlamak icin guclu bir ipucu verir.`
          : `${company.name} icin asama sayisi bilgisi her kayitta bulunmasa da mevcut deneyimler surecin yapisi hakkinda yonlendirici ipuclari saglar.`,
        responseDaysAverage
          ? `Geri donus hizi ortalama ${responseDaysAverage.toFixed(1)} gun civarinda gorunuyor. Adaylar icin bu veri, beklenti yonetimi ve paralel surec planlamasi acisindan oldukca kritiktir.`
          : `${company.name} icin geri donus hizi verisi eksik olsa bile yorum metinleri surecin temposu ve iletisim kalitesi hakkinda fikir verebilir.`,
        topInterviewPositions.length > 0
          ? `En cok paylasim gelen roller ${topInterviewPositions.join(", ")} oldugu icin mulakat okumasini bu pozisyonlarin temsil gucuyle birlikte degerlendirmek gerekir.`
          : `${company.name} icin mulakat pozisyonlari genis bir yelpazeye yayiliyorsa tek bir deneyimi tum organizasyona genellemek yerine rol bazli okumak daha sagliklidir.`,
      ].join(" ")
    : null;

  const prosSummary = frequentPros.length > 0
    ? [
        `${company.name} icin one cikan arti basliklari genellikle calisma deneyimini gunluk hayatta hissedilen yonleriyle tarif ediyor. Toplulugun tekrar eden pozitif sinyalleri, resmi isveren markasi mesajlarindan daha guvenilir bir operasyonel resim sunabiliyor.`,
        `En sik vurgulanan guclu taraflar ${frequentPros.join(", ")} seklinde ozetlenebilir. Bu temalar, adaylarin sadece unvan ya da paket degil; ekip ritmi, yonetim sekli ve ogreni hizi konusunda da beklenti olusturmasina yardimci olur.`,
        `${company.name} benzeri sirketlerde arti olarak yazilan noktalarin gercek degeri, bunlarin farkli kullanicilar tarafindan bagimsiz bicimde tekrar edilmesiyle artar. Bu nedenle ayni tema ne kadar cok tekrar ediyorsa karar surecindeki agirligi de o kadar yukselir.`,
      ].join(" ")
    : null;

  const consSummary = frequentCons.length > 0
    ? [
        `${company.name} sayfasindaki eksi basliklari, adaylarin gozden kacirabilecegi riskleri erken fark etmesi acisindan en az pozitif yorumlar kadar degerlidir. Buradaki amac tekil serzenisleri buyutmek degil, tekrar eden sorun alanlarini ayiklamaktir.`,
        `En cok tekrar eden elestiriler ${frequentCons.join(", ")} etrafinda toplaniyor. Bu sinyaller; is yuku, iletisim kalitesi, rol netligi veya terfi beklentisinin ne kadar dengeli yonetildigine dair erken uyari gorevi gorebilir.`,
        `${company.name} icin bu eksiler, teklif kabul edilmeden once sorulacak mulakat sorularini da sekillendirebilir. Ozellikle ayni tema farkli zamanlarda birden fazla kullanici tarafindan aktariliyorsa bunun sistematik olma ihtimali artar.`,
      ].join(" ")
    : null;

  const candidateTakeaway = [
    `${company.name} hakkinda karar verirken en saglikli yaklasim, yorum, maas ve mulakat sinyallerini tek tek degil birlikte okumaktir. Tek bir yorum veya tek bir maas girdisi sirket gercegini temsil etmeyebilir; ancak ayni yonde biriken sinyaller beklenti cizmek icin oldukca faydalidir.`,
    company.sector || company.city
      ? `${company.sector ? `${company.sector} sektorunde` : "Bu segmentte"} ${company.city ? `${company.city} merkezli` : "yer alan"} alternatiflerle kiyaslama yapmak, bu sayfadaki verinin anlamini daha da guclendirir. Benzer rol ve kidem duzeyindeki adaylar, teklif paketi kadar kultur ve iletisim kalitesini de sorgulamali.`
      : `${company.name} icin veri sayisi arttikca bu sayfa daha guclu bir karar aracina donusecek. Simdilik mevcut sinyaller; beklenti kalibrasyonu, mulakat hazirligi ve maas pazarligi icin kullanilabilir bir temel sunuyor.`,
    `${company.name} sayfasi bu nedenle sadece bilgi toplama noktasi degil; teklif oncesi kontrol listesi olarak da kullanilabilir. Adaylarin rolu, ekip yapisini, yonetici beklentisini, ucret bandini ve surecin hizini birlikte sorgulamasi daha kaliteli kararlar dogurur.`,
  ].join(" ");

  const faqItems = buildFaqItems(company, snapshot);
  const externalLinks = buildExternalLinks(company);
  const keywords = [
    `${company.name} yorumlari`,
    `${company.name} maas`,
    `${company.name} mulakat`,
    `${company.name} calisma kosullari`,
    company.sector ? `${company.sector} sirket yorumlari` : null,
    company.city ? `${company.city} sirket yorumlari` : null,
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
