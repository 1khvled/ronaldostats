// ES dictionary — RonaldoStats
// Extracted verbatim from the original inline dictionaries by
// scripts/refactor-i18n.mjs. Structure is identical across all 9 languages.

export const HOME = {
    locale: "es-ES",
    shirt10: "Camiseta número 10",
    head: (t, p, d) => `<b>${n(t.goals)} goles oficiales</b> en <b>${n(t.apps)} partidos profesionales</b> con Barcelona, PSG, Inter Miami y Selección Argentina al ${esc(d.lastUpdated)}. Campeón del mundo y récord de 8 Balones de Oro.`,
    meta: (p, dob) => `${esc(p.name)}, nacido el ${dob} en ${esc(p.birthplace)}. Tiene ${p.age} años, juega como delantero y milita en ${esc(p.current.join(" e "))}.`,
    roleLabel: "Rol",
    teamsLabel: "Equipos",
    nowLabel: "Actualidad",
    kpiCareer: "Goles en su carrera",
    kpiCareerNote: (gpg, seasons) => `${gpg} goles por partido en ${seasons} temporadas de clubes.`,
    kpiApps: "Partidos oficiales",
    kpiAppsNote: (clubs, country) => `${clubs} en clubes, ${country} con Argentina.`,
    kpiArg: "Goles con Argentina",
    kpiArgNote: (gpg, caps) => `${gpg} por partido en ${caps} encuentros internacionales.`,
    kpiTrophies: "Títulos colectivos",
    kpiTrophiesNote: (lang) => `Récord histórico de ${LIVE.trophies} títulos y 8 Balones de Oro. <a href="/${lang}/achievements">Palmarés completo</a>.`,
    kpiRoad: "Camino a los 1.000 goles",
    kpiRoadNote: (togo, projYear, pace) => `Faltan ${togo} goles. Al ritmo actual (~${pace.toFixed(0)} por año), alcanzará los 1.000 hacia ${projYear}.`,
    copyStatsBtn: "Copiar estadísticas",
    copyText: (goals, apps, clubGoals, argGoals, updated) => `Messi: ${goals} goles en ${apps} partidos oficiales (${clubGoals} en clubes, ${argGoals} con Argentina), ${LIVE.trophies} títulos colectivos, 8 Balones de Oro — al ${updated}.`,
    copyMsg: "Copiado al portapapeles.",
    clubCaption: (updated, lang) => `Partidos y goles en cada equipo senior para Lionel Messi, al ${updated}. Desglose por competición en la <a href="/${lang}/goalsbyseason">página de temporadas</a>.`,
    thTeam: "Equipo y años",
    thApps: "PJ",
    thGoals: "Goles",
    thGpg: "Goles / PJ",
    thTotal: "Total carrera",
    yearSub: "Elige un año y mira cómo crece el total acumulado, desde su debut en 2004 hasta hoy.",
    yearTitle: "Estadísticas de Messi por año natural",
    yearLabel: "Año",
    yearFigcap: (start, cur, prov, lang) => `Goles por año natural, ${start} a ${cur}${prov ? " (en curso)" : ""} — con récord de 91 en 2012. <a href="/${lang}/goalsbyyear">Abrir tabla completa</a>.`,
    tileGoals: (year, prov) => `Goles en ${year}${prov ? " (hasta hoy)" : ""}`,
    tileTotal: (year) => `Total acumulado tras ${year}`,
    tileAge: (year) => `Edad durante ${year}`,
    records: (best, post30, pct) => [
      [`91`, `<b>Goles en 2012</b>, el mayor registro en un año natural en la historia del fútbol mundial — ${best.goals} en todas las competiciones.`],
      [`8`, `<b>Balones de Oro</b> (2009–12, 2015, 2019, 2021, 2023) — récord absoluto en la historia del fútbol.`],
      [`474`, `<b>Goles en La Liga</b>, máximo goleador histórico de la liga española y de cualquier liga europea.`],
      [`129`, `<b>Goles en Champions League</b> — 120 con el Barcelona y 9 con el PSG, segundo máximo goleador histórico.`],
      [post30, `<b>Goles tras cumplir 30 años</b> — aproximadamente el ${pct}% de los goles de toda su carrera.`],
      [`57`, `<b>Hat-tricks o más</b> con clubes y selección absoluta en su carrera profesional.`],
      [`46`, `<b>Títulos colectivos</b> — el futbolista más laureado de la historia del fútbol, coronado por el Mundial 2022.`]
    ],
    silverCaption: () => `${LIVE.trophies} títulos oficiales de primer equipo, club por club, más premios individuales máximos.`,
    silverThTrophy: "Título",
    silverThTimes: "Veces",
    silverThNote: "Detalles",
    silverRows: [
      ["Títulos con el FC Barcelona", "35", "2005 a 2021, incluyendo 4 Champions League y 10 Ligas"],
      ["Títulos con la Selección Argentina", "5", "Mundial 2022, Copas América 2021 y 2024, Finalissima 2022, Oro Olímpico 2008"],
      ["Títulos con el Paris Saint-Germain", "3", "Ligue 1 2022 y 2023, Supercopa de Francia 2022"],
      ["Títulos con el Inter Miami", "4", "Leagues Cup 2023, Supporters' Shield 2024, MLS Cup 2025, Campeones Cup 2026"],
      ["Balón de Oro", "8", "Récord mundial — 2009–12, 2015, 2019, 2021, 2023"]
    ],
    splitFk: "Goles de tiro libre",
    splitFkNote: "Golazos de falta directa con clubes y selección.",
    splitPen: "Goles de penal",
    splitPenNote: "Aproximadamente uno de cada ocho goles en su carrera.",
    splitHt: "Hat-tricks o más",
    splitHtNote: "Partidos con 3 o más goles anotados.",
    splitCaveat: (tot) => `Los desgloses de penaltis y tiros libres son compilaciones oficiales provisionales. El total oficial de ${tot} goles no se ve afectado.`,
    faq: (t, agg, m, d, lang) => [
      ["¿Cuántos goles ha marcado Lionel Messi en total?", `<b>${n(t.goals)} goles oficiales</b> en ${n(t.apps)} partidos profesionales al ${esc(d.lastUpdated)}, con un promedio de ${t.goalsPerGame} goles por partido. Ver <a href="/${lang}/goalsbyyear">goles por año</a>.`],
      ["¿Cuántos goles marcó Messi en el Barcelona?", `<b>${n(agg.barcelona.goals)} goles</b> en ${n(agg.barcelona.apps)} partidos entre 2004 y 2021, incluyendo el récord de 474 en La Liga.`],
      ["¿Cuántos goles tiene en PSG e Inter Miami?", `<b>${agg.psg.goals} con el Paris Saint-Germain</b> y <b>${n(agg.miami.goals)} con el Inter Miami</b>.`],
      ["¿Cuántos goles ha marcado con Argentina?", `<b>${n(t.country.goals)} goles</b> en ${n(t.country.apps)} partidos internacionales desde 2005.`],
      ["¿Cuál fue el mejor año goleador de Messi?", `<b>2012, con 91 goles oficiales</b>, récord Guinness mundial para un año natural. Ver <a href="/${lang}/goalsbyyear">todos los años</a>.`],
      ["¿Cuántos títulos ha ganado Messi?", `<b>47 títulos oficiales</b> (35 con Barcelona, 3 con PSG, 4 con Inter Miami y 5 con Argentina). Ver <a href="/${lang}/achievements">palmarés</a>.`]
    ]
  };

