const bcrypt = require('bcrypt');
const { Pool } = require('pg');

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://admin:admin123@localhost:5432/appointment_db?schema=public'
  });

  try {
    const email = 'admin@example.com';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO "User" (email, password, "createdAt", "updatedAt") VALUES ($1, $2, NOW(), NOW()) RETURNING id, email',
      [email, hashedPassword]
    );

    console.log('✅ Admin user created successfully!');
    console.log(`📧 Email: ${result.rows[0].email}`);
    console.log(`🆔 ID: ${result.rows[0].id}`);
  } catch (error) {
    if (error.code === '23505') {
      console.log('ℹ️ Admin user already exists.');
    } else {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  } finally {
    await pool.end();
  }
}

main();
