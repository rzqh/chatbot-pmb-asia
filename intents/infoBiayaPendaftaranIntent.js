const {
  saveChatToDatabase,
  getUserName,
  getBiayaPendaftaran,
} = require("../services/database");
const { Payload } = require("dialogflow-fulfillment");
const newlineToBr = require("newline-to-br");

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

    // Tambahkan greeting sebagai respons pertama
    agent.add(greeting);

    biayaPendaftaran = await getBiayaPendaftaran();

    if (biayaPendaftaran.length === 0) {
      agent.add("Maaf, belum ada data biaya pendaftaran yang tersedia.");
    } else {
      const richContent = biayaPendaftaran.map((item) => ({
        type: "accordion",
        title: item.title,
        subtitle: "Ketuk untuk menampilkan biaya pendaftaran", 
        text: [
          newlineToBr(`- ${item.periode_satu?.replace(/,$/, "").trim() || "Data tidak tersedia"}`),
          newlineToBr(`\n - ${item.periode_dua?.replace(/,$/, "").trim() || "Data tidak tersedia"}`),
          newlineToBr(`\n - ${item.periode_tiga?.replace(/,$/, "").trim() || "Data tidak tersedia"}`),
          newlineToBr(`\n - ${item.periode_empat?.replace(/,$/, "").trim() || "Data tidak tersedia"}`),
        ],
      }));

      agent.add(
        new Payload(
          "DIALOGFLOW_MESSENGER",
          { richContent: [richContent] }, 
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