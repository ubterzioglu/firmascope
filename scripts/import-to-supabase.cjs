/**
 * LinkedIn'den cekilen sirketleri Supabase'e aktarir.
 *
 * Gerekli env:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY (veya fallback olarak SUPABASE_ANON_KEY)
 *
 * Kullanim:
 *   node scripts/import-to-supabase.cjs
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
const SUPABASE_KEY = (
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  ''
).trim();

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function loadCompanies() {
  const jsonPath = path.join(__dirname, '../data/linkedin-turkey-100.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ JSON dosyasi bulunamadi:', jsonPath);
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
    city: company.city?.trim() || 'Istanbul',
    sector: company.sector?.trim() || 'Diger',
    company_type: 'A.S.',
    status: company.status?.trim() || 'Aktif',
    size: company.size?.trim() || '51-200',
    logo_url: company.logo_url?.trim() || null,
  };
}

async function main() {
  console.log('🚀 Supabase aktarimi baslatiliyor...\n');

  const companies = loadCompanies().map(normalizeCompany).filter((company) => company.name && company.slug);
  console.log(`📊 ${companies.length} sirket hazirlandi`);

  const { data: existingCompanies, error: fetchError } = await supabase
    .from('companies')
    .select('slug');

  if (fetchError) {
    console.error('❌ Mevcut sirketler cekilemedi:', fetchError.message);
    process.exit(1);
  }

  const existingSlugs = new Set(existingCompanies.map((company) => company.slug));
  const pendingCompanies = companies.filter((company) => !existingSlugs.has(company.slug));

  if (pendingCompanies.length === 0) {
    console.log('✅ Tum sirketler zaten mevcut.');
    return;
  }

  const { error: insertError } = await supabase.from('companies').insert(pendingCompanies);
  if (insertError) {
    console.error('❌ Insert hatasi:', insertError.message);
    process.exit(1);
  }

  console.log(`✅ ${pendingCompanies.length} sirket eklendi.`);
}

main().catch((error) => {
  console.error('💥 Fatal error:', error.message);
  process.exit(1);
});
