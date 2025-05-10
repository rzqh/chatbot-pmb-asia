const { getProgramStudiSarjana, saveChatToDatabase } = require("../services/database");

async function infoProgramStudiSarjanaIntent(agent) {
  try {
    // Fetch program studi sarjana data from the database
    const programStudi = await getProgramStudiSarjana();

    let response;
    if (programStudi.length === 0) {
      response = "Maaf, saat ini tidak ada informasi program studi sarjana yang tersedia.";
      agent.add(response);
    } else {
      response = "Berikut adalah informasi program studi sarjana yang tersedia:\n";
      programStudi.forEach((item, index) => {
        response += `${index + 1}. Fakultas: ${item.fakultas}\n`;
        response += `   Program Studi: ${item.program_studi}\n`;
        if (item.program_studi_desc) {
          response += `   Deskripsi: ${item.program_studi_desc}\n`;
        }
        if (item.akreditasi) {
          response += `   Akreditasi: ${item.akreditasi}\n`;
        }
        response += "\n";
      });
      agent.add(response);
    }

    // Save the chat to the database
    await saveChatToDatabase(
      agent.session,
      agent.query,
      "info_program_studi_sarjana",
      response, // Use the constructed response
      agent.originalRequest.source || "unknown"
    );
  } catch (error) {
    console.error("Error in infoProgramStudiSarjanaIntent:", error);
    agent.add("Maaf, ada kesalahan saat mengambil informasi program studi sarjana. Silakan coba lagi.");
  }
}

module.exports = infoProgramStudiSarjanaIntent;