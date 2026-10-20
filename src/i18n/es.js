// ES dictionary — RonaldoStats
// Traducción del diccionario de inglés (src/i18n/en.js). Estructura idéntica
// a la de los demás idiomas: mismas claves, mismo orden y mismas firmas de
// función. Los valores son copia editorial; las rutas (href) no se tocan.

export const HOME = {
    locale: "es-ES",
    shirt10: "Camiseta número 7",
    head: (t, p, d) => `<b>${n(t.goals)} goles</b> en <b>${n(t.apps)} partidos oficiales</b> — con Sporting CP, Manchester United, Real Madrid, Juventus y ${esc(p.current.join(" y "))}. Campeón de Europa y quíntuplo ganador del Ballon d'Or, contado a mano y verificado dos veces, al ${esc(d.lastUpdated)}.`,
    meta: (p, dob) => `${esc(p.name)}, nacido el ${dob} en ${esc(p.birthplace)}. Tiene ${p.age} años, juega de ${esc(p.position.toLowerCase() === "forward" ? "delantero" : p.position.toLowerCase())} y actualmente está en ${esc(p.current.join(" y "))}.`,
    roleLabel: "Rol",
    teamsLabel: "Equipos",
    nowLabel: "Ahora",
    kpiCareer: "Goles en su carrera",
    kpiCareerNote: (gpg, seasons) => `${gpg} goles por partido a lo largo de ${seasons} temporadas de club.`,
    kpiApps: "Partidos oficiales",
    kpiAppsNote: (clubs, country) => `${clubs} en club, ${country} con Portugal.`,
    kpiArg: "Goles con Portugal",
    kpiArgNote: (gpg, caps) => `${gpg} por partido en ${caps} partidos.`,
    kpiTrophies: "Títulos colectivos",
    kpiTrophiesNote: (lang) => `Más <b>5 Ballons d'Or</b> y <b>4 Botas de Oro Europeas</b>. <a href="/${lang}/achievements">Palmarés completo</a>.`,
    kpiRoad: "Camino a los 1.000 goles",
    kpiRoadNote: (togo, projYear, pace) => `Faltan ${togo}. Proyección aproximada al ritmo actual (~${pace.toFixed(0)} por año): los 1.000 llegarían hacia ${projYear}.`,
    copyStatsBtn: "Copiar las cifras principales",
    copyText: (goals, apps, clubGoals, argGoals, updated) => `Ronaldo: ${goals} goles en ${apps} partidos oficiales (${clubGoals} en club, ${argGoals} con Portugal), ${LIVE.trophies} títulos colectivos, 5 Ballons d'Or — al ${updated}.`,
    copyMsg: "Copiado — pégalo donde quieras.",
    clubCaption: (updated, lang) => `Partidos y goles en cada equipo de primer equipo en el que ha jugado Cristiano Ronaldo, al ${updated}. El desglose por competición está en la <a href="/${lang}/goalsbyseason">página de goles por temporada</a>.`,
    thTeam: "Equipo y años",
    thApps: "Partidos",
    thGoals: "Goles",
    thGpg: "Goles por partido",
    thTotal: "Total de carrera",
    yearSub: "Elige un año y mira cómo sube el total acumulado — desde su debut en 2002 hasta hoy.",
    yearTitle: "Estadísticas de Ronaldo por año natural",
    yearLabel: "Año",
    yearFigcap: (start, cur, prov, lang) => `Goles por año natural, de ${start} a ${cur}${prov ? " (en curso)" : ""} — con un máximo de 69 en 2013. <a href="/${lang}/goalsbyyear">Abrir la tabla completa</a>.`,
    tileGoals: (year, prov) => `Goles en ${year}${prov ? " (hasta ahora)" : ""}`,
    tileTotal: (year) => `Total de carrera tras ${year}`,
    tileAge: (year) => `Edad durante ${year}`,
    records: (best, post30, pct) => [
      [`69`, `<b>Goles en 2013</b>, los más que ha marcado en un solo año natural — ${best.goals} en todas las competiciones.`],
      [`5`, `<b>Ballons d'Or</b> (2008, 2013, 2014, 2016, 2017) — con cuatro Botas de Oro Europeas.`],
      [`311`, `<b>Goles en La Liga</b> para el Real Madrid, récord histórico de la competición.`],
      [`140`, `<b>Goles en Champions League</b> en 183 partidos, el récord en la historia de la competición.`],
      [post30, `<b>Goles desde los 30 años</b> — alrededor del ${pct}% de todo su total de carrera, anotados desde 2015.`],
      [`66`, `<b>Hat-tricks o más</b> con clubes y selección a lo largo de su carrera profesional (recuento provisional).`],
      [`${LIVE.trophies}`, `<b>Títulos colectivos</b> — 32 con clubes y 3 con Portugal.`]
    ],
    silverCaption: () => `${LIVE.trophies} títulos colectivos en primer equipo, club por club, más los principales premios individuales. Algunos medios citan 36–37 porque cuentan la Supercopa de la UEFA y las supercopas nacionales de otra manera: la lista detallada de aquí suma ${LIVE.trophies}.`,
    silverThTrophy: "Título",
    silverThTimes: "Veces",
    silverThNote: "Nota",
    silverRows: [
      ["Títulos colectivos — Real Madrid", "15", "De 2009 a 2018, incluidos 4 Champions League"],
      ["Títulos colectivos — Manchester United", "9", "De 2003 a 2009, incluidos Champions League y Club World Cup en 2008"],
      ["Títulos colectivos — Juventus", "5", "Serie A dos veces, Coppa Italia y 2 Supercoppa Italiana"],
      ["Títulos colectivos — Portugal", "3", "Euro 2016, Nations League 2019 y 2025"],
      ["Títulos colectivos — Al Nassr", "2", "Arab Club Champions Cup 2023, Saudi Pro League 2026"],
      ["Títulos colectivos — Sporting CP", "1", "Supertaça Cândido de Oliveira 2002"],
      ["Ballon d'Or", "5", "2008, 2013, 2014, 2016, 2017"]
    ],
    splitFk: "Goles de tiro libre",
    splitFkNote: "Marcados en falta directa con clubes y selección (recuento compilado provisional).",
    splitPen: "Goles de penalti",
    splitPenNote: "Algo menos de uno de cada cinco de todos sus goles (recuento compilado provisional).",
    splitHt: "Hat-tricks o más",
    splitHtNote: "Partidos con tres o más goles, en todas las competiciones.",
    splitCaveat: (tot) => `El desglose por tiro libre, penalti y parte del cuerpo es un recuento compilado ampliamente publicado, provisional hasta que termine el recuento manual partido por partido. El total de ${tot} no se ve afectado.`,
    faq: (t, agg, m, d, lang) => [
      ["¿Cuántos goles ha marcado Cristiano Ronaldo en total a lo largo de su carrera?", `<b>${n(t.goals)} goles oficiales de carrera</b> en ${n(t.apps)} partidos oficiales con clubes y selección al ${esc(d.lastUpdated)}, con un promedio de ${t.goalsPerGame} goles por partido. Consulta su <a href="/${lang}/goalsbyyear">desglose de goles año a año</a>.`],
      ["¿Cuántas asistencias tiene Cristiano Ronaldo en su carrera?", `Cristiano Ronaldo ha registrado <b>${n(LIVE.assists)} asistencias oficiales de carrera</b> — el recuento compilado ampliamente publicado — y <b>${n(LIVE.tmAssists)} asistencias</b> según los criterios más amplios de Transfermarkt, en ${n(t.apps)} partidos. Su desglose: ${n(d.totals?.assists?.byTeam?.real_madrid?.official || 152)} para el Real Madrid, ${n(d.totals?.assists?.byTeam?.manchester_united?.official || 66)} para el Manchester United, ${n(d.totals?.assists?.byTeam?.juventus?.official || 20)} para la Juventus, ${n(d.totals?.assists?.byTeam?.al_nassr?.official || 9)} para el Al Nassr y ${n(d.totals?.assists?.byTeam?.portugal?.official || 14)} para Portugal.`],
      ["¿Cuáles son los totales de goles y asistencias de Cristiano Ronaldo?", `A lo largo de su carrera profesional, Cristiano Ronaldo ha acumulado <b>${n(LIVE.ga)} contribuciones de gol oficiales</b> (<b>${n(t.goals)} goles</b> y <b>${n(LIVE.assists)} asistencias oficiales</b>) en ${n(t.apps)} partidos, un promedio de <b>0.93 participaciones directas en goles por partido</b>. Con los criterios de Transfermarkt, el total asciende a <b>${n(LIVE.tmGa)} participaciones en goles</b> (${n(t.goals)} goles + ${n(LIVE.tmAssists)} asistencias).`],
      ["¿Quién tiene mejores estadísticas históricas, Ronaldo o Messi?", `En partidos oficiales de primer equipo, <b>Cristiano Ronaldo</b> ostenta el récord histórico de gol con <b>${n(t.goals)} goles</b> y ${n(LIVE.assists)} asistencias en ${n(t.apps)} partidos (${t.goalsPerGame} goles por partido), mientras que Messi suma <b>${n(LIVE.rGoals)} goles</b> y 408 asistencias en 1.181 partidos (0.79 goles por partido). Ronaldo alcanzó los ${n(t.goals)} goles en <b>159 partidos menos</b>, cuenta con ${LIVE.trophies} títulos colectivos en primer equipo frente a los ${LIVE.rTrophies} de Messi, y con 5 Ballons d'Or frente a los 8 de Messi. Compara sus récords completos cara a cara en nuestra <a href="/${lang}/ronaldo-vs-messi">página de estadísticas Ronaldo vs Messi</a>.`],
      ["¿Cómo se reparten los goles de la carrera de Ronaldo por club?", `<b>${n(t.clubs.goals)} goles de club</b> en ${n(t.clubs.apps)} partidos de club — ` + ["Real Madrid", "Manchester United", "Juventus", "Al Nassr", "Sporting CP"].map((c) => {
        const rows = (d.clubSeasons || []).filter((s) => s.club === c);
        const apps = rows.reduce((a, s) => a + s.apps, 0);
        const goals = rows.reduce((a, s) => a + s.goals, 0);
        return `${c} ${n(goals)} en ${n(apps)}`;
      }).join(" · ") + ` — más <b>${n(t.country.goals)} goles</b> en ${n(t.country.apps)} partidos con Portugal. Consulta las <a href="/${lang}/goalsbyseason">estadísticas de club temporada a temporada</a>.`],
      ["¿Cuántos goles de tiro libre directo ha marcado Ronaldo?", `Cristiano Ronaldo ha marcado <b>66 goles de tiro libre directo</b> en el fútbol profesional, además de <b>184 penaltis en 220 intentos</b> y 731 goles en jugada abierta: un recuento compilado provisional hasta que se termine el recuento manual completo.`],
      ["¿Cuántos hat-tricks ha marcado Ronaldo?", `Ronaldo ha marcado <b>${n(d.hatTricks)} hat-tricks</b> de carrera con clubes y selección (recuento provisional), incluidos <b>10 con Portugal</b>: récord mundial para un jugador internacional.`],
      ["¿Cuántos goles de penalti ha marcado Ronaldo?", `Ronaldo ha marcado <b>184 goles de penalti</b> en 220 intentos entre clubes y selección: una tasa de acierto del 83.6%.`],
      ["¿Cuántos goles que no son de penalti ha marcado Cristiano Ronaldo?", `Ronaldo ha marcado <b>${n(t.goals - (m?.penalties || 184))} goles que no son de penalti</b> en ${n(t.apps)} partidos (${((t.goals - (m?.penalties || 184)) / t.apps).toFixed(2)} goles que no son de penalti por partido): el 81% de todo lo que ha marcado en su vida.`],
      ["¿Cuántos goles marcó Ronaldo en 2013?", `<b>69 goles oficiales en 2013</b> (59 del Real Madrid y 10 de Portugal): el mayor año natural de su carrera, y un año que trajo un hat-trick con Portugal en 15 minutos contra Irlanda del Norte. Consulta nuestro <a href="/${lang}/goalsbyyear">rastreador de estadísticas de 2013</a>.`],
      ["¿Cuántos títulos ha ganado Cristiano Ronaldo?", `<b>${n(LIVE.trophies)} títulos colectivos en primer equipo</b> — 32 con clubes (Real Madrid 15, Manchester United 9, Juventus 5, Al Nassr 2, Sporting CP 1) y 3 con Portugal (Euro 2016, Nations League 2019 y 2025), más 5 Ballons d'Or. Algunos medios citan 36–37 porque cuentan de otra forma la Supercopa de la UEFA y las supercopas nacionales. Consulta la <a href="/${lang}/achievements">lista completa de títulos</a>.`],
      ["¿Cuántos Ballons d'Or ha ganado Cristiano Ronaldo?", `Cristiano Ronaldo ha ganado <b>5 Ballons d'Or</b> (2008, 2013, 2014, 2016, 2017): el primero en 2008, con 23 años, cuando fue nombrado en las 96 papeletas.`],
      ["¿Cuál es el récord de Ronaldo en el Real Madrid?", `El récord de Ronaldo en El Clásico con el Real Madrid — y todos los goles que ha marcado contra el Real Madrid con otra camiseta — está recopilado en nuestra <a href="/${lang}/real-madrid">página de Ronaldo en el Real Madrid</a>.`],
      ["¿Cuáles son las estadísticas de Ronaldo en la UEFA Champions League?", `Ronaldo ha marcado <b>140 goles en 183 partidos de Champions League</b>: el récord histórico de la competición, con <b>42 asistencias</b>, también récord, y 5 títulos (2008, 2014, 2016, 2017, 2018). Consulta todos los datos en nuestro <a href="/${lang}/champions-league">centro de Champions League</a>.`],
      ["¿Cuáles son las estadísticas de Ronaldo en la Copa del Mundo?", `Ronaldo ha jugado en <b>seis Copas del Mundo</b> (2006, 2010, 2014, 2018, 2022 y 2026) y sigue siendo el máximo goleador de la historia de Portugal, con <b>146 goles en 234 partidos</b>: récord absoluto internacional en ambas categorías.`],
      ["¿Qué le falta a Cristiano Ronaldo para los 1.000 goles de carrera?", `Con ${n(t.goals)} goles, Ronaldo necesita <b>${Math.max(0, 1000 - t.goals)} goles más</b> para alcanzar los 1.000 goles de carrera, una marca que ningún jugador ha alcanzado en el fútbol profesional.`]
    ]
  };