export const BY_YEAR = {
    head: (ys, best, t) => `Desde su primer gol oficial en ${ys[0].year} hasta los <b>${best.goals} goles en ${best.year}</b> — cada año natural de una carrera de ${n(t.goals)} goles oficiales, con totales acumulados y su edad.`,
    cap: (best, t) => `Barras: goles en ese año (máximo ${best.goals}, en ${best.year}). Línea: ascenso acumulado hasta ${n(t.goals)}.`,
    chartLabel: (best) => `Goles de Messi por año natural con total acumulado de carrera, con récord de ${best.goals} en ${best.year}`,
    kpiCareer: "Goles de carrera",
    kpiBest: "Mejor año",
    kpiBestSub: "Récord mundial en un año natural.",
    kpiCurrSub: "Temporada en curso.",
    kpiYears: "Años marcando",
    kpiYearsSub: (ys, last) => `Cada año desde ${ys[0].year} hasta ${last.year}.`,
    decades: "Goles en los años",
    tableSub: "Más recientes primero. 2026 tiene asterisco mientras la temporada sigue jugándose. Clic en una columna para ordenar o escribe para filtrar.",
    caption: "Goles, total acumulado de carrera y edad por año natural desde su debut en 2004.",
    thYear: "Año", thGoals: "Goles", thTotal: "Total carrera", thAge: "Edad",
    inProgNote: "* Temporada 2026 en curso — se actualiza después de cada partido.",
    filterPlaceholder: "Filtrar años — ej. 2012",
    bestYearHtml: (best) => `<p><b>${best.year} es el año goleador más extraordinario de la historia del fútbol: ${best.goals} goles</b> — 79 con el Barcelona y 12 con Argentina — superando el récord de 40 años de Gerd Müller (85 goles). Incluyó una racha de 33 jornadas consecutivas anotando en liga y los 5 goles en Champions League contra el Bayer Leverkusen.</p><p>Los siguientes mejores años, 2011 (60 goles) y 2010 (60 goles), demuestran lo astronómico de su nivel. <a href="/es/dashboard">Ver cómo se dividen esos goles por competición</a>.</p>`
  };

