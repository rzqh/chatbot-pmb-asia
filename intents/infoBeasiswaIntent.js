const { getBeasiswa, saveChatToDatabase } = require("../services/database");
const { Payload } = require("dialogflow-fulfillment");

async function infoBeasiswaIntent(agent) {
  try {
    const beasiswa = await getBeasiswa();

    const imageContent= {
      type: "image",
      rawUrl: "https://www.asia.ac.id/images/banner4.jpg",
      accessibilityText: "Beasiswa Asia Malang"
    }
    if (beasiswa.length === 0) {
      agent.add("Maaf, saat ini tidak ada informasi beasiswa yang tersedia.");
    } else {
      agent.add("Berikut terdapat beberapa beasiswa atau peringanan biaya yang dapat digunakan:");

      const richContent = beasiswa.map((item) => ({
        type: "info",
        title: item.title,
        subtitle: item.subtitle,
      }));

      agent.add(
        new Payload(
          "DIALOGFLOW_MESSENGER",
          { richContent: [[imageContent], richContent] },
          { sendAsMessage: true, rawPayload: true }
        )
      );

      agent.add("Untuk klaim beasiswa dapat dilakukan saat melakukan proses pendaftaran di kampus yaa.")
      agent.add("Kami tunggu kedatanganmu! 👋");
    }

    await saveChatToDatabase(
      agent.session,
      agent.query,
      "beasiswa", // Changed from "info_beasiswa" to match Dialogflow intent name
      "Beasiswa information displayed",
      "DIALOGFLOW_MESSENGER"
    );
  } catch (error) {
    console.error("Error in infoBeasiswaIntent:", error);
    agent.add("Maaf, ada kesalahan saat mengambil informasi beasiswa. Silakan coba lagi.");
  }
}

module.exports = infoBeasiswaIntent;
