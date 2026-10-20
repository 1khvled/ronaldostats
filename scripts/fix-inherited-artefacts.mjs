import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";

// ---------------------------------------------------------------------------
// 1. the gear page's third product is the Portugal 2006-07 home shirt, so the
//    affiliate search must ask for that, not for a celebration cape
// ---------------------------------------------------------------------------
{
  const P = path.join(ROOT, "gear.html");
  let t = fs.readFileSync(P, "utf8");
  const before = t;
  t = t.replace("k=ronaldo+celebration+cape&tag=ronaldostats-20", "k=portugal+2006+home+shirt+ronaldo+7&tag=ronaldostats-20");
  t = t.replace("k=ronaldo+cap+hat+snapback&tag=ronaldostats-20", "k=ronaldo+baseball+cap+hat&tag=ronaldostats-20");
  fs.writeFileSync(P, t, "utf8");
  console.log(before === t ? "ok  gear.html: the affiliate searches already match the products" : "ok  gear.html: the affiliate searches match the products");
}

// ---------------------------------------------------------------------------
// 2. the CSP named a CDN that does not exist
// ---------------------------------------------------------------------------
{
  const P = path.join(ROOT, "vercel.json");
  const v = JSON.parse(fs.readFileSync(P, "utf8"));
  let n = 0;
  for (const rule of v.headers || []) {
    for (const h of rule.headers || []) {
      if (h.key === "Content-Security-Policy" && /cdn\.ronaldoallgoals\.com/.test(h.value)) {
        h.value = h.value.replace("media-src 'self' https://cdn.ronaldoallgoals.com blob: https:;",
          "media-src 'self' https://www.dailymotion.com https://www.youtube.com https://www.youtube-nocookie.com blob: https:;");
        n++;
      }
    }
  }
  fs.writeFileSync(P, JSON.stringify(v, null, 2) + "\n", "utf8");
  console.log("ok  vercel.json: " + n + " CSP rules no longer name a host that does not exist");
}

// ---------------------------------------------------------------------------
// 3. the auto-sync script is Ronaldo's tracker, not Messi's
// ---------------------------------------------------------------------------
{
  const from = path.join(ROOT, "scripts/auto-sync-messi.mjs");
  const to = path.join(ROOT, "scripts/auto-sync-ronaldo.mjs");
  if (fs.existsSync(from)) {
    let t = fs.readFileSync(from, "utf8");
    t = t.replace(/auto-sync-messi\.mjs/g, "auto-sync-ronaldo.mjs");
    fs.writeFileSync(to, t, "utf8");
    fs.unlinkSync(from);
    console.log("ok  scripts/auto-sync-messi.mjs renamed to auto-sync-ronaldo.mjs");
  } else console.log("ok  scripts/auto-sync-ronaldo.mjs is already named correctly");

  const P = path.join(ROOT, "package.json");
  const p = JSON.parse(fs.readFileSync(P, "utf8"));
  if (p.scripts["sync:messi"]) {
    p.scripts["sync:ronaldo"] = p.scripts["sync:messi"].replace(/auto-sync-messi\.mjs/g, "auto-sync-ronaldo.mjs");
    delete p.scripts["sync:messi"];
    fs.writeFileSync(P, JSON.stringify(p, null, 2) + "\n", "utf8");
    console.log("ok  package.json: sync:messi -> sync:ronaldo");
  }
}

// ---------------------------------------------------------------------------
// 4. every file a script reads must exist
// ---------------------------------------------------------------------------
{
  const missing = new Map();
  for (const f of fs.readdirSync(path.join(ROOT, "scripts"))) {
    if (!/\.(mjs|cjs|js)$/.test(f)) continue;
    const t = fs.readFileSync(path.join(ROOT, "scripts", f), "utf8");
    const refs = new Set();
    for (const m of t.matchAll(/["'`]\s*(?:path\.join\([^)]*?,\s*)?["'`]((?:public|src|scripts)\/[A-Za-z0-9_\-./]+)["'`]/g)) refs.add(m[1]);
    for (const m of t.matchAll(/["'`](public\/data\/[A-Za-z0-9_\-.]+\.json)["'`]/g)) refs.add(m[1]);
    for (const r of refs) {
      if (!fs.existsSync(path.join(ROOT, r))) {
        if (!missing.has(r)) missing.set(r, []);
        missing.get(r).push(f);
      }
    }
  }
  console.log("\n=== files the scripts read that do not exist ===");
  if (!missing.size) console.log("  none");
  for (const [r, files] of missing) console.log("  " + r + "   <- " + files.join(", "));
}
