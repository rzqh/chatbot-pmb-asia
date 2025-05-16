const { intentMap } = require("./index");

async function triggerIntentHandler(agent) {
  const query = agent.parameters.query; // Ambil query dari parameter event

  if (query) {
    // Cari intent yang sesuai dengan query
    const matchedIntent = Array.from(intentMap.keys()).find((intent) =>
      query.toLowerCase().includes(intent.toLowerCase())
    );

    if (matchedIntent) {
      // Gunakan setFollowupEvent untuk memicu intent yang sesuai
      agent.setFollowupEvent({
        name: matchedIntent, // Nama intent yang akan dipicu
        parameters: { query }, // Kirim query sebagai parameter
      });
    } else {
      agent.add("Maaf, saya tidak dapat menemukan pertanyaan tersebut.");
    }
  } else {
    agent.add("Maaf, terjadi kesalahan saat memproses permintaan Anda.");
  }
}

module.exports = triggerIntentHandler;