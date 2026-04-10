/**
 * LinkedIn'den çekilen şirketleri Supabase'e aktarır.
 *
 * Varsayılan olarak:
 * - `SUPABASE_URL`
 * - `SUPABASE_SERVICE_ROLE_KEY` (veya fallback olarak `SUPABASE_ANON_KEY`)
 * değişkenlerini kullanır.
 *
 * Kullanım:
 *   node scripts/import-to-supabase-fetch.cjs
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
const SUPABASE_KEY = (
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY
  || ''
).trim();

const BATCH_SIZE = 50;

function assertConfig() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli.');
    process.exit(1);
  }
}

function loadCompanies() {
  const jsonPath = path.join(__dirname, '../data/linkedin-turkey-100.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ JSON dosyası bulunamadı:', jsonPath);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  return data.companies || [];
}

function normalizeCompany(company) {
  return {
    name: company.name?.trim(),
    slug: company.slug?.trim(),
    initials: company.initials?.trim() || '',
    description: (company.description || company.tagline || '').trim() || null,
    city: company.city?.trim() || 'İstanbul',
    sector: company.sector?.trim() || 'Diğer',
    company_type: 'A.Ş.',
    status: company.status?.trim() || 'Aktif',
    size: company.size?.trim() || '51-200',
    logo_url: company.logo_url?.trim() || null,
  };
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const raw = await response.text();
  let body = raw;
  try {
    body = raw ? JSON.parse(raw) : null;
  } catch {
    body = raw;
  }

  return { response, body };
}

async function fetchExistingSlugs() {
  const { response, body } = await apiRequest(`${SUPABASE_URL}/rest/v1/companies?select=slug`);
  if (!response.ok) {
    throw new Error(`Mevcut şirketler okunamadı: ${JSON.stringify(body).slice(0, 300)}`);
  }

  return new Set((body || []).map((item) => item.slug));
}

async function insertBatch(batch) {
  const { response, body } = await apiRequest(`${SUPABASE_URL}/rest/v1/companies`, {
    method: 'POST',
    headers: {
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(batch),
  });

  if (!response.ok) {
    throw new Error(JSON.stringify(body).slice(0, 400));
  }
}

async function fetchCompanyCount() {
  const { response } = await apiRequest(`${SUPABASE_URL}/rest/v1/companies?select=id`, {
    headers: {
      Prefer: 'count=exact',
      Range: '0-0',
    },
  });

  const contentRange = response.headers.get('content-range') || '*/0';
  const total = Number(contentRange.split('/')[1] || 0);
  return Number.isFinite(total) ? total : 0;
}

async function main() {
  assertConfig();

  console.log('🚀 Supabase sirket aktarimi baslatiliyor...\n');

  const companies = loadCompanies().map(normalizeCompany).filter((company) => company.name && company.slug);
  console.log(`📊 JSON icinden ${companies.length} sirket hazirlandi`);

  console.log('📥 Mevcut slug listesi cekiliyor...');
  const existingSlugs = await fetchExistingSlugs();
  console.log(`   ${existingSlugs.size} mevcut sirket bulundu`);

  const pendingCompanies = companies.filter((company) => !existingSlugs.has(company.slug));
  if (pendingCompanies.length === 0) {
    console.log('✅ Tum sirketler zaten mevcut.');
    return;
  }

  console.log(`\n➕ ${pendingCompanies.length} yeni sirket eklenecek`);
  pendingCompanies.slice(0, 5).forEach((company, index) => {
    console.log(`   ${index + 1}. ${company.name} (${company.sector})`);
  });

  let insertedCount = 0;
  for (let index = 0; index < pendingCompanies.length; index += BATCH_SIZE) {
    const batch = pendingCompanies.slice(index, index + BATCH_SIZE);
    await insertBatch(batch);
    insertedCount += batch.length;
    console.log(`   ✅ ${insertedCount}/${pendingCompanies.length} sirket eklendi`);
  }

  const finalCount = await fetchCompanyCount();

  console.log(`\n${'='.repeat(50)}`);
  console.log('✅ AKTARIM TAMAMLANDI');
  console.log(`📊 Yeni eklenen: ${insertedCount}`);
  console.log(`📁 Toplam sirket: ${finalCount}`);
}

main().catch((error) => {
  console.error('💥 Migration hatasi:', error.message);
  process.exit(1);
});