export const BY_SEASON = {
    head: (best) => `Todas las temporadas de club desde 2004/05 hasta 2026 — <b>récord: ${best.goals} goles en ${best.season}</b> — con desglose de liga, copas y torneos internacionales, más Argentina año por año.`,
    clubSub: "Partidos / goles en cada formato. 2026 es la temporada en curso. Clic en una columna para ordenar o escribe para filtrar.",
    caption: (len) => `Todas las ${len} temporadas de club: Barcelona 2004/05–2020/21, PSG 2021/22–2022/23, Inter Miami 2023–2026.`,
    thSeason: "Temporada", thClub: "Club", thApps: "Partidos", thGoals: "Goles", thLeague: "Liga", thCup: "Copa", thCont: "Internacional", thOther: "Otros",
    totalLabel: "Total clubes", bestBadge: "Mejor temporada de club",
    filterClubPlaceholder: "Filtrar temporadas — ej. PSG, 2012",
    countrySub: "Eliminatorias y torneos oficiales más amistosos, los más recientes primero.",
    countryCaption: "Goles con la Selección Argentina por año natural, 2005 a 2026.",
    thYear: "Año", thNote: "Detalles", totalArgLabel: "Total Argentina",
    filterCountryPlaceholder: "Filtrar años de Argentina — ej. 2022",
    bestSeasonHtml: (best) => `<p><b>${best.season} — ${best.goals} goles en ${best.apps} partidos para el Barcelona</b> — es la temporada de club más prolífica de la historia del fútbol: 50 en La Liga (récord), 14 en la Champions League, 3 en la Copa del Rey y 6 en las supercopas. Marcó en todas las competiciones que disputó.</p><p>Forma parte de una racha de cuatro temporadas históricas (2009/10–2012/13) en las que nunca bajó de 53 goles en clubes. <a href="/es/goalsbyyear">Ver los mismos goles contados por año natural</a>.</p>`
  };

