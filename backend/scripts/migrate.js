import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false,
  });

  try {
    console.log('📦 Starting database migration...\n');

    // Read schema.sql
    const schemaPath = path.join(__dirname, '../schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at ${schemaPath}`);
    }

    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Split and execute statements (handle multi-statement SQL)
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    let count = 0;
    for (const statement of statements) {
      try {
        await pool.query(statement);
        count++;
      } catch (error) {
        // Ignore errors for things that might already exist
        if (!error.message.includes('already exists') && !error.message.includes('UNIQUE')) {
          console.warn(`⚠️  Statement error: ${error.message.split('\n')[0]}`);
        }
      }
    }

    console.log(`✓ Executed ${count} database statements`);
    console.log('✓ Database schema initialized\n');

    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
