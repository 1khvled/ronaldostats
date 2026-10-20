import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";
const LANGS = ["es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"];

// 1. the latest-goal page: the panel said there was no video. There is.
const OLD_PANEL = "Text record, not a video. RonaldoStats does not host, embed or stream match footage. The panel below is the published record of the goal: number, date, opponent, competition, score, minute, finish type and career total. Where a scoreline is not published it is shown as an em dash.";
const NEW_PANEL = "Watch the goal. RonaldoStats does not host the footage, but it links to it: the clip the CR7 goal archive publishes for this goal, the video of every goal of that season, and a search for the goal itself — and it plays the clips it can, in the player above. The panel below is the published record: number, date, opponent, competition, score, minute, finish type and career total. Where a scoreline is not published it is shown as an em dash.";

// 2. the FAQ that repeated it
const OLD_Q = "Does RonaldoStats host Cristiano Ronaldo goal video?";
const NEW_Q = "Where can I watch Cristiano Ronaldo's goals?";
const OLD_A = "No. RonaldoStats is a statistical archive: it does not host, embed or stream match footage. Every goal is published in text with its date, opponent, competition, minute and finish type, and the 366-day Birthday Explorer lists the dates on which he scored.";
const NEW_A = "RonaldoStats does not host the footage — it links to it, and plays what it can. The CR7 goal archive publishes a page for every one of the 981 goals with the clip it carries for that goal; ronaldo7.net publishes a video of every goal of each season; and the 366-day Birthday Explorer plays the clip for any date he scored. Where the clip is a YouTube video it plays here in the player above.";

// 3. the birthday explorer: say that the videos are there
const NOTE = "Every goal has a video: pick a date below, then tap ▶ Watch this goal on any goal.";

