const { saveChatToDatabase } = require("../services/database");

async function fallbackIntent(agent) {
  const response =
    "Mohon maaf, Asista belum memahami pertanyaan Anda. Silakan coba dengan kalimat lain. ☺️🙏";
  agent.add(response);

  // Simpan interaksi fallback ke database
  try {
    await saveChatToDatabase(
      agent.session,
      agent.query,
      "Default Fallback Intent",
      response,
      agent.originalRequest?.source || "unknown"
    );
  } catch (error) {
    // Logging error, tapi tidak perlu mengganggu user
    console.error("Error saving fallback chat:", error);
  }
}

module.exports = fallbackIntent;
