#!/usr/bin/env python3
"""
Supabase migration runner
Supabase veritabanında SQL migration'larını çalıştırır.

Kullanım:
  python run_migrations.py <DB_URL>
  
Örnek:
  python run_migrations.py "postgresql://postgres:password@db.supabase.co:5432/postgres"
  
Connection String nerede bulunur:
  1. https://app.supabase.com/ → Projecte git
  2. Settings → Database → Connection String
  3. 'Connection Details' seçeneğini aç
  4. PostgreSQL connection string'i kopyala
"""

import sys
import os
import glob
import psycopg2
from pathlib import Path

def get_migrations():
    """Migration dosyalarını kronolojik sırada al"""
    migrations_dir = Path(__file__).parent / 'supabase' / 'migrations'
    
    migration_files = [
        '001_initial_schema.sql',
        '002_setup_rls_and_triggers.sql',
        '003_create_auth_trigger.sql',
        '004_create_policies.sql'
    ]
    
    return [migrations_dir / f for f in migration_files if (migrations_dir / f).exists()]

def run_migrations(db_url):
    """SQL migration'larını çalıştır"""
    
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()
        
        migrations = get_migrations()
        
        if not migrations:
            print("❌ Migration dosyaları bulunamadı!")
            return False
        
        print(f"🚀 {len(migrations)} migration bulundu.\n")
        
        for migration_file in migrations:
            try:
                with open(migration_file, 'r') as f:
                    sql = f.read()
                
                print(f"⏳ {migration_file.name} çalıştırılıyor...")
                
                cursor.execute(sql)
                conn.commit()
                
                print(f"✅ {migration_file.name} başarılı\n")
                
            except psycopg2.Error as e:
                print(f"❌ {migration_file.name} hatası:")
                print(f"   Error: {e.diag.message_primary if hasattr(e, 'diag') else str(e)}")
                conn.rollback()
                return False
            except Exception as e:
                print(f"❌ {migration_file.name} hatası: {e}")
                conn.rollback()
                return False
        
        cursor.close()
        conn.close()
        
        print("✨ Tüm migration'lar başarılı!")
        return True
        
    except psycopg2.Error as e:
        print(f"❌ Veritabanı bağlantı hatası:")
        print(f"   {e}")
        print("\n💡 Connection string'i kontrol edin:")
        print("   https://app.supabase.com/ → Settings → Database → Connection String")
        return False
    except Exception as e:
        print(f"❌ Hata: {e}")
        return False

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        print("\n⚠️  Database URL gerekli!")
        print("\nOrnekler:")
        print("  python run_migrations.py 'postgresql://postgres:password@db.supabase.co:5432/postgres'")
        sys.exit(1)
    
    db_url = sys.argv[1]
    
    if run_migrations(db_url):
        sys.exit(0)
    else:
        sys.exit(1)
