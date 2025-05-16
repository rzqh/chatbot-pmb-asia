const { getJadwalPendaftaran, saveChatToDatabase } = require("../services/database");
const { Payload } = require("dialogflow-fulfillment");

async function infoJadwalPendaftaranIntent(agent) {
  try {
    const jadwal = await getJadwalPendaftaran();

    if (jadwal.length === 0) {
      agent.add("Maaf, saat ini tidak ada jadwal pendaftaran yang tersedia.");
    } else {
      agent.add("Berikut informasi jadwal pendaftaran di Institut Asia Malang. 📋");
      
      // Map clock emojis to periods
      const clockEmojis = {
        "Periode 1": "🕐",
        "Periode 2": "🕑",
        "Periode 3": "🕒",
        "Periode 4": "🕓"
      };

      const richContent = jadwal.map((item) => ({
        type: "info",
        title: `${clockEmojis[item.title] || ''} ${item.title}`,
        subtitle: `📆 ${item.subtitle}`,
      }));

      agent.add(new Payload("DIALOGFLOW_MESSENGER", { richContent: [richContent] }, { sendAsMessage: true, rawPayload: true }));
    }

    await saveChatToDatabase(
      agent.session,
      agent.query,
      "info_jadwal_pendaftaran",
      "Rich content sent",
      "DIALOGFLOW_MESSENGER"
    );
  } catch (error) {
    console.error("Error in infoJadwalPendaftaranIntent:", error);
    agent.add("Maaf, ada kesalahan saat mengambil jadwal pendaftaran. Silakan coba lagi.");
  }
}

module.exports = infoJadwalPendaftaranIntent;
