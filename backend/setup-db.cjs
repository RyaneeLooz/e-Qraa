/**
 * e-Qraa Database Setup Script (CJS)
 * Run from project root: node backend/setup-db.cjs
 */

'use strict';
const { Client } = require('pg');
const { readFileSync, existsSync } = require('fs');
const { join } = require('path');

const GREEN = '\x1b[32m✔\x1b[0m';
const RED   = '\x1b[31m✘\x1b[0m';
const BLUE  = '\x1b[34mℹ\x1b[0m';

console.log('\n\x1b[1m═══════════════════════════════════════\x1b[0m');
console.log('\x1b[1m  e-Qraa Database Setup\x1b[0m');
console.log('\x1b[1m═══════════════════════════════════════\x1b[0m\n');

async function main() {
  // Load connection details dynamically from .env
  let dbUrl = 'postgres://postgres:1234@localhost:5432/eqraa';
  const envPath = join(__dirname, '.env');
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf8');
    const match = envContent.match(/DATABASE_URL\s*=\s*(.*)/);
    if (match && match[1]) {
      dbUrl = match[1].trim().replace(/["']/g, ''); // strip any surrounding quotes
    }
  }

  // Derive default postgres admin URL to create database safely
  const adminDbUrl = dbUrl.replace(/\/[^/]*$/, '/postgres');

  // Step 1: Create the 'eqraa' database
  const adminClient = new Client({ connectionString: adminDbUrl });

  try {
    await adminClient.connect();
    console.log(`${GREEN} Connected to PostgreSQL server`);

    const { rowCount } = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = 'eqraa'`
    );
    if (rowCount > 0) {
      console.log(`${BLUE} Database 'eqraa' already exists — skipping creation`);
    } else {
      await adminClient.query('CREATE DATABASE eqraa');
      console.log(`${GREEN} Database 'eqraa' created`);
    }
  } finally {
    await adminClient.end();
  }

  // Step 2: Apply schema to 'eqraa'
  const eqraaClient = new Client({ connectionString: dbUrl });

  try {
    await eqraaClient.connect();
    console.log(`${GREEN} Connected to 'eqraa' database`);

    const sqlPath = join(__dirname, 'database.sql');
    const rawSql = readFileSync(sqlPath, 'utf8');

    // Remove SQL comments
    const noCommentsSql = rawSql
      .replace(/--.*$/gm, '') // remove single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, ''); // remove multi-line comments

    // Make CREATE TABLE idempotent
    const idempotentSql = noCommentsSql.replace(
      /CREATE TABLE (?!IF NOT EXISTS)/g,
      'CREATE TABLE IF NOT EXISTS '
    );

    const statements = idempotentSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 2);

    let applied = 0, skipped = 0;

    for (const stmt of statements) {
      if (stmt.toUpperCase().trimStart().startsWith('SELECT')) {
        skipped++; continue;
      }
      try {
        await eqraaClient.query(stmt);
        applied++;
      } catch (err) {
        // 42701 = column already exists, 42P07 = table already exists, 23505 = unique violation
        if (['42701','42P07','23505'].includes(err.code)) {
          skipped++;
        } else {
          console.log(`${RED} Stmt failed: ${stmt.slice(0,80).replace(/\n/g,' ')}`);
          console.log(`      → ${err.message}`);
        }
      }
    }

    console.log(`${GREEN} Schema done — ${applied} executed, ${skipped} skipped`);

    const { rows } = await eqraaClient.query(
      `SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename`
    );
    console.log(`${GREEN} Tables: ${rows.map(r => r.tablename).join(', ')}`);

  } finally {
    await eqraaClient.end();
  }

  console.log('\n\x1b[32m\x1b[1m  ✔ Database ready!\x1b[0m');
  console.log('  Start the servers: npm run dev (from project root)\n');
}

main().catch(err => {
  console.error(`${RED} Fatal: ${err.message}`);
  console.error(err);
  process.exit(1);
});
