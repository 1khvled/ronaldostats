// PT dictionary — RonaldoStats
// Extracted verbatim from the original inline dictionaries by
// scripts/refactor-i18n.mjs. Structure is identical across all 9 languages.

export const HOME = {
    locale: "pt-BR",
    shirt10: "Camisa número 10",
    head: (t, p, d) => `<b>${n(t.goals)} gols oficiais</b> em <b>${n(t.apps)} partidas profissionais</b> por Barcelona, PSG, Inter Miami e Seleção Argentina em ${esc(d.lastUpdated)}. Campeão mundial e 8 Bolas de Ouro.`,
    meta: (p, dob) => `${esc(p.name)}, nascido em ${dob} em ${esc(p.birthplace)}. Tem ${p.age} anos, joga como atacante e defende o ${esc(p.current.join(" e "))}.`,
    roleLabel: "Função",
    teamsLabel: "Clubes",
    nowLabel: "Atual",
    kpiCareer: "Gols na carreira",
    kpiCareerNote: (gpg, seasons) => `${gpg} gols por jogo em ${seasons} temporadas de clubes.`,
    kpiApps: "Partidas oficiais",
    kpiAppsNote: (clubs, country) => `${clubs} por clubes, ${country} pela Argentina.`,
    kpiArg: "Gols pela Argentina",
    kpiArgNote: (gpg, caps) => `${gpg} por jogo em ${caps} jogos internacionais.`,
    kpiTrophies: "Títulos coletivos",
    kpiTrophiesNote: (lang) => `Recorde histórico de ${LIVE.trophies} títulos e 8 Bolas de Ouro. <a href="/${lang}/achievements">Palmarés completo</a>.`,
    kpiRoad: "Rumo aos 1.000 gols",
    kpiRoadNote: (togo, projYear, pace) => `Faltam ${togo} gols. No ritmo atual (~${pace.toFixed(0)} por ano), atingirá os 1.000 perto de ${projYear}.`,
    copyStatsBtn: "Copiar estatísticas",
    copyText: (goals, apps, clubGoals, argGoals, updated) => `Messi: ${goals} gols em ${apps} partidas oficiais (${clubGoals} por clubes, ${argGoals} pela Argentina), ${LIVE.trophies} títulos, 8 Bolas de Ouro — em ${updated}.`,
    copyMsg: "Copiado para a área de transferência.",
    clubCaption: (updated, lang) => `Partidas e gols em cada equipe sênior de Lionel Messi, em ${updated}. Desdobramento completo na <a href="/${lang}/goalsbyseason">página de temporadas</a>.`,
    thTeam: "Equipe e anos",
    thApps: "Jogos",
    thGoals: "Gols",
    thGpg: "Gols / Jogo",
    thTotal: "Total na carreira",
    yearSub: "Escolha um ano e veja o total acumulado subir, desde sua estreia em 2004 até hoje.",
    yearTitle: "Estatísticas de Messi por ano civil",
    yearLabel: "Ano",
    yearFigcap: (start, cur, prov, lang) => `Gols por ano civil, ${start} a ${cur}${prov ? " (em andamento)" : ""} — com recorde de 91 em 2012. <a href="/${lang}/goalsbyyear">Abrir tabela completa</a>.`,
    tileGoals: (year, prov) => `Gols em ${year}${prov ? " (até agora)" : ""}`,
    tileTotal: (year) => `Total acumulado após ${year}`,
    tileAge: (year) => `Idade durante ${year}`,
    records: (best, post30, pct) => [
      [`91`, `<b>Gols em 2012</b>, o recorde mundial absoluto em um único ano civil — ${best.goals} em todas as competições.`],
      [`8`, `<b>Bolas de Ouro</b> (2009–12, 2015, 2019, 2021, 2023) — mais que qualquer outro jogador na história.`],
      [`474`, `<b>Gols na La Liga</b>, recorde histórico absoluto da liga espanhola.`],
      [`129`, `<b>Gols na Champions League</b> — 120 pelo Barcelona e 9 pelo PSG, segundo maior artilheiro.`],
      [post30, `<b>Gols após os 30 anos</b> — cerca de ${pct}% de todos os gols de sua carreira.`],
      [`57`, `<b>Hat-tricks ou mais</b> por clubes e seleção principal em sua carreira profissional.`],
      [`46`, `<b>Títulos coletivos</b> — a carreira mais vitoriosa da história do futebol, coroada pela Copa de 2022.`]
    ],
    silverCaption: () => `${LIVE.trophies} títulos oficiais de equipes principais, clube a clube, mais as maiores honrarias individuais.`,
    silverThTrophy: "Troféu",
    silverThTimes: "Vezes",
    silverThNote: "Observações",
    silverRows: [
      ["Títulos pelo Barcelona", "35", "2005 a 2021, incluindo 4 Ligas dos Campeões e 10 La Ligas"],
      ["Títulos pela Argentina", "5", "Copa do Mundo 2022, Copas América 2021 e 2024, Finalíssima 2022, Ouro Olímpico 2008"],
      ["Títulos pelo PSG", "3", "Ligue 1 2022 e 2023, Supercopa da França 2022"],
      ["Títulos pelo Inter Miami", "4", "Leagues Cup 2023, Supporters' Shield 2024, MLS Cup 2025, Campeones Cup 2026"],
      ["Bola de Ouro", "8", "Recorde mundial — 2009–12, 2015, 2019, 2021, 2023"]
    ],
    splitFk: "Gols de falta",
    splitFkNote: "Cobranças magistrais por clubes e seleção.",
    splitPen: "Gols de pênalti",
    splitPenNote: "Cerca de um em cada oito gols da carreira.",
    splitHt: "Hat-tricks ou mais",
    splitHtNote: "Partidas com 3 ou mais gols marcados.",
    splitCaveat: (tot) => `Os dados de faltas e pênaltis são compilações oficiais provisórias. O total oficial de ${tot} gols é imutável.`,
    faq: (t, agg, m, d, lang) => [
      ["Quantos gols Lionel Messi tem na carreira?", `<b>${n(t.goals)} gols oficiais</b> em ${n(t.apps)} partidas profissionais até ${esc(d.lastUpdated)}, média de ${t.goalsPerGame} gols por jogo. Veja a <a href="/${lang}/goalsbyyear">tabela por ano</a>.`],
      ["Quantos gols Messi marcou pelo Barcelona?", `<b>${n(agg.barcelona.goals)} gols</b> em ${n(agg.barcelona.apps)} jogos de 2004 a 2021 — incluindo recorde de 474 na La Liga.`],
      ["Quantos gols pelo PSG e Inter Miami?", `<b>${agg.psg.goals} pelo Paris Saint-Germain</b> e <b>${n(agg.miami.goals)} pelo Inter Miami</b>.`],
      ["Quantos gols Messi marcou pela Argentina?", `<b>${n(t.country.goals)} gols</b> em ${n(t.country.apps)} partidas oficiais desde 2005.`],
      ["Qual foi o melhor ano de Messi em gols?", `<b>2012, com 91 gols</b> — recorde mundial absoluto em um ano civil. Veja <a href="/${lang}/goalsbyyear">todos os anos</a>.`],
      ["Quantos títulos Messi ganhou?", `<b>47 títulos coletivos</b> — 35 pelo Barcelona, 3 pelo PSG, 4 pelo Inter Miami e 5 pela Argentina. Veja o <a href="/${lang}/achievements">palmarés</a>.`]
    ]
  };