const T = {
  es: {
    [NEW_PANEL]: "Mira el gol. RonaldoStats no aloja la footage, pero te lleva a ella: el clip que publica el archivo de goles del CR7 para este gol, el vídeo de todos los goles de esa temporada y una búsqueda del propio gol — y reproduce los clips que puede, en el reproductor de arriba. El panel de abajo es el registro publicado: número, fecha, rival, competición, marcador, minuto, tipo de definición y total de carrera. Cuando no se publica un resultado, se muestra con un guion largo.",
    [NEW_Q]: "¿Dónde puedo ver los goles de Cristiano Ronaldo?",
    [NEW_A]: "RonaldoStats no aloja las imágenes: te lleva a ellas y reproduce las que puede. El archivo de goles del CR7 publica una página para cada uno de los 981 goles, con el clip que lleva; ronaldo7.net publica un vídeo de todos los goles de cada temporada; y el Explorador de Cumpleaños de 366 días reproduce el clip de cualquier fecha en la que marcó. Cuando el clip es un vídeo de YouTube, se reproduce aquí, en el reproductor de arriba.",
    [NOTE]: "Cada gol tiene vídeo: elige una fecha abajo y pulsa ▶ Ver este gol en cualquier gol.",
  },
  pt: {
    [NEW_PANEL]: "Assiste ao golo. O RonaldoStats não aloja as imagens, mas leva-te até elas: o clip que o arquivo de golos do CR7 publica para este golo, o vídeo de todos os golos dessa época e uma pesquisa pelo próprio golo — e reproduz os clips que pode, no leitor acima. O painel abaixo é o registo publicado: número, data, adversário, competição, resultado, minuto, tipo de finalização e total de carreira. Quando não há resultado publicado, mostra-se um travessão.",
    [NEW_Q]: "Onde posso ver os golos de Cristiano Ronaldo?",
    [NEW_A]: "O RonaldoStats não aloja as imagens: leva-te até elas e reproduz as que pode. O arquivo de golos do CR7 publica uma página para cada um dos 981 golos, com o clip que traz; o ronaldo7.net publica um vídeo de todos os golos de cada época; e o Explorador de Aniversários de 366 dias reproduz o clip de qualquer data em que marcou. Quando o clip é um vídeo do YouTube, é reproduzido aqui, no leitor acima.",
    [NOTE]: "Cada golo tem vídeo: escolhe uma data abaixo e toca em ▶ Ver este golo em qualquer golo.",
  },
  fr: {
    [NEW_PANEL]: "Regardez le but. RonaldoStats n'héberge pas les images, mais il vous y mène : le clip que l'archive des buts du CR7 publie pour ce but, la vidéo de tous les buts de la saison et une recherche sur le but lui-même — et il lit les clips qu'il peut, dans le lecteur ci-dessus. Le panneau ci-dessous est le relevé publié : numéro, date, adversaire, compétition, score, minute, type de finition et total en carrière. Quand un score n'est pas publié, il est affiché avec un tiret cadratin.",
    [NEW_Q]: "Où puis-je voir les buts de Cristiano Ronaldo ?",
    [NEW_A]: "RonaldoStats n'héberge pas les images : il vous y mène et lit celles qu'il peut. L'archive des buts du CR7 publie une page pour chacun des 981 buts, avec le clip qu'elle contient ; ronaldo7.net publie une vidéo de tous les buts de chaque saison ; et l'Explorateur d'anniversaire sur 366 jours lit le clip de n'importe quelle date où il a marqué. Quand le clip est une vidéo YouTube, il est lu ici, dans le lecteur ci-dessus.",
    [NOTE]: "Chaque but a une vidéo : choisissez une date ci-dessous, puis touchez ▶ Voir ce but sur n'importe quel but.",
  },
  ar: {
    [NEW_PANEL]: "شاهد الهدف. لا يستضيف RonaldoStats لقطات المباراة، لكنه يقودك إليها: المقطع الذي ينشره أرشيف أهداف CR7 لهذا الهدف، وفيديو كل أهداف ذلك الموسم، وبحث عن الهدف نفسه — ويشغّل المقاطع التي يستطيع تشغيلها، في المشغّل أعلاه. اللوحة أدناه هي السجل المنشور: الرقم، التاريخ، الخصم، البطولة، النتيجة، الدقيقة، نوع التسديد ومجموع المسيرة. وحين لا يُنشر نتيجة تُعرض بشرطة طويلة.",
    [NEW_Q]: "أين يمكنني مشاهدة أهداف كريستيانو رونالدو؟",
    [NEW_A]: "لا يستضيف RonaldoStats اللقطات: يقودك إليها ويشغّل ما يستطيع. ينشر أرشيف أهداف CR7 صفحة لكل واحد من الأهداف الـ981، مع المقطع الذي يحمله؛ وينشر ronaldo7.net فيديو لكل أهداف كل موسم؛ ومشغّل أعياد الميلاد على 366 يوماً يشغّل المقطع لأي يوم سجّل فيه. وحين يكون المقطع فيديو على YouTube، يُشغَّل هنا في المشغّل أعلاه.",
    [NOTE]: "لكل هدف فيديو: اختر تاريخاً أدناه، ثم اضغط ▶ شاهد هذا الهدف على أي هدف.",
  },
  bn: {
    [NEW_PANEL]: "গোলটি দেখুন। RonaldoStats ম্যাচের ফুটেজ সঞ্চয় করে না, তবে আপনাকে তার কাছে নিয়ে যায়: এই গোলের জন্য CR7 গোল আর্কাইভে প্রকাশিত ক্লিপ, ওই মৌসুমের প্রতিটি গোলের ভিডিও এবং গোলটি খোঁজার একটি অনুসন্ধান — এবং যেগুলো চালাতে পারে সেগুলো উপরের প্লেয়ারে বাজায়। নিচের প্যানেলটি প্রকাশিত রেকর্ড: নম্বর, তারিখ, প্রতিপক্ষ, টুর্নামেন্ট, স্কোর, মিনিট, শটের ধরন এবং ক্যারিয়ারের মোট। স্কোর প্রকাশিত না থাকলে তা একটি দীর্ঘ ড্যাশ দিয়ে দেখানো হয়।",
    [NEW_Q]: "ক্রিস্টিয়ানো রোনালদোর গোলগুলো কোথায় দেখা যাবে?",
    [NEW_A]: "RonaldoStats ফুটেজ সঞ্চয় করে না: আপনাকে তার কাছে নিয়ে যায় এবং যা চালাতে পারে তা বাজায়। CR7 গোল আর্কাইভ ৯৮১টি গোলের প্রতিটির জন্য একটি পাতা প্রকাশ করে, সেই সঙ্গে সংশ্লিষ্ট ক্লিপটি; ronaldo7.net প্রতিটি মৌসুমের সব গোলের ভিডিও প্রকাশ করে; আর ৩৬৬ দিনের জন্মদিন এক্সপ্লোরার যেকোনো তারিখের ক্লিপ বাজায়। ক্লিপটি ইউটিউবের ভিডিও হলে তা এখানে, উপরের প্লেয়ারে বাজানো হয়।",
    [NOTE]: "প্রতিটি গোলের ভিডিও আছে: নিচে একটি তারিখ বেছে নিন, তারপর যেকোনো গোলে ▶ এই গোলটি দেখুন চাপুন।",
  },
  hi: {
    [NEW_PANEL]: "गोल देखें। RonaldoStats मैच फुटेज होस्ट नहीं करता, लेकिन आपको उसके पास ले जाता है: इस गोल के लिए CR7 गोल आर्काइव में प्रकाशित क्लिप, उस सीज़न के हर गोल का वीडियो और गोल की खोज — और जो क्लिप चला सकता है, उन्हें ऊपर के प्लेयर में चलाता है। नीचे का पैनल प्रकाशित रिकॉर्ड है: नंबर, तारीख, प्रतिद्वंद्वी, प्रतियोगिता, स्कोर, मिनट, शॉट का प्रकार और करियर का कुल। जहाँ स्कोर प्रकाशित नहीं होता, वहाँ लंबी डैश दिखाई जाती है।",
    [NEW_Q]: "क्रिस्टियानो रोनाल्डो के गोल कहाँ देख सकते हैं?",
    [NEW_A]: "RonaldoStats फुटेज होस्ट नहीं करता: वह आपको उसके पास ले जाता है और जो चला सकता है वह चलाता है। CR7 गोल आर्काइव 981 में से हर गोल के लिए एक पेज प्रकाशित करता है, उसके साथ वह क्लिप भी; ronaldo7.net हर सीज़न के सभी गोल का वीडियो प्रकाशित करता है; और 366-दिन का जन्मदिन एक्सप्लोरर उन हर तारीख़ का क्लिप बजाता है जिस दिन उन्होंने गोल किया। जब क्लिप YouTube वीडियो होता है, वह यहाँ ऊपर के प्लेयर में चलता है।",
    [NOTE]: "हर गोल का वीडियो है: नीचे एक तारीख़ चुनें, फिर किसी भी गोल पर ▶ यह गोल देखें दबाएँ।",
  },
  ro: {
    [NEW_PANEL]: "Urmărește golul. RonaldoStats nu găzduiește imaginile, dar te duce la ele: clipul pe care arhiva de goluri CR7 îl publică pentru acest gol, videoclipul cu toate golurile sezonului și o căutare a golului însuși — și redă clipurile pe care le poate, în playerul de mai sus. Panoul de mai jos este înregistrarea publicată: număr, dată, adversar, competiție, scor, minut, tip de finalizare și total de carieră. Unde scorul nu este publicat, se afișează o liniu lungă.",
    [NEW_Q]: "Unde pot vedea golurile lui Cristiano Ronaldo?",
    [NEW_A]: "RonaldoStats nu găzduiește imaginile: te duce la ele și redă ce poate. Arhiva de goluri CR7 publică o pagină pentru fiecare dintre cele 981 de goluri, cu clipul pe care îl conține; ronaldo7.net publică un videoclip cu toate golurile fiecărui sezon; iar Exploratorul de Zi de Naștere pe 366 de zile redă clipul pentru orice dată în care a marcat. Când clipul este un videoclip de YouTube, este redat aici, în playerul de mai sus.",
    [NOTE]: "Fiecare gol are un videoclip: alege o dată mai jos, apoi apasă ▶ Vezi acest gol pe orice gol.",
  },
  uz: {
    [NEW_PANEL]: "Gohni ko'ring. RonaldoStats match videolarini saqlamaydi, lekin sizni ularga olib boradi: bu gol uchun CR7 gol arxivi nashr qilgan klip, oʻsha mavsumdagi barcha gollar videosi va golni qidirish natijasi — va qanday klplarni oʻzgartirishi mumkin boʻlsa, ularni yuqoridagi pleyerda ijro etadi. Pastdagi panel — bu nashr etilgan hisob: raqam, sana, raqib, musobaqa, hisob, daqiqa, zarba turi va karyera jami. Hisob nashr qilinmagan joylarda uzun chiziq koʻrsatiladi.",
    [NEW_Q]: "Kristiano Ronaldoning gollarini qayerda koʻraman?",
    [NEW_A]: "RonaldoStats videolarni saqlamaydi: u sizni ularga olib boradi va oʻzgartira oladiganlarini ijro etadi. CR7 gol arxivi 981 golning har biri uchun alohida sahifa nashr qiladi, uning bilan ushbu klip; ronaldo7.net har bir mavsumdagi barcha gollar videosini nashr qiladi; 366 kunlik tugʻilgan kun eksploratori esa u gol urgan har qanday sanada klibni ijro etadi. Agar klip YouTube videosi boʻlsa, u shu yerda, yuqoridagi pleyerda ijro etiladi.",
    [NOTE]: "Har bir golning videosi bor: pastdan bir sanani tanlang, keyin istalgan golda ▶ Bu golni koʻring tugmasini bosing.",
  },
};

