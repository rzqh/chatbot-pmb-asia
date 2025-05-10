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
    let biayaPendaftaran = []; // Initialize 
  
    try {
      const userName = await getUserName(sessionId);
      console.log("✅ Nama pengguna yang diambil:", userName); // Debugging log untuk userName

      greeting =
        userName && userName !== "Sahabat Asista"
          ? `Bapak/Ibu, berikut biaya pendaftaran yang tersedia di Institut Asia:`
          : "Berikut biaya pendaftaran yang tersedia di Institut Asia:";

      biayaPendaftaran = await getBiayaPendaftaran();
      console.log("✅ Data biaya pendaftaran yang diambil:", biayaPendaftaran); // Debugging log untuk biayaPendaftaran

      agent.add(greeting);

      if (biayaPendaftaran.length === 0) {
        agent.add("Maaf, belum ada data biaya pendaftaran yang tersedia.");
      } else {        
        const richContent = biayaPendaftaran.map((item) => ({
          type: "list",
          title: item.title,
          subtitle: item.subtitle,
        }));

        try {          
          agent.add(
            new Payload(
              "DIALOGFLOW_MESSENGER",
              {
                richContent: [richContent],
              },
              { sendAsMessage: true, rawPayload: true }
            )
          );
        } catch (payloadError) {
          console.error("❌ Payload error:", payloadError);
          agent.add("Maaf, terjadi kesalahan menampilkan data list.");
        }

        // Fallback text response
        const textResponse = biayaPendaftaran
          .map((item, idx) => `${idx + 1}. ${item.title}: ${item.subtitle}`)
          .join('\n');
        agent.add(textResponse);
      }

      // Simpan chat ke database setelah semua respons dikirim
      setTimeout(() => {
        const allBiayaPendaftaran = biayaPendaftaran
          .map((r, i) => `${i + 1}. ${r.title} - ${r.subtitle}`)
          .join("\n");
  
        saveChatToDatabase(
          sessionId,
          query,
          intentName,
          `${greeting}\n${allBiayaPendaftaran}`,
          "DIALOGFLOW_MESSENGER"
        ).catch((err) => {
          console.error("❗ Gagal simpan ke database, tapi UI sudah tampil:", err);
        });
      }, 100);
      
    } catch (error) {
      console.error("🔥 Error terjadi di biayaPendaftaranIntent:", error);
      agent.add(
        "Maaf, terjadi kesalahan saat menampilkan informasi. Silakan coba lagi."
      );
    }
  }
  
  module.exports = biayaPendaftaranIntent;