export const DASH = {
    teamNames: { all: "todos los equipos", barcelona: "Barcelona", psg: "PSG", miami: "Inter Miami", argentina: "Argentina" },
    pills: [["all", "Todos"], ["barcelona", "Barcelona"], ["psg", "PSG"], ["miami", "Inter Miami"], ["argentina", "Argentina"]],
    head: (name) => `Los 930 goles de Lionel Messi analizados de cuatro formas — por competición, por temporada, por definición y por parte del cuerpo — filtrados para <b>${esc(name)}</b>. Toca un equipo para actualizar todos los gráficos.`,
    filterNote: (name, goals, apps, T) => `Mostrando ${name}: ${n(goals)} goles en ${n(apps)} partidos` + (T === "barcelona" || T === "psg" ? " (Desglose en Champions League: Barcelona 120, PSG 9 — fuentes oficiales de los clubes)." : "."),
    kpis: { goals: "Goles", apps: "Partidos", gpg: "Promedio de gol", forTeam: (name) => `Con ${name}.` },
    chartEmpty: "No hay filas para este filtro de equipo.",
    figCap: (T, name) => T === "all" ? "Años naturales, 2004 a 2026." : T === "argentina" ? "Años naturales con Argentina." : "Temporadas de club con " + esc(name) + ".",
    finishParts: { "Open play": "Jugada abierta", "Penalties": "Penaltis", "Free kicks": "Tiros libres" },
    finishCenter: "goles carrera",
    finishCaveat: "Totales de carrera combinados de todos los equipos. Conteo verificado.",
    finishCaveatFiltered: (d) => `No existe desglose por remate por equipo individual — revisa los totales de carrera abajo. De sus ${n(d.totals.goals)} goles oficiales: ${d.byFinish.openPlay} jugada abierta, ${d.byFinish.penalties} penaltis y ${d.byFinish.freeKicks} tiros libres.`,
    bodyParts: { "Left foot": "Pie izquierdo", "Right foot": "Pie derecho", "Head": "Cabeza", "Other": "Otro (pecho, etc.)" },
    bodyCenter: "con la zurda",
    bodyCaveat: "Totales de carrera combinados de todos los equipos (conteo oficial verificado).",
    ageName: (r) => `Edad ${r.age} · ${r.year}`,
    ageCaveat: (apeak) => `Cada gol profesional según la edad a la que lo anotó — clubes y selección combinados. Máximo: ${apeak.goals} goles a los ${apeak.age} años (${apeak.year}).`,
    ageFilterNote: "Las edades combinan clubes y selección, por lo que este gráfico cubre toda la carrera — quita el filtro para verlo.",
    compCaption: (name) => `Goles por competición — ${esc(name)}.`,
    thComp: "Competición", thGoals: "Goles", thShare: "Porcentaje",
    recAllTime: "Récord histórico de la competición",
    finishCaption: "Cómo se marcaron los goles y con qué parte del cuerpo — totales de carrera, todos los equipos.",
    thFinish: "Definición / Parte del cuerpo",
    finishCaveatTable: "El desglose por remate y parte del cuerpo es un conteo oficial verificado.",
    finishRows: (d) => [
      ["Jugada abierta", d.byFinish.openPlay],
      ["Penaltis", d.byFinish.penalties],
      ["Tiros libres directos", d.byFinish.freeKicks],
      ["Pie izquierdo", d.byBodyPart.left],
      ["Pie derecho", d.byBodyPart.right],
      ["Cabeza", d.byBodyPart.head],
      ["Otro (pecho, etc.)", d.byBodyPart.other]
    ],
    teamCardSub: { goals: "goles", apps: "partidos", gpg: "por partido", of: "de" },
    records: (comp, d) => [
      ["91", `<b>Goles en 2012</b> — el récord mundial oficial en un año natural.`],
      [n(comp("La Liga")), `<b>Goles en La Liga</b> — récord histórico absoluto, todos con Barcelona.`],
      [n(comp("UEFA Champions League")), `<b>Goles en Champions League</b> — 120 Barcelona · 9 PSG.`],
      ["8", `<b>Balones de Oro</b> — récord histórico del fútbol (2009–12, 2015, 2019, 2021, 2023).`],
      [n(d.hatTricks), `<b>Hat-tricks o más</b> con clubes y selección absoluta.`],
      [`${LIVE.trophies}`, `<b>Títulos oficiales</b> — el futbolista más laureado de la historia.`]
    ],
    method: "Los goles en Champions League se dividen en Barcelona 120 y PSG 9 a partir de actas oficiales; el resto de competiciones siguen la distribución oficial de partidos documentada en los datos."
  };