export const BY_YEAR = {
    head: (ys, best, t) => `Do seu primeiro gol oficial em ${ys[0].year} até os <b>${best.goals} gols em ${best.year}</b> — todos os anos civis de uma carreira de ${n(t.goals)} gols.`,
    cap: (best, t) => `Barras: gols no ano (máximo ${best.goals}, em ${best.year}). Linha: ascensão acumulada até ${n(t.goals)}.`,
    chartLabel: (best) => `Gols de Messi por ano com total acumulado`,
    kpiCareer: "Gols na carreira",
    kpiBest: "Melhor ano",
    kpiBestSub: "Recorde mundial em um único ano civil.",
    kpiCurrSub: "Temporada em andamento.",
    kpiYears: "Anos marcando",
    kpiYearsSub: (ys, last) => `Cada ano desde ${ys[0].year} até ${last.year}.`,
    decades: "Gols nos anos",
    tableSub: "Mais recentes primeiro. 2026 está em andamento. Clique numa coluna para ordenar ou pesquise para filtrar.",
    caption: "Gols, total acumulado e idade por ano civil desde a estreia em 2004.",
    thYear: "Ano", thGoals: "Gols", thTotal: "Total carreira", thAge: "Idade",
    inProgNote: "* Temporada 2026 em andamento — atualizada após cada partida.",
    filterPlaceholder: "Filtrar anos — ex. 2012",
    bestYearHtml: (best) => `<p><b>${best.year} é o ano mais prolífico da história do futebol: ${best.goals} gols</b> — 79 pelo Barcelona e 12 pela Argentina — superando o recorde de Gerd Müller (85 gols). <a href="/pt/dashboard">Ver no painel como se dividem esses gols</a>.</p>`
  };

