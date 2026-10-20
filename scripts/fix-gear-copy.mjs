import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";

// ---------------------------------------------------------------------------
// The product photos are now real photographs of the actual products, so the
// copy has to describe what the picture shows.
// ---------------------------------------------------------------------------
const CHANGES = [
  // 1. the third product is a Portugal home shirt, not a celebration cape
  ["CR7 Gold Celebration Cape", "Portugal 2006-07 Home Shirt #7 Ronaldo"],
  ["Gold celebration cape with green trim, worn over the No. 7 shirt", "Portugal home shirt from the 2006-07 season, maroon with a gold number 7"],
  ["Gold cape with green trim, the look Ronaldo made famous at Juventus", "Maroon home shirt from Ronaldo's 2006-07 season in the Portugal colours"],
  ["Hooded, one-size cut that sits over the No. 7 shirt", "Gold number 7 on the chest, with the Portugal crest on the breast"],
  ["Soft lining and a light fill for the final whistle", "Lightweight polyester with a stitched collar and a loose match cut"],
  // 2. the cap is a blue baseball cap
  ["CR7 Embroidered Snapback Cap", "CR7 Baseball Cap"],
  ["Red cap with a gold number 7 embroidered on the front", "Blue baseball cap with a curved brim"],
  ["Red six-panel crown with a gold number 7 on the front", "Six-panel crown with a curved brim and a structured front"],
  ["Structured front with breathable eyelets and a gold brim", "Breathable eyelets and a cotton twill finish"],
  // 3. the pictures that are not of a CR7 product any more
  ["Portugal home match jersey, red with green trim and a gold number 7", "Portugal home match jersey, red with a green chest band and the national crest"],
  ["Size 5 match football, white with black panels and a red ring", "Size 5 match football, white with dark swooshes and a green ring"],
  ["Black CR7 hoodie with gold drawstrings and a gold chest print", "Black hooded sweatshirt in heavyweight fleece"],
  ["Framed CR7 number 7 print from the RonaldoStats career archive", "Cristiano Ronaldo in the Real Madrid number 7 shirt, from the RonaldoStats career archive"],
];

// the meta descriptions mention the cape too
const META_CAPES = [
  ["Verified Cristiano Ronaldo match jerseys, Portugal home and away kits, the gold celebration cape, signature CR7 boots, a match ball, a hoodie, a cap and a framed print. Affiliate picks supporting RonaldoStats.",
   "Verified Cristiano Ronaldo match jerseys, Portugal home and away kits, a 2006-07 home shirt, signature CR7 boots, a match ball, a hoodie, a cap and a framed print. Affiliate picks supporting RonaldoStats."],
  ["Equip yourself with verified Cristiano Ronaldo match jerseys, Portugal home and away kits, the gold celebration cape, signature CR7 boots, a match ball, a hoodie, a cap and a framed print. Every purchase through our verified links helps keep RonaldoStats 100% free, fast, and independently maintained.",
   "Equip yourself with verified Cristiano Ronaldo match jerseys, Portugal home and away kits, a 2006-07 home shirt, signature CR7 boots, a match ball, a hoodie, a cap and a framed print. Every purchase through our verified links helps keep RonaldoStats 100% free, fast, and independently maintained."],
  ["Shop verified Cristiano Ronaldo match jerseys, Portugal home and away kits, the gold celebration cape, signature CR7 boots, a match ball, a hoodie, a cap and a framed print on Amazon.",
   "Shop verified Cristiano Ronaldo match jerseys, Portugal home and away kits, a 2006-07 home shirt, signature CR7 boots, a match ball, a hoodie, a cap and a framed print on Amazon."],
  ["Cristiano Ronaldo gear, Ronaldo jerseys, Ronaldo Portugal home jersey 7, Ronaldo Portugal away jersey, Ronaldo celebration cape, CR7 football boots, Ronaldo match ball, CR7 hoodie, Ronaldo cap, Ronaldo poster print, Ronaldo Amazon store, buy Ronaldo shirt",
   "Cristiano Ronaldo gear, Ronaldo jerseys, Ronaldo Portugal home jersey 7, Ronaldo Portugal away jersey, Ronaldo 2006-07 home shirt, CR7 football boots, Ronaldo match ball, CR7 hoodie, Ronaldo cap, Ronaldo poster print, Ronaldo Amazon store, buy Ronaldo shirt"],
];

