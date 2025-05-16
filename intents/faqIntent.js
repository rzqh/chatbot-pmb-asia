const { getMostAskedIntents, saveChatToDatabase } = require("../services/database");
const { Payload } = require("dialogflow-fulfillment");

async function faqIntent(agent) {
  try {
    const faqData = await getMostAskedIntents(5);

    if (faqData.length === 0) {
      agent.add("Maaf, saat ini tidak ada pertanyaan yang sering ditanyakan.");
    } else {
      agent.add("Berikut adalah beberapa pertanyaan yang sering ditanyakan:");

      // Buat array of buttons untuk rich response
      const buttons = faqData.map((item) => ({
        text: `${item.display_name.padEnd(30)} (${item.count} pertanyaan)`,
        link: "",
        event: {
          name: "trigger_intent",
          languageCode: "id",
          parameters: {
            query: item.intent,
          },
        },
      }));

      // Format rich response sesuai dengan struktur yang benar
      const richResponse = {
        richContent: [[
          {
            type: "chips",
            options: buttons,
            padding: 2
          }
        ]]
      };

      // Kirim rich content ke pengguna
      agent.add(
        new Payload(
          "DIALOGFLOW_MESSENGER",
          richResponse,
          { sendAsMessage: true, rawPayload: true }
        )
      );
    }

    // Simpan interaksi pengguna ke database
    await saveChatToDatabase(
      agent.session,
      agent.query,
      "faq",
      "FAQ displayed",
      "DIALOGFLOW_MESSENGER"
    );
  } catch (error) {
    console.error("Error in faqIntent:", error);
    agent.add("Maaf, terjadi kesalahan saat memuat FAQ. Silakan coba lagi.");
  }
}

module.exports = faqIntent;