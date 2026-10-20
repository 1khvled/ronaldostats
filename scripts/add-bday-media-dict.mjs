// Add the BDAY_MEDIA dictionary (the birthday page's media panel copy) to
// every language module, and make the English module the source of truth.
//
//   node scripts/add-bday-media-dict.mjs
import fs from "node:fs";
import path from "node:path";

const DIR = "D:/Projects/ronaldo-stats/src/i18n";
const LANGS = ["en", "es", "pt", "fr", "ar", "bn", "hi", "ro", "uz"];

const DICT = {
  en: {
    searchHighlights: "🔍 Search Highlights",
    openArchive: "Open in the CR7 goal archive",
    noClip: "No published clip for this goal.",
    noClipBody: "The match record below comes from the primary match sheets. The links open the goal's page in the archive and a search for the footage.",
    clipLabel: "Published clip",
    compilationLabel: "All-goals compilation",
    publisher: "Published by",
    assist: "Assist: {name}",
    finish: "Finish: {type}",
    goalNumber: "Goal #{n}",
    watchOn: "Watch on {publisher}",
    sourceLine: "Goal record: {source} — the archive sources its list from Wikipedia's List of senior career goals by Cristiano Ronaldo (CC BY-SA 4.0, built on FBref's goal log) and StatsBomb open data. Clips are published by their rights holders.",
    sourceNote: "The dates, competitions, scorelines, minutes, finishes and assists on this page come from cr7allgoals.com, whose per-goal list is Wikipedia's List of senior career goals by Cristiano Ronaldo (CC BY-SA 4.0, built on FBref's goal log), with StatsBomb open data for the reviewed event details. The international list is RSSSF's appearance record — 146 goals in 234 caps for Portugal. Where a minute was never published it is left empty rather than invented.",
  },
  es: {
    searchHighlights: "🔍 Buscar jugadas",
    openArchive: "Abrir en el archivo de goles de CR7",
    noClip: "No hay clip publicado de este gol.",
    noClipBody: "El registro del partido de abajo procede de las actas oficiales. Los enlaces abren la página del gol en el archivo y una búsqueda del footage.",
    clipLabel: "Clip publicado",
    compilationLabel: "Compilación de todos sus goles",
    publisher: "Publicado por",
    assist: "Asistencia: {name}",
    finish: "Finalización: {type}",
    goalNumber: "Gol n.º {n}",
    watchOn: "Ver en {publisher}",
    sourceLine: "Registro del gol: {source} — el archivo toma su lista de la Wikipedia, List of senior career goals by Cristiano Ronaldo (CC BY-SA 4.0, sobre el registro de goles de FBref), y de StatsBomb open data. Los clips los publican sus titulares de derechos.",
    sourceNote: "Las fechas, competiciones, marcadores, minutos, finalizaciones y asistencias de esta página proceden de cr7allgoals.com, cuya lista de goles es la de Wikipedia, List of senior career goals by Cristiano Ronaldo (CC BY-SA 4.0, sobre el registro de FBref), con StatsBomb open data para los detalles de los partidos revisados. La lista internacional es el registro de apariciones de RSSSF: 146 goles en 234 partidos con Portugal. Cuando el minuto nunca se publicó, se deja vacío en lugar de inventarlo.",
  },
  pt: {
    searchHighlights: "🔍 Buscar lances",
    openArchive: "Abrir no arquivo de gols do CR7",
    noClip: "Não há clipe publicado deste gol.",
    noClipBody: "O registro da partida abaixo vem das atas oficiais. Os links abrem a página do gol no arquivo e uma busca pelo vídeo.",
    clipLabel: "Clipe publicado",
    compilationLabel: "Compilação de todos os gols",
    publisher: "Publicado por",
    assist: "Assistência: {name}",
    finish: "Finalização: {type}",
    goalNumber: "Gol n.º {n}",
    watchOn: "Assistir em {publisher}",
    sourceLine: "Registro do gol: {source} — o arquivo tira sua lista da Wikipédia, List of senior career goals by Cristiano Ronaldo (CC BY-SA 4.0, sobre o log de gols do FBref), e do StatsBomb open data. Os clipes são publicados pelos detentores de direitos.",
    sourceNote: "As datas, competições, placares, minutos, finalizações e assistências desta página vêm do cr7allgoals.com, cuja lista de gols é a da Wikipédia, List of senior career goals by Cristiano Ronaldo (CC BY-SA 4.0, sobre o log do FBref), com o StatsBomb open data nos detalhes revisados dos jogos. A lista internacional é o registro de jogos da RSSSF: 146 gols em 234 partidas por Portugal. Quando o minuto nunca foi publicado, fica vazio em vez de ser inventado.",
  },
  fr: {
    searchHighlights: "🔍 Rechercher les séquences",
    openArchive: "Ouvrir dans l'archive des buts de CR7",
    noClip: "Aucun clip publié pour ce but.",
    noClipBody: "La fiche du match ci-dessous provient des feuilles de match officielles. Les liens ouvrent la page du but dans l'archive et une recherche de la séquence.",
    clipLabel: "Clip publié",
    compilationLabel: "Compilation de tous ses buts",
    publisher: "Publié par",
    assist: "Passe : {name}",
    finish: "Conclusion : {type}",
    goalNumber: "But n° {n}",
    watchOn: "Voir sur {publisher}",
    sourceLine: "Fiche du but : {source} — l'archive tire sa liste de Wikipédia, List of senior career goals by Cristiano Ronaldo (CC BY-SA 4.0, d'après le relevé de buts de FBref), et de StatsBomb open data. Les clips sont publiés par leurs ayants droit.",
    sourceNote: "Les dates, compétitions, scores, minutes, conclusions et passes de cette page proviennent de cr7allgoals.com, dont la liste de buts est celle de Wikipédia, List of senior career goals by Cristiano Ronaldo (CC BY-SA 4.0, d'après le relevé de FBref), avec StatsBomb open data pour les détails révisés des matchs. La liste internationale est le relevé de sélections de la RSSSF : 146 buts en 234 sélections avec le Portugal. Quand la minute n'a jamais été publiée, elle reste vide plutôt qu'inventée.",
  },
  ar: {
    searchHighlights: "🔍 ابحث عن اللقطة",
    openArchive: "افتح في أرشيف أهداف CR7",
    noClip: "لا يوجد مقطع منشور لهذا الهدف.",
    noClipBody: "بيانات المباراة أدناه مأخوذة من تقارير المباريات الرسمية. الروابط تفتح صفحة الهدف في الأرشيف وابحثاً عن اللقطة.",
    clipLabel: "مقطع منشور",
    compilationLabel: "تجميع كل أهدافه",
    publisher: "نشرته",
    assist: "صناعة: {name}",
    finish: "طريقة التسجيل: {type}",
    goalNumber: "الهدف رقم {n}",
    watchOn: "شاهد على {publisher}",
    sourceLine: "سجل الهدف: {source} — يعتمد الأرشيف قائمته على ويكيبيديا، «List of senior career goals by Cristiano Ronaldo» (CC BY-SA 4.0، المبنية على سجل أهداف FBref)، وعلى بيانات StatsBomb المفتوحة. المقاطع منشورة من قبل أصحاب الحقوق.",
    sourceNote: "التواريخ والمسابقات والنتائج والدقائق وطرق التسجيل والصناعة في هذه الصفحة تأتي من cr7allgoals.com، التي قائمة الأهداف هي قائمة ويكيبيديا «List of senior career goals by Cristiano Ronaldo» (CC BY-SA 4.0، المبنية على سجل FBref)، مع بيانات StatsBomb المفتوحة لتفاصيل المباريات المراجَعة. القائمة الدولية هي سجل مباريات RSSSF: 146 هدفاً في 234 مباراة مع البرتغال. وحيث لم تُنشر الدقيقة، تُترك فارغة بدل اختراعها.",
  },
  bn: {
    searchHighlights: "🔍 হাইলাইট খুঁজুন",
    openArchive: "CR7 গোল আর্কাইভে খুলুন",
    noClip: "এই গোলের কোনো প্রকাশিত ক্লিপ নেই।",
    noClipBody: "নিচের ম্যাচ রেকর্ড প্রাথমিক ম্যাচ শিট থেকে নেওয়া। লিংকগুলো আর্কাইভে গোলের পাতা এবং ফুটেজের অনুসন্ধান খোলে।",
    clipLabel: "প্রকাশিত ক্লিপ",
    compilationLabel: "সব গোলের সংকলন",
    publisher: "প্রকাশক",
    assist: "সহায়তা: {name}",
    finish: "শেষ করার ধরন: {type}",
    goalNumber: "গোল নং {n}",
    watchOn: "{publisher}-এ দেখুন",
    sourceLine: "গোলের রেকর্ড: {source} — আর্কাইভ তার তালিকা নেয় উইকিপিডিয়ার ‘List of senior career goals by Cristiano Ronaldo’ (CC BY-SA 4.0, যা FBref-এর গোল লগের ভিত্তিতে তৈরি) এবং StatsBomb ওপেন ডেটা থেকে। ক্লিপগুলো প্রকাশ করেছেন তাদের অধিকারধারকরা।",
    sourceNote: "এই পাতার তারিখ, প্রতিযোগিতা, স্কোর, মিনিট, শেষ করার ধরন ও সহায়তা আসে cr7allgoals.com থেকে, যার গোলের তালিকা উইকিপিডিয়ার ‘List of senior career goals by Cristiano Ronaldo’ (CC BY-SA 4.0, FBref-এর গোল লগের ভিত্তিতে তৈরি); পর্যালোচিত ম্যাচের বিবরণে StatsBomb ওপেন ডেটা। আন্তর্জাতিক তালিকা RSSSF-এর অ্যাপিয়ারেন্স রেকর্ড — পর্তুগালের হয়ে ২৩৪ ম্যাচে ১৪৬ গোল। যে মিনিট কখনো প্রকাশিত হয়নি, সেখানে অনুমান না করে ফাঁকা রাখা হয়েছে।",
  },
  hi: {
    searchHighlights: "🔍 हाइलाइट खोजें",
    openArchive: "CR7 गोल संग्रह में खोलें",
    noClip: "इस गोल की कोई प्रकाशित क्लिप नहीं है।",
    noClipBody: "नीचे दिया मैच रिकॉर्ड आधिकारिक मैच शीट से लिया गया है। लिंक आर्काइव में गोल का पृष्ठ और फुटेज की खोज खोलते हैं।",
    clipLabel: "प्रकाशित क्लिप",
    compilationLabel: "सभी गोलों का संकलन",
    publisher: "प्रकाशक",
    assist: "सहायता: {name}",
    finish: "समापन: {type}",
    goalNumber: "गोल #{n}",
    watchOn: "{publisher} पर देखें",
    sourceLine: "गोल रिकॉर्ड: {source} — आर्काइव अपनी सूची विकिपीडिया के ‘List of senior career goals by Cristiano Ronaldo’ (CC BY-SA 4.0, जो FBref के गोल लॉग पर आधारित है) और StatsBomb ओपन डेटा से लेता है। क्लिप अपने अधिकारधारकों द्वारा प्रकाशित हैं।",
    sourceNote: "इस पृष्ठ की तारीखें, प्रतियोगिताएँ, स्कोर, मिनट, समापन और सहायता cr7allgoals.com से आती हैं, जिसकी प्रति-गोल सूची विकिपीडिया की ‘List of senior career goals by Cristiano Ronaldo’ (CC BY-SA 4.0, FBref के गोल लॉग पर आधारित) है, और समीक्षित मैच विवरणों के लिए StatsBomb ओपन डेटा है। अंतर्राष्ट्रीय सूची RSSSF की उपस्थिति रिकॉर्ड है — पुर्तगाल के लिए 234 मैचों में 146 गोल। जहाँ मिनट कभी प्रकाशित नहीं हुआ, वहाँ अनुमान लगाने के बजाय खाली छोड़ा गया है।",
  },
  ro: {
    searchHighlights: "🔍 Caută reprizele",
    openArchive: "Deschide în arhiva golurilor CR7",
    noClip: "Nu există un clip publicat pentru acest gol.",
    noClipBody: "Fișa meciului de mai jos provine din foile oficiale de meci. Linkurile deschid pagina golului în arhivă și o căutare a secvenței.",
    clipLabel: "Clip publicat",
    compilationLabel: "Compilație cu toate golurile",
    publisher: "Publicat de",
    assist: "Pasă: {name}",
    finish: "Finalizare: {type}",
    goalNumber: "Golul nr. {n}",
    watchOn: "Vizionează pe {publisher}",
    sourceLine: "Fișa golului: {source} — arhiva își ia lista din Wikipedia, List of senior career goals by Cristiano Ronaldo (CC BY-SA 4.0, construită pe jurnalul de goluri al FBref), și din StatsBomb open data. Clipurile sunt publicate de deținătorii drepturilor.",
    sourceNote: "Datele, competițiile, scorurile, minutele, finalizările și pasele de pe această pagină provin din cr7allgoals.com, a cărui listă de goluri este cea din Wikipedia, List of senior career goals by Cristiano Ronaldo (CC BY-SA 4.0, construită pe jurnalul FBref), cu StatsBomb open data pentru detaliile meciurilor revizuite. Lista internațională este jurnalul de selecții al RSSSF: 146 goluri în 234 de selecții cu Portugalia. Unde minutul nu a fost publicat niciodată, acolo rămâne gol, nu inventat.",
  },
  uz: {
    searchHighlights: "🔍 Harakatlarni qidiring",
    openArchive: "CR7 gol arxivida ochish",
    noClip: "Bu gol uchun nashr qilingan klip yo'q.",
    noClipBody: "Pastdagi match yozuvi rasmiy match varaqalaridan olingan. Havolalar arxivdagi gol sahifasini va videoni qidirishni ochadi.",
    clipLabel: "Nashr qilingan klip",
    compilationLabel: "Barcha gollar kompilyatsiyasi",
    publisher: "Nashr qilgan",
    assist: "Yordam: {name}",
    finish: "Yakunlash: {type}",
    goalNumber: "{n}-gol",
    watchOn: "{publisher} da ko'ring",
    sourceLine: "Gol yozuvi: {source} — arxiv o'z ro'yxatini Vikipediyaning 'List of senior career goals by Cristiano Ronaldo' (CC BY-SA 4.0, FBref gol jurnaliga asoslangan) va StatsBomb ochiq ma'lumotlaridan oladi. Kliplar huquq egalari tomonidan nashr qilinadi.",
    sourceNote: "Ushbu sahifadagi sanalar, musobaqalar, hisoblar, daqiqalar, yakunlash turlari va yordamlar cr7allgoals.com dan olinadi, uning har bir gol ro'yxati Vikipediyaning 'List of senior career goals by Cristiano Ronaldo' (CC BY-SA 4.0, FBref gol jurnaliga asoslangan) bo'lib, ko'rib chiqilgan match tafsilotlari uchun StatsBomb ochiq ma'lumotlari ishlatiladi. Xalqaro ro'yxat RSSSFning chiqishlar yozuvi — Portugaliya uchun 234 ta o'yinda 146 ta gol. Daqiqa hech qachon nashr qilinmagan joylarda uni o'ylab topish o'rniga bo'sh qoldiriladi.",
  },
};

for (const lang of LANGS) {
  const f = path.join(DIR, lang + ".js");
  let t = fs.readFileSync(f, "utf8");
  if (t.includes("export const BDAY_MEDIA")) { console.log(lang + ": already present"); continue; }
  const body = JSON.stringify(DICT[lang], null, 2)
    .split("\n")
    .map((l, i) => (i === 0 ? l : "  " + l))
    .join("\n");
  t = t.replace(/\s*$/, "") + "\n\nexport const BDAY_MEDIA = " + body + ";\n";
  fs.writeFileSync(f, t, "utf8");
  console.log(lang + ": BDAY_MEDIA added");
}
