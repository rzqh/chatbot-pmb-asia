const {
  saveChatToDatabase,
  getUserName,
  getBiayaPendaftaran,
} = require("../services/database");
const { Payload } = require("dialogflow-fulfillment");

async function biayaPendaftaranIntent(agent) {
  const sessionId = agent.session;
  const query = agent.query || "";
  const intentName = "biaya_pendaftaran";

  let greeting = "";
  let biayaPendaftaran = [];

  try {
    const userName = await getUserName(sessionId);
    greeting =
      userName && userName !== "Sahabat Institut Asia"
        ? `Bapak/Ibu/Saudara ${userName}, berikut biaya pendaftaran yang tersedia di Institut Asia:`
        : "Berikut biaya pendaftaran yang tersedia di Institut Asia:";

    biayaPendaftaran = await getBiayaPendaftaran();

    if (biayaPendaftaran.length === 0) {
      agent.add("Maaf, belum ada data biaya pendaftaran yang tersedia.");
    } else {
      const richContent = biayaPendaftaran.map((item) => ({
        type: "accordion", // Use accordion type
        title: item.title,
        subtitle: "Ketuk untuk menampilkan biaya pendaftaran", // Static subtitle for all items
        text: [
          `${item.periode_satu || "Data tidak tersedia"}`,
          `${item.periode_dua || "Data tidak tersedia"}`,
          `${item.periode_tiga || "Data tidak tersedia"}`,
          `${item.periode_empat || "Data tidak tersedia"}`,
        ], // Use specific period data for multi-line text
      }));

      agent.add(
        new Payload(
          "DIALOGFLOW_MESSENGER",
          { richContent: [richContent] }, // Wrap in the required structure
          { sendAsMessage: true, rawPayload: true }
        )
      );
    }

    await saveChatToDatabase(
      sessionId,
      query,
      intentName,
      greeting,
      "DIALOGFLOW_MESSENGER"
    );
  } catch (error) {
    console.error("🔥 Error terjadi di biayaPendaftaranIntent:", error);
    agent.add("Maaf, terjadi kesalahan saat menampilkan informasi. Silakan coba lagi.");
  }
}

module.exports = biayaPendaftaranIntent;