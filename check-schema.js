import { Pool } from 'pg';

const DATABASE_URL = 'postgres://postgres.feafcmvulxsrjrdxosyt:j4pdMX41F02df980@aws-1-eu-central-1.pooler.supabase.com:5432/postgres';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkSchema() {
  const client = await pool.connect();
  
  try {
    console.log('📋 Profiles table columnları:\n');
    const result = await client.query(
      `SELECT column_name, data_type, is_nullable
       FROM information_schema.columns 
       WHERE table_schema = 'public' AND table_name = 'profiles'
       ORDER BY ordinal_position`
    );
    console.table(result.rows);
    
    console.log('\n📋 Companies table columnları:\n');
    const result2 = await client.query(
      `SELECT column_name, data_type, is_nullable
       FROM information_schema.columns 
       WHERE table_schema = 'public' AND table_name = 'companies'
       ORDER BY ordinal_position`
    );
    console.table(result2.rows);
    
    console.log('\n🔐 Profiles table RLS Policies:\n');
    const result3 = await client.query(
      `SELECT policyname, permissive, roles, qual, with_check
       FROM pg_policies
       WHERE tablename = 'profiles'`
    );
    console.table(result3.rows);
    
  } finally {
    client.release();
    await pool.end();
  }
}

checkSchema().catch(err => console.error('Error:', err));
