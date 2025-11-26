#!/usr/bin/env node

/**
 * Script to create the first admin user
 * Run with: node create-admin.js
 */

const readline = require('readline');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('\n🔐 Create Admin User\n');

  const email = await question('Email: ');
  const password = await question('Password: ');

  if (!email || !password) {
    console.error('❌ Email and password are required');
    process.exit(1);
  }

  if (password.length < 6) {
    console.error('❌ Password must be at least 6 characters');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://admin:admin123@localhost:5432/appointment_db?schema=public'
  });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO "User" (email, password, "createdAt", "updatedAt") VALUES ($1, $2, NOW(), NOW()) RETURNING id, email',
      [email, hashedPassword]
    );

    console.log('\n✅ Admin user created successfully!');
    console.log(`📧 Email: ${result.rows[0].email}`);
    console.log(`🆔 ID: ${result.rows[0].id}\n`);
  } catch (error) {
    if (error.code === '23505') {
      console.error('\n❌ Error: User with this email already exists\n');
    } else {
      console.error('\n❌ Error:', error.message, '\n');
    }
    process.exit(1);
  } finally {
    await pool.end();
    rl.close();
  }
}

main();
