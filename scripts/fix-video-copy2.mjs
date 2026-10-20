import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";
const LANGS = ["es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"];

const OLD_B = "Text record, not a video.";
const NEW_B = "Watch the goal.";
const OLD_REST = "RonaldoStats does not host, embed or stream match footage. The panel below is the published record of the goal: number, date, opponent, competition, score, minute, finish type and career total. Where a scoreline is not published it is shown as an em dash.";
const NEW_REST = "RonaldoStats does not host the footage, but it links to it: the clip the CR7 goal archive publishes for this goal, the video of every goal of that season, and a search for the goal itself — and it plays the clips it can, in the player above. The panel below is the published record: number, date, opponent, competition, score, minute, finish type and career total. Where a scoreline is not published it is shown as an em dash.";

const B = {
  es: "Mira el gol.",
  pt: "Assiste ao golo.",
  fr: "Regardez le but.",
  ar: "شاهد الهدف.",
  bn: "গোলটি দেখুন।",
  hi: "गोल देखें।",
  ro: "Urmărește golul.",
  uz: "Gohni ko'ring.",
};
const REST = {
  es: "RonaldoStats no aloja la footage, pero te lleva a ella: el clip que publica el archivo de goles del CR7 para este gol, el vídeo de todos los goles de esa temporada y una búsqueda del propio gol — y reproduce los clips que puede, en el reproductor de arriba. El panel de abajo es el registro publicado: número, fecha, rival, competición, marcador, minuto, tipo de definición y total de carrera. Cuando no se publica un resultado, se muestra con un guion largo.",
  pt: "O RonaldoStats não aloja as imagens, mas leva-te até elas: o clip que o arquivo de golos do CR7 publica para este golo, o vídeo de todos os golos dessa época e uma pesquisa pelo próprio golo — e reproduz os clips que pode, no leitor acima. O painel abaixo é o registo publicado: número, data, adversário, competição, resultado, minuto, tipo de finalização e total de carreira. Quando não há resultado publicado, mostra-se um travessão.",
  fr: "RonaldoStats n'héberge pas les images, mais il vous y mène : le clip que l'archive des buts du CR7 publie pour ce but, la vidéo de tous les buts de la saison et une recherche sur le but lui-même — et il lit les clips qu'il peut, dans le lecteur ci-dessus. Le panneau ci-dessous est le relevé publié : numéro, date, adversaire, compétition, score, minute, type de finition et total en carrière. Quand un score n'est pas publié, il est affiché avec un tiret cadratin.",
  ar: "لا يستضيف RonaldoStats لقطات المباراة، لكنه يقودك إليها: المقطع الذي ينشره أرشيف أهداف CR7 لهذا الهدف، وفيديو كل أهداف ذلك الموسم، وبحث عن الهدف نفسه — ويشغّل المقاطع التي يستطيع تشغيلها، في المشغّل أعلاه. اللوحة أدناه هي السجل المنشور: الرقم، التاريخ، الخصم، البطولة، النتيجة، الدقيقة، نوع التسديد ومجموع المسيرة. وحين لا يُنشر نتيجة تُعرض بشرطة طويلة.",
  bn: "RonaldoStats ম্যাচের ফুটেজ সঞ্চয় করে না, তবে আপনাকে তার কাছে নিয়ে যায়: এই গোলের জন্য CR7 গোল আর্কাইভে প্রকাশিত ক্লিপ, ওই মৌসুমের প্রতিটি গোলের ভিডিও এবং গোলটি খোঁজার একটি অনুসন্ধান — এবং যেগুলো চালাতে পারে সেগুলো উপরের প্লেয়ারে বাজায়। নিচের প্যানেলটি প্রকাশিত রেকর্ড: নম্বর, তারিখ, প্রতিপক্ষ, টুর্নামেন্ট, স্কোর, মিনিট, শটের ধরন এবং ক্যারিয়ারের মোট। স্কোর প্রকাশিত না থাকলে তা একটি দীর্ঘ ড্যাশ দিয়ে দেখানো হয়।",
  hi: "RonaldoStats मैच फुटेज होस्ट नहीं करता, लेकिन आपको उसके पास ले जाता है: इस गोल के लिए CR7 गोल आर्काइव में प्रकाशित क्लिप, उस सीज़न के हर गोल का वीडियो और गोल की खोज — और जो क्लिप चला सकता है, उन्हें ऊपर के प्लेयर में चलाता है। नीचे का पैनल प्रकाशित रिकॉर्ड है: नंबर, तारीख, प्रतिद्वंद्वी, प्रतियोगिता, स्कोर, मिनट, शॉट का प्रकार और करियर का कुल। जहाँ स्कोर प्रकाशित नहीं होता, वहाँ लंबी डैश दिखाई जाती है।",
  ro: "RonaldoStats nu găzduiește imaginile, dar te duce la ele: clipul pe care arhiva de goluri CR7 îl publică pentru acest gol, videoclipul cu toate golurile sezonului și o căutare a golului însuși — și redă clipurile pe care le poate, în playerul de mai sus. Panoul de mai jos este înregistrarea publicată: număr, dată, adversar, competiție, scor, minut, tip de finalizare și total de carieră. Unde scorul nu este publicat, se afișează o liniu lungă.",
  uz: "RonaldoStats match videolarini saqlamaydi, lekin sizni ularga olib boradi: bu gol uchun CR7 gol arxivi nashr qilgan klip, oʻsha mavsumdagi barcha gollar videosi va golni qidirish natijasi — va qanday klplarni oʻzgartirishi mumkin boʻlsa, ularni yuqoridagi pleyerda ijro etadi. Pastdagi panel — bu nashr etilgan hisob: raqam, sana, raqib, musobaqa, hisob, daqiqa, zarba turi va karyera jami. Hisob nashr qilinmagan joylarda uzun chiziq koʻrsatiladi.",
};

const dir = path.join(ROOT, "src", "i18n", "shell");
for (const lang of LANGS) {
  const f = path.join(dir, lang + ".json");
  const d = JSON.parse(fs.readFileSync(f, "utf8"));
  let n = 0;
  if (OLD_B in d) { delete d[OLD_B]; d[NEW_B] = B[lang]; n++; }
  if (OLD_REST in d) { delete d[OLD_REST]; d[NEW_REST] = REST[lang]; n++; }
  fs.writeFileSync(f, JSON.stringify(d, null, 2) + "\n", "utf8");
  console.log("ok  " + lang + ": " + n + " keys updated");
}
