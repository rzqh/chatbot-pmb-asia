const { getFasilitas, saveChatToDatabase } = require("../services/database");
const { Payload } = require("dialogflow-fulfillment");
const nl2br = require("newline-to-br");

async function infoFasilitasIntent(agent) {
  try {
    const fasilitas = await getFasilitas();

    if (fasilitas.length === 0) {
      agent.add("Maaf, saat ini tidak ada informasi fasilitas yang tersedia.");
      return;
    }

    agent.add("Berikut adalah fasilitas yang tersedia di Institut Asia Malang:");

    // Group fasilitas by kategori
    const groupedFasilitas = fasilitas.reduce((acc, curr) => {
      if (!acc[curr.kategori]) {
        acc[curr.kategori] = [];
      }
      acc[curr.kategori].push(curr);
      return acc;
    }, {});

    // Create image and accordion rich content
    const imageContent = {
      type: "image",
      rawUrl: "https://s2asia.ac.id/wp-content/webp-express/webp-images/uploads/2023/02/DSC_0057-scaled.jpg.webp",
      accessibilityText: "Fasilitas Institut Asia Malang"
    };

    const accordionContent = Object.entries(groupedFasilitas).map(([kategori, items]) => ({
      type: "accordion",
      title: `🏫 Fasilitas ${kategori}`,
      subtitle: `${items.length} Fasilitas tersedia`,
      text: items.map(item => 
        nl2br(`${item.nama_fasilitas}\n${item.deskripsi}\n\n`)
      ).join('\n\n')
    }));

    agent.add(
      new Payload(
        "DIALOGFLOW_MESSENGER",
        { richContent: [[imageContent], accordionContent] },
        { sendAsMessage: true, rawPayload: true }
      )
    );

    await saveChatToDatabase(
      agent.session,
      agent.query,
      "fasilitas_asia", // Changed from "info_fasilitas" to match Dialogflow intent name
      "Facilities information displayed",
      "DIALOGFLOW_MESSENGER"
    );
  } catch (error) {
    console.error("Error in infoFasilitasIntent:", error);
    agent.add("Maaf, terjadi kesalahan saat memuat informasi fasilitas. Silakan coba lagi.");
  }
}

module.exports = infoFasilitasIntent;
