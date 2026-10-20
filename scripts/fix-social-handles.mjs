/**
 * The account names inside the translated social strings.
 *
 *   node scripts/fix-social-handles.mjs
 *
 * The English strings carry the account name, and so does every translation:
 * "تابع @ronaldostat1 على X" still named the old account. The account the
 * site points at is the one MessiStat runs, @messistat1, and the channel is
 * @messistatdotcom, so every language says so.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1"), "..");
const SHELL = path.join(ROOT, "src", "i18n", "shell");

for (const lang of ["es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"]) {
  const file = path.join(SHELL, lang + ".json");
  const dict = JSON.parse(fs.readFileSync(file, "utf8"));
  let n = 0;
  for (const [k, v] of Object.entries(dict)) {
    if (typeof v !== "string") continue;
    if (!/@ronaldostat1|@ronaldostats1|@ronaldostatdotcom|@ronaldostatsdotcom/.test(v)) continue;
    const value = v
      .split("@ronaldostats1").join("@messistat1")
      .split("@ronaldostat1").join("@messistat1")
      .split("@ronaldostatsdotcom").join("@messistatdotcom")
      .split("@ronaldostatdotcom").join("@messistatdotcom");
    dict[k] = value;
    n++;
  }
  const sorted = {};
  for (const k of Object.keys(dict).sort()) sorted[k] = dict[k];
  fs.writeFileSync(file, JSON.stringify(sorted, null, 1), "utf8");
  console.log("  " + lang + ": " + n + " strings carry the account name");
}
