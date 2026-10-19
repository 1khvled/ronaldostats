// smart-check.mjs — the local twin of worker/smart-check.js.
//
//   node scripts/smart-check.mjs            (stage new matches for review)
//   node scripts/smart-check.mjs --dry-run  (inspect without writing)
//
// The worker and this script must behave identically, so this one simply
// drives the same engine: scripts/auto-sync-matches.mjs polls ESPN's public
// scoreboards for the competitions Ronaldo plays in and stages anything new
// into public/data/pending.json for a human to confirm.
//
// It NEVER writes a total.
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const passthrough = args.includes("--dry-run") ? ["--check"] : args;

console.log("[smart-check] delegating to auto-sync-matches.mjs");
const r = spawnSync(process.execPath, [path.join(here, "auto-sync-matches.mjs"), ...passthrough], { stdio: "inherit" });
process.exit(r.status === null ? 1 : r.status);
