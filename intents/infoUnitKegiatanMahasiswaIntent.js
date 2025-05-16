const { getUnitKegiatanMahasiswa, saveChatToDatabase } = require("../services/database");
const { Payload } = require("dialogflow-fulfillment");

async function infoUnitKegiatanMahasiswaIntent(agent) {
  try {
    const ukmData = await getUnitKegiatanMahasiswa();

    if (!ukmData || ukmData.length === 0) {
      agent.add("Maaf, saat ini tidak ada informasi Unit Kegiatan Mahasiswa yang tersedia.");
      return;
    }

    agent.add("Berikut adalah daftar Unit Kegiatan Mahasiswa di Institut Asia Malang:");

    // Kelompokkan UKM berdasarkan kategori
    const groupedUkm = ukmData.reduce((acc, curr) => {
      const kategori = curr.kategori || "Lainnya"; // Default kategori jika tidak ada
      if (!acc[kategori]) {
        acc[kategori] = [];
      }
      acc[kategori].push(curr);
      return acc;
    }, {});

    // Buat rich content untuk setiap kategori
    const richContent = Object.entries(groupedUkm).map(([kategori, items]) => ({
      type: "accordion",
      title: `Kategori: ${kategori}`,
      subtitle: `${items.length} UKM`,
      text: items.map(item => `- ${item.title}: ${item.subtitle || "Tidak ada deskripsi"}`).join('\n'),
    }));

    // Kirim rich content ke pengguna
    agent.add(
      new Payload(
        "DIALOGFLOW_MESSENGER",
        { richContent: [richContent] },
        { sendAsMessage: true, rawPayload: true }
      )
    );

    await saveChatToDatabase(
      agent.session,
      agent.query,
      "info_ukm", // Ganti dengan nama intent yang sesuai di Dialogflow
      "Informasi UKM ditampilkan",
      "DIALOGFLOW_MESSENGER"
    );
  } catch (error) {
    console.error("Error in infoUnitKegiatanMahasiswaIntent:", error);
    agent.add("Maaf, terjadi kesalahan saat memuat informasi UKM. Silakan coba lagi.");
  }
}

module.exports = infoUnitKegiatanMahasiswaIntent;