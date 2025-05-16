const { getSyaratPendaftaran, saveChatToDatabase } = require("../services/database");
const { Payload } = require("dialogflow-fulfillment");
const nl2br = require("newline-to-br");

async function infoSyaratPendaftaranIntent(agent) {
  try {
    const syarat = await getSyaratPendaftaran();

    if (syarat.length === 0) {
      agent.add("Maaf, saat ini tidak ada informasi syarat pendaftaran yang tersedia.");
    } else {
      agent.add("Berikut syarat pendaftaran mahasiswa baru di Institut Asia Malang:");

      const richContent = [{
        type: "accordion",
        title: "Syarat pendaftaran",
        subtitle: "Nb: Biaya Daftar Ulang termasuk DPP Angsuran 1, PKKMB, Almamater Jacket, T-shirt dan Guidebook",
        text: nl2br(syarat.map(item => `- ${item.title.trim()}`).join('\n'))
      }];

      agent.add(
        new Payload(
          "DIALOGFLOW_MESSENGER",
          { richContent: [richContent] },
          { sendAsMessage: true, rawPayload: true }
        )
      );
      agent.add("Bagaimana? Mudah bukan? Silahkan jika kamu tertarik untuk bertanya tentang alur/biaya pendaftaran 😊");
    }

    await saveChatToDatabase(
      agent.session,
      agent.query,
      "syarat_pendaftaran",
      "Syarat pendaftaran information displayed",
      "DIALOGFLOW_MESSENGER"
    );
  } catch (error) {
    console.error("Error in infoSyaratPendaftaranIntent:", error);
    agent.add("Maaf, ada kesalahan saat mengambil informasi syarat pendaftaran. Silakan coba lagi.");
  }
}

module.exports = infoSyaratPendaftaranIntent;
