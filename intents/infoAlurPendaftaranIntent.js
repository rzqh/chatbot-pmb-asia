const { saveChatToDatabase, getAlurPendaftaran } = require("../services/database");
const { Payload } = require("dialogflow-fulfillment");

async function infoAlurPendaftaranIntent(agent) {
  try {
    const sessionId = agent.session;
    const query = agent.query || "";
    const intentName = "info_alur_pendaftaran";

    agent.add("Alur pendaftaran di Institut Asia Malang melibatkan beberapa langkah berikut:");

    const alurPendaftaran = await getAlurPendaftaran();
    if (!alurPendaftaran || alurPendaftaran.length === 0) {
      agent.add("Maaf, informasi alur pendaftaran belum tersedia.");
      return;
    }

    // Combine all rich responses into a single richContent array
    const richContent = [
      {
        type: "accordion",
        title: "1. Pendaftaran",
        subtitle: "Langkah pertama dalam proses pendaftaran",
        image: {
          src: {
            rawUrl: "https://example.com/path/to/pendaftaran.png", // Replace with a valid image URL
          },
        },
        text: [
          "- Mengisi formulir pendaftaran secara online melalui website resmi Institut Asia Malang ",
          "- Mendaftar secara offline dengan datang langsung ke kampus (Senin-Sabtu, pukul 09:00-17:00 WIB).",
        ].join("\n"),
      },
      {
        type: "accordion",
        title: "2. Penyerahan Berkas",
        subtitle: "Dokumen yang perlu diserahkan dan bisa menyusul",
        image: {
          src: {
            rawUrl: "https://example.com/path/to/berkas.png", // Replace with a valid image URL
          },
        },
        text: [
          "- Menyerahkan fotokopi ijazah terakhir atau Surat Keterangan Lulus tingkat SLTA.",
          "- Menyerahkan pas foto berwarna ukuran 3x4 sebanyak 4 lembar.",
        ].join("\n"),
      },
      {
        type: "accordion",
        title: "3. Tes Masuk (Khusus program studi IBM)",
        subtitle: "Tahapan tes masuk",
        text: [
          "- Tes File dan Administrasi.",
          "- Tes Kemampuan Akademik (TPA) dan Tes Kemampuan Bahasa Inggris (TPE).",
          "- Tes Wawancara.",
        ].join("\n"),
      },
      {
        type: "accordion",
        title: "4. Pengumuman Hasil",
        subtitle: "Menunggu hasil seleksi",
        image: {
          src: {
            rawUrl: "https://example.com/path/to/pengumuman.png", // Replace with a valid image URL
          },
        },
        text: ["- Menunggu pengumuman hasil seleksi."].join("\n"),
      },
      {
        type: "accordion",
        title: "5. Daftar Ulang/Registrasi",
        subtitle: "Langkah terakhir setelah diterima",
        image: {
          src: {
            rawUrl: "https://example.com/path/to/registrasi.png", // Replace with a valid image URL
          },
        },
        text: [
          "- Jika dinyatakan diterima, melakukan daftar ulang dengan membayar biaya yang telah ditentukan.",
        ].join("\n"),
      },
      {
        type: "divider",
      },      
      ...alurPendaftaran.map((item) => ({
        type: "button",
        text: "Ketuk untuk menuju pendaftaran online",
        link: item.url,
        icon: {
          type: "chevron_right",
          color: "#4CAF50",
        },
        style: "filled",
        color: "#4CAF50",
      })),
    ];

    // Send a single Payload response with all rich content
    agent.add(
      new Payload(
        "DIALOGFLOW_MESSENGER",
        { richContent: [richContent] },
        { sendAsMessage: true, rawPayload: true }
      )
    );

    await saveChatToDatabase(
      sessionId,
      query,
      intentName,
      "Rich content and detailed steps sent",
      "DIALOGFLOW_MESSENGER"
    );
  } catch (error) {
    console.error("Error in infoAlurPendaftaranIntent:", error);
    agent.add("Maaf, terjadi kesalahan saat menampilkan informasi alur pendaftaran. Silakan coba lagi.");
  }
}

module.exports = infoAlurPendaftaranIntent;
