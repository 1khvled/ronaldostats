import fs from "node:fs";
const P = "D:/Projects/ronaldo-stats/vercel.json";
const v = JSON.parse(fs.readFileSync(P, "utf8"));

// the old slug was the Messi page's; keep the old URLs working
const NEW = [
  { source: "/vs-real-madrid", destination: "/en/real-madrid", permanent: true },
  { source: "/vs-real-madrid.html", destination: "/en/real-madrid", permanent: true },
  { source: "/:lang/vs-real-madrid", destination: "/:lang/real-madrid", permanent: true },
  { source: "/:lang/vs-real-madrid.html", destination: "/:lang/real-madrid", permanent: true },
];
let n = 0;
for (const r of NEW) {
  const hit = (v.redirects || []).find((x) => x.source === r.source && x.destination === r.destination);
  if (hit) continue;
  v.redirects = v.redirects || [];
  v.redirects.push(r);
  n++;
}
fs.writeFileSync(P, JSON.stringify(v, null, 2) + "\n", "utf8");
console.log("ok  vercel.json: " + n + " redirects added for the old slug (" + (v.redirects || []).length + " rules in total)");
