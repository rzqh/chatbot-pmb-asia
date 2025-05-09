const path = require("path");
const fs = require("fs");

class Migrator {
  constructor(pool) {
    this.pool = pool;
    this.migrationsTable = "database_migrations";
    this.migrationsDir = path.join(__dirname, "migrations");
  }

  async init() {
    try {
      console.log("Starting database migrations...");
      await this.createMigrationsTable();
      await this.runMigrations();
      console.log("Database migrations completed successfully");
      return true;
    } catch (error) {
      console.error("Migration initialization failed:", error);
      throw error;
    }
  }

  async createMigrationsTable() {
    try {
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS ${this.migrationsTable} (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL,
          executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log("Migrations table verified/created");
    } catch (error) {
      console.error("Error creating migrations table:", error);
      throw error;
    }
  }

  async getExecutedMigrations() {
    try {
      const res = await this.pool.query(
        `SELECT name FROM ${this.migrationsTable} ORDER BY executed_at DESC`
      );
      return res.rows.map((row) => row.name);
    } catch (error) {
      console.error("Error fetching executed migrations:", error);
      throw error;
    }
  }

  async getMigrationFiles() {
    try {
      if (!fs.existsSync(this.migrationsDir)) {
        console.warn("Migrations directory not found, creating...");
        fs.mkdirSync(this.migrationsDir, { recursive: true });
        return [];
      }

      return fs
        .readdirSync(this.migrationsDir)
        .filter((file) => file.endsWith(".sql"))
        .sort((a, b) => {
          // Urutkan berdasarkan nama file (0001-, 0002-, dst)
          const numA = parseInt(a.split("-")[0]);
          const numB = parseInt(b.split("-")[0]);
          return numA - numB;
        });
    } catch (error) {
      console.error("Error reading migration files:", error);
      throw error;
    }
  }

  async runMigration(file) {
    const filePath = path.join(this.migrationsDir, file);
    try {
      const sql = fs.readFileSync(filePath, "utf8");

      await this.pool.query("BEGIN");
      console.log(`Executing migration: ${file}`);

      // Eksekusi setiap pernyataan SQL secara terpisah
      const statements = sql.split(";").filter((s) => s.trim().length > 0);

      for (const statement of statements) {
        await this.pool.query(statement);
      }

      await this.pool.query(
        `INSERT INTO ${this.migrationsTable} (name) VALUES ($1)`,
        [file]
      );

      await this.pool.query("COMMIT");
      console.log(`Successfully applied migration: ${file}`);
      return true;
    } catch (error) {
      await this.pool.query("ROLLBACK");
      console.error(`Migration failed: ${file}`, error);
      throw error;
    }
  }

  async runMigrations() {
    try {
      const executed = await this.getExecutedMigrations();
      const files = await this.getMigrationFiles();

      const pending = files.filter((file) => !executed.includes(file));

      if (pending.length === 0) {
        console.log("No new migrations to execute");
        return [];
      }

      console.log(`Found ${pending.length} new migration(s) to execute`);

      const results = [];
      for (const file of pending) {
        const result = await this.runMigration(file);
        results.push({ file, success: result });
      }

      console.log(`Completed ${pending.length} migration(s)`);
      return results;
    } catch (error) {
      console.error("Error running migrations:", error);
      throw error;
    }
  }
}

module.exports = (pool) => new Migrator(pool);