export const BY_SEASON = {
    head: (best) => `Todas as temporadas de clube de 2004/05 a 2026 — <b>recorde: ${best.goals} gols em ${best.season}</b> — com divisão de liga, copas e torneios continentais.`,
    clubSub: "Partidas / gols em cada formato. 2026 está em andamento. Clique numa coluna para ordenar ou pesquise para filtrar.",
    caption: (len) => `Todas as ${len} temporadas de clube: Barcelona 2004/05–2020/21, PSG 2021/22–2022/23, Inter Miami 2023–2026.`,
    thSeason: "Temporada", thClub: "Clube", thApps: "Partidas", thGoals: "Gols", thLeague: "Liga", thCup: "Copa", thCont: "Continental", thOther: "Outros",
    totalLabel: "Total clubes", bestBadge: "Melhor temporada de clube",
    filterClubPlaceholder: "Filtrar temporadas — ex. PSG, 2012",
    countrySub: "Eliminatórias, torneios oficiais e amistosos, mais recentes primeiro.",
    countryCaption: "Gols com a Seleção Argentina por ano civil, 2005 a 2026.",
    thYear: "Ano", thNote: "Detalhes", totalArgLabel: "Total Argentina",
    filterCountryPlaceholder: "Filtrar anos Argentina — ex. 2022",
    bestSeasonHtml: (best) => `<p><b>${best.season} — ${best.goals} gols em ${best.apps} jogos pelo Barcelona</b> — é a temporada de clube mais prolífica da história do futebol: 50 na La Liga (recorde), 14 na Champions League, 3 na Copa do Rei e 6 em supercopas. <a href="/pt/goalsbyyear">Ver esses gols por ano civil</a>.</p>`
  };