// ---------------------------------------------------------------------------
// the translations, language by language
// ---------------------------------------------------------------------------
const T = {
  es: {
    "Portugal 2006-07 Home Shirt #7 Ronaldo": "Camiseta local de Portugal 2006-07 #7 Ronaldo",
    "Portugal home shirt from the 2006-07 season, maroon with a gold number 7": "Camiseta local de Portugal de la temporada 2006-07, granate con el número 7 dorado",
    "Maroon home shirt from Ronaldo's 2006-07 season in the Portugal colours": "Camiseta local granate de la temporada 2006-07 de Ronaldo con los colores de Portugal",
    "Gold number 7 on the chest, with the Portugal crest on the breast": "Número 7 dorado en el pecho y el escudo de Portugal en el pecho",
    "Lightweight polyester with a stitched collar and a loose match cut": "Poliéster ligero con cuello cosido y corte amplio de partido",
    "CR7 Baseball Cap": "Gorra CR7",
    "Blue baseball cap with a curved brim": "Gorra de béisbol azul con visera curva",
    "Six-panel crown with a curved brim and a structured front": "Crown de seis paneles con visera curva y frente estructurado",
    "Breathable eyelets and a cotton twill finish": "Ojillas transpirables y acabado en sarga de algodón",
    "Portugal home match jersey, red with a green chest band and the national crest": "Camiseta local de Portugal, roja con una franja verde en el pecho y el escudo nacional",
    "Size 5 match football, white with dark swooshes and a green ring": "Balón de partido talla 5, blanco con curvas oscuras y un anillo verde",
    "Black hooded sweatshirt in heavyweight fleece": "Sudadera negra con capucha en felpa gruesa",
    "Cristiano Ronaldo in the Real Madrid number 7 shirt, from the RonaldoStats career archive": "Cristiano Ronaldo con la camiseta número 7 del Real Madrid, del archivo de carreras de RonaldoStats",
  },
  pt: {
    "Portugal 2006-07 Home Shirt #7 Ronaldo": "Camisa de jogo Portugal 2006-07 #7 Ronaldo",
    "Portugal home shirt from the 2006-07 season, maroon with a gold number 7": "Camisa de jogo de Portugal da temporada 2006-07, grená com o número 7 dourado",
    "Maroon home shirt from Ronaldo's 2006-07 season in the Portugal colours": "Camisa de jogo grená da temporada 2006-07 de Ronaldo nas cores de Portugal",
    "Gold number 7 on the chest, with the Portugal crest on the breast": "Número 7 dourado no peito e o escudo de Portugal no peito",
    "Lightweight polyester with a stitched collar and a loose match cut": "Poliéster leve com gola costurada e corte amplo de jogo",
    "CR7 Baseball Cap": "Boné CR7",
    "Blue baseball cap with a curved brim": "Boné de baseball azul com aba curva",
    "Six-panel crown with a curved brim and a structured front": "Coroa de seis painéis com aba curva e frente estruturado",
    "Breathable eyelets and a cotton twill finish": "Ilhoses respiráveis e acabamento em sarja de algodão",
    "Portugal home match jersey, red with a green chest band and the national crest": "Camisa de jogo de Portugal, vermelha com uma faixa verde no peito e o escudo nacional",
    "Size 5 match football, white with dark swooshes and a green ring": "Bola de jogo tamanho 5, branca com rabiscos escuros e um anel verde",
    "Black hooded sweatshirt in heavyweight fleece": "Moletom preto com capuz em fleece pesado",
    "Cristiano Ronaldo in the Real Madrid number 7 shirt, from the RonaldoStats career archive": "Cristiano Ronaldo com a camisa número 7 do Real Madrid, do arquivo de carreira da RonaldoStats",
  },
  fr: {
    "Portugal 2006-07 Home Shirt #7 Ronaldo": "Maillot Portugal 2006-07 n° 7 Ronaldo",
    "Portugal home shirt from the 2006-07 season, maroon with a gold number 7": "Maillot du Portugal de la saison 2006-07, bordeaux avec le numéro 7 doré",
    "Maroon home shirt from Ronaldo's 2006-07 season in the Portugal colours": "Maillot domicile bordeaux de la saison 2006-07 de Ronaldo aux couleurs du Portugal",
    "Gold number 7 on the chest, with the Portugal crest on the breast": "Numéro 7 doré sur la poitrine et le blason du Portugal sur le devant",
    "Lightweight polyester with a stitched collar and a loose match cut": "Polyester léger, col cousu et coupe ample de match",
    "CR7 Baseball Cap": "Casquette CR7",
    "Blue baseball cap with a curved brim": "Casquette de baseball bleue avec visière incurvée",
    "Six-panel crown with a curved brim and a structured front": "Calotte à six panneaux, visière incurvée et avant structuré",
    "Breathable eyelets and a cotton twill finish": "Œillets respirants et finition en sergé de coton",
    "Portugal home match jersey, red with a green chest band and the national crest": "Maillot domicile du Portugal, rouge avec une bande verte sur la poitrine et le blason national",
    "Size 5 match football, white with dark swooshes and a green ring": "Ballon de match taille 5, blanc avec des swooshes sombres et un anneau vert",
    "Black hooded sweatshirt in heavyweight fleece": "Sweat à capuche noir en molleton épais",
    "Cristiano Ronaldo in the Real Madrid number 7 shirt, from the RonaldoStats career archive": "Cristiano Ronaldo en maillot numéro 7 du Real Madrid, tiré de l'archive de carrière RonaldoStats",
  },
  ar: {
    "Portugal 2006-07 Home Shirt #7 Ronaldo": "قميص البرتغال المحلي 2006-07 رقم 7 رونالدو",
    "Portugal home shirt from the 2006-07 season, maroon with a gold number 7": "قميص البرتغال المحلي في موسم 2006-07، عنابي مع الرقم 7 الذهبي",
    "Maroon home shirt from Ronaldo's 2006-07 season in the Portugal colours": "قميص محلي عنابي من موسم 2006-07 لرونالدو بألوان البرتغال",
    "Gold number 7 on the chest, with the Portugal crest on the breast": "الرقم 7 الذهبي على الصدر وشعار البرتغال على الصدر",
    "Lightweight polyester with a stitched collar and a loose match cut": "بوليستر خفيف بياقة مخيطة وقصة واسعة الملاءمة",
    "CR7 Baseball Cap": "قبعة CR7",
    "Blue baseball cap with a curved brim": "قبعة بيسبول زرقاء بحافة منحنية",
    "Six-panel crown with a curved brim and a structured front": "قبعة بستة ألواح بحافة منحنية وواجهة مثبتة",
    "Breathable eyelets and a cotton twill finish": "عيون قابلة للتنفس وتشطيب تويل قطني",
    "Portugal home match jersey, red with a green chest band and the national crest": "قميص البرتغال المحلي، أحمر مع شريط أخضر على الصدر والشعار الوطني",
    "Size 5 match football, white with dark swooshes and a green ring": "كرة مباراة مقاس 5، بيضاء مع خطوط داكنة وحلقة خضراء",
    "Black hooded sweatshirt in heavyweight fleece": "سويت شيرت أسود بقبعة من الفليص السميك",
    "Cristiano Ronaldo in the Real Madrid number 7 shirt, from the RonaldoStats career archive": "كريستيانو رونالدو بقميص ريال مدريد رقم 7، من أرشيف المسيرة في RonaldoStats",
  },
  bn: {
    "Portugal 2006-07 Home Shirt #7 Ronaldo": "পর্তুগাল হোম জার্সি 2006-07 #7 রোনালদো",
    "Portugal home shirt from the 2006-07 season, maroon with a gold number 7": "২০০৬-০৭ মৌসুমের পর্তুগাল হোম জার্সি, মেরুন রঙে সোনালি ৭ নম্বরসহ",
    "Maroon home shirt from Ronaldo's 2006-07 season in the Portugal colours": "২০০৬-০৭ মৌসুমে রোনালদোর মেরুন হোম জার্সি, পর্তুগালের রঙে",
    "Gold number 7 on the chest, with the Portugal crest on the breast": "বুকে সোনালি ৭ নম্বর এবং বুকে পর্তুগালের প্রতীক",
    "Lightweight polyester with a stitched collar and a loose match cut": "হালকা পলিস্টার, সেলাই করা কলার এবং ঢিলা ম্যাচ কাট",
    "CR7 Baseball Cap": "CR7 ক্যাপ",
    "Blue baseball cap with a curved brim": "বাঁকা ঝালির নীল বেসবল ক্যাপ",
    "Six-panel crown with a curved brim and a structured front": "ছয় প্যানেলের ক্রাউন, বাঁকা ঝালি এবং গঠনমূলক সামনের অংশ",
    "Breathable eyelets and a cotton twill finish": "শ্বাস-প্রশ্বাসযোগ্য ছিদ্র ও কটন টুইল ফিনিশ",
    "Portugal home match jersey, red with a green chest band and the national crest": "পর্তুগাল হোম ম্যাচ জার্সি, লাল রঙে বুকে সবুজ পটি ও জাতীয় প্রতীক",
    "Size 5 match football, white with dark swooshes and a green ring": "আকার ৫ ম্যাচ বল, সাদা রঙে গাঢ় রেখা ও সবুজ বলয়সহ",
    "Black hooded sweatshirt in heavyweight fleece": "ভারী ফ্লিসের কালো হুডি",
    "Cristiano Ronaldo in the Real Madrid number 7 shirt, from the RonaldoStats career archive": "রিয়েল মাদ্রিদের ৭ নম্বর জার্সিতে ক্রিস্টিয়ানো রোনালদো, RonaldoStats-এর ক্যারিয়ার আর্কাইভ থেকে",
  },
  hi: {
    "Portugal 2006-07 Home Shirt #7 Ronaldo": "पुर्तगाल होम जर्सी 2006-07 #7 रोनाल्डो",
    "Portugal home shirt from the 2006-07 season, maroon with a gold number 7": "2006-07 सीज़न की पुर्तगाल होम जर्सी, मैरून रंग में सोने का 7 नंबर",
    "Maroon home shirt from Ronaldo's 2006-07 season in the Portugal colours": "रोनाल्डो की 2006-07 सीज़न की मैरून होम जर्सी, पुर्तगाल के रंगों में",
    "Gold number 7 on the chest, with the Portugal crest on the breast": "छाती पर सोने का 7 नंबर और बुक पर पुर्तगाल का क्रेस्ट",
    "Lightweight polyester with a stitched collar and a loose match cut": "हल्का पॉलिएस्टर, सिलाई की गई कॉलर और ढीला मैच कट",
    "CR7 Baseball Cap": "CR7 कैप",
    "Blue baseball cap with a curved brim": "घुमे हुए किनारे वाली नीली बेसबॉल कैप",
    "Six-panel crown with a curved brim and a structured front": "छह पैनल वाला क्राउन, घुमा किनारा और स्ट्रक्चर्ड फ्रंट",
    "Breathable eyelets and a cotton twill finish": "साँस लेने योग्य आँखें और कॉटन ट्विल फिनिश",
    "Portugal home match jersey, red with a green chest band and the national crest": "पुर्तगाल होम मैच जर्सी, लाल रंग में छाती पर हरी पट्टी और राष्ट्रीय क्रेस्ट",
    "Size 5 match football, white with dark swooshes and a green ring": "साइज़ 5 मैच बॉल, सफ़ेद रंग में गहरे तीर और हरी पट्टी के साथ",
    "Black hooded sweatshirt in heavyweight fleece": "भारी फ़्लीस वाली काली हुडी",
    "Cristiano Ronaldo in the Real Madrid number 7 shirt, from the RonaldoStats career archive": "रियल मैड्रिड की 7 नंबर की जर्सी में क्रिस्टियानो रोनाल्डो, RonaldoStats के करियर आर्काइव से",
  },
  ro: {
    "Portugal 2006-07 Home Shirt #7 Ronaldo": "Tricou de acasă Portugalia 2006-07 #7 Ronaldo",
    "Portugal home shirt from the 2006-07 season, maroon with a gold number 7": "Tricou de acasă al Portugaliei din sezonul 2006-07, bordo cu numărul 7 auriu",
    "Maroon home shirt from Ronaldo's 2006-07 season in the Portugal colours": "Tricou de acasă bordo din sezonul 2006-07 al lui Ronaldo, în culorile Portugaliei",
    "Gold number 7 on the chest, with the Portugal crest on the breast": "Numărul 7 auriu pe piept și stema Portugaliei pe piept",
    "Lightweight polyester with a stitched collar and a loose match cut": "Poliester ușor, guler cusut și croi generos de meci",
    "CR7 Baseball Cap": "Căciulă CR7",
    "Blue baseball cap with a curved brim": "Căciulă de baseball albastră cu bor înclinat",
    "Six-panel crown with a curved brim and a structured front": "Coroană cu șase panouri, bor înclinat și față structurată",
    "Breathable eyelets and a cotton twill finish": "Ochi respirabili și finisaj din twill de bumbac",
    "Portugal home match jersey, red with a green chest band and the national crest": "Tricou de meci Portugalia, roșu cu o bandă verde pe piept și stema națională",
    "Size 5 match football, white with dark swooshes and a green ring": "Minge de meci mărimea 5, albă cu curbe întunecate și un inel verde",
    "Black hooded sweatshirt in heavyweight fleece": "Bluză cu glocă neagră, din fleece groasă",
    "Cristiano Ronaldo in the Real Madrid number 7 shirt, from the RonaldoStats career archive": "Cristiano Ronaldo în tricoul cu numărul 7 al Real Madrid, din arhiva de carieră RonaldoStats",
  },
  uz: {
    "Portugal 2006-07 Home Shirt #7 Ronaldo": "Portugaliya uy futbolkasi 2006-07 #7 Ronaldo",
    "Portugal home shirt from the 2006-07 season, maroon with a gold number 7": "2006-07 mavsumidagi Portugaliya uy futbolkasi, oltin 7-raqamli, to'q qizil rangda",
    "Maroon home shirt from Ronaldo's 2006-07 season in the Portugal colours": "Ronaldoning 2006-07 mavsumidagi to'q qizil uy futbolkasi, Portugaliya ranglarida",
    "Gold number 7 on the chest, with the Portugal crest on the breast": "Ko'krakda oltin 7-raqam va Portugaliya nishoni",
    "Lightweight polyester with a stitched collar and a loose match cut": "Yengil poliyester, tikilgan yoqa va keng o'yin kroki",
    "CR7 Baseball Cap": "CR7 kaska",
    "Blue baseball cap with a curved brim": "Qayriq egilgan chekkali ko'k beysbol kaska",
    "Six-panel crown with a curved brim and a structured front": "Olti paneldan iborat crown, egilgan chekka va mustahkamlangan old qismi",
    "Breathable eyelets and a cotton twill finish": "Nafas olish uchun teshiklar va paxta mato twill qopqog'i",
    "Portugal home match jersey, red with a green chest band and the national crest": "Portugaliya uy match futbolkasi, qizil rangda ko'krakda yashil yoqa va milliy nishon bilan",
    "Size 5 match football, white with dark swooshes and a green ring": "5-o'lchamli match to'pi, oq rangda to'q izohalar va yashil halqa bilan",
    "Black hooded sweatshirt in heavyweight fleece": "Qalin fleysdagi qora rangli hoodi",
    "Cristiano Ronaldo in the Real Madrid number 7 shirt, from the RonaldoStats career archive": "Real Madridning 7-raqamli futbolkasida Kristiano Ronaldo, RonaldoStats karyer arxividan",
  },
};

