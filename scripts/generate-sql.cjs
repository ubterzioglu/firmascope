/**
 * LinkedIn verilerinden SQL INSERT dosyası oluşturur
 * Supabase Dashboard > SQL Editor'de çalıştırılabilir
 * 
 * Kullanım: node scripts/generate-sql.cjs
 */

const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../data/linkedin-turkey-100.json');
const outputPath = path.join(__dirname, '../data/linkedin-import.sql');

if (!fs.existsSync(jsonPath)) {
  console.error('❌ JSON dosyası bulunamadı:', jsonPath);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
const companies = data.companies || [];

console.log(`📊 ${companies.length} şirket okundu\n`);

// SQL başlangıcı
let sql = `-- LinkedIn'den çekilen şirketlerin Supabase'e aktarımı
-- Tarih: ${new Date().toISOString()}
-- Toplam: ${companies.length} şirket

-- ON CONFLICT ile duplicate'leri atlayarak ekle
`;

// Her şirket için INSERT
companies.forEach((c, i) => {
  const safeName = c.name?.replace(/'/g, "''") || '';
  const safeDesc = (c.description || c.tagline || '')?.substring(0, 500).replace(/'/g, "''");
  
  sql += `
INSERT INTO companies (
  name, slug, initials, description, city, sector, size, status, 
  website, logo_url, linkedin_url, source, scraped_at
) VALUES (
  '${safeName}',
  '${c.slug}',
  '${c.initials}',
  '${safeDesc}',
  '${c.city || 'İstanbul'}',
  '${c.sector || 'Diğer'}',
  '${c.size || '51-200'}',
  'Aktif',
  '${c.website || ''}',
  '${c.logo_url || ''}',
  '${c.linkedin_url || ''}',
  'linkedin-apify',
  '${c.scraped_at || new Date().toISOString()}'
)
ON CONFLICT (slug) DO NOTHING;
`;
});

// Dosyaya kaydet
fs.writeFileSync(outputPath, sql);

console.log('✅ SQL dosyası oluşturuldu:', outputPath);
console.log(`📁 ${companies.length} şirket için INSERT komutları hazır`);
console.log('\n📋 Kullanım:');
console.log('   1. Supabase Dashboard > SQL Editor\'a git');
console.log('   2. data/linkedin-import.sql dosyasını aç');
console.log('   3. Tüm içeriği kopyala ve SQL Editor\'e yapıştır');
console.log('   4. Çalıştır (Run)');

// Özet
const sectors = {};
companies.forEach(c => {
  sectors[c.sector || 'Diğer'] = (sectors[c.sector || 'Diğer'] || 0) + 1;
});

console.log('\n📈 Sektör Dağılımı:');
Object.entries(sectors).sort((a, b) => b[1] - a[1]).forEach(([s, c]) => {
  console.log(`   ${s}: ${c}`);
});
