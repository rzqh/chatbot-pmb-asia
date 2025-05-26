const { info } = require("actions-on-google/dist/common");
const { pool, initializeDatabase } = require("../src/config/database");

// Inisialisasi status database
let isInitialized = false;

// Fungsi untuk memastikan inisialisasi
async function ensureInitialized() {
  if (!isInitialized) {
    try {
      await initializeDatabase();
      isInitialized = true;
      console.log("🛠️ Database service ready");
    } catch (error) {
      console.error("❌ Database service initialization failed:", error);
      throw error;
    }
  }
}

// Mapping untuk tampilan intent
const INTENT_DISPLAY_NAMES = {
  get_user_name: "Perkenalan",
  jalur_masuk: "Jalur Masuk",
  biaya_kuliah: "Biaya Kuliah",
  beasiswa: "Info Beasiswa",
  registrasi: "Cara Registrasi",
  faq: "Pertanyaan Umum",
  default: "Layanan Lainnya",
  biaya_pendaftaran: "Biaya pendaftaran",
  info_lokasi_kampus: "Lokasi Institut Asia",
  info_program_studi_sarjana: "Program studi",
  info_jadwal_pendaftaran: "Jadwal pendaftaran",
  info_alur_pendaftaran: "Syarat dan alur pendaftaran",
};

// ✅ Fungsi untuk memastikan user sudah ada
async function ensureUserExists(sessionId, defaultName = "Guest") {
  await ensureInitialized();

  try {
    const userCheck = await pool.query(
      `SELECT 1 FROM users WHERE session_id = $1`,
      [sessionId]
    );

    if (userCheck.rowCount === 0) {
      await pool.query(
        `INSERT INTO users (session_id, name, created_at, last_active)
         VALUES ($1, $2, NOW(), NOW())`,
        [sessionId, defaultName]
      );
      console.log(`✅ New session saved in users: ${sessionId}`);
    }
  } catch (error) {
    console.error("❌ Error ensuring user exists:", error.message);
    throw error;
  }
}

// Fungsi simpan nama user
async function saveUserName(sessionId, name) {
  await ensureInitialized();

  try {
    const result = await pool.query(
      `INSERT INTO users (session_id, name, created_at, last_active)
       VALUES ($1, $2, NOW(), NOW())
       ON CONFLICT (session_id) 
       DO UPDATE SET 
         name = $2,
         last_active = NOW()
       RETURNING *`,
      [sessionId, name]
    );

    console.log(`👤 User saved: ${sessionId}`);
    return result.rows[0];
  } catch (error) {
    console.error("❌ Error saving user:", error.message);
    throw error;
  }
}

// Fungsi ambil nama user
async function getUserName(sessionId) {
  await ensureInitialized();

  try {
    const result = await pool.query(
      `SELECT name FROM users WHERE session_id = $1`,
      [sessionId]
    );
    return result.rows[0]?.name;
  } catch (error) {
    console.error("❌ Error getting user:", error.message);
    return null;
  }
}

// ✅ Fungsi simpan chat ke database
async function saveChatToDatabase(
  sessionId,
  query,
  intent,
  response,
  platform = "DIALOGFLOW"
) {
  await ensureInitialized();

  try {
    // 1️⃣ Pastikan user sudah ada (kalau belum, insert)
    await ensureUserExists(sessionId);

    // 2️⃣ Update last_active di tabel users
    await pool.query(
      `UPDATE users SET last_active = NOW() WHERE session_id = $1`,
      [sessionId]
    );

    // 3️⃣ Simpan chat ke database
    const result = await pool.query(
      `INSERT INTO chats (session_id, query, intent, response, platform, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [sessionId, query, intent, response, platform]
    );

    console.log(`💬 Chat saved - Session: ${sessionId}`, {
      intent: intent,
      query: query.substring(0, 50) + (query.length > 50 ? "..." : ""), // Log sebagian query
    });

    return result.rows[0];
  } catch (error) {
    console.error("❌ Failed to save chat:", {
      sessionId: sessionId,
      error: error.message,
      query: query,
      intent: intent,
    });
    throw error;
  }
}

// Fungsi ambil riwayat chat
async function getChatHistory(sessionId, limit = 5) {
  await ensureInitialized();

  try {
    const result = await pool.query(
      `SELECT query, intent, response, created_at
       FROM chats
       WHERE session_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [sessionId, limit]
    );
    return result.rows;
  } catch (error) {
    console.error("❌ Error getting history:", error.message);
    return [];
  }
}