export const BY_YEAR = {
    head: (ys, best, t) => `Desde su primer gol oficial en ${ys[0].year} hasta los <b>${best.goals} goles en ${best.year}</b> — cada año natural de una carrera que produjo ${n(t.goals)} goles, con totales acumulados y su edad.`,
    cap: (best, t) => `Barras: goles de ese año (máximo ${best.goals}, en ${best.year}). Línea: ascenso acumulado hasta ${n(t.goals)}.`,
    chartLabel: (best) => `Goles de Ronaldo por año natural con el total acumulado de carrera, con un máximo de ${best.goals} en ${best.year}`,
    kpiCareer: "Goles de carrera",
    kpiBest: "Mejor año",
    kpiBestSub: "Los más que ha marcado en un año natural.",
    kpiCurrSub: "Temporada en curso.",
    kpiYears: "Años goleador",
    kpiYearsSub: (ys, last) => `Cada año desde ${ys[0].year} hasta ${last.year}.`,
    decades: "Goles de la década",
    tableSub: "Más recientes primero. 2026 lleva un asterisco mientras la temporada sigue en curso. Haz clic en una columna para ordenar o escribe para filtrar. Los años récord llevan una nota al pie: pasa el ratón por encima del año.",
    caption: "Goles, total acumulado de carrera y edad de cada año natural desde el debut de Ronaldo en 2002.",
    thYear: "Año", thGoals: "Goles", thTotal: "Total de carrera", thAge: "Edad",
    inProgNote: "* Temporada 2026 en curso: se actualiza después de cada partido.",
    filterPlaceholder: "Filtrar años — ej. 2013",
    bestYearHtml: (best) => `<p><b>${best.year} es el año natural más prolífico de la carrera de Ronaldo: ${best.goals} goles</b> — 59 del Real Madrid y 10 de Portugal. Trajo el segundo Ballon d'Or, una temporada de club con 55 goles y tres tantos con Portugal en 15 minutos contra Irlanda del Norte.</p><p>Los años inmediatamente posteriores —2012 (63), 2014 (61) y 2011 (60)— muestran hasta dónde se mantuvo el listón a lo largo de cinco temporadas seguidas, de 2010 a 2014. <a href="/en/dashboard">Mira cómo se reparten esos goles por competición</a>.</p>`
  };