// ---------------------------------------------------------------------------
// the English shells
// ---------------------------------------------------------------------------
{
  const P = path.join(ROOT, "latest-goal.html");
  let t = fs.readFileSync(P, "utf8");
  let n = 0;
  if (t.includes(OLD_PANEL)) { t = t.split(OLD_PANEL).join(NEW_PANEL); n++; }
  if (t.includes(OLD_Q)) { t = t.split(OLD_Q).join(NEW_Q); n++; }
  if (t.includes(OLD_A)) { t = t.split(OLD_A).join(NEW_A); n++; }
  fs.writeFileSync(P, t, "utf8");
  console.log("ok  latest-goal.html: " + n + " strings updated");
}
{
  const P = path.join(ROOT, "birthday.html");
  let t = fs.readFileSync(P, "utf8");
  const lead = t.match(/<p class="page-lead">[\s\S]*?<\/p>/);
  if (!lead) { console.error("the birthday page's lead paragraph was not found"); process.exit(1); }
  const note = `\n<p class="bday-video-note">${NOTE}</p>`;
  if (!t.includes("bday-video-note")) {
    t = t.replace(lead[0], lead[0] + note);
    fs.writeFileSync(P, t, "utf8");
    console.log("ok  birthday.html: the video note is in");
  } else console.log("ok  birthday.html: the video note is already there");
}

