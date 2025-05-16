const { getLokasiKampus, saveChatToDatabase } = require("../services/database");
const { Payload } = require("dialogflow-fulfillment");

async function infoLokasiKampusIntent(agent) {
  try {
    const lokasiKampusData = await getLokasiKampus();

    if (!lokasiKampusData || lokasiKampusData.length === 0) {
      agent.add("Maaf, saat ini tidak ada informasi lokasi kampus yang tersedia.");
    } else {
      agent.add("Berikut lokasi Institut Asia Malang. Ketuk pin dibawah untuk mengalihkan ke Google Maps 🗺️");

      const locationContent = lokasiKampusData.map((item) => ({
        type: "info",
        title: item.title,
        subtitle: item.subtitle,
        image: {
          src: {
            rawUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
          },
        },
        actionLink: item.link_maps,
      }));

      agent.add(
        new Payload(
          "DIALOGFLOW_MESSENGER",
          { richContent: [locationContent] },
          { sendAsMessage: true, rawPayload: true }
        )
      );
    }

    await saveChatToDatabase(
      agent.session,
      agent.query,
      "info_lokasi_kampus",
      "Rich content sent",
      "DIALOGFLOW_MESSENGER"
    );
  } catch (error) {
    console.error("Error in infoLokasiKampusIntent:", error);
    agent.add("Maaf, ada kesalahan saat mengambil informasi lokasi kampus. Silakan coba lagi.");
  }
}

module.exports = infoLokasiKampusIntent;