export const BY_SEASON = {
    head: (best) => `Todas las temporadas de club de 2002/03 a 2026/27 — <b>mejor: ${best.goals} goles en ${best.season}</b> — con desglose de liga, copa y competición continental, más Portugal año a año.`,
    clubSub: "Partidos / goles en cada formato. 2026/27 es la temporada en curso. Haz clic en una columna para ordenar o escribe para filtrar.",
    caption: (len) => `Las ${len} temporadas de club: Sporting CP 2002/03, Manchester United 2003/04–2008/09 y 2021/22–2022/23, Real Madrid 2009/10–2017/18, Juventus 2018/19–2021/22, Al Nassr 2022/23–2026/27.`,
    thSeason: "Temporada", thClub: "Club", thApps: "Partidos", thGoals: "Goles", thLeague: "Liga", thCup: "Copa", thCont: "Continental", thOther: "Otros",
    totalLabel: "Total de club", bestBadge: "Mejor temporada de club",
    filterClubPlaceholder: "Filtrar temporadas — ej. Real Madrid, 2012",
    countrySub: "Eliminatorias y torneos oficiales, además de amistosos, los más recientes primero.",
    countryCaption: "Goles con Portugal por año natural, de 2003 a 2026.",
    thYear: "Año", thNote: "Nota", totalArgLabel: "Total con Portugal",
    filterCountryPlaceholder: "Filtrar años con Portugal — ej. 2016",
    bestSeasonHtml: (best) => `<p><b>${best.season} — ${best.goals} goles en ${best.apps} partidos con ${best.club}</b> — es la temporada de club más prolífica de su carrera: ${best.league.goals} en la liga, ${best.continental.goals} en la Champions League, ${best.cup.goals} en la copa y ${best.other.goals} en las supercopas. Marcó en todas las competiciones en las que participó.</p><p>Supera por poco al legendario 2011/12 —60 goles, 46 de ellos en La Liga— dentro de una racha de seis temporadas en el Madrid en las que nunca bajó de 51 goles de club. <a href="/en/goalsbyyear">Los mismos goles contados por año natural</a>.</p>`
  };

