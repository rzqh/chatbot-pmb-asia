const { saveChatToDatabase } = require("../services/database");
const { Suggestion } = require("dialogflow-fulfillment"); // Import Suggestion

async function welcomeIntent(agent) {
  try {
    const response =
      "Asista siap menjawab pertanyaan seputar PMB! 👋";

    agent.add(response);

    // Add suggestion chips for user interaction
    agent.add(new Suggestion("Ya, tentu!"));
    agent.add(new Suggestion("Tidak, terima kasih."));

    agent.setContext({
      name: "awaiting_name",
      lifespan: 2,
      parameters: {},
    });

    await saveChatToDatabase(
      agent.session,
      agent.query,
      "Default Welcome Intent",
      response,
      agent.originalRequest.source || "unknown"
    );
  } catch (error) {
    console.error("Error in welcomeIntent:", error);
    agent.add("Maaf, ada kesalahan. Silakan coba lagi.");
  }
}

module.exports = welcomeIntent;