export const TIMELINE = {
    head: (t) => `Desde su debut en Barcelona en 2004 hasta <b>${n(t.goals)} goles oficiales</b> y contando — las noches históricas, récords y trofeos en orden cronológico.`,
    keydates: (t, lastUpdated) => [
      ["16 Oct 2004", "Debut oficial con el <b>Barcelona</b> ante el Espanyol, con 17 años."],
      ["1 May 2005", "Primer gol oficial, ante el Albacete — el goleador más joven del Barcelona en ese momento."],
      ["17 Ago 2005", "Debut con la <b>Selección Argentina</b> absoluta ante Hungría."],
      ["2012", "<b>91 goles</b> en un año natural — récord mundial absoluto en la historia del fútbol."],
      ["18 Dic 2022", "Campeón de la <b>Copa del Mundo</b> con Argentina en Catar, marcando un doblete en la final."],
      [esc(lastUpdated), `<b>${n(t.goals)} goles oficiales</b> entre clubes y selección — última actualización.`]
    ],
    inProg: "en progreso",
    goals: "goles",
    goalsInEra: (goals, share, total) => `<b>${n(goals)} goles</b> · ${share}% de ${n(total)}`,
    peakYear: (pk, tr) => `<p class="ch-callout">Año cumbre <b>${pk.year} · ${pk.goals} goles</b>` + (tr ? ` · <b>${tr}</b> ${tr === 1 ? "título colectivo" : "títulos colectivos"} en esta etapa` : "") + `</p>`,
    empty: (val, total) => `Sin resultados para “${val}” — borra la búsqueda para ver los ${total} hitos.`,
    tagRecord: "Récord", tagWc: "Mundial", tagFirst: "Primero",
    faq: [
      ["¿Cuándo debutó Messi?", "Con el Barcelona el <b>16 de octubre de 2004</b> contra el Espanyol con 17 años y 114 días; con Argentina el 17 de agosto de 2005."],
      ["¿Cuándo marcó Messi su primer gol?", "El <b>1 de mayo de 2005</b> ante el Albacete — en ese momento el goleador más joven del Barcelona en La Liga."],
      ["¿Cuándo ganó Messi la Copa del Mundo?", "El <b>18 de diciembre de 2022</b>, venciendo a Francia por penales en Lusail tras empatar 3–3."],
      ["¿Cuándo se fue Messi del Barcelona?", "En <b>agosto de 2021</b>, fichando por el Paris Saint-Germain tras 21 años en el club catalán."],
      ["¿Cuándo llegó Messi al Inter Miami?", "En <b>julio de 2023</b>, ganando la Leagues Cup pocas semanas después de su llegada."]
    ],
    method: "Los hitos cronológicos están documentados por fecha exacta; las barras de goles dividen los años naturales en períodos consecutivos que suman el total de la carrera."
  };

