import fs from "node:fs";
const ROOT = "D:/Projects/ronaldo-stats/";

// --- 1. the CSP: the CDN that does not exist ------------------------------
{
  const P = ROOT + "vercel.json";
  let t = fs.readFileSync(P, "utf8");
  const before = t;
  t = t.split("https://cdn.ronaldoallgoals.com").join("https://www.dailymotion.com https://www.youtube-nocookie.com");
  fs.writeFileSync(P, t, "utf8");
  console.log(before === t ? "  (the CSP had no CDN host)" : "ok  vercel.json: the CSP names the hosts the media really comes from");
}

// --- 2. the sitemap: the video fallback ------------------------------------
{
  const P = ROOT + "scripts/build-sitemap.mjs";
  let t = fs.readFileSync(P, "utf8");
  const before = t;
  // the archive's own page for the goal is the honest fallback: the CDN the
  // old build pointed at does not exist
  t = t.replace(
    "const LG_VIDEO = LG?.videoUrl || `https://cdn.ronaldoallgoals.com/Goal${LG_NUM}.mp4`;",
    "const LG_VIDEO = LG?.videoUrl || `https://cr7allgoals.com/goal/${LG_NUM}/`;"
  );
  fs.writeFileSync(P, t, "utf8");
  console.log(before === t ? "  (the sitemap fallback was already fixed)" : "ok  build-sitemap.mjs: the video fallback points at the archive");
}

// --- 3. any other reference to the dead CDN -------------------------------
{
  const files = [];
  const walk = (d) => {
    for (const item of fs.readdirSync(d, { withFileTypes: true })) {
      if (["node_modules", "dist", ".git", "public/data"].includes(item.name)) continue;
      const f = d + "/" + item.name;
      if (item.isDirectory()) walk(f);
      else if (/\.(html|mjs|js|json|txt|xml|webmanifest|yml)$/.test(item.name)) files.push(f);
    }
  };
  walk(ROOT);
  let left = 0;
  for (const f of files) {
    const t = fs.readFileSync(f, "utf8");
    if (t.includes("cdn.ronaldoallgoals.com") || t.includes("ronaldostats1") || t.includes("ronaldostat1") || t.includes("ronaldostatdotcom") || t.includes("ronaldostatsdotcom")) {
      left++;
      console.log("  ! " + f.replace(ROOT + "/", "") + " still mentions an old handle or the dead CDN");
    }
  }
  if (!left) console.log("ok  no page or script still points at the dead CDN or an old handle");
}
