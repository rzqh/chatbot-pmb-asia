const { saveChatToDatabase } = require("../services/database");
const { Payload } = require("dialogflow-fulfillment");

async function infoRekomendasiAsiaIntent(agent) {
  try {
    agent.add("Kenapa memilih Institut Asia Malang? Berikut beberapa alasannya:");

    const richContent = [
      [
        {
          type: "image",
          rawUrl: "https://rzqhhh.sirv.com/Images/pmb-asia/banner5.jpg",
          accessibilityText: "Institut Asia Malang"
        }
      ],
      [
        {
          type: "info",
          title: "🏆 Akreditasi Unggul",
          subtitle: "Institut Asia Malang memiliki akreditasi yang sangat baik dan diakui secara nasional."
        },
        {
          type: "info",
          title: "💼 Kurikulum Berbasis Industri",
          subtitle: "Kurikulum disusun sesuai kebutuhan industri dan perkembangan teknologi terkini."
        },
        {
          type: "info",
          title: "🌏 Peluang Karir Global",
          subtitle: "Lulusan Institut Asia Malang memiliki peluang kerja di perusahaan nasional maupun internasional."
        },
        {
          type: "info",
          title: "🤝 Kemitraan Luas",
          subtitle: "Bekerja sama dengan banyak perusahaan dan institusi untuk magang dan penempatan kerja."
        },
        {
          type: "info",
          title: "🏫 Fasilitas Modern",
          subtitle: "Dilengkapi dengan laboratorium, ruang kelas interaktif, dan fasilitas penunjang lainnya."
        }
      ]
    ];

    agent.add(
      new Payload(
        "DIALOGFLOW_MESSENGER",
        { richContent },
        { sendAsMessage: true, rawPayload: true }
      )
    );

    await saveChatToDatabase(
      agent.session,
      agent.query,
      "rekomendasi_asia",
      "Alasan memilih Institut Asia Malang ditampilkan",
      "DIALOGFLOW_MESSENGER"
    );
  } catch (error) {
    console.error("Error in infoRekomendasiAsiaIntent:", error);
    agent.add("Maaf, terjadi kesalahan saat memuat informasi. Silakan coba lagi.");
  }
}

module.exports = infoRekomendasiAsiaIntent;