export const DASH = {
    teamNames: { all: "todos os times", barcelona: "Barcelona", psg: "PSG", miami: "Inter Miami", argentina: "Argentina" },
    pills: [["all", "Todos os times"], ["barcelona", "Barcelona"], ["psg", "PSG"], ["miami", "Inter Miami"], ["argentina", "Argentina"]],
    head: (name) => `Todos os 930 gols de Lionel Messi analisados de quatro formas — por competição, por temporada, por finalização e por parte do corpo — filtrados para <b>${esc(name)}</b>. Toque em um time para atualizar os gráficos.`,
    filterNote: (name, goals, apps, T) => `Exibindo ${name}: ${n(goals)} gols em ${n(apps)} jogos` + (T === "barcelona" || T === "psg" ? " (Divisão na Champions League: Barcelona 120, PSG 9 — fontes oficiais dos clubes)." : "."),
    kpis: { goals: "Gols", apps: "Jogos", gpg: "Média de gols", forTeam: (name) => `Pelo ${name}.` },
    chartEmpty: "Nenhuma linha para este filtro de time.",
    figCap: (T, name) => T === "all" ? "Anos civis, 2004 a 2026." : T === "argentina" ? "Anos civis com a Argentina." : "Temporadas de clube pelo " + esc(name) + ".",
    finishParts: { "Open play": "Bola rolando", "Penalties": "Pênaltis", "Free kicks": "Faltas" },
    finishCenter: "gols na carreira",
    finishCaveat: "Totais de carreira combinados de todas as equipes. Contagem oficial verificada.",
    finishCaveatFiltered: (d) => `Não existe divisão por finalização por time individual — veja os totais da carreira abaixo. De seus ${n(d.totals.goals)} gols oficiais: ${d.byFinish.openPlay} bola rolando, ${d.byFinish.penalties} pênaltis e ${d.byFinish.freeKicks} faltas.`,
    bodyParts: { "Left foot": "Pé esquerdo", "Right foot": "Pé direito", "Head": "Cabeça", "Other": "Outro (peito, etc.)" },
    bodyCenter: "com a canhota",
    bodyCaveat: "Totais de carreira combinados de todos os times (contagem oficial verificada).",
    ageName: (r) => `Idade ${r.age} · ${r.year}`,
    ageCaveat: (apeak) => `Cada gol profissional de acordo com a idade em que marcou — clubes e seleção combinados. Recorde: ${apeak.goals} gols aos ${apeak.age} anos (${apeak.year}).`,
    ageFilterNote: "As idades combinam clubes e seleção, portanto este gráfico cobre toda a carreira — limpe o filtro para ver.",
    compCaption: (name) => `Gols por competição — ${esc(name)}.`,
    thComp: "Competição", thGoals: "Gols", thShare: "Porcentagem",
    recAllTime: "Recorde histórico da competição",
    finishCaption: "Como os gols foram marcados e com qual parte do corpo — totais da carreira, todos os times.",
    thFinish: "Finalização / Parte do corpo",
    finishCaveatTable: "O detalhamento por finalização e parte do corpo é uma contagem oficial verificada.",
    finishRows: (d) => [
      ["Bola rolando", d.byFinish.openPlay],
      ["Pênaltis", d.byFinish.penalties],
      ["Cobranças de falta", d.byFinish.freeKicks],
      ["Pé esquerdo", d.byBodyPart.left],
      ["Pé direito", d.byBodyPart.right],
      ["Cabeça", d.byBodyPart.head],
      ["Outro (peito, etc.)", d.byBodyPart.other]
    ],
    teamCardSub: { goals: "gols", apps: "jogos", gpg: "por jogo", of: "de" },
    records: (comp, d) => [
      ["91", `<b>Gols em 2012</b> — recorde mundial oficial em um ano civil.`],
      [n(comp("La Liga")), `<b>Gols na La Liga</b> — recorde histórico absoluto da competição, todos pelo Barcelona.`],
      [n(comp("UEFA Champions League")), `<b>Gols na Champions League</b> — 120 pelo Barcelona, 9 pelo PSG.`],
      ["8", `<b>Bolas de Ouro</b> — recorde histórico do futebol (2009–12, 2015, 2019, 2021, 2023).`],
      [n(d.hatTricks), `<b>Hat-tricks ou mais</b> por clubes e seleção.`],
      [`${LIVE.trophies}`, `<b>Títulos oficiais</b> — o jogador mais laureado da história do futebol.`]
    ],
    method: "Gols na Champions League divididos em Barcelona 120 e PSG 9 a partir de fontes oficiais dos clubes; demais competições seguem os registros oficiais."
  };

export const TIMELINE = {
    head: (t) => `Desde a estreia no Barcelona em 2004 até <b>${n(t.goals)} gols na carreira</b> e contando — noites históricas, recordes e títulos em ordem.`,
    keydates: (t, lastUpdated) => [
      ["16 Out 2004", "Estreia profissional pelo <b>Barcelona</b> contra o Espanyol, aos 17 anos."],
      ["1 Mai 2005", "Primeiro gol oficial, contra o Albacete — o mais jovem a marcar pelo Barcelona na época."],
      ["17 Ago 2005", "Estreia pela <b>Seleção Argentina</b> principal contra a Hungria."],
      ["2012", "<b>91 gols</b> no ano civil — recorde mundial absoluto na história do futebol."],
      ["18 Dez 2022", "Conquista a <b>Copa do Mundo</b> com a Argentina no Catar, marcando dois gols na final."],
      [esc(lastUpdated), `<b>${n(t.goals)} gols na carreira</b> por clubes e seleção — última verificação.`]
    ],
    inProg: "em andamento",
    goals: "gols",
    goalsInEra: (goals, share, total) => `<b>${n(goals)} gols</b> · ${share}% de ${n(total)}`,
    peakYear: (pk, tr) => `<p class="ch-callout">Ano auge <b>${pk.year} · ${pk.goals} gols</b>` + (tr ? ` · <b>${tr}</b> ${tr === 1 ? "título coletivo" : "títulos coletivos"} neste período` : "") + `</p>`,
    empty: (val, total) => `Nenhum resultado para “${val}” — limpe a busca para ver os ${total} marcos.`,
    tagRecord: "Recorde", tagWc: "Copa", tagFirst: "Primeiro",
    faq: [
      ["Quando Messi estreou?", "Pelo Barcelona em <b>16 de outubro de 2004</b> contra o Espanyol aos 17 anos; pela Argentina em 17 de agosto de 2005."],
      ["Quando Messi marcou seu primeiro gol?", "Em <b>1 de maio de 2005</b> contra o Albacete — então o mais jovem marcador da história do Barcelona."],
      ["Quando Messi ganhou a Copa do Mundo?", "Em <b>18 de dezembro de 2022</b>, derrotando a França nos pênaltis em Lusail após um épico 3–3."],
      ["Quando Messi saiu do Barcelona?", "Em <b>agosto de 2021</b>, acertando com o Paris Saint-Germain após 21 anos no clube catalão."],
      ["Quando Messi chegou ao Inter Miami?", "Em <b>julho de 2023</b>, conquistando a Leagues Cup poucas semanas após chegar."]
    ],
    method: "Marcos cronológicos documentados por data exata; barras de gols dividem os anos civis em faixas contínuas somando o total da carreira."
  };

