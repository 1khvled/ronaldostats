import fs from "node:fs";
import path from "node:path";
const ROOT = "D:/Projects/ronaldo-stats/";
const LANGS = ["es","pt","fr"];

const OLD_B = "Text record, not a video.";
const NEW_B = "Watch the goal.";
const OLD_REST = "RonaldoStats does not host, embed or stream match footage. The panel below is the published record of the goal: number, date, opponent, competition, score, minute, finish type and career total. Where a scoreline is not published it is shown as an em dash.";
const NEW_REST = "RonaldoStats does not host the footage, but it links to it: the clip the CR7 goal archive publishes for this goal, the video of every goal of that season, and a search for the goal itself — and it plays the clips it can, in the player above. The panel below is the published record: number, date, opponent, competition, score, minute, finish type and career total. Where a scoreline is not published it is shown as an em dash.";

const B = {
  es: "Mira el gol.",
  pt: "Assiste ao golo.",
  fr: "Regardez le but.",
};
const REST = {
  es: "RonaldoStats no aloja la footage, pero te lleva a ella: el clip que publica el archivo de goles del CR7 para este gol, el vídeo de todos los goles de esa temporada y una búsqueda del propio gol — y reproduce los clips que puede, en el reproductor de arriba. El panel de abajo es el registro publicado: número, fecha, rival, competición, marcador, minuto, tipo de definición y total de carrera. Cuando no se publica un resultado, se muestra con un guion largo.",
  pt: "O RonaldoStats não aloja as imagens, mas leva-te até elas: o clip que o arquivo de golos do CR7 publica para este golo, o vídeo de todos os golos dessa época e uma pesquisa pelo próprio golo — e reproduz os clips que pode, no leitor acima. O painel abaixo é o registo publicado: número, data, adversário, competição, resultado, minuto, tipo de finalização e total de carreira. Quando não há resultado publicado, mostra-se um travessão.",
  fr: "RonaldoStats n'héberge pas les images, mais il vous y mène : le clip que l'archive des buts du CR7 publie pour ce but, la vidéo de tous les buts de la saison et une recherche sur le but lui-même — et il lit les clips qu'il peut, dans le lecteur ci-dessus. Le panneau ci-dessous est le relevé publié : numéro, date, adversaire, compétition, score, minute, type de finition et total en carrière. Quand un score n'est pas publié, il est affiché avec un tiret cadratin.",
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