export const DASH = {
  teamNames: { all: "todos los equipos", real_madrid: "Real Madrid", manchester_united: "Manchester United", juventus: "Juventus", al_nassr: "Al Nassr", sporting_cp: "Sporting CP", portugal: "Portugal" },
  pills: [["all", "Todos los equipos"], ["real_madrid", "Real Madrid"], ["manchester_united", "Manchester United"], ["juventus", "Juventus"], ["al_nassr", "Al Nassr"], ["sporting_cp", "Sporting CP"], ["portugal", "Portugal"]],
  head: (name) => `Cada gol de Ronaldo, cortado de cuatro maneras —por competición, por temporada, por definición y por parte del cuerpo— filtrado para <b>${esc(name)}</b>. Toca un equipo para rehacer todos los gráficos.`,
  filterNote: (name, goals, apps, T) => `Mostrando ${name}: ${n(goals)} goles en ${n(apps)} partidos` + (T === "real_madrid" ? " (Champions League: 140 goles en 183 partidos con 42 asistencias: las tres son récords de la competición)." : "."),
  kpis: { goals: "Goles", apps: "Partidos", gpg: "Goles por partido", forTeam: (name) => `Con ${name}.` },
  chartEmpty: "No hay filas para este filtro de equipo.",
  figCap: (T, name) => T === "all" ? "Años naturales, de 2002 a 2026." : ["portugal", "portugal_nt", "country"].includes(T) ? "Años naturales con Portugal." : "Temporadas de club de " + esc(name) + ".",
  finishParts: { "Open play": "Jugada abierta", "Penalties": "Penaltis", "Free kicks": "Tiros libres" },
  finishCenter: "goles de carrera",
  finishCaveat: "Totales de carrera de todos los equipos juntos: no existe un desglose por equipo. Recuento compilado provisional.",
  finishCaveatFiltered: (d) => `No existe un desglose por equipo según la definición del gol, así que este gráfico solo cubre el conjunto de todos los equipos: consulta los totales de carrera más abajo. Los ${n(d.totals.goals)} goles de Ronaldo se reparten en ${d.byFinish.openPlay} en jugada abierta, ${d.byFinish.penalties} penaltis y ${d.byFinish.freeKicks} tiros libres (recuento compilado provisional).`,
  bodyParts: { "Left foot": "Pie izquierdo", "Right foot": "Pie derecho", "Head": "Cabeza", "Other": "Otro" },
  bodyCenter: "goles con el pie derecho",
  bodyCaveat: "Totales de carrera de todos los equipos juntos: un recuento compilado provisional, hasta que termine el recuento manual completo.",
  ageName: (r) => `Edad ${r.age} · ${r.year}`,
  ageCaveat: (apeak) => `Cada gol de primer equipo según la edad a la que lo marcó — clubes y selección juntos. Máximo: ${apeak.goals} goles a los ${apeak.age} años (${apeak.year}).`,
  ageFilterNote: "Las edades combinan goles de club y de selección, así que este gráfico cubre solo la carrera completa: quita el filtro de equipo para verlo.",
  compCaption: (name) => `Goles por competición — ${esc(name)}.`,
  thComp: "Competición", thGoals: "Goles", thShare: "Porcentaje",
  recAllTime: "Récord histórico de la competición",
  finishCaption: "Cómo se marcaron los goles y con qué parte del cuerpo — totales de carrera, todos los equipos.",
  thFinish: "Definición",
  finishCaveatTable: "El desglose por definición del gol y por parte del cuerpo es un recuento compilado provisional.",
  finishRows: (d) => [
    ["Jugada abierta", d.byFinish.openPlay],
    ["Penaltis", d.byFinish.penalties],
    ["Tiros libres", d.byFinish.freeKicks],
    ["Pie izquierdo", d.byBodyPart.left],
    ["Pie derecho", d.byBodyPart.right],
    ["Cabeza", d.byBodyPart.head],
    ["Otro (pecho, etc.)", d.byBodyPart.other]
  ],
  teamCardSub: { goals: "goles", apps: "partidos", gpg: "por partido", of: "de" },
  records: (comp, d) => [
    ["69", `<b>Goles en 2013</b> — los más que ha marcado en un año natural.`],
    [n(comp("La Liga")), `<b>Goles en La Liga</b>, récord histórico de la competición, todos con el Real Madrid.`],
    ["140", `<b>Goles en Champions League</b> — el récord en la historia de la competición.`],
    ["5", `<b>Ballons d'Or</b> (2008, 2013, 2014, 2016, 2017).`],
    [n(d.hatTricks), `<b>Hat-tricks o más</b> con clubes y selección (recuento provisional).`],
    [`${LIVE.trophies}`, `<b>Títulos colectivos</b> — 32 con clubes y 3 con Portugal.`]
  ],
  method: "Las cifras de la Champions League (140 goles en 183 partidos, 42 asistencias) son récords de la competición tomados de los libros de récords del club y de la UEFA; el resto de desgloses por competición filtrados por equipo sigue el mapeo de competiciones por temporada de club y está documentado en el archivo de datos."
};