export const ACH = {
    head: (teamTotal) => `<b>${teamTotal} títulos coletivos</b> — a carreira mais vitoriosa do futebol — mais um recorde de <b>8 Bolas de Ouro</b>. Todos os títulos clube por clube.`,
    kpis: (per) => [
      ["Títulos coletivos", 46, `Barcelona ${per["Barcelona"] || 0} · Argentina ${per["Argentina"] || 0} · PSG ${per["Paris Saint-Germain"] || 0} · Miami ${per["Inter Miami"] || 0}.`],
      ["Bolas de Ouro", "8", "Recorde — 2009–12, 2015, 2019, 2021, 2023."],
      ["Champions Leagues", "4", "2006, 2009, 2011, 2015 — todas com o Barcelona."],
      ["Grandes torneios de seleções", "3", "Copa do Mundo 2022, Copas América 2021 e 2024."]
    ],
    qa: (teamTotal, per) => [
      ["Quantos títulos Messi já ganhou?", `<b>${teamTotal} títulos coletivos oficiais</b>: ${per["Barcelona"] || 0} no Barcelona, ${per["Paris Saint-Germain"] || 0} no PSG, ${per["Inter Miami"] || 0} no Inter Miami e ${per["Argentina"] || 0} na Argentina.`],
      ["Quantas Bolas de Ouro Messi tem?", "<b>Oito</b> — mais do que qualquer outro jogador na história (2009–12, 2015, 2019, 2021, 2023)."],
      ["Messi já ganhou a Copa do Mundo?", "<b>Sim — em 2022</b>, marcando dois gols na final contra a França, além das Copas América de 2021 e 2024."],
      ["Quantas Champions Leagues Messi ganhou?", "<b>Quatro</b>, todas pelo Barcelona: 2006, 2009, 2011 e 2015."]
    ],
    teamHeader: (team, sub) => `${esc(team)} — ${sub} títulos`,
    indHeader: (indTotal) => `Prêmios individuais — ${indTotal} distinções`,
    faq: [
      ["Qual é o troféu mais importante de Messi?", "A <b>Copa do Mundo de 2022</b> — a coroação suprema de sua carreira, vencida como o melhor jogador do torneio."],
      ["Quantos títulos nacionais Messi tem?", "<b>Doze títulos de liga</b> — 10 La Ligas, 2 Ligue 1s — mais a MLS Supporters' Shield e Leagues Cup pelo Miami."],
      ["Quantos prêmios individuais Messi já ganhou?", "Oito Bolas de Ouro, seis Chuteiras de Ouro e duas Bolas de Ouro da Copa do Mundo — cada um um recorde histórico."],
      ["Messi é o jogador mais condecorado de todos os tempos?", "Pela soma de troféus coletivos e recordes individuais — <b>sim, sob qualquer métrica</b>."]
    ]
  };

