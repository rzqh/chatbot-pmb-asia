const welcomeIntent = require("./welcomeIntent");
const infoJadwalPendaftaranIntent = require("./infoJadwalPendaftaranIntent");
const biayaPendaftaranIntent = require("./infoBiayaPendaftaranIntent");
const infoProgramStudiSarjanaIntent = require("./infoProgramStudiSarjanaIntent.js");
const infoLokasiKampusIntent = require("./infoLokasiKampusIntent");
const infoAlurPendaftaranIntent = require("./infoAlurPendaftaranIntent");
const faqIntent = require("./faqIntent"); // Import the FAQ intent
const triggerIntentHandler = require("./triggerIntentHandler");
const infoFasilitasIntent = require("./infoFasilitasIntent");
const infoBeasiswaIntent = require("./infoBeasiswaIntent");
const infoSyaratPendaftaranIntent = require("./infoSyaratPendaftaranIntent");
const infoUnitKegiatanMahasiswaIntent = require("./infoUnitKegiatanMahasiswaIntent");

const intentMap = new Map();
intentMap.set("welcome_pmb", welcomeIntent);
intentMap.set("info_jadwal_pendaftaran", infoJadwalPendaftaranIntent);
intentMap.set("biaya_pendaftaran", biayaPendaftaranIntent);
intentMap.set("program_studi", infoProgramStudiSarjanaIntent);
intentMap.set("lokasi_kampus", infoLokasiKampusIntent);
intentMap.set("alur_pendaftaran", infoAlurPendaftaranIntent);
intentMap.set("faq", faqIntent);
intentMap.set("trigger_intent", triggerIntentHandler); // Tambahkan handler untuk event trigger_intent
intentMap.set("fasilitas_asia", infoFasilitasIntent); // Changed from "info_fasilitas" to "fasilitas_asia"
intentMap.set("beasiswa", infoBeasiswaIntent); // Changed from "info_beasiswa" to match Dialogflow intent name
intentMap.set("syarat_pendaftaran", infoSyaratPendaftaranIntent);
intentMap.set("ukm", infoUnitKegiatanMahasiswaIntent);

module.exports = intentMap;

// filepath: intents/index.js