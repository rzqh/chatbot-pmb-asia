const { saveChatToDatabase, getAlurPendaftaran } = require("../services/database");
const { Payload } = require("dialogflow-fulfillment");
const newlineToBr = require("newline-to-br");

async function infoAlurPendaftaranIntent(agent) {
  try {
    const sessionId = agent.session;
    const query = agent.query || "";
    
    agent.add("Berikut alur pendaftaran di Institut Asia Malang:");

    const alurPendaftaran = await getAlurPendaftaran();
    if (!alurPendaftaran || alurPendaftaran.length === 0) {
      agent.add("Maaf, informasi alur pendaftaran belum tersedia.");
      return;
    }

    const richContent = [
      {
        type: "accordion",
        title: "1. Pendaftaran",
        subtitle: "Langkah pertama dalam proses pendaftaran",
        image: {
          src: {
            rawUrl: "",
          },
        },
        text: newlineToBr(`- Mengisi formulir pendaftaran secara online melalui website resmi Institut Asia Malang
                - Mendaftar secara offline dengan datang langsung ke kampus (Senin-Sabtu, pukul 09:00-17:00 WIB).`),
      },
      {
        type: "accordion",
        title: "2. Penyerahan Berkas",
        subtitle: "Dokumen yang perlu diserahkan dan bisa menyusul",
        image: {
          src: {
            rawUrl: "",
          },
        },
        text: newlineToBr(`- Menyerahkan fotokopi ijazah terakhir atau Surat Keterangan Lulus tingkat SLTA.
                - Menyerahkan pas-foto berwarna ukuran 3x4 sebanyak 4 lembar.`),
      },      
      {
        type: "accordion",
        title: "3. Pengumuman Penerimaan",
        subtitle: "Menunggu hasil penerimaan",
        image: {
          src: {
            rawUrl: "",
          },
        },
        text: newlineToBr(`- Menunggu pengumuman hasil seleksi.`),
      },
      {
        type: "accordion",
        title: "4. Daftar Ulang/Registrasi",
        subtitle: "Langkah terakhir setelah diterima",
        image: {
          src: {
            rawUrl: "",
          },
        },
        text: newlineToBr(`- Jika dinyatakan diterima, melakukan daftar ulang dengan membayar biaya yang telah ditentukan.`),
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

    agent.add(
      new Payload(agent.UNSPECIFIED, {
        richContent: [richContent],
      }, { sendAsMessage: true, rawPayload: true })
    );

  } catch (error) {
    console.error("Error in infoAlurPendaftaranIntent:", error);
    agent.add("Maaf, terjadi kesalahan saat memuat informasi alur pendaftaran.");
  }
}

module.exports = infoAlurPendaftaranIntent;
