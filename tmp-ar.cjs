// One-off: complete the Arabic shell dictionary.
// - appends the 56 keys listed in ar.missing.json
// - drops every key that no longer exists in en.json
// - preserves the existing key order and appends the new keys at the end
const fs = require('fs');
const path = require('path');

const dir = path.join('src', 'i18n', 'shell');
const enPath = path.join(dir, 'en.json');
const arPath = path.join(dir, 'ar.json');
const missPath = path.join(dir, 'ar.missing.json');

const T = {
  "(0.73 goals per game), 35 trophies, and 5 Ballons d'Or across Sporting CP, Manchester United, Real Madrid, Juventus, Al Nassr and Portugal. Explore every":
    "(0.73 هدفاً في المباراة)، 35 لقباً، و5 Ballons d'Or مع سبورتينغ ومانشستر يونايتد وريال مدريد ويوفنتوس والنصر والبرتغال. استكشف كل",
  "0.73 goals per match": "0.73 هدفاً في المباراة",
  "1,242 goal contributions (G+A), 0.93 per match": "1,242 مساهمة في الأهداف (G+A)، 0.93 في المباراة",
  "1,340 senior appearances": "1,340 ظهوراً في المحترفين",
  "261 assists": "261 تمريرة حاسمة",
  "Across his senior professional career for club and country (2002\u20132026),":
    "خلال مسيرته الاحترافية في المحترفين مع الأندية والمنتخب (2002\u20132026)،",
  "Al Nassr \u00b7 Portugal": "النصر \u00b7 البرتغال",
  "CR7": "CR7",
  "Career statistics": "إحصاءات المسيرة",
  "Copy Embed Code": "انسخ رمز التضمين",
  "Cristiano Ronaldo &amp; Lionel Messi \u2014 two overlapping careers, 36 direct club meetings, and a statistical archive that records the results without ruling on them.":
    "كريستيانو رونالدو &amp; ليونيل ميسي \u2014 مساران متداخلان، و36 مواجهة مباشرة بين الأندية، وأرشيف إحصائي يسجّل النتائج دون أن يحكم فيها.",
  "Cristiano Ronaldo Official Career Record: 981 Goals &amp; 261 Assists":
    "السجل الرسمي لمسيرة كريستيانو رونالدو: 981 هدفاً &amp; 261 تمريرة حاسمة",
  "Cristiano Ronaldo Stats: 981 Goals, 1,340 Matches &amp; 35 Trophies":
    "إحصاءات كريستيانو رونالدو: 981 هدفاً، و1,340 مباراة &amp; 35 لقباً",
  "Cristiano Ronaldo Total Goals and Assists Official Record":
    "السجل الرسمي لإجمالي أهداف وتمريرات كريستيانو رونالدو الحاسمة",
  "Cristiano Ronaldo and Lionel Messi, side by side: all-time goals, appearances, assists, set pieces, trophies, international records and every one of the 36 direct club meetings. The numbers are sourced; the verdict is the reader's.":
    "كريستيانو رونالدو وليونيل ميسي جنباً إلى جنب: أهداف تاريخية، وظهورات، وتمريرات حاسمة، وكرة ثابتة، وألقاب، وأرقام قياسية دولية، وكل واحدة من الـ36 مواجهة مباشرة بين الأندية. والأرقام مستمدة من مصادرها؛ والخلاصة متروكة للقارئ.",
  "Cristiano Ronaldo by club season \u2014 1,106 club appearances and 835 club goals across 27 seasons, Sporting CP 2002/03 to Al Nassr 2026/27":
    "كريستيانو رونالدو حسب الموسم مع الأندية \u2014 1,106 ظهوراً و835 هدفاً مع الأندية عبر 27 موسماً، من سبورتينغ 2002/03 إلى النصر 2026/27",
  "Cristiano Ronaldo stats": "لإحصاءات كريستيانو رونالدو",
  "Cristiano Ronaldo \u00b7 Portugal &amp; Al Nassr": "كريستيانو رونالدو \u00b7 البرتغال &amp; النصر",
  "Forward": "مهاجم",
  "Goal alerts, milestones and community chat, straight to your phone. It's free \u2014 and every new member helps keep RonaldoStats alive. Love the site?":
    "تنبيهات الأهداف والمحطات والدردشة المجتمعية، مباشرة إلى هاتفك. وهي مجانية \u2014 وكل عضو جديد يساعد في إبقاء RonaldoStats حيّاً. هل يعجبك الموقع؟",
  "Head-to-Head &amp; Complete Career Comparison": "المواجهات المباشرة &amp; المقارنة الكاملة للمسيرة",
  "Join the RonaldoStats community": "انضم إلى مجتمع RonaldoStats",
  "Never miss a Ronaldo goal \u2014 join us &amp; support RonaldoStats":
    "لا يفوتك أي هدف لرونالدو \u2014 انضم إلينا &amp; ادعم RonaldoStats",
  "Now": "الآن",
  "Player profile": "الملف الشخصي للاعب",
  "Role": "الدور",
  "Ronaldo &amp; Messi": "رونالدو &amp; ميسي",
  "Ronaldo stat": "إحصاء رونالدو",
  "RonaldoStats Home": "الصفحة الرئيسية لـRonaldoStats",
  "RonaldoStats Logo": "شعار RonaldoStats",
  "Shirt number 7": "رقم القميص 7",
  "Shop official Ronaldo gear on Amazon": "تسوّق منتجات رونالدو الرسمية على أمازون",
  "Sporting CP \u00b7 Manchester United \u00b7 Real Madrid \u00b7 Juventus \u00b7 Al Nassr":
    "سبورتينغ \u00b7 مانشستر يونايتد \u00b7 ريال مدريد \u00b7 يوفنتوس \u00b7 النصر",
  "Stat": "إحصاء",
  "Teams": "الفرق",
  "The Eternal Duel:": "الدور الأبدى:",
  "The Verified Cristiano Ronaldo Statistics &amp; Video Database":
    "قاعدة بيانات إحصاءات &amp; مقاطع فيديو كريستيانو رونالدو الموثّقة",
  "The verified": "قاعدة البيانات الموثّقة",
  "database:": ":",
  "has recorded": "سجّل",
  "in": "في",
  "or": "أو",
  "support us on Ko-fi": "ادعمنا على Ko-fi",
  "to cover hosting and video streaming costs.": "لتغطية تكاليف الاستضافة وبث الفيديو.",
  "updated live after each match.": "يُحدَّث مباشرة بعد كل مباراة.",
  "\u2014 an average of": "\u2014 بمعدل",
  "\u2694\ufe0f 36 DIRECT HEAD-TO-HEAD MATCHES \u00b7 13 BALLONS D'OR BETWEEN THEM":
    "\u2694\ufe0f 36 مواجهة مباشرة \u00b7 13 Ballons d'Or بينهما",
  "\u26bd Forward #7": "\u26bd مهاجم #7",
  "\u2708\ufe0f Join Telegram Channel": "\u2708\ufe0f انضم إلى قناة تيليجرام",
  "\u2713 Primary Source \u00b7 Verified October 2026": "\u2713 مصدر أساسي \u00b7 موثّق في أكتوبر 2026",
  "\u2b50 5 Ballons d'Or": "\u2b50 5 Ballons d'Or",
  "\ud83c\udf82 Born 5 February 1985 \u00b7 41": "\ud83c\udf82 وُلد في 5 فبراير 1985 \u00b7 41",
  "\ud83c\udfc6 35 Trophies": "\ud83c\udfc6 35 لقباً",
  "\ud83d\udc55 Ronaldo Store \ud83d\udecd\ufe0f": "\ud83d\udc55 متجر رونالدو \ud83d\udecd\ufe0f",
  "\ud83d\udccd Funchal, Madeira, Portugal": "\ud83d\udccd فونشال، ماديرا، البرتغال",
  "\ud83d\udccf 1.87 m": "\ud83d\udccf 1.87 m",
};

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const ar = JSON.parse(fs.readFileSync(arPath, 'utf8'));
const missing = JSON.parse(fs.readFileSync(missPath, 'utf8'));

const enKeys = new Set(Object.keys(en));
const out = {};

// 1. keep the existing order, drop the obsolete keys
for (const k of Object.keys(ar)) {
  if (enKeys.has(k)) out[k] = ar[k];
}

// 2. append the new keys, in the order of the missing list
for (const k of missing) {
  if (!(k in T)) throw new Error('no translation authored for: ' + JSON.stringify(k));
  if (!(k in en)) throw new Error('missing key not in en.json: ' + JSON.stringify(k));
  if (k in out) throw new Error('key already present: ' + JSON.stringify(k));
  out[k] = T[k];
}

// 3. sanity: exact key-set match with en.json
const outKeys = Object.keys(out);
const missingAfter = outKeys.filter((k) => !enKeys.has(k));
const absent = Object.keys(en).filter((k) => !(k in out));
if (missingAfter.length || absent.length) {
  throw new Error('key set mismatch. extra: ' + JSON.stringify(missingAfter) + ' absent: ' + JSON.stringify(absent));
}

fs.writeFileSync(arPath, JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log('written. keys:', outKeys.length, '| en keys:', Object.keys(en).length);
