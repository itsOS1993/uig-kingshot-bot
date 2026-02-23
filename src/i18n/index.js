const de = require('./de');
const en = require('./en');
const es = require('./es');
const ru = require('./ru');
const tr = require('./tr');

const languages = {
  de,
  en,
  es,
  ru,
  tr
};

function t(lang, key) {
  return languages[lang]?.[key] || languages["en"][key];
}

module.exports = { t };