const welcomeIntent = require("./welcomeIntent");
const infoJadwalPendaftaranIntent = require("./infoJadwalPendaftaranIntent");
// const fallbackIntent = require("./fallbackIntent");
// const getUserNameIntent = require("./getUserNameIntent");
// const whyChooseUADIntent = require("./whyChooseUADIntent");
// const jalurSeleksiIntent = require("./jalurSeleksiIntent");
// const biayaPendaftaranIntent = require("./biayaPendaftaranIntent");
// const programStudiIntent = require("./programStudiIntent");
// const seleksiBebasTesIntent = require("./seleksiBebasTesIntent");

const intentMap = new Map();
// intentMap.set("Default Fallback Intent", fallbackIntent);
intentMap.set("welcome_pmb", welcomeIntent);
intentMap.set("info_jadwal_pendaftaran", infoJadwalPendaftaranIntent);
// intentMap.set("get_user_name", getUserNameIntent);
// intentMap.set("why_choose_uad", whyChooseUADIntent);
// intentMap.set("jalur_seleksi", jalurSeleksiIntent);
// intentMap.set("biaya_pendaftaran", biayaPendaftaranIntent);
// intentMap.set("program_studi", programStudiIntent);
// intentMap.set("seleksi_bebas_tes", seleksiBebasTesIntent);

module.exports = intentMap;