export const TIMELINE = {
  head: (t) => `Desde su debut con el Sporting CP en 2002 hasta los <b>${n(t.goals)} goles de carrera</b> y contando — las noches decisivas, los récords y los trofeos, fechados y en orden.`,
  keydates: (t, lastUpdated) => [
    ["14 Ago 2002", "Debut profesional con el <b>Sporting CP</b> ante el Inter en la tercera ronda de clasificación de la Champions League, con 17 años."],
    ["20 Ago 2003", "Debut con <b>Portugal</b> contra Kazajistán, semanas después de vestir la legendaria camiseta número 7 del Manchester United."],
    ["2008", "<b>Ballon d'Or</b> a los 23 años, nombrado en las 96 papeletas, con la Champions League y la FIFA Club World Cup."],
    ["2013", "<b>69 goles</b> en el año natural: su mejor marca, con un hat-trick con Portugal en 15 minutos."],
    ["2016", "Levanta la <b>Eurocopa</b> como capitán de Portugal, con tres goles y la Bota de Plata."],
    [esc(lastUpdated), `<b>${n(t.goals)} goles de carrera</b> entre clubes y selección: última verificación en esta fecha.`]
  ],
  inProg: "en curso",
  goals: "goles",
  goalsInEra: (goals, share, total) => `<b>${n(goals)} goles</b> · ${share}% de ${n(total)}`,
  peakYear: (pk, tr) => `<p class="ch-callout">Año cumbre <b>${pk.year} · ${pk.goals} goles</b>` + (tr ? ` · <b>${tr}</b> ${tr === 1 ? "título colectivo" : "títulos colectivos"} ganados en este periodo` : "") + `</p>`,
  empty: (val, total) => `Nada coincide con “${val}” — borra la búsqueda para ver los ${total} hitos.`,
  tagRecord: "Récord", tagWc: "Mundial", tagFirst: "Primero",
  faq: [
    ["¿Cuándo jugó Ronaldo su debut profesional?", "Con el <b>Sporting CP</b> el <b>14 de agosto de 2002</b> ante el Inter en la tercera ronda de clasificación de la Champions League, con 17 años; sus primeros goles profesionales llegaron dos meses después, ante el Moreirense."],
    ["¿Cuándo marcó Ronaldo su primer gol?", "Su primer gol con Portugal fue un testarazo contra <b>Grecia en la Euro 2004</b>; ese mismo año, su primer gol con el Manchester United fue un tiro libre contra el Portsmouth."],
    ["¿Cuándo ganó Ronaldo la Champions League?", "Por primera vez en <b>2008</b> con el Manchester United y luego cuatro veces seguidas con el Real Madrid, en <b>2014, 2016, 2017 y 2018</b>."],
    ["¿Cuándo fichó Ronaldo por el Real Madrid?", "En <b>junio de 2009</b>, por una cifra récord en la historia de los traspasos, con 80.000 aficionados en el Bernabéu para su presentación."],
    ["¿Cuándo fichó Ronaldo por el Al Nassr?", "En <b>enero de 2023</b>, con un debut como capitán ante el Al-Ettifaq en el que marcó dos goles en un empate a 2–2."]
  ],
  method: "Las entradas de la cronología son hitos con granularidad de año y fecha; las barras de goles por era dividen los años naturales en tramos que no se solapan, de modo que suman el total de la carrera."
};