export const ACH = {
    head: (teamTotal) => `<b>${teamTotal} títulos colectivos</b> — la carrera más condecorada en la historia del fútbol — más un récord de <b>8 Balones de Oro</b>. Todos los trofeos club por club y año por año.`,
    kpis: (per) => [
      ["Títulos colectivos", 46, `Barcelona ${per["Barcelona"] || 0} · Argentina ${per["Argentina"] || 0} · PSG ${per["Paris Saint-Germain"] || 0} · Miami ${per["Inter Miami"] || 0}.`],
      ["Balones de Oro", "8", "Récord histórico — 2009–12, 2015, 2019, 2021, 2023."],
      ["Champions Leagues", "4", "2006, 2009, 2011, 2015 — todas con el FC Barcelona."],
      ["Grandes torneos internacionales", "3", "Copa del Mundo 2022, Copas América 2021 y 2024."]
    ],
    qa: (teamTotal, per) => [
      ["¿Cuántos títulos ha ganado Messi?", `<b>${teamTotal} títulos oficiales en categoría absoluta</b>: ${per["Barcelona"] || 0} con Barcelona, ${per["Paris Saint-Germain"] || 0} con PSG, ${per["Inter Miami"] || 0} con Inter Miami y ${per["Argentina"] || 0} con Argentina.`],
      ["¿Cuántos Balones de Oro tiene Messi?", "<b>Ocho</b> — más que cualquier otro futbolista en la historia (2009–12, 2015, 2019, 2021, 2023)."],
      ["¿Ha ganado Messi la Copa del Mundo?", "<b>Sí — 2022</b>, anotando dos goles en la gran final frente a Francia, además de las Copas América 2021 y 2024."],
      ["¿Cuántas Champions League ha ganado Messi?", "<b>Cuatro</b>, todas con el Barcelona: 2006, 2009, 2011 y 2015."]
    ],
    teamHeader: (team, sub) => `${esc(team)} — ${sub} títulos`,
    indHeader: (indTotal) => `Distinciones individuales — ${indTotal} premios`,
    faq: [
      ["¿Cuál es el trofeo más importante de Messi?", "La <b>Copa del Mundo 2022</b> — el gran título que coronó su carrera, conquistado siendo elegido el mejor jugador del torneo."],
      ["¿Cuántos títulos de liga ha ganado Messi?", "<b>Doce ligas</b> — 10 con Barcelona, 2 con el PSG — además de la MLS Supporters' Shield (2024) y la Leagues Cup (2023) con Miami."],
      ["¿Cuántos premios individuales tiene Messi?", "Ocho Balones de Oro, seis Botas de Oro europeas y dos Balones de Oro del Mundial — cada uno un récord histórico."],
      ["¿Es Messi el jugador con más títulos de la historia?", "Sumando títulos colectivos y distinciones individuales — <b>sí, por cualquier criterio razonable</b>."]
    ]
  };

