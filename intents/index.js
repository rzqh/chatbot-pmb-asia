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
const infoRekomendasiAsiaIntent = require("./infoRekomendasiAsiaIntent");
const fallbackIntent = require("./fallbackIntent"); // Tambahkan import fallbackIntent

const intentMap = new Map();
intentMap.set("welcome_pmb", welcomeIntent);
intentMap.set("info_jadwal_pendaftaran", infoJadwalPendaftaranIntent);
intentMap.set("biaya_pendaftaran", biayaPendaftaranIntent);
intentMap.set("program_studi", infoProgramStudiSarjanaIntent);
intentMap.set("lokasi_kampus", infoLokasiKampusIntent);
intentMap.set("alur_pendaftaran", infoAlurPendaftaranIntent);
intentMap.set("faq", faqIntent);
intentMap.set("trigger_intent", triggerIntentHandler);
intentMap.set("fasilitas_asia", infoFasilitasIntent); 
intentMap.set("beasiswa", infoBeasiswaIntent); 
intentMap.set("syarat_pendaftaran", infoSyaratPendaftaranIntent);
intentMap.set("ukm", infoUnitKegiatanMahasiswaIntent);
intentMap.set("rekomendasi_asia", infoRekomendasiAsiaIntent);
intentMap.set("Default Fallback Intent", fallbackIntent); 

module.exports = intentMap;

// filepath: intents/index.js