export const ACH = {
  head: (teamTotal) => `<b>${teamTotal} títulos colectivos</b> — 32 con clubes y 3 con Portugal — más <b>5 Ballons d'Or</b>. Todos los títulos, club por club, con el año en que se ganaron.`,
  kpis: (per) => [
    ["Títulos colectivos", 35, `Real Madrid ${per["Real Madrid"] || 0} · Manchester United ${per["Manchester United"] || 0} · Juventus ${per["Juventus"] || 0} · Portugal ${per["Portugal"] || 0}.`],
    ["Ballons d'Or", "5", "2008, 2013, 2014, 2016, 2017."],
    ["Botas de Oro Europeas", "4", "2008, 2011, 2014, 2015."],
    ["Temporadas como máximo goleador de la UCL", "7", "Máximo goleador de la Champions League en 2008 y luego en todas las temporadas de 2013 a 2018."]
  ],
  qa: (teamTotal, per) => [
    ["¿Cuántos títulos ha ganado Ronaldo?", `<b>${teamTotal} títulos colectivos en primer equipo</b>: ${per["Real Madrid"] || 0} del Real Madrid, ${per["Manchester United"] || 0} del Manchester United, ${per["Juventus"] || 0} de la Juventus, ${per["Al Nassr"] || 0} del Al Nassr, ${per["Sporting CP"] || 0} del Sporting CP y ${per["Portugal"] || 0} con Portugal.`],
    ["¿Cuántos Ballons d'Or ha ganado Ronaldo?", "<b>Cinco</b>: 2008, 2013, 2014, 2016 y 2017; el primero, con 23 años."],
    ["¿Ha ganado Ronaldo un título internacional importante?", "<b>Sí</b>: la UEFA Euro 2016 como capitán y la UEFA Nations League en 2019 y 2025."],
    ["¿Cuántas Champions League ha ganado Ronaldo?", "<b>Cinco</b>: 2008 con el Manchester United y luego 2014, 2016, 2017 y 2018 con el Real Madrid."]
  ],
  teamHeader: (team, sub) => `${esc(team)} — ${sub} títulos`,
  indHeader: (indTotal) => `Distinciones individuales — ${indTotal} premios`,
  faq: [
    ["¿Cuál es el trofeo más importante de Ronaldo?", "La <b>Eurocopa de 2016</b>: el título que capitaneó con Portugal en París, siendo el segundo máximo goleador del torneo."],
    ["¿Cuántos títulos de liga ha ganado Ronaldo?", "<b>Ocho</b>: 3 de Premier League, 2 de La Liga, 2 de Serie A y 1 de la Saudi Pro League, tal como se detalla en el palmarés de este archivo."],
    ["¿Cuántos premios individuales ha ganado Ronaldo?", "Cinco Ballons d'Or, cuatro Botas de Oro Europeas, tres premios UEFA de Mejor Jugador del Año, el FIFA World Player of the Year de 2008, el premio FIFA Puskás de 2009, la Bota de Oro de la Euro 2020 y The Best FIFA Men's Player en 2016 y 2017."],
    ["¿Es Ronaldo el jugador más laureado de la historia?", "Solo en títulos colectivos, Messi va por delante con 46 frente a los 35 de Ronaldo. Ronaldo lidera los récords de gol: 981 goles, 140 de ellos en la Champions League, y 146 goles en 234 partidos con Portugal."]
  ]
};

