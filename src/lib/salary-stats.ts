// Pure, immutable helpers to aggregate salary entries by position (+ optional city).
// Used on the company detail "Maaşlar" tab to show min / average / max per role.

export interface SalaryStatInput {
  job_title: string;
  salary_amount: number;
  currency?: string | null;
  location_city?: string | null;
}

export interface SalaryStat {
  jobTitle: string;
  city: string | null;
  currency: string;
  min: number;
  avg: number;
  max: number;
  count: number;
}

const DEFAULT_CURRENCY = "TRY";

/**
 * Group salaries by job title + city and compute min/avg/max/count.
 * Currency is taken from the most common currency within each group
 * (mixed-currency groups are uncommon; we surface the dominant one).
 * Results are sorted by sample count descending, then job title.
 */
export const computeSalaryStats = (
  salaries: readonly SalaryStatInput[]
): SalaryStat[] => {
  const groups = new Map<string, SalaryStatInput[]>();

  for (const salary of salaries) {
    if (!salary.job_title || typeof salary.salary_amount !== "number" || Number.isNaN(salary.salary_amount)) {
      continue;
    }
    const city = salary.location_city?.trim() || "";
    const key = `${salary.job_title.trim().toLowerCase()}|${city.toLowerCase()}`;
    const existing = groups.get(key);
    if (existing) {
      groups.set(key, [...existing, salary]);
    } else {
      groups.set(key, [salary]);
    }
  }

  const stats: SalaryStat[] = [];

  for (const entries of groups.values()) {
    const amounts = entries.map((e) => e.salary_amount);
    const sum = amounts.reduce((acc, n) => acc + n, 0);
    stats.push({
      jobTitle: entries[0].job_title.trim(),
      city: entries[0].location_city?.trim() || null,
      currency: dominantCurrency(entries),
      min: Math.min(...amounts),
      avg: Math.round(sum / amounts.length),
      max: Math.max(...amounts),
      count: entries.length,
    });
  }

  return stats.sort((a, b) => b.count - a.count || a.jobTitle.localeCompare(b.jobTitle, "tr"));
};

const dominantCurrency = (entries: readonly SalaryStatInput[]): string => {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const currency = entry.currency?.trim() || DEFAULT_CURRENCY;
    counts.set(currency, (counts.get(currency) || 0) + 1);
  }
  let best = DEFAULT_CURRENCY;
  let bestCount = -1;
  for (const [currency, count] of counts) {
    if (count > bestCount) {
      best = currency;
      bestCount = count;
    }
  }
  return best;
};
