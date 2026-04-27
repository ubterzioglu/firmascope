/**
 * LinkedIn verilerinden SQL INSERT dosyası oluşturur
 * Admin panelindeki SQL upload alanında çalıştırılabilir
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
  name, slug, initials, description, city, sector, size, company_type, status
) VALUES (
  '${safeName}',
  '${c.slug}',
  '${c.initials}',
  '${safeDesc}',
  '${c.city || 'Istanbul'}',
  '${c.sector || 'Diger'}',
  '${c.size || '51-200'}',
  'A.S.',
  'Aktif'
)
ON CONFLICT (slug) DO NOTHING;
`;
});

// Dosyaya kaydet
fs.writeFileSync(outputPath, sql);

console.log('✅ SQL dosyası oluşturuldu:', outputPath);
console.log(`📁 ${companies.length} şirket için INSERT komutları hazır`);
console.log('\n📋 Kullanım:');
console.log('   1. Admin panelinde Sirketler sekmesine git');
console.log('   2. data/linkedin-import.sql dosyasını aç');
console.log('   3. SQL dosyasını upload alanından yükle');
console.log('   4. Çalıştır (SQL Dosyasini Calistir)');

// Özet
const sectors = {};
companies.forEach(c => {
  sectors[c.sector || 'Diğer'] = (sectors[c.sector || 'Diğer'] || 0) + 1;
});

console.log('\n📈 Sektör Dağılımı:');
Object.entries(sectors).sort((a, b) => b[1] - a[1]).forEach(([s, c]) => {
  console.log(`   ${s}: ${c}`);
});
