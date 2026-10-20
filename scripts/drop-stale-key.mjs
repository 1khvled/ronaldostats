import fs from "node:fs";
import path from "node:path";
const DIR = "D:/Projects/ronaldo-stats/src/i18n/shell/";
// The rail mark used to read "M10" (Messi's shirt number) and now reads "CR7";
// the old key is dead weight in every dictionary.
for (const lang of ["es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"]) {
  const f = DIR + lang + ".json";
  const d = JSON.parse(fs.readFileSync(f, "utf8"));
  if (!("M10" in d)) { console.log(lang + ": nothing to remove"); continue; }
  delete d["M10"];
  fs.writeFileSync(f, JSON.stringify(d, null, 2) + "\n", "utf8");
  console.log(lang + ": the stale M10 key removed");
}
