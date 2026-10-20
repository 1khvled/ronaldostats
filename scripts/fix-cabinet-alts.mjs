import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";

// The cabinet's five entries, in order, with the alt that describes the
// photograph each one now shows.
const NEW = {
  en: [
    "Cristiano Ronaldo in the Portugal number 7 shirt at the 2018 FIFA World Cup",
    "Cristiano Ronaldo holding the Ballon d'Or he has won a record five times",
    "The European Cup and UEFA Champions League trophies, won five times by Cristiano Ronaldo",
    "The FIFA Club World Cup Golden Ball trophies in the CR7 Museum in Madeira",
    "Cristiano Ronaldo in the Real Madrid number 7 shirt, in a La Liga he won twice",
  ],
  es: [
    "Cristiano Ronaldo con la camiseta número 7 de Portugal en el Mundial de la FIFA de 2018",
    "Cristiano Ronaldo sosteniendo el Ballon d'Or que ha ganado un récord de cinco veces",
    "Las copas de la Copa de Europa y de la UEFA Champions League, ganadas cinco veces por Cristiano Ronaldo",
    "Los trofeos Golden Ball de la FIFA Club World Cup en el museo CR7 de Madeira",
    "Cristiano Ronaldo con la camiseta número 7 del Real Madrid, en una La Liga que ganó dos veces",
  ],
  pt: [
    "Cristiano Ronaldo com a camisa número 7 de Portugal na Copa do Mundo da FIFA de 2018",
    "Cristiano Ronaldo com o Ballon d'Or que ganhou um recorde de cinco vezes",
    "As taças da Taça Europeia e da UEFA Champions League, ganhas cinco vezes por Cristiano Ronaldo",
    "Os troféus Golden Ball da FIFA Club World Cup no museu CR7 da Madeira",
    "Cristiano Ronaldo com a camisa número 7 do Real Madrid, numa La Liga que ganhou duas vezes",
  ],
  fr: [
    "Cristiano Ronaldo en maillot numéro 7 du Portugal lors de la Coupe du monde 2018",
    "Cristiano Ronaldo tenant le Ballon d'Or qu'il a remporté un record de cinq fois",
    "Les coupes de la Coupe d'Europe et de la UEFA Champions League, remportées cinq fois par Cristiano Ronaldo",
    "Les trophées Golden Ball de la FIFA Club World Cup au musée CR7 de Madère",
    "Cristiano Ronaldo en maillot numéro 7 du Real Madrid, dans une Liga qu'il a remportée deux fois",
  ],
  ar: [
    "كريستيانو رونالدو بقميص البرتغال رقم 7 في كأس العالم 2018",
    "كريستيانو رونالدو يحمل الكرة الذهبية التي فاز بها خمسة مرات وهو رقم قياسي",
    "كؤوس دوري أبطال أوروبا وكأس دوري أبطال أوروبا التي فاز بها كريستيانو رونالدو خمس مرات",
    "كؤوس الكرة الذهبية لبطولة كأس العالم للأندية في متحف CR7 بماديرا",
    "كريستيانو رونالدو بقميص ريال مدريد رقم 7، في دوري ليجا فاز به مرتين",
  ],
  bn: [
    "২০১৮ FIFA বিশ্বকাপে পর্তুগালের ৭ নম্বর জার্সিতে ক্রিস্টিয়ানো রোনালদো",
    "ক্রিস্টিয়ানো রোনালদো রেকর্ড পাঁচবার জেতা বলন ডি'অর তুলে ধরে আছেন",
    "ক্রিস্টিয়ানো রোনালদো পাঁচবার জেতা ইউরোপীয় কাপ ও ইউএফএ চ্যাম্পিয়ন্স লিগের কাপ",
    "মাদেরার CR7 জাদুঘরে FIFA ক্লাব ওয়ার্ল্ড কাপের গোল্ডেন বল ট্রফি",
    "রিয়েল মাদ্রিদের ৭ নম্বর জার্সিতে ক্রিস্টিয়ানো রোনালদো, দুবার জেতা লা লিগায়",
  ],
  hi: [
    "2018 FIFA विश्व कप में पुर्तगाल की 7 नंबर की जर्सी में क्रिस्टियानो रोनाल्डो",
    "क्रिस्टियानो रोनाल्डो रिकॉर्ड पाँच बार जीतने वाला बलन डी'ऑर पकड़े हुए",
    "यूरोपीय कप और UEFA चैंपियंस लीग के कप, जो क्रिस्टियानो रोनाल्डो ने पाँच बार जीते",
    "मदेरा के CR7 संग्रहालय में FIFA क्लब वर्ल्ड कप के गोल्डन बॉल ट्रॉफी",
    "रियल मैड्रिड की 7 नंबर की जर्सी में क्रिस्टियानो रोनाल्डो, दो बार जीती गई ला लीगा में",
  ],
  ro: [
    "Cristiano Ronaldo în tricoul cu numărul 7 al Portugaliei la Cupa Mondială FIFA din 2018",
    "Cristiano Ronaldo ținând Balonul de Aur câștigat de un record de cinci ori",
    "Cupele Cuppei Europei și UEFA Champions League, câștigate de cinci ori de Cristiano Ronaldo",
    "Trofee Golden Ball ale FIFA Club World Cup din muzeul CR7 din Madeira",
    "Cristiano Ronaldo în tricoul cu numărul 7 al Real Madrid, într-o La Liga câștigată de două ori",
  ],
  uz: [
    "2018 FIFA Jahon Kupida Portugaliyaning 7-raqamli futbolkasida Kristiano Ronaldo",
    "Kristiano Ronaldo rekord daraja bes marta qozgani Balon d'orni ushlab turibdi",
    "Kristiano Ronaldo bes marta yutgan Yevropa kubogi va UEFA Champions League kuboklari",
    "Maderadagi CR7 muzeyida FIFA Klub Jahon Kubogi Golden Ball kuboklari",
    "Real Madridning 7-raqamli futbolkasida Kristiano Ronaldo, ikki marta yutgan La Liga'da",
  ],
};

const dir = path.join(ROOT, "src", "i18n");
for (const lang of Object.keys(NEW)) {
  const f = path.join(dir, lang + ".js");
  let t = fs.readFileSync(f, "utf8");
  const start = t.indexOf("export const CABINET = [");
  if (start < 0) { console.log("  " + lang + ": no CABINET array"); continue; }
  const end = t.indexOf("];", start);
  if (end < 0) { console.log("  " + lang + ": the CABINET array is not closed"); continue; }
  let seg = t.slice(start, end);
  let i = 0;
  seg = seg.replace(/alt: "[^"]*"/g, () => {
    const v = NEW[lang][i++] || "";
    return 'alt: ' + JSON.stringify(v);
  });
  if (i !== 5) { console.log("  " + lang + ": found " + i + " alt entries, expected 5"); continue; }
  t = t.slice(0, start) + seg + t.slice(end);
  fs.writeFileSync(f, t, "utf8");
  console.log("ok  " + lang + ": the cabinet's five alt texts now describe the photographs");
}