export const BDAY = {
    months: ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    badgeSuccess: "🎉 ¡Sí! Messi marcó en tu cumpleaños",
    badgeMessi: "🎂 ¡El propio cumpleaños de Leo Messi!",
    badgeEmpty: "Sin goles en esta fecha",
    headlineSuccess: (g, m, d) => `¡Lionel Messi marcó <b>${g} ${g === 1 ? "gol" : "goles"}</b> en <b>${m} ${m === 1 ? "partido" : "partidos"}</b> el ${d} a lo largo de su carrera senior!`,
    headlineMessi: `¡Compartes cumpleaños con <b>Lionel Andrés Messi</b> (nacido el 24 de junio de 1987 en Rosario)!`,
    headlineEmpty: (d) => `Lionel Messi no ha marcado el <b>${d}</b> durante su carrera senior.`,
    whyZeroTitle: "¿Por qué 0 goles?",
    whyZeroMessi: "Lionel Messi nunca ha jugado un partido oficial un 24 de junio porque finales de junio coincide con las vacaciones de verano de clubes o períodos de descanso entre fases de torneos de selecciones.",
    whyZeroMessiSub: "¡Compartes tu día especial con el mejor futbolista de todos los tiempos!",
    emptyExpl: "Messi no tuvo partido programado o no anotó en este día exacto — ¡pero ha marcado en <b>292 de los 366 días (79,8%)</b> del año!",
    closestDay: (d, g) => `El día de calendario más cercano en el que Messi marcó es el <b>${d}</b> (${g} goles).`,
    closestBtn: (d, g) => `Ver ${d} (${g} goles) &rarr;`,
    watchClip: (cnt) => `Ver ${cnt > 1 ? cnt + " videos de goles" : "video del gol"}`,
    searchYt: "🔍 Buscar resumen en YouTube",
    playInline: "📺 Reproducir aquí",
    closeInline: "✕ Cerrar video",
    ytHighlights: "Resumen en YouTube",
    goalSummary: (g) => `${g} ${g === 1 ? "gol anotado" : "goles anotados"}:`,
    goalTab: (idx, min) => `Gol ${idx}${min ? ` (${min}')` : ""}`,
    shareSuccess: (d, g, m) => `¡Lionel Messi marcó ${g} goles en ${m} partidos el día de mi cumpleaños (${d})! Comprueba el tuyo:`,
    shareEmpty: (d) => `¿Marcó Lionel Messi en tu cumpleaños? ¡Marcó en 292 de los 366 días del año! Comprueba el tuyo:`,
  };

export const LATEST_GOAL = {
    goalPrefix: "Gol #",
    scoreline: "Resultado",
    didScoreTodayYes: "¡SÍ! Lionel Messi anotó hoy: ¡Gol #{goalNum} en el minuto {minute} ante {opp} ({score})!",
    didScoreTodayNo: "¿Marcó Messi hoy? El partido oficial más reciente de Lionel Messi tuvo lugar el {date} en {comp}, donde anotó el Gol #{goalNum} de su carrera en el minuto {minute} para sellar el triunfo {score}. Mira el vídeo oficial arriba.",
    matchResult: "Resultado del partido más reciente: {title}",
    goalBadge: "Gol #{goalNum} marcado ({minute})",
    playHighlight: "Selecciona cualquiera de los goles recientes de Lionel Messi para reproducir el vídeo al instante:",
    viewDateGoals: "Ver goles del {formattedDate} →",
    tagHeader: "Cabezazo 🔥",
    tagFreekick: "Tiro libre directo 🔥",
    tagPenalty: "Penal",
    tagLeftFoot: "Disparo con zurda",
    tagRightFoot: "Pierna derecha",
    tagOpenPlay: "Jugada colectiva",
    assist: "Asistencia"
  };

export const ARG_STREAM = {
    badge: "🇦🇷 ÚLTIMO PARTIDO CON ARGENTINA",
    title: "Partido de Despedida de Lionel Messi",
    text: "¡El partido de despedida de Lionel Messi el 6 de octubre de 2026! Mira la transmisión EN VIVO gratis y SIN ANUNCIOS.",
    highlight: "Transmisión gratis en vivo • Sin anuncios",
    cta: "Ver Transmisión Gratis ▶",
    closeAria: "Cerrar notificación",
    matchCardTitle: "Partido Histórico de Despedida • 6 Oct 2026",
    matchCardDesc: "Mira el último partido internacional de Lionel Messi con Argentina en vivo en Koora Live sin anuncios."
  };

export const EXPLORE_LANGS = [
    { href: "/es/birthday", page: "birthday", t: "🎂 ¿Marcó Messi en tu cumpleaños?", d: (d) => `Busca entre los 366 días del año con clips de video de los ${n(d.totals.goals)} goles oficiales de Messi.` },
    { href: "/es/messi-vs-ronaldo", page: "messi-vs-ronaldo", t: "🐐 Messi vs Messi Histórico", d: () => `Estadísticas cara a cara: ${n(LIVE.goals)} vs ${n(LIVE.rGoals)} goles, ${LIVE.trophies} vs ${LIVE.rTrophies} títulos, 8 vs 5 Balones de Oro.` },
    { href: "/es/vs-real-madrid", page: "vs-real-madrid", t: "⚔️ Messi vs Real Madrid", d: () => "Los 26 goles en El Clásico, 45 partidos, 14 asistencias, hat-tricks y videos." },
    { href: "/es/champions-league", page: "champions-league", t: "⭐ Récord en Champions League", d: () => "129 goles en UEFA Champions League, 8 hat-tricks y 4 títulos europeos." },
    { href: "/es/latest-goal", page: "latest-goal", t: "⚽ Último gol de Messi en video", d: () => "Mira el video del último gol de Messi, consulta si marcó hoy y reproduce sus últimos goles." },
    { href: "/es", page: "home", t: "Estadísticas de Messi", d: (d) => `Las cifras clave: ${n(d.totals.goals)} goles en ${n(d.totals.apps)} partidos profesionales.` },
    { href: "/es/dashboard", page: "dashboard", t: "Panel interactivo de Messi", d: () => "Filtra todos los gráficos por Barcelona, PSG, Inter Miami o Argentina." },
    { href: "/es/timeline", page: "timeline", t: "Lionel Messi en el tiempo", d: () => "Cada hito histórico de su carrera, fechado y en orden, de 2004 a hoy." },
  ];

export const ERA_INTROS = {
    rosario: `Un joven de 17 años de Rosario debuta contra el Espanyol en octubre de 2004, y en pocos meses el Camp Nou corea su nombre. Su primer gol llega ante el Albacete en mayo siguiente —picando el balón sobre el portero tras asistencia de Ronaldinho— convirtiéndose en el goleador más joven del Barcelona. Para 2008 ya lucía el oro olímpico en su cuello.`,
    peak: `Seis títulos en 2009. Cuatro Balones de Oro consecutivos. Luego 2012: 91 goles en un solo año natural, rompiendo un récord intacto durante cuatro décadas —incluyendo cinco goles en una noche europea contra el Leverkusen. La cima futbolística más deslumbrante de la historia.`,
    msn: `Messi, Suárez y Neymar: el tridente ofensivo más letal del fútbol moderno, sellando el segundo triplete en 2015 en Berlín. Su gol en la final de la Copa del Rey de esa primavera, superando a media defensa del Athletic Club, es una de las mayores obras de arte del fútbol.`,
    carry: `La legendaria remontada 6–1 al PSG en 2017, la icónica celebración de la camiseta 10 en el Bernabéu y otro doblete de Liga y Copa en 2018 liderando al equipo con actuaciones magistrales en cada jornada.`,
    farewell: `El sexto Balón de Oro, la Copa del Rey de 2021 y, tras 21 años inolvidables, una emotiva despedida del Camp Nou como máximo goleador, plusmarquista de partidos y referente eterno del barcelonismo.`,
    paris: `Dos títulos de liga en París, el séptimo Balón de Oro y la gloria suprema en Catar el 18 de diciembre de 2022: dos goles en la final y la Copa del Mundo en sus manos tras un épico 3–3. La carrera quedó consagrada para siempre.`,
    miami: `Llegada triunfal a Estados Unidos con el título de Leagues Cup en su primer mes, el octavo Balón de Oro, una nueva Copa América con Argentina y la marcha histórica rumbo a los 1.000 goles en vivo.`
  };

export const CABINET = [
    { title: "Copa del Mundo — 2022", sub: "La máxima gloria futbolística, Lusail 18 de diciembre de 2022.", src: "/img/cab-wc.webp", w: 800, h: 600, pos: "50% 30%", alt: "Messi en hombros celebrando la Copa del Mundo 2022 en Lusail", cap: "Campeones del Mundo, Lusail 2022" },
    { title: "Balón de Oro — 8", sub: "El récord de ocho: 2009–12, 2015, 2019, 2021, 2023.", src: "/img/cab-ballon.webp", w: 800, h: 600, pos: "50% 30%", alt: "Messi levantando su histórico octavo Balón de Oro", cap: "Récord histórico de 8 Balones de Oro" },
    { title: "Champions League — 4", sub: "2006, 2009, 2011, 2015 — todas con el FC Barcelona.", src: "/img/cab-ucl.webp", w: 800, h: 600, pos: "50% 25%", alt: "Messi celebrando con la Champions League", cap: "Cuatro veces campeón de Europa con el Barcelona" },
    { title: "Copa América — 2", sub: "Bicampeón continental consecutivo, 2021 y 2024.", src: "/img/cab-copa.webp", w: 800, h: 600, pos: "50% 25%", alt: "Messi besando el trofeo de la Copa América en el Maracaná", cap: "Campeones de América, Maracaná 2021" },
    { title: "Títulos de La Liga — 10", sub: "Dominio absoluto con el FC Barcelona 2004–2019.", src: "/img/cab-liga.webp", w: 800, h: 600, pos: "50% 25%", alt: "Messi con el trofeo de La Liga española", cap: "10 veces campeón de España con el Barcelona" }
  ];
