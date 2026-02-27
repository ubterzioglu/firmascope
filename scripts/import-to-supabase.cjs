/**
 * LinkedIn'den çekilen şirketleri Supabase'e aktarma script'i
 * 
 * Kullanım: node scripts/import-to-supabase.cjs
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase bağlantı bilgileri - .env.local'den veya doğrudan
const SUPABASE_URL = 'https://feafcmvulxsrjrdxosyt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlYWZjbXZ1bHhzcmpyZHhvc3l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyMzg1NDYsImV4cCI6MjA4NDgxNDU0Nn0.q-s1Kmd9QQKwUX6hOwQuzipuaiZhUrihaBYcZsllel4';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log('🚀 Supabase\'e Aktarma Başlatılıyor...\n');
  
  // 1. JSON dosyasını oku
  const jsonPath = path.join(__dirname, '../data/linkedin-turkey-100.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ JSON dosyası bulunamadı:', jsonPath);
    process.exit(1);
  }
  
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const linkedinCompanies = data.companies || [];
  
  console.log(`📊 LinkedIn'den ${linkedinCompanies.length} şirket okundu`);
  
  // 2. Mevcut şirketleri çek
  console.log('📥 Mevcut şirketler çekiliyor...');
  const { data: existingCompanies, error: fetchError } = await supabase
    .from('companies')
    .select('slug, name');
  
  if (fetchError) {
    console.error('❌ Mevcut şirketleri çekerken hata:', fetchError.message);
    process.exit(1);
  }
  
  const existingSlugs = new Set(existingCompanies.map(c => c.slug));
  console.log(`   ${existingCompanies.length} mevcut şirket bulundu`);
  
  // 3. Yeni şirketleri filtrele
  const newCompanies = linkedinCompanies.filter(c => !existingSlugs.has(c.slug));
  
  if (newCompanies.length === 0) {
    console.log('✅ Tüm şirketler zaten veritabanında!');
    return;
  }
  
  console.log(`\n➕ ${newCompanies.length} yeni şirket eklenecek`);
  console.log('\nİlk 5 şirket:');
  newCompanies.slice(0, 5).forEach((c, i) => {
    console.log(`   ${i + 1}. ${c.name} (${c.sector})`);
  });
  if (newCompanies.length > 5) {
    console.log(`   ... ve ${newCompanies.length - 5} şirket daha`);
  }
  
  // 4. Supabase'e ekle
  console.log('\n💾 Veritabanına yazılıyor...');
  
  // Batch'lere böl (50'şerli)
  const BATCH_SIZE = 50;
  let insertedCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < newCompanies.length; i += BATCH_SIZE) {
    const batch = newCompanies.slice(i, i + BATCH_SIZE);
    
    const { data: inserted, error } = await supabase
      .from('companies')
      .insert(batch);
    
    if (error) {
      console.error(`   ❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} hatası:`, error.message);
      errorCount += batch.length;
    } else {
      insertedCount += batch.length;
      console.log(`   ✅ ${insertedCount}/${newCompanies.length} şirket eklendi`);
    }
    
    // Kısa bekleme
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // 5. Özet
  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ AKTARIM TAMAMLANDI!');
  console.log(`📊 Toplam: ${insertedCount} şirket eklendi`);
  if (errorCount > 0) {
    console.log(`❌ Hatalı: ${errorCount} şirket`);
  }
  console.log(`📁 Veritabanındaki toplam şirket: ${existingCompanies.length + insertedCount}`);
  
  // 6. Sektör dağılımı
  console.log('\n📈 Yeni Şirketler - Sektör Dağılımı:');
  const sectors = {};
  newCompanies.forEach(c => {
    sectors[c.sector] = (sectors[c.sector] || 0) + 1;
  });
  Object.entries(sectors)
    .sort((a, b) => b[1] - a[1])
    .forEach(([sector, count]) => {
      console.log(`   ${sector}: ${count}`);
    });
}

main().catch(err => {
  console.error('💥 Fatal error:', err.message);
  process.exit(1);
});