export const BDAY = {
    months: ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
    badgeSuccess: "🎉 Sim! Messi marcou no seu aniversário!",
    badgeMessi: "🎂 O próprio aniversário de Leo Messi!",
    badgeEmpty: "Sem gols nesta data",
    headlineSuccess: (g, m, d) => `Lionel Messi marcou <b>${g} ${g === 1 ? "gol" : "gols"}</b> em <b>${m} ${m === 1 ? "partida" : "partidas"}</b> em ${d} em sua carreira profissional!`,
    headlineMessi: `Você faz aniversário no mesmo dia que <b>Lionel Andrés Messi</b> (nascido em 24 de junho de 1987 em Rosário)!`,
    headlineEmpty: (d) => `Lionel Messi não marcou em <b>${d}</b> durante sua carreira profissional.`,
    whyZeroTitle: "Por que 0 gols?",
    whyZeroMessi: "Lionel Messi nunca disputou uma partida oficial em 24 de junho porque o fim de junho coincide com as férias de verão dos clubes europeus ou intervalos de descanso em torneios de seleções.",
    whyZeroMessiSub: "Você divide seu dia especial com o maior jogador de futebol de todos os tempos!",
    emptyExpl: "Messi não teve partida marcada ou não marcou neste dia — mas ele já marcou em <b>292 dos 366 dias (79,8%)</b> do ano!",
    closestDay: (d, g) => `O dia mais próximo em que Messi marcou é <b>${d}</b> (${g} gols na carreira).`,
    closestBtn: (d, g) => `Ver ${d} (${g} gols) &rarr;`,
    watchClip: (cnt) => `Assistir ${cnt > 1 ? cnt + " gols" : "ao gol"}`,
    searchYt: "🔍 Buscar no YouTube",
    playInline: "📺 Assistir aqui",
    closeInline: "✕ Fechar vídeo",
    ytHighlights: "Melhores momentos no YouTube",
    goalSummary: (g) => `${g} ${g === 1 ? "gol marcado" : "gols marcados"}:`,
    goalTab: (idx, min) => `Gol ${idx}${min ? ` (${min}')` : ""}`,
    shareSuccess: (d, g, m) => `Lionel Messi marcou ${g} gols em ${m} jogos no dia do meu aniversário (${d})! Confira o seu:`,
    shareEmpty: (d) => `Marcou Messi no dia do seu aniversário? Ele marcou em 292 dos 366 dias do ano! Confira o seu:`,
  };

export const LATEST_GOAL = {
    goalPrefix: "Gol #",
    scoreline: "Resultado",
    didScoreTodayYes: "SIM! Lionel Messi marcou hoje: Gol #{goalNum} aos {minute} contra {opp} ({score})!",
    didScoreTodayNo: "Messi marcou hoje? A partida oficial mais recente de Lionel Messi ocorreu em {date} na {comp}, onde marcou o Gol #{goalNum} de sua carreira aos {minute} selando a vitória por {score}. Assista ao vídeo oficial acima.",
    matchResult: "Resultado da partida mais recente: {title}",
    goalBadge: "Gol #{goalNum} marcado ({minute})",
    playHighlight: "Selecione qualquer um dos gols recentes de Lionel Messi abaixo para assistir ao vídeo imediatamente:",
    viewDateGoals: "Ver gols de {formattedDate} →",
    tagHeader: "Cabeceio 🔥",
    tagFreekick: "Falta direta 🔥",
    tagPenalty: "Pênalti",
    tagLeftFoot: "Chute de canhota",
    tagRightFoot: "Pé direito",
    tagOpenPlay: "Bola rolando",
    assist: "Assistência"
  };

export const ARG_STREAM = {
    badge: "🇦🇷 ÚLTIMO JOGO PELA ARGENTINA",
    title: "Jogo de Despedida de Lionel Messi",
    text: "O jogo de despedida de Lionel Messi em 6 de outubro de 2026! Assista à transmissão AO VIVO grátis e SEM ANÚNCIOS.",
    highlight: "Transmissão ao vivo grátis • Sem anúncios",
    cta: "Assistir Grátis ▶",
    closeAria: "Fechar notificação",
    matchCardTitle: "Jogo Histórico de Despedida • 6 Out 2026",
    matchCardDesc: "Assista ao último jogo de Lionel Messi pela seleção da Argentina ao vivo no Koora Live sem anúncios."
  };

export const EXPLORE_LANGS = [
    { href: "/pt/birthday", page: "birthday", t: "🎂 ¿Marcou Messi no seu aniversário?", d: (d) => `Pesquise os 366 dias do ano com vídeos de todos os ${n(d.totals.goals)} gols de Messi.` },
    { href: "/pt/messi-vs-ronaldo", page: "messi-vs-ronaldo", t: "🐐 Messi vs Messi Histórico", d: () => `Estatísticas cara a cara: ${n(LIVE.goals)} vs ${n(LIVE.rGoals)} gols, ${LIVE.trophies} vs ${LIVE.rTrophies} títulos, 8 vs 5 Bolas de Ouro.` },
    { href: "/pt/vs-real-madrid", page: "vs-real-madrid", t: "⚔️ Messi vs Real Madrid", d: () => "Os 26 gols no El Clásico, 45 partidas, 14 assistências e hat-tricks." },
    { href: "/pt/champions-league", page: "champions-league", t: "⭐ Recorde na Champions League", d: () => "129 gols na UEFA Champions League, 8 hat-tricks e 4 títulos europeus." },
    { href: "/pt/latest-goal", page: "latest-goal", t: "⚽ Último gol de Messi em vídeo", d: () => "Assista ao vídeo do último gol de Messi, veja se marcou hoje e confira vídeos recentes." },
    { href: "/pt", page: "home", t: "Estatísticas de Lionel Messi", d: (d) => `Os números oficiais: ${n(d.totals.goals)} gols em ${n(d.totals.apps)} partidas profissionais.` },
    { href: "/pt/dashboard", page: "dashboard", t: "Painel de estatísticas", d: () => "Filtre todos os gráficos por Barcelona, PSG, Inter Miami ou Argentina." },
    { href: "/pt/timeline", page: "timeline", t: "História e Linha do tempo", d: () => "Cada momento da carreira em ordem cronológica de 2004 até hoje." },
  ];

export const ERA_INTROS = {
    rosario: `Um jovem de 17 anos de Rosário estreia contra o Espanyol em outubro de 2004 e, em poucos meses, o Camp Nou já canta seu nome. O primeiro gol vem contra o Albacete em maio seguinte — encobrindo o goleiro após passe de Ronaldinho. Em 2008, conquista o ouro olímpico em Pequim.`,
    peak: `Seis títulos em 2009. Quatro Bolas de Ouro consecutivas. Depois 2012: 91 gols em um único ano civil, quebrando um recorde de 40 anos — incluindo cinco gols em uma noite de Champions contra o Leverkusen. O auge mais impressionante do futebol mundial.`,
    msn: `Messi, Suárez e Neymar: o trio MSN encantou o planeta e conquistou a segunda tríplice coroa em 2015 em Berlim. Um ataque inesquecível e imparável.`,
    carry: `A histórica remontada de 6–1 contra o PSG em 2017, a lendária comemoração exibindo a camisa 10 no Bernabéu e a liderança absoluta com mais uma dobradinha nacional em 2018.`,
    farewell: `A sexta Bola de Ouro, a Copa do Rei de 2021 e a emocionante despedida do Camp Nou após 21 anos históricos como maior artilheiro e ídolo eterno do Barcelona.`,
    paris: `Dois títulos franceses em Paris, a sétima Bola de Ouro e a glória suprema no Catar em 18 de dezembro de 2022: campeão da Copa do Mundo com dois gols na final. O topo absoluto da história.`,
    miami: `Conquista imediata da Leagues Cup, oitava Bola de Ouro, mais uma Copa América com a Argentina e a contagem rumo aos 1.000 gols oficiais ao vivo.`
  };

export const CABINET = [
    { title: "Copa do Mundo — 2022", sub: "A coroação máxima da história do futebol, Lusail 18 dez 2022.", src: "/img/cab-wc.webp", w: 800, h: 600, pos: "50% 30%", alt: "Messi carregado nos ombros celebrando a Copa do Mundo 2022", cap: "Campeões Mundiais, Lusail 2022" },
    { title: "Bola de Ouro — 8", sub: "O recorde de oito troféus: 2009–12, 2015, 2019, 2021, 2023.", src: "/img/cab-ballon.webp", w: 800, h: 600, pos: "50% 30%", alt: "Messi erguendo a sua oitava Bola de Ouro", cap: "Recorde histórico de 8 Bolas de Ouro" },
    { title: "Champions League — 4", sub: "2006, 2009, 2011, 2015 — todas com o Barcelona.", src: "/img/cab-ucl.webp", w: 800, h: 600, pos: "50% 25%", alt: "Messi com o troféu da Liga dos Campeões", cap: "Tetracampeão europeu pelo Barcelona" },
    { title: "Copa América — 2", sub: "Bicampeão continental consecutivo, 2021 e 2024.", src: "/img/cab-copa.webp", w: 800, h: 600, pos: "50% 25%", alt: "Messi beijando a Copa América no Maracanã", cap: "Campeões da Copa América, Maracanã 2021" },
    { title: "Títulos de La Liga — 10", sub: "Hegemonia nacional pelo FC Barcelona 2004–2019.", src: "/img/cab-liga.webp", w: 800, h: 600, pos: "50% 25%", alt: "Messi com o troféu da La Liga", cap: "10 vezes campeão espanhol pelo Barcelona" }
  ];
