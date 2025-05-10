const { getLokasiKampus, saveChatToDatabase } = require("../services/database");

async function infoLokasiKampusIntent(agent) {
  try {
    // Fetch lokasi kampus data from the database
    const lokasiKampus = await getLokasiKampus();

    let response;
    if (lokasiKampus.length === 0) {
      response = "Maaf, saat ini tidak ada informasi lokasi kampus yang tersedia.";
      agent.add(response);
    } else {
      response = "Berikut adalah informasi lokasi kampus yang tersedia:\n\n";
      lokasiKampus.forEach((item) => {
        response += `${item.title}\n`;
        response += `${item.subtitle}\n`;
        response += `Peta Lokasi: ${item.link_maps}\n\n`;
      });
      agent.add(response);
    }

    // Save the chat to the database
    await saveChatToDatabase(
      agent.session,
      agent.query,
      "info_lokasi_kampus",
      response, // Use the constructed response
      agent.originalRequest.source || "unknown"
    );
  } catch (error) {
    console.error("Error in infoLokasiKampusIntent:", error);
    agent.add("Maaf, ada kesalahan saat mengambil informasi lokasi kampus. Silakan coba lagi.");
  }
}

module.exports = infoLokasiKampusIntent;
