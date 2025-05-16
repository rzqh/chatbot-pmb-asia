const { getProgramStudiSarjana, saveChatToDatabase } = require("../services/database");
const { Payload } = require("dialogflow-fulfillment");
const newlineToBr = require("newline-to-br");

async function infoProgramStudiSarjanaIntent(agent) {
  try {

    agent.add("Berikut program studi yang tersedia di Institut Asia Malang");

    const programStudi = await getProgramStudiSarjana();

    if (programStudi.length === 0) {
      agent.add("Maaf, saat ini tidak ada informasi program studi sarjana yang tersedia.");
    } else {
      const richContent = programStudi.map((item) => {
        let additionalText = "";

        switch (item.program_studi) {
          case "🧑‍💻 Teknik Informatika ":
            additionalText = newlineToBr(
              "\n\nTerdapat beberapa konsentrasi yaitu:\n- Multimedia & Game\n- Sistem Cerdas\n- Jaringan Komputer"
            );
            break;
          case "🏦 Akuntansi":
            additionalText = newlineToBr(
              "\n\nTerdapat beberapa konsentrasi yaitu:\n- Akuntansi Manajemen\n- Akuntansi Keuangan\n- Akuntansi Keuangan Syari'ah"
            );
            break;
          case "📊 Professional Business Management":
            additionalText = newlineToBr(
              "\n\nTerdapat beberapa konsentrasi yaitu:\n- Sumber Daya manusia\n- Pemasaran\n- International Business Management"
            );
            break;
          case "🎨 Desain Komunikasi Visual":
            additionalText = newlineToBr(
              "\n\nTerdapat beberapa konsentrasi yaitu:\n- Branding\n- Ilustrasi\n- Media Rekam"
            );
            break;
          default:
            additionalText = "Informasi tambahan tidak tersedia.";
        }        
                        
        return {
          type: "accordion", // Use accordion type
          title: `${item.program_studi}`,
          subtitle: `Akreditasi: ${item.akreditasi}`, // Keep subtitle simple
          text: [
            `${item.program_studi_desc || "Deskripsi tidak tersedia"}`,
            additionalText,
          ].join("\n"), // Combine text into multi-line format
        };
      });

      agent.add(
        new Payload(
          "DIALOGFLOW_MESSENGER",
          { richContent: [richContent] }, // Wrap in the required structure
          { sendAsMessage: true, rawPayload: true }
        )
      );
    }

    await saveChatToDatabase(
      agent.session,
      agent.query,
      "info_program_studi_sarjana",
      "Rich content sent",
      "DIALOGFLOW_MESSENGER"
    );
  } catch (error) {
    console.error("Error in infoProgramStudiSarjanaIntent:", error);
    agent.add("Maaf, ada kesalahan saat mengambil informasi program studi sarjana. Silakan coba lagi.");
  }
}

module.exports = infoProgramStudiSarjanaIntent;