// the local phrase for "the gold celebration cape" -> the local phrase for
// "a 2006-07 home shirt", so the meta descriptions stay true to the range
const CAPE = {
  es: ["la capa de celebración dorada", "la camiseta local de 2006-07"],
  pt: ["a capa de comemoração dourada", "a camisa de 2006-07"],
  fr: ["cape de célébration dorée", "maillot 2006-07"],
  ar: ["عباءة الاحتفال الذهبية", "قميص 2006-07"],
  bn: ["সোনালি উৎসব কেপ", "২০০৬-০৭ জার্সি"],
  hi: ["सोने का सेलिब्रेशन केप", "2006-07 जर्सी"],
  ro: ["capa de celebrare aurie", "tricoul din 2006-07"],
  uz: ["oltin bayram koʻchakchasi", "2006-07 futbolkasi"],
};
const KEYWORD_CAPE = {
  es: ["Ronaldo celebration cape", "camiseta de Portugal 2006-07 de Ronaldo"],
  pt: ["Ronaldo celebration cape", "camisa de Portugal 2006-07 de Ronaldo"],
  fr: ["Ronaldo celebration cape", "maillot Portugal 2006-07 de Ronaldo"],
  ar: ["Ronaldo celebration cape", "قميص البرتغال 2006-07 لرونالدو"],
  bn: ["Ronaldo celebration cape", "২০০৬-০৭ পর্তুগাল জার্সি রোনালদো"],
  hi: ["Ronaldo celebration cape", "रोनाल्डो की 2006-07 पुर्तगाल जर्सी"],
  ro: ["Ronaldo celebration cape", "tricoul Portugaliei 2006-07 al lui Ronaldo"],
  uz: ["Ronaldo celebration cape", "2006-07 yili Portugaliya futbolkasi"],
};

