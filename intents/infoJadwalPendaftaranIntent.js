const { getJadwalPendaftaran, saveChatToDatabase } = require("../services/database");

async function infoJadwalPendaftaranIntent(agent) {
  try {
    // Fetch registration schedule from the database
    const jadwal = await getJadwalPendaftaran();

    let response;
    if (jadwal.length === 0) {
      response = "Maaf, saat ini tidak ada jadwal pendaftaran yang tersedia.";
      agent.add(response);
    } else {
      response = "Berikut adalah jadwal pendaftaran yang tersedia:\n";
      jadwal.forEach((item, index) => {
        response += `${index + 1}. ${item.title}: ${item.subtitle}\n`;
      });
      agent.add(response);
    }

    // Save the chat to the database
    await saveChatToDatabase(
      agent.session,
      agent.query,
      "info_jadwal_pendaftaran",
      response, // Use the constructed response
      agent.originalRequest.source || "unknown"
    );
  } catch (error) {
    console.error("Error in infoJadwalPendaftaranIntent:", error);
    agent.add("Maaf, ada kesalahan saat mengambil jadwal pendaftaran. Silakan coba lagi.");
  }
}

module.exports = infoJadwalPendaftaranIntent;