// ---------------------------------------------------------------------------
// the eight dictionaries
// ---------------------------------------------------------------------------
{
  const dir = path.join(ROOT, "src", "i18n", "shell");
  const PAIRS = [[OLD_PANEL, NEW_PANEL], [OLD_Q, NEW_Q], [OLD_A, NEW_A]];
  for (const lang of LANGS) {
    const f = path.join(dir, lang + ".json");
    const d = JSON.parse(fs.readFileSync(f, "utf8"));
    let n = 0;
    for (const [a, b] of PAIRS) {
      if (!(a in d)) continue;
      delete d[a];
      d[b] = T[lang][b];
      n++;
    }
    // the new birthday note
    const enNoteKey = NOTE;
    if (!d[enNoteKey]) { d[enNoteKey] = T[lang][NOTE]; n++; }
    fs.writeFileSync(f, JSON.stringify(d, null, 2) + "\n", "utf8");
    console.log("ok  " + lang + ": " + n + " strings updated");
  }
}

// ---------------------------------------------------------------------------
// the styles for the note
// ---------------------------------------------------------------------------
{
  const P = path.join(ROOT, "src", "styles.css");
  let css = fs.readFileSync(P, "utf8");
  if (!css.includes(".bday-video-note")) {
    css += `
/* ---------- birthday: the video note under the lead ---------- */
.bday-video-note {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0.6rem 0 0;
  padding: 10px 14px;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--brand-ink);
  background: var(--brand-soft);
  border: 1px solid var(--line);
  border-left: 3px solid var(--brand);
  border-radius: 10px;
}
`;
    fs.writeFileSync(P, css, "utf8");
    console.log("ok  styles.css: the video note");
  }
}
