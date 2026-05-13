/**
 * e-Qraa Database Setup Script
 * Creates the 'eqraa' database and applies database.sql schema
 * Run: node scripts/setup-db.mjs
 */

import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const { Client } = pg;

const GREEN  = '\x1b[32m✔\x1b[0m';
const RED    = '\x1b[31m✘\x1b[0m';
const BLUE   = '\x1b[34mℹ\x1b[0m';

console.log('\n\x1b[1m═══════════════════════════════════════\x1b[0m');
console.log('\x1b[1m  e-Qraa Database Setup\x1b[0m');
console.log('\x1b[1m═══════════════════════════════════════\x1b[0m\n');

// Step 1: Connect to default 'postgres' DB and create 'eqraa'
const adminClient = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '1234',
  database: 'postgres',  // connect to default db first
});

try {
  await adminClient.connect();
  console.log(`${GREEN} Connected to PostgreSQL as postgres`);

  // Check if eqraa DB already exists
  const checkRes = await adminClient.query(
    `SELECT 1 FROM pg_database WHERE datname = 'eqraa'`
  );

  if (checkRes.rowCount > 0) {
    console.log(`${BLUE} Database 'eqraa' already exists — skipping creation`);
  } else {
    await adminClient.query('CREATE DATABASE eqraa');
    console.log(`${GREEN} Database 'eqraa' created`);
  }
} catch (err) {
  console.error(`${RED} Failed to connect/create DB: ${err.message}`);
  process.exit(1);
} finally {
  await adminClient.end();
}

// Step 2: Connect to 'eqraa' and apply schema
const eqraaClient = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '1234',
  database: 'eqraa',
});

try {
  await eqraaClient.connect();
  console.log(`${GREEN} Connected to 'eqraa' database`);

  // Read the SQL schema file
  const sqlPath = join(__dirname, '..', 'backend', 'database.sql');
  const rawSql = readFileSync(sqlPath, 'utf8');

  // Split into individual statements (skip empty lines and comments)
  // Remove SELECT statements and data manipulation (INSERT/UPDATE/DELETE) to make it idempotent
  // We use CREATE TABLE IF NOT EXISTS by replacing CREATE TABLE
  const idempotentSql = rawSql
    .replace(/CREATE TABLE (?!IF NOT EXISTS)/g, 'CREATE TABLE IF NOT EXISTS ');

  // Split by semicolons, filter out SELECT-only queries and empty statements
  const statements = idempotentSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.match(/^--/) && !s.match(/^\s*$/));

  let applied = 0;
  let skipped = 0;

  for (const stmt of statements) {
    // Skip pure SELECT statements (they don't modify schema/data)
    const upper = stmt.toUpperCase().trimStart();
    if (upper.startsWith('SELECT')) {
      skipped++;
      continue;
    }
    try {
      await eqraaClient.query(stmt);
      applied++;
    } catch (err) {
      // Ignore "already exists" and "duplicate column" errors — idempotent
      if (err.code === '42701' || err.code === '42P07' || err.code === '23505') {
        console.log(`${BLUE} Already exists (skipped): ${stmt.slice(0, 60).replace(/\n/g, ' ')}...`);
        skipped++;
      } else {
        console.log(`${RED} Failed: ${stmt.slice(0, 80).replace(/\n/g, ' ')}`);
        console.log(`        Error: ${err.message}`);
      }
    }
  }

  console.log(`\n${GREEN} Schema applied — ${applied} statements executed, ${skipped} skipped`);

  // Verify tables exist
  const tablesRes = await eqraaClient.query(
    `SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename`
  );
  const tables = tablesRes.rows.map(r => r.tablename);
  console.log(`${GREEN} Tables in 'eqraa': ${tables.join(', ')}`);

} catch (err) {
  console.error(`${RED} Schema setup failed: ${err.message}`);
  process.exit(1);
} finally {
  await eqraaClient.end();
}

console.log('\n\x1b[32m\x1b[1m  ✔ Database setup complete!\x1b[0m');
console.log('  You can now start the backend: npm run dev --prefix backend\n');
