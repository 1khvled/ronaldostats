import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";

// The cabinet is rendered at runtime from DICT.CABINET, so the alt texts and
// the picture itself live in the nine dictionary modules, not in the page.
const CHANGES = [
  ["Cristiano Ronaldo in Portugal's shirt at a FIFA World Cup",
   "Cristiano Ronaldo in the Portugal number 7 shirt at the 2018 FIFA World Cup"],
  ["Cristiano Ronaldo holding his fifth Ballon d'Or trophy aloft",
   "Cristiano Ronaldo holding the Ballon d'Or he has won a record five times"],
  ["Cristiano Ronaldo celebrating with the Champions League trophy",
   "The European Cup and UEFA Champions League trophies, won five times by Cristiano Ronaldo"],
  ["Cristiano Ronaldo kissing the FIFA Club World Cup trophy",
   "The FIFA Club World Cup Golden Ball trophies in the CR7 Museum in Madeira"],
  ["Cristiano Ronaldo with the La Liga championship trophy",
   "Cristiano Ronaldo in the Real Madrid number 7 shirt, in a La Liga he won twice"],
];

const T = {
  en: {},
  es: {
    "Cristiano Ronaldo in the Portugal number 7 shirt at the 2018 FIFA World Cup": "Cristiano Ronaldo con la camiseta número 7 de Portugal en el Mundial de la FIFA de 2018",
    "Cristiano Ronaldo holding the Ballon d'Or he has won a record five times": "Cristiano Ronaldo sosteniendo el Ballon d'Or que ha ganado un récord de cinco veces",
    "The European Cup and UEFA Champions League trophies, won five times by Cristiano Ronaldo": "Las copas de la Copa de Europa y de la UEFA Champions League, ganadas cinco veces por Cristiano Ronaldo",
    "The FIFA Club World Cup Golden Ball trophies in the CR7 Museum in Madeira": "Los trofeos Golden Ball de la FIFA Club World Cup en el museo CR7 de Madeira",
    "Cristiano Ronaldo in the Real Madrid number 7 shirt, in a La Liga he won twice": "Cristiano Ronaldo con la camiseta número 7 del Real Madrid, en una La Liga que ganó dos veces",
  },
  pt: {
    "Cristiano Ronaldo in the Portugal number 7 shirt at the 2018 FIFA World Cup": "Cristiano Ronaldo com a camisa número 7 de Portugal na Copa do Mundo da FIFA de 2018",
    "Cristiano Ronaldo holding the Ballon d'Or he has won a record five times": "Cristiano Ronaldo com o Ballon d'Or que ganhou um recorde de cinco vezes",
    "The European Cup and UEFA Champions League trophies, won five times by Cristiano Ronaldo": "As taças da Taça Europeia e da UEFA Champions League, ganhas cinco vezes por Cristiano Ronaldo",
    "The FIFA Club World Cup Golden Ball trophies in the CR7 Museum in Madeira": "Os troféus Golden Ball da FIFA Club World Cup no museu CR7 da Madeira",
    "Cristiano Ronaldo in the Real Madrid number 7 shirt, in a La Liga he won twice": "Cristiano Ronaldo com a camisa número 7 do Real Madrid, numa La Liga que ganhou duas vezes",
  },
  fr: {
    "Cristiano Ronaldo in the Portugal number 7 shirt at the 2018 FIFA World Cup": "Cristiano Ronaldo en maillot numéro 7 du Portugal lors de la Coupe du monde 2018",
    "Cristiano Ronaldo holding the Ballon d'Or he has won a record five times": "Cristiano Ronaldo tenant le Ballon d'Or qu'il a remporté un record de cinq fois",
    "The European Cup and UEFA Champions League trophies, won five times by Cristiano Ronaldo": "Les coupes de la Coupe d'Europe et de la UEFA Champions League, remportées cinq fois par Cristiano Ronaldo",
    "The FIFA Club World Cup Golden Ball trophies in the CR7 Museum in Madeira": "Les trophées Golden Ball de la FIFA Club World Cup au musée CR7 de Madère",
    "Cristiano Ronaldo in the Real Madrid number 7 shirt, in a La Liga he won twice": "Cristiano Ronaldo en maillot numéro 7 du Real Madrid, dans une Liga qu'il a remportée deux fois",
  },
  ar: {
    "Cristiano Ronaldo in the Portugal number 7 shirt at the 2018 FIFA World Cup": "كريستيانو رونالدو بقميص البرتغال رقم 7 في كأس العالم 2018",
    "Cristiano Ronaldo holding the Ballon d'Or he has won a record five times": "كريستيانو رونالدو يحمل الكرة الذهبية التي فاز بها خمسة مرات وهو رقم قياسي",
    "The European Cup and UEFA Champions League trophies, won five times by Cristiano Ronaldo": "كؤوس دوري أبطال أوروبا وكأس دوري أبطال أوروبا التي فاز بها كريستيانو رونالدو خمس مرات",
    "The FIFA Club World Cup Golden Ball trophies in the CR7 Museum in Madeira": "كؤوس الكرة الذهبية لبطولة كأس العالم للأندية في متحف CR7 بماديرا",
    "Cristiano Ronaldo in the Real Madrid number 7 shirt, in a La Liga he won twice": "كريستيانو رونالدو بقميص ريال مدريد رقم 7، في دوري ليجا فاز به مرتين",
  },
  bn: {
    "Cristiano Ronaldo in the Portugal number 7 shirt at the 2018 FIFA World Cup": "২০১৮ FIFA বিশ্বকাপে পর্তুগালের ৭ নম্বর জার্সিতে ক্রিস্টিয়ানো রোনালদো",
    "Cristiano Ronaldo holding the Ballon d'Or he has won a record five times": "ক্রিস্টিয়ানো রোনালদো রেকর্ড পাঁচবার জেতা বলন ডি'অর তুলে ধরে আছেন",
    "The European Cup and UEFA Champions League trophies, won five times by Cristiano Ronaldo": "ক্রিস্টিয়ানো রোনালদো পাঁচবার জেতা ইউরোপীয় কাপ ও ইউএফএ চ্যাম্পিয়ন্স লিগের কাপ",
    "The FIFA Club World Cup Golden Ball trophies in the CR7 Museum in Madeira": "মাদেরার CR7 জাদুঘরে FIFA ক্লাব ওয়ার্ল্ড কাপের গোল্ডেন বল ট্রফি",
    "Cristiano Ronaldo in the Real Madrid number 7 shirt, in a La Liga he won twice": "রিয়েল মাদ্রিদের ৭ নম্বর জার্সিতে ক্রিস্টিয়ানো রোনালদো, দুবার জেতা লা লিগায়",
  },
  hi: {
    "Cristiano Ronaldo in the Portugal number 7 shirt at the 2018 FIFA World Cup": "2018 FIFA विश्व कप में पुर्तगाल की 7 नंबर की जर्सी में क्रिस्टियानो रोनाल्डो",
    "Cristiano Ronaldo holding the Ballon d'Or he has won a record five times": "क्रिस्टियानो रोनाल्डो रिकॉर्ड पाँच बार जीतने वाला बलन डी'ऑर पकड़े हुए",
    "The European Cup and UEFA Champions League trophies, won five times by Cristiano Ronaldo": "यूरोपीय कप और UEFA चैंपियंस लीग के कप, जो क्रिस्टियानो रोनाल्डो ने पाँच बार जीते",
    "The FIFA Club World Cup Golden Ball trophies in the CR7 Museum in Madeira": "मदेरा के CR7 संग्रहालय में FIFA क्लब वर्ल्ड कप के गोल्डन बॉल ट्रॉफी",
    "Cristiano Ronaldo in the Real Madrid number 7 shirt, in a La Liga he won twice": "रियल मैड्रिड की 7 नंबर की जर्सी में क्रिस्टियानो रोनाल्डो, दो बार जीती गई ला लीगा में",
  },
  ro: {
    "Cristiano Ronaldo in the Portugal number 7 shirt at the 2018 FIFA World Cup": "Cristiano Ronaldo în tricoul cu numărul 7 al Portugaliei la Cupa Mondială FIFA din 2018",
    "Cristiano Ronaldo holding the Ballon d'Or he has won a record five times": "Cristiano Ronaldo ținând Balonul de Aur câștigat de un record de cinci ori",
    "The European Cup and UEFA Champions League trophies, won five times by Cristiano Ronaldo": "Cupele Cuppei Europei și UEFA Champions League, câștigate de cinci ori de Cristiano Ronaldo",
    "The FIFA Club World Cup Golden Ball trophies in the CR7 Museum in Madeira": "Trofee Golden Ball ale FIFA Club World Cup din muzeul CR7 din Madeira",
    "Cristiano Ronaldo in the Real Madrid number 7 shirt, in a La Liga he won twice": "Cristiano Ronaldo în tricoul cu numărul 7 al Real Madrid, într-o La Liga câștigată de două ori",
  },
  uz: {
    "Cristiano Ronaldo in the Portugal number 7 shirt at the 2018 FIFA World Cup": "2018 FIFA Jahon Kupida Portugaliyaning 7-raqamli futbolkasida Kristiano Ronaldo",
    "Cristiano Ronaldo holding the Ballon d'Or he has won a record five times": "Kristiano Ronaldo rekord daraja bes marta qozgani Balon d'orni ushlab turibdi",
    "The European Cup and UEFA Champions League trophies, won five times by Cristiano Ronaldo": "Kristiano Ronaldo bes marta yutgan Yevropa kubogi va UEFA Champions League kuboklari",
    "The FIFA Club World Cup Golden Ball trophies in the CR7 Museum in Madeira": "Maderadagi CR7 muzeyida FIFA Klub Jahon Kubogi Golden Ball kuboklari",
    "Cristiano Ronaldo in the Real Madrid number 7 shirt, in a La Liga he won twice": "Real Madridning 7-raqamli futbolkasida Kristiano Ronaldo, ikki marta yutgan La Liga'da",
  },
};

const dir = path.join(ROOT, "src", "i18n");
for (const lang of Object.keys(T)) {
  const f = path.join(dir, lang + ".js");
  let t = fs.readFileSync(f, "utf8");
  let n = 0;
  for (const [oldS, newS] of CHANGES) {
    if (!t.includes(oldS)) { console.log("  " + lang + ": no " + oldS.slice(0, 34)); continue; }
    const tr = T[lang][newS];
    if (!tr) { console.log("  " + lang + ": no translation for " + newS.slice(0, 34)); continue; }
    t = t.split(oldS).join(tr);
    n++;
  }
  // the Club World Cup card now shows the Golden Ball trophies
  if (t.includes('src: "/img/cab-copa.webp"')) {
    t = t.replace('src: "/img/cab-copa.webp"', 'src: "/img/cab-cwc-2026.webp"');
    n++;
  }
  fs.writeFileSync(f, t, "utf8");
  console.log("ok  " + lang + ": " + n + " cabinet entries updated");
}
