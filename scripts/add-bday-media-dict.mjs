// Add the BDAY_MEDIA dictionary (the birthday page's media panel copy) to
// every language module, and make the English module the source of truth.
//
//   node scripts/add-bday-media-dict.mjs
import fs from "node:fs";
import path from "node:path";

const DIR = "D:/Projects/ronaldo-stats/src/i18n";
const LANGS = ["en","es","pt","fr"];

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
