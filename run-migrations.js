import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Supabase PostgreSQL connection detayları
// Supabase Dashboard → Settings → Database → Connection String adresinden alabilirsiniz
const DATABASE_URL = process.argv[2] || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL gerekli!');
  console.error('\nKullanım:');
  console.error('  node run-migrations.js "postgresql://user:password@host:5432/db"');
  console.error('\nVeya:');
  console.error('  export DATABASE_URL="postgresql://..." && node run-migrations.js');
  console.error('\n💡 Connection String nerede bulunur:');
  console.error('  https://app.supabase.com/ → Settings → Database → Connection String');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: true }
    : { rejectUnauthorized: false }
});

const migrations = [
  '001_initial_schema.sql',
  '002_setup_rls_and_triggers.sql',
  '003_create_auth_trigger.sql',
  '004_create_policies.sql'
];

// SQL statement'ları parse et ve ayrıştır
// Dollar-quoted strings'i dikkate al
function parseSql(sql) {
  const statements = [];
  let current = '';
  let inDollarQuote = false;
  let dollarTag = '';
  let i = 0;

  while (i < sql.length) {
    // Dollar quote check
    if (sql[i] === '$' && !inDollarQuote) {
      let j = i + 1;
      while (j < sql.length && (sql[j].match(/[a-zA-Z0-9_]/) || sql[j] === '$')) {
        j++;
      }
      if (sql[j] === '$') {
        dollarTag = sql.substring(i, j + 1);
        inDollarQuote = true;
        current += dollarTag;
        i = j + 1;
        continue;
      }
    }

    // Check for end of dollar quote
    if (inDollarQuote && sql.substring(i, i + dollarTag.length) === dollarTag) {
      current += dollarTag;
      inDollarQuote = false;
      i += dollarTag.length;
      continue;
    }

    // Semi-colon ends statement (if not in dollar quote)
    if (sql[i] === ';' && !inDollarQuote) {
      current = current.trim();
      if (current && !current.startsWith('--')) {
        statements.push(current);
      }
      current = '';
      i++;
      continue;
    }

    current += sql[i];
    i++;
  }

  // Add remaining statement
  current = current.trim();
  if (current && !current.startsWith('--')) {
    statements.push(current);
  }

  return statements;
}

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Migration işlemi başlanıyor...\n');
    
    for (const migration of migrations) {
      const filePath = path.join(__dirname, 'supabase', 'migrations', migration);
      
      try {
        console.log(`⏳ ${migration} çalıştırılıyor...`);
        
        const sql = fs.readFileSync(filePath, 'utf-8');
        
        // Tüm SQL'i bir kez çalıştır (tüm statements içinde)
        await client.query(sql);
        
        console.log(`✅ ${migration} başarılı\n`);
        
      } catch (err) {
        console.error(`❌ ${migration} hatası:`);
        console.error(`   ${err.message}\n`);
        throw err;
      }
    }
    
    console.log('✨ Tüm migration\'lar başarılı!');
    
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
