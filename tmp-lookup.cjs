const fs = require('fs');
const ar = JSON.parse(fs.readFileSync('src/i18n/shell/ar.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/i18n/shell/en.json', 'utf8'));
const re = new RegExp(process.argv[2]);
for (const k of Object.keys(ar)) {
  if (re.test(k)) {
    console.log(JSON.stringify(k) + '\n  => ' + JSON.stringify(ar[k]) + '\n  ENctx: ' + JSON.stringify(en[k] ? en[k].ctx : '(not in en)'));
  }
}
