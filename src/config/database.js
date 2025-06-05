const { Pool } = require("pg");
const path = require("path");
const fs = require("fs");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: {
    rejectUnauthorized: false, 
  },
};

const pool = new Pool(dbConfig);

// Fungsi untuk menjalankan migrasi
async function runMigrations() {
  const migrationsDir = path.join(__dirname, "../database/migrations");
  const migrationsTable = "database_migrations";

  try {
    // 1. Buat tabel migrasi jika belum ada
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${migrationsTable} (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Dapatkan migrasi yang sudah dijalankan
    const executed = await pool
      .query(`SELECT name FROM ${migrationsTable} ORDER BY executed_at DESC`)
      .then((res) => res.rows.map((row) => row.name));

    // 3. Dapatkan file migrasi
    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    // 4. Jalankan migrasi yang belum dijalankan
    for (const file of files) {
      if (!executed.includes(file)) {
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, "utf8");

        await pool.query("BEGIN");
        try {
          // Eksekusi setiap statement secara terpisah
          const statements = sql
            .split(/;\s*\n/)
            .filter((s) => s.trim().length > 0);
          for (const statement of statements) {
            if (statement.trim()) {
              await pool.query(statement);
            }
          }

          await pool.query(
            `INSERT INTO ${migrationsTable} (name) VALUES ($1)`,
            [file]
          );
          await pool.query("COMMIT");
          console.log(`✅ Migration applied: ${file}`);
        } catch (err) {
          await pool.query("ROLLBACK");
          console.error(`❌ Failed to apply migration ${file}:`, err.message);
          throw err;
        }
      }
    }
  } catch (error) {
    console.error("🛑 Migration failed:", error);
    throw error;
  }
}

// Fungsi inisialisasi database
async function initializeDatabase() {
  try {
    // Test koneksi
    await pool.query("SELECT NOW()");
    console.log("🔌 Database connected successfully");

    // Jalankan migrasi
    await runMigrations();

    return pool;
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}

// Handle kesalahan koneksi
pool.on("error", (err) => {
  console.error("💥 Unexpected database error:", err);
  process.exit(-1);
});

module.exports = {
  pool,
  initializeDatabase,
  runMigrations,
};