// ---------------------------------------------------------------------------
// 1. the English shell
// ---------------------------------------------------------------------------
{
  const P = path.join(ROOT, "gear.html");
  let t = fs.readFileSync(P, "utf8");
  let n = 0;
  for (const [oldS, newS] of [...CHANGES, ...META_CAPES]) {
    if (!t.includes(oldS)) { console.log("  (not in gear.html) " + oldS.slice(0, 50)); continue; }
    t = t.split(oldS).join(newS);
    n++;
  }
  fs.writeFileSync(P, t, "utf8");
  console.log("ok  gear.html: " + n + " strings updated");
}

// ---------------------------------------------------------------------------
// 2. the eight dictionaries
// ---------------------------------------------------------------------------
{
  const dir = path.join(ROOT, "src", "i18n", "shell");
  for (const lang of Object.keys(T)) {
    const f = path.join(dir, lang + ".json");
    const d = JSON.parse(fs.readFileSync(f, "utf8"));
    let n = 0;
    for (const [oldS, newS] of CHANGES) {
      if (!(oldS in d)) { console.log("  " + lang + ": no key " + oldS.slice(0, 40)); continue; }
      const tr = T[lang][newS];
      if (!tr) { console.log("  " + lang + ": no translation for " + newS.slice(0, 40)); continue; }
      delete d[oldS];
      d[newS] = tr;
      n++;
    }
    // the meta descriptions
    for (const [oldS, newS] of META_CAPES) {
      if (!(oldS in d)) continue;
      let val = d[oldS];
      const [from, to] = CAPE[lang];
      if (val.includes(from)) val = val.split(from).join(to);
      const [kFrom, kTo] = KEYWORD_CAPE[lang];
      if (val.includes(kFrom)) val = val.split(kFrom).join(kTo);
      delete d[oldS];
      d[newS] = val;
      n++;
    }
    fs.writeFileSync(f, JSON.stringify(d, null, 2) + "\n", "utf8");
    console.log("ok  " + lang + ": " + n + " keys updated");
  }
}
