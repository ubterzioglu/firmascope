-- Check existing tables and columns
-- Run this in Supabase SQL Editor to verify schema

-- Check profiles table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';

-- Check companies table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'companies';

-- Check contacts table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'contacts';

-- Check projects table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'projects';

-- Check activities table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'activities';