export const BDAY = {
    months: ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    badgeSuccess: "🎉 ¡Sí! ¡Ronaldo marcó en tu cumpleaños!",
    badgeMessi: "🎂 ¡El propio cumpleaños de CR7!",
    badgeEmpty: "Sin goles en esta fecha",
    headlineSuccess: (g, m, d) => `¡Cristiano Ronaldo marcó <b>${g} ${g === 1 ? "gol" : "goles"}</b> en <b>${m} ${m === 1 ? "partido" : "partidos"}</b> el ${d} a lo largo de su carrera profesional!`,
    headlineMessi: `¡Compartes cumpleaños con <b>Cristiano Ronaldo</b> (nacido el 5 de febrero de 1985 en Funchal, Madeira)!`,
    headlineEmpty: (d) => `Cristiano Ronaldo no ha marcado ningún gol el <b>${d}</b> a lo largo de su carrera profesional.`,
    whyZeroTitle: "¿Por qué 0 goles?",
    whyZeroMessi: "El 5 de febrero cae en pleno centro de la temporada europea de clubes, así que para Ronaldo suele ser un día de partido cualquiera: el calendario de partidos y los minutos que disputa deciden si marca algún gol en la fecha en que nació.",
    whyZeroMessiSub: "Compartes tu día especial con Cristiano Ronaldo, CR7, nacido el 5 de febrero de 1985.",
    emptyExpl: "Ronaldo no tenía partido programado ese día exacto del calendario, o no marcó, pero ha marcado en la mayoría de los días del año entre clubes y selección.",
    closestDay: (d, g) => `El día del calendario más cercano en el que Ronaldo marcó es el <b>${d}</b> (${g} goles de carrera).`,
    closestBtn: (d, g) => `Comprobar ${d} (${g} goles) &rarr;`,
    watchClip: (cnt) => `Ver ${cnt > 1 ? cnt + " vídeos de goles" : "vídeo del gol"}`,
    searchYt: "🔍 Buscar resúmenes",
    playInline: "📺 Reproducir aquí",
    closeInline: "✕ Cerrar vídeo",
    ytHighlights: "Resúmenes en YouTube",
    goalSummary: (g) => `${g} ${g === 1 ? "gol" : "goles"} marcados:`,
    goalTab: (idx, min) => `Gol ${idx}${min ? ` (${min}')` : ""}`,
    shareSuccess: (d, g, m) => `¡Cristiano Ronaldo marcó ${g} goles en ${m} partidos el día de mi cumpleaños (${d})! Comprueba tu fecha:`,
    shareEmpty: (d) => `¿Marcó Cristiano Ronaldo en tu cumpleaños? Ha marcado en la mayoría de los días del año entre clubes y selección. Comprueba la tuya:`,
  };

export const LATEST_GOAL = {
    goalPrefix: "Gol n.º",
    scoreline: "Resultado",
    didScoreTodayYes: "¡SÍ! Cristiano Ronaldo marcó hoy: gol n.º {goalNum} en el minuto {minute} ante {opp} ({score})!",
    didScoreTodayNo: "¿Marcó Ronaldo hoy? El último partido oficial de Cristiano Ronaldo se disputó el {date} en {comp}, donde marcó su gol n.º {goalNum} en el minuto {minute} para cerrar una victoria de {score}. Reproduce aquí mismo el vídeo oficial del gol.",
    matchResult: "Resultado del último partido: {title}",
    goalBadge: "Gol n.º {goalNum} marcado ({minute})",
    playHighlight: "Selecciona cualquiera de los últimos goles de Cristiano Ronaldo para cargar al instante el vídeo del gol en el reproductor de arriba:",
    viewDateGoals: "Ver los goles del {formattedDate} →",
    tagHeader: "Cabezazo 🔥",
    tagFreekick: "Tiro libre directo 🔥",
    tagPenalty: "Penalti",
    tagLeftFoot: "Disparo con el pie izquierdo",
    tagRightFoot: "Pie derecho",
    tagOpenPlay: "Jugada abierta",
    assist: "Asistencia"
  };

export const ARG_STREAM = {
    badge: "🇵🇹 PARTIDO DE PORTUGAL",
    title: "El Portugal de Cristiano Ronaldo",
    text: "Noche de Portugal: mira el directo EN VIVO gratis y SIN ANUNCIOS.",
    highlight: "Directo gratis • Sin anuncios",
    cta: "Ver el directo gratis ▶",
    closeAria: "Cerrar notificación",
    matchCardTitle: "Portugal Internacional • Noche de partido en directo",
    matchCardDesc: "Mira a Cristiano Ronaldo y Portugal en directo en Koora Live: directo gratis, cero anuncios."
  };

export const EXPLORE_LANGS = [
  { href: "/en/birthday", page: "birthday", t: "🎂 ¿Marcó Ronaldo en tu cumpleaños?", d: (d) => `Busca entre los 366 días del año con vídeos de los ${n(d.totals.goals)} goles de la carrera profesional de Ronaldo.` },
  { href: "/en/ronaldo-vs-messi", page: "ronaldo-vs-messi", t: "🐐 Ronaldo vs Messi de la historia", d: () => `Estadísticas cara a cara: ${n(LIVE.goals)} vs ${n(LIVE.rGoals)} goles, ${LIVE.trophies} vs ${LIVE.rTrophies} títulos, 5 vs 8 Ballons d'Or.` },
  { href: "/en/real-madrid", page: "real-madrid", t: "🏟️ Ronaldo en el Real Madrid", d: () => "Sus nueve años en el Real Madrid: 450 goles, 311 en La Liga, cuatro Champions League y 18 en el Clásico." },
  { href: "/en/champions-league", page: "champions-league", t: "⭐ Récord en la Champions League", d: () => "140 goles en la UEFA Champions League, 42 asistencias y 5 títulos europeos." },
  { href: "/en/latest-goal", page: "latest-goal", t: "⚽ Último gol de Ronaldo en vídeo", d: () => "Mira el vídeo de su último gol, comprueba si ha marcado hoy y revisa los vídeos recientes." },
  { href: "/en", page: "home", t: "Estadísticas de la carrera de Ronaldo", d: (d) => `Las cifras clave: ${n(d.totals.goals)} goles en ${n(d.totals.apps)} partidos oficiales.` },
  { href: "/en/dashboard", page: "dashboard", t: "Panel de estadísticas de Ronaldo", d: () => "Filtra todos los gráficos por Real Madrid, Manchester United, Juventus, Al Nassr, Sporting CP o Portugal." },
  { href: "/en/timeline", page: "timeline", t: "Ronaldo a lo largo de los años", d: () => "Cada hito de su carrera, fechado y en orden, de 2002 hasta hoy." },
];

/* Aperturas de capítulo por era. El renderer busca primero la introducción
   por el slug de la era (rosario, peak, msn, carry, farewell, paris, miami)
   y, si no la encuentra, cae en el nombre de la era, así que ambas claves
   apuntan aquí al mismo texto de Ronaldo — sin tocar app.js. */
export const ERA_INTROS = {
  "The boy from Rosario":
    `Cristiano Ronaldo llegó a Lisboa desde Funchal, en Madeira, siendo un adolescente con fama de veloz y con la costumbre de pedir el balón. Su primera temporada en Primera División con el Sporting CP le dio cinco goles en 31 partidos y, en apenas doce meses, se puso la legendaria camiseta número 7 del Manchester United por 12.24 millones de libras. Marcó en la final de la FA Cup con 19 años, ganó tres Premier League, la Champions League y la FIFA Club World Cup, y en 2008 fue nombrado mejor jugador del mundo con 23 años: las 96 papeletas a su favor.`,
  "The greatest peak football has seen":
    `El Real Madrid pagó una cifra récord en 2009 y se llevó el talento ofensivo más caro de la historia del deporte. Él respondió con un testarazo en la final de la Copa del Rey contra el Barcelona en su primera temporada y, después, con un título de La Liga ganado con un récord de 100 puntos y 46 goles en liga. Para finales de 2012 había alcanzado los 60 goles en un año natural y los 100 en La Liga para el club, y la identidad ofensiva del Madrid se estaba reconstruyendo a su alrededor.`,
  "MSN and the second treble":
    `Tres temporadas en el Madrid llevaron a Ronaldo a rebasar casi cada marca del libro de récords. Marcó 69 goles en 2013, su mejor año natural, incluidos tres con Portugal en quince minutos contra Irlanda del Norte: uno de sus diez hat-tricks internacionales, récord mundial. La Décima llegó en 2014 y, a finales de 2015, su gol número 500 en la carrera ya lo había puesto por delante de cualquier maxi-goleador de la historia de la Champions League.`,
  "Carrying Barcelona":
    `Tras la Eurocopa de 2016 ganada en Francia, Ronaldo añadió la Champions League en 2017 —con un hat-trick contra el Bayern Múnich que lo llevó a los 100 goles en la competición— y un quinto Ballon d'Or en la misma temporada. Superó a Jimmy Greaves como máximo goleador de las cinco grandes ligas europeas y, a los 33 años, fichó por la Juventus, donde marcó un hat-trick en su primer partido de Champions League.`,
  "Farewell to Barcelona":
    `El título de la Nations League y su sitio en los libros de récords llegaron en 2019, con su gol número 700 en la carrera ante Ucrania en octubre. Su partido oficial número 1.000 llegó ante el Cagliari en febrero de 2020 y, en 2021, superó a Ali Daei para convertirse en el máximo goleador de la historia del fútbol internacional masculino, con su décimo hat-trick internacional: récord mundial.`,
  "Paris and the World Cup":
    `Su regreso al Manchester United en 2021 trajo la camiseta número 7 y un nuevo escenario para el veteranísimo de la plantilla; en 2022 superó a Josef Bican con un hat-trick contra el Tottenham. El salto a Arabia Saudí en enero de 2023 lo convirtió en capitán del Al Nassr y, con su partido internacional número 197, en el jugador con más presencias en el fútbol internacional masculino.`,
  "Miami and the road to 1,000":
    `El Al Nassr le dio un nuevo comienzo y un título de la Saudi Pro League, pero los récords siguieron llegando: el gol 900 de su carrera en la Nations League en 2024, el gol 800 de club y el 100 para el Al Nassr en 2025 —convirtiéndolo en el primer jugador en marcar 100 goles para cuatro clubes— y, en 2026, el gol 500 marcado después de cumplir los 30 y una sexta Copa del Mundo. Cada gol dobla ahora la curva hacia los 1.000.`
};
/* Claves alias: los slugs de era (y los slugs más cortos de la era de
   Ronaldo) resuelven a los mismos siete párrafos, así que los capítulos de
   la cronología se abren siempre con el texto de Ronaldo, sea cual sea la
   clave que use el renderer. */
Object.assign(ERA_INTROS, {
  rosario: ERA_INTROS["The boy from Rosario"],
  peak: ERA_INTROS["The greatest peak football has seen"],
  msn: ERA_INTROS["MSN and the second treble"],
  carry: ERA_INTROS["Carrying Barcelona"],
  farewell: ERA_INTROS["Farewell to Barcelona"],
  paris: ERA_INTROS["Paris and the World Cup"],
  miami: ERA_INTROS["Miami and the road to 1,000"],
  lisbon: ERA_INTROS["The boy from Rosario"],
  united: ERA_INTROS["The boy from Rosario"],
  madrid: ERA_INTROS["The greatest peak football has seen"],
  firstballon: ERA_INTROS["The greatest peak football has seen"],
  juve: ERA_INTROS["Farewell to Barcelona"],
  ronaldo2: ERA_INTROS["Paris and the World Cup"],
  nassr: ERA_INTROS["Miami and the road to 1,000"],
});

export const CABINET = [
    { title: "Portugal y la Copa del Mundo", sub: "Seis Copas del Mundo (2006–2026) y 146 goles en 234 partidos con Portugal.", src: "/img/cab-wc.webp", w: 800, h: 600, pos: "50% 30%", alt: "Cristiano Ronaldo con la camiseta número 7 de Portugal en el Mundial de la FIFA de 2018", cap: "El máximo goleador de la historia de Portugal, en seis Copas del Mundo" },
    { title: "Ballon d'Or — 5", sub: "2008, 2013, 2014, 2016, 2017 — el primero, con 23 años.", src: "/img/cab-ballon.webp", w: 800, h: 600, pos: "50% 30%", alt: "Cristiano Ronaldo sosteniendo el Ballon d'Or que ha ganado un récord de cinco veces", cap: "Cinco Ballons d'Or" },
    { title: "Champions League — 5", sub: "140 goles, récord de la competición, en 183 partidos.", src: "/img/cab-ucl.webp", w: 800, h: 600, pos: "50% 25%", alt: "Las copas de la Copa de Europa y de la UEFA Champions League, ganadas cinco veces por Cristiano Ronaldo", cap: "Cinco títulos europeos y 140 goles en la Champions League" },
    { title: "FIFA Club World Cup — 4", sub: "2008, 2014, 2016 y 2017 con el Manchester United y el Real Madrid.", src: "/img/cab-cwc.webp", w: 800, h: 600, pos: "50% 25%", alt: "Los trofeos Golden Ball de la FIFA Club World Cup en el museo CR7 de Madeira", cap: "Cuatro FIFA Club World Cup" },
    { title: "La Liga — 311 goles", sub: "El récord histórico de la competición, todos con el Real Madrid.", src: "/img/cab-liga.webp", w: 800, h: 600, pos: "50% 25%", alt: "Cristiano Ronaldo con la camiseta número 7 del Real Madrid, en una La Liga que ganó dos veces", cap: "311 goles en La Liga para el Real Madrid" }
  ];

export const BDAY_MEDIA = {
    "searchHighlights": "🔍 Buscar jugadas",
    "openArchive": "Abrir en el archivo de goles de CR7",
    "noClip": "No hay clip publicado de este gol.",
    "noClipBody": "El registro del partido de abajo procede de las actas oficiales. Los enlaces abren la página del gol en el archivo y una búsqueda del footage.",
    "clipLabel": "Clip publicado",
    "seasonNote": "Todos los goles que marcó Ronaldo en la temporada {season}.",
    "compilationNote": "Este gol aparece en una compilación de todos los goles. Usa el enlace del archivo para encontrar su posición exacta.",
    "compilationLabel": "Compilación de todos sus goles",
    "publisher": "Publicado por",
    "assist": "Asistencia: {name}",
    "finish": "Finalización: {type}",
    "goalNumber": "Gol n.º {n}",
    "watchOn": "Ver en {publisher}",
    "sourceLine": "Registro del gol: {source} — el archivo toma su lista de la Wikipedia, List of senior career goals by Cristiano Ronaldo (CC BY-SA 4.0, sobre el registro de goles de FBref), y de StatsBomb open data. Los clips los publican sus titulares de derechos.",
    "sourceNote": "Las fechas, competiciones, marcadores, minutos, finalizaciones y asistencias de esta página proceden de cr7allgoals.com, cuya lista de goles es la de Wikipedia, List of senior career goals by Cristiano Ronaldo (CC BY-SA 4.0, sobre el registro de FBref), con StatsBomb open data para los detalles de los partidos revisados. La lista internacional es el registro de apariciones de RSSSF: 146 goles en 234 partidos con Portugal. Cuando el minuto nunca se publicó, se deja vacío en lugar de inventarlo."
  };