// Fungsi ambil intent paling sering ditanya
async function getMostAskedIntents(limit = 5) {
  await ensureInitialized();

  try {
    const result = await pool.query(
      `SELECT intent, COUNT(*) as count
       FROM chats
       WHERE intent NOT IN ('Default Welcome Intent', 'get_user_name', 'faq')
       GROUP BY intent
       ORDER BY count DESC
       LIMIT $1`,
      [limit]
    );

    return result.rows.map((row) => ({
      intent: row.intent,
      display_name:
        INTENT_DISPLAY_NAMES[row.intent] || INTENT_DISPLAY_NAMES.default,
      count: row.count,
    }));
  } catch (error) {
    console.error("❌ Error getting popular intents:", error.message);
    return [];
  }
}

//
// 🚀 FUNGSI BARU: Ambil response dari tabel intent_responses
async function getIntentResponses(intentName) {
  await ensureInitialized();

  try {
    const query = `
      SELECT title, subtitle 
      FROM intent_responses 
      WHERE intent_name = $1 AND active = TRUE
      ORDER BY "order" ASC
    `;
    const result = await pool.query(query, [intentName]);

    // Langsung return array of rows (object)
    return result.rows; // ✅ sekarang hasilnya array seperti yang dibutuhkan agent
  } catch (error) {
    console.error("❌ Error fetching intent responses:", error.message);
    return []; // kembalikan array kosong kalau error
  }
}

async function getReasons() {
  const client = await pool.connect(); // ✅ Ini yang benar di PostgreSQL
  try {
    const res = await client.query(
      "SELECT title, subtitle FROM reasons ORDER BY id ASC"
    );
    return res.rows;
  } finally {
    client.release(); // ✅ Selalu release connection
  }
}

async function getJadwalPendaftaran() {
  const client = await pool.connect();
  try {
    const res = await client.query(
      'SELECT title, subtitle FROM jadwal_pendaftaran WHERE active = true ORDER BY "order" ASC'
    );
    return res.rows;
  } finally {
    client.release();
  }
}

async function getUnitKegiatanMahasiswa() {
  try {
    const result = await pool.query(
      `SELECT id, kategori, title, subtitle, "order", active
       FROM unit_kegiatan_mahasiswa
       WHERE active = true
       ORDER BY kategori ASC`
    );
    return result.rows;
  } catch (error) {
    console.error("❌ Error getting Unit Kegiatan Mahasiswa:", error.message);
    return [];
  }
}


async function getAlurPendaftaran() {
  const client = await pool.connect();
  try {
    const res = await client.query(
      'SELECT * FROM alur_pendaftaran WHERE active = true ORDER BY "order" ASC'
    );
    return res.rows;
  } finally {
    client.release();
  }
}

async function getBiayaPendaftaran() {
  const result = await pool.query(
    'SELECT title, periode_satu, periode_dua, periode_tiga, periode_empat FROM biaya_pendaftaran WHERE active = true ORDER BY "order"'
  );
  return result.rows;
}

async function getProgramStudiSarjana() {
  const result = await pool.query("SELECT * FROM program_studi_sarjana");
  return result.rows;
}

// Fungsi untuk mengambil data program studi magister
async function getProgramStudiMagister() {
  const result = await pool.query("SELECT * FROM program_studi_magister");
  return result.rows;
}

async function getLokasiKampus() {
  const result = await pool.query("SELECT * FROM lokasi_kampus");
  return result.rows;
}

async function getFasilitas() {
  const result = await pool.query(
    `SELECT kategori, nama_fasilitas, deskripsi 
     FROM fasilitas 
     WHERE active = true 
     ORDER BY kategori, nama_fasilitas`
  );
  return result.rows;
}

async function getBeasiswa() {
  const result = await pool.query(
    `SELECT title, subtitle 
     FROM beasiswa 
     WHERE active = true 
     ORDER BY "order" ASC`
  );
  return result.rows;
}

async function getSyaratPendaftaran() {
  const result = await pool.query(
    `SELECT title 
     FROM syarat_pendaftaran 
     WHERE active = true 
     ORDER BY "order" ASC`
  );
  return result.rows;
}

module.exports = {
  // User functions
  saveUserName,
  getUserName,

  // Chat functions
  saveChatToDatabase,
  getMostAskedIntents,
  getChatHistory,
  getReasons,
  getJadwalPendaftaran,
  getBiayaPendaftaran,
  getProgramStudiSarjana,
  getProgramStudiMagister,  
  getIntentResponses,
  getLokasiKampus,
  getAlurPendaftaran,
  getFasilitas,
  getBeasiswa,
  getSyaratPendaftaran,
  getUnitKegiatanMahasiswa,
  // Initialization
  ensureInitialized,
};
