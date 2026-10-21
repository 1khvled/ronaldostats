// PT (pt-BR) dictionary — RonaldoStats
// Tradução do dicionário em inglês (src/i18n/en.js). Mesma estrutura,
// mesmas chaves e mesma ordem de todos os idiomas.
// Termos mantidos: Cristiano Ronaldo, CR7, Ballon d'Or, Champions League,
// UEFA Champions League, nomes dos clubes e Portugal.

export const HOME = {
    locale: "pt-BR",
    shirt10: "Camisa número 7",
    head: (t, p, d) => `<b>${n(t.goals)} gols</b> em <b>${n(t.apps)} partidas profissionais</b> — pelo Sporting CP, Manchester United, Real Madrid, Juventus e ${esc(p.current.join(" e "))}. Campeão europeu e cinco vezes vencedor do Ballon d'Or, contado à mão e conferido duas vezes, em ${esc(d.lastUpdated)}.`,
    meta: (p, dob) => `${esc(p.name)}, nascido em ${dob} em ${esc(p.birthplace)}. Tem ${p.age} anos, joga como ${esc(p.position.toLowerCase())} e está no ${esc(p.current.join(" e "))}.`,
    roleLabel: "Função",
    teamsLabel: "Clubes",
    nowLabel: "Atual",
    kpiCareer: "Gols na carreira",
    kpiCareerNote: (gpg, seasons) => `${gpg} gols por jogo ao longo de ${seasons} temporadas de clubes.`,
    kpiApps: "Partidas profissionais",
    kpiAppsNote: (clubs, country) => `${clubs} clubes, ${country} por Portugal.`,
    kpiArg: "Gols por Portugal",
    kpiArgNote: (gpg, caps) => `${gpg} por jogo em ${caps} jogos pela seleção.`,
    kpiTrophies: "Títulos coletivos",
    kpiTrophiesNote: (lang) => `Mais <b>5 Ballons d'Or</b> e <b>4 Chuteiras de Ouro Europeias</b>. <a href="/${lang}/achievements">Lista completa de honrarias</a>.`,
    kpiRoad: "Rumo aos 1.000 gols",
    kpiRoadNote: (togo, projYear, pace) => `Faltam ${togo}. Projeção aproximada no ritmo atual (~${pace.toFixed(0)} por ano): os 1.000 chegam por volta de ${projYear}.`,
    copyStatsBtn: "Copiar estatísticas principais",
    copyText: (goals, apps, clubGoals, argGoals, updated) => `Ronaldo: ${goals} gols em ${apps} partidas profissionais (${clubGoals} por clubes, ${argGoals} por Portugal), ${LIVE.trophies} títulos coletivos, 5 Ballons d'Or — em ${updated}.`,
    copyMsg: "Copiado — cole em qualquer lugar.",
    clubCaption: (updated, lang) => `Partidas e gols de todos os times seniores em que Cristiano Ronaldo jogou, em ${updated}. A divisão completa por competição está na <a href="/${lang}/goalsbyseason">página de gols por temporada</a>.`,
    thTeam: "Time e anos",
    thApps: "Jogos",
    thGoals: "Gols",
    thGpg: "Gols por jogo",
    thTotal: "Total da carreira",
    yearSub: "Escolha um ano e veja o total acumulado subir — da estreia em 2002 até hoje.",
    yearTitle: "Estatísticas de Ronaldo por ano civil",
    yearLabel: "Ano",
    yearFigcap: (start, cur, prov, lang) => `Gols por ano civil, ${start} a ${cur}${prov ? " (em andamento)" : ""} — com pico de 69 em 2013. <a href="/${lang}/goalsbyyear">Abrir a tabela completa</a>.`,
    tileGoals: (year, prov) => `Gols em ${year}${prov ? " (até agora)" : ""}`,
    tileTotal: (year) => `Total da carreira após ${year}`,
    tileAge: (year) => `Idade em ${year}`,
    records: (best, post30, pct) => [
      [`69`, `<b>Gols em 2013</b>, o máximo que ele marcou em um único ano civil — ${best.goals} em todas as competições.`],
      [`5`, `<b>Ballons d'Or</b> (2008, 2013, 2014, 2016, 2017) — com quatro Chuteiras de Ouro Europeias.`],
      [`311`, `<b>Gols na La Liga</b> pelo Real Madrid, o recorde histórico da competição.`],
      [`140`, `<b>Gols na Champions League</b> em 183 jogos, o recorde na história da competição.`],
      [post30, `<b>Gols depois dos 30 anos</b> — cerca de ${pct}% de todo o total da carreira, marcados a partir de 2015.`],
      [`66`, `<b>Hat-tricks ou mais</b> por clubes e seleção ao longo da carreira profissional (contagem provisória).`],
      [`${LIVE.trophies}`, `<b>Títulos coletivos</b> — 32 por clubes e 3 por Portugal.`]
    ],
    silverCaption: () => `${LIVE.trophies} títulos de equipe em nível sênior, clube por clube, além das principais honrarias individuais. Alguns veículos citam 36–37 porque contam a Supercopa da UEFA e as supercopas domésticas de forma diferente — a lista detalhada aqui soma ${LIVE.trophies}.`,
    silverThTrophy: "Troféu",
    silverThTimes: "Vezes",
    silverThNote: "Observação",
    silverRows: [
      ["Títulos coletivos — Real Madrid", "15", "2009 a 2018, incluindo 4 Champions Leagues"],
      ["Títulos coletivos — Manchester United", "9", "2003 a 2009, incluindo a Champions League e a Copa do Mundo de Clubes em 2008"],
      ["Títulos coletivos — Juventus", "5", "Serie A duas vezes, Coppa Italia e 2 Supercoppa Italiana"],
      ["Títulos coletivos — Portugal", "3", "Euro 2016, Nations League 2019 e 2025"],
      ["Títulos coletivos — Al Nassr", "2", "Arab Club Champions Cup 2023 e Saudi Pro League 2026"],
      ["Títulos coletivos — Sporting CP", "1", "Supertaça Cândido de Oliveira 2002"],
      ["Ballon d'Or", "5", "2008, 2013, 2014, 2016, 2017"]
    ],
    splitFk: "Gols de falta",
    splitFkNote: "Cobranças em gol por clubes e seleção (contagem compilada provisória).",
    splitPen: "Gols de pênalti",
    splitPenNote: "Quase um em cada cinco de todos os seus gols (contagem compilada provisória).",
    splitHt: "Hat-tricks ou mais",
    splitHtNote: "Jogos com três ou mais gols, em todas as competições.",
    splitCaveat: (tot) => `A divisão por tipo de finalização (falta, pênalti) e por parte do corpo é uma contagem compilada amplamente publicada — provisória até que se conclua uma contagem manual, jogo a jogo. O total de ${tot} não é afetado.`,
    faq: (t, agg, m, d, lang) => [
      ["Quantos gols na carreira Cristiano Ronaldo marcou?", `<b>${n(t.goals)} gols oficiais na carreira</b> em ${n(t.apps)} partidas profissionais por clubes e seleção em ${esc(d.lastUpdated)}, uma média de ${t.goalsPerGame} gols por jogo. Explore a <a href="/${lang}/goalsbyyear">quebra completa dos gols ano a ano</a>.`],
      ["Quantas assistências na carreira Cristiano Ronaldo tem?", `Cristiano Ronaldo registrou <b>${n(LIVE.assists)} assistências oficiais na carreira</b> — a contagem compilada amplamente publicada — e <b>${n(LIVE.tmAssists)} assistências</b> sob os critérios ampliados do Transfermarkt, em ${n(t.apps)} partidas. A divisão: ${n(d.totals?.assists?.byTeam?.real_madrid?.official || 152)} pelo Real Madrid, ${n(d.totals?.assists?.byTeam?.manchester_united?.official || 66)} pelo Manchester United, ${n(d.totals?.assists?.byTeam?.juventus?.official || 20)} pela Juventus, ${n(d.totals?.assists?.byTeam?.al_nassr?.official || 9)} pelo Al Nassr e ${n(d.totals?.assists?.byTeam?.portugal?.official || 14)} por Portugal.`],
      ["Quais são os totais de gols e assistências de Cristiano Ronaldo?", `Ao longo da carreira profissional, Cristiano Ronaldo acumulou <b>${n(LIVE.ga)} contribuições oficiais para gols</b> (<b>${n(t.goals)} gols</b> e <b>${n(LIVE.assists)} assistências oficiais</b>) em ${n(t.apps)} partidas — uma média de <b>0.93 participações diretas em gols por partida</b>. Sob os critérios do Transfermarkt, o total sobe para <b>${n(LIVE.tmGa)} participações em gols</b> (${n(t.goals)} gols + ${n(LIVE.tmAssists)} assistências).`],
      ["Quem tem os melhores números da história, Ronaldo ou Messi?", `Em partidas oficiais de nível sênior, <b>Cristiano Ronaldo</b> detém o recorde histórico de gols com <b>${n(t.goals)} gols</b> e ${n(LIVE.assists)} assistências em ${n(t.apps)} jogos (${t.goalsPerGame} gols por jogo), enquanto Messi tem <b>${n(LIVE.rGoals)} gols</b> e 408 assistências em 1.181 jogos (0.79 gols por jogo). Ronaldo alcançou ${n(t.goals)} gols em <b>159 jogos a menos</b>, tem ${LIVE.trophies} títulos coletivos contra os ${LIVE.rTrophies} de Messi, e 5 Ballons d'Or contra os 8 de Messi. Compare os históricos completos cara a cara na nossa <a href="/${lang}/ronaldo-vs-messi">página de estatísticas Ronaldo vs Messi</a>.`],
      ["Qual é a quebra de gols de Ronaldo na carreira por clube?", `<b>${n(t.clubs.goals)} gols em clubes</b> em ${n(t.clubs.apps)} jogos de clubes — ` + ["Real Madrid", "Manchester United", "Juventus", "Al Nassr", "Sporting CP"].map((c) => {
        const rows = (d.clubSeasons || []).filter((s) => s.club === c);
        const apps = rows.reduce((a, s) => a + s.apps, 0);
        const goals = rows.reduce((a, s) => a + s.goals, 0);
        return `${c} ${n(goals)} em ${n(apps)}`;
      }).join(" · ") + ` — mais <b>${n(t.country.goals)} gols</b> em ${n(t.country.apps)} jogos pela Seleção Portuguesa. Veja as <a href="/${lang}/goalsbyseason">estatísticas de clubes temporada por temporada</a>.`],
      ["Quantos gols diretos de falta Cristiano Ronaldo marcou?", `Cristiano Ronaldo marcou <b>66 gols diretos de falta</b> no futebol profissional, ao lado de <b>184 pênaltis em 220 tentativas</b> e 731 gols de bola rolando — uma contagem compilada provisória até a conclusão de uma contagem manual completa.`],
      ["Quantos hat-tricks Ronaldo marcou?", `Ronaldo marcou <b>${n(d.hatTricks)} hat-tricks na carreira</b> por clubes e seleção (contagem provisória), incluindo <b>10 pela Seleção Portuguesa</b> — um recorde mundial para um jogador de seleção.`],
      ["Quantos gols de pênalti Ronaldo marcou?", `Ronaldo marcou <b>184 gols de pênalti</b> em 220 tentativas entre clubes e seleção — uma conversão de 83.6%.`],
      ["Quantos gols sem pênalti Cristiano Ronaldo marcou?", `Ronaldo marcou <b>${n(t.goals - (m?.penalties || 184))} gols sem pênalti</b> em ${n(t.apps)} partidas (${((t.goals - (m?.penalties || 184)) / t.apps).toFixed(2)} gols sem pênalti por partida) — 81% de tudo o que ele já marcou.`],
      ["Quantos gols Ronaldo marcou em 2013?", `<b>69 gols oficiais em 2013</b> (59 pelo Real Madrid e 10 por Portugal) — o maior ano civil da carreira, e um ano que trouxe um hat-trick pela Seleção Portuguesa em 15 minutos contra a Irlanda do Norte. Confira nosso <a href="/${lang}/goalsbyyear">rastreador de estatísticas de 2013</a>.`],
      ["Quantos troféus Cristiano Ronaldo conquistou?", `<b>${n(LIVE.trophies)} títulos de equipe em nível sênior</b> — 32 por clubes (Real Madrid 15, Manchester United 9, Juventus 5, Al Nassr 2, Sporting CP 1) e 3 por Portugal (Euro 2016, Nations League 2019 e 2025), mais 5 Ballons d'Or. Alguns veículos citam 36–37 porque contam a Supercopa da UEFA e as supercopas domésticas de forma diferente. Veja a <a href="/${lang}/achievements">lista completa de troféus</a>.`],
      ["Quantos Ballons d'Or Cristiano Ronaldo conquistou?", `Cristiano Ronaldo conquistou <b>5 Ballons d'Or</b> (2008, 2013, 2014, 2016, 2017) — o primeiro em 2008, aos 23 anos, quando foi nomeado em 77 dos 96 votos.`],
      ["Qual é o retrospecto de Ronaldo no Real Madrid?", `O retrospecto de Ronaldo nos El Clássicos pelo Real Madrid — e cada gol que ele marcou contra o Real Madrid com outra camisa — está reunido na nossa <a href="/${lang}/real-madrid">página de Ronaldo no Real Madrid</a>.`],
      ["Quais são as estatísticas de Ronaldo na UEFA Champions League?", `Ronaldo marcou <b>140 gols em 183 jogos na Champions League</b> — o recorde histórico da competição — com <b>42 assistências</b>, também recorde, e conquistou 5 títulos (2008, 2014, 2016, 2017, 2018). Veja os dados completos no nosso <a href="/${lang}/champions-league">hub da Champions League</a>.`],
      ["Quais são as estatísticas de Ronaldo na FIFA World Cup?", `Ronaldo jogou em <b>seis Copas do Mundo FIFA</b> (2006, 2010, 2014, 2018, 2022 e 2026) e permanece o maior artilheiro de Portugal, com <b>146 gols em 234 jogos</b> — o recorde histórico de seleções nos dois quesitos.`],
      ["Quão longe Cristiano Ronaldo está de 1.000 gols na carreira?", `Com ${n(t.goals)} gols, Ronaldo precisa de mais <b>${Math.max(0, 1000 - t.goals)} gols</b> para alcançar 1.000 gols na carreira — uma marca que nenhum jogador alcançou no futebol oficial de nível sênior.`]
    ]
  };

export const BY_YEAR = {
    head: (ys, best, t) => `Do primeiro gol profissional em ${ys[0].year} até <b>${best.goals} gols em ${best.year}</b> — todos os anos civis de uma carreira que produziu ${n(t.goals)} gols, com totais acumulados e a idade dele.`,
    cap: (best, t) => `Barras: gols no ano (pico ${best.goals}, ${best.year}). Linha: a subida até ${n(t.goals)}.`,
    chartLabel: (best) => `Gols de Ronaldo por ano civil com o total acumulado da carreira, com pico de ${best.goals} em ${best.year}`,
    kpiCareer: "Gols na carreira",
    kpiBest: "Melhor ano",
    kpiBestSub: "O máximo que ele marcou em um ano civil.",
    kpiCurrSub: "Temporada em andamento.",
    kpiYears: "Anos com gols",
    kpiYearsSub: (ys, last) => `Todos os anos, de ${ys[0].year} a ${last.year}.`,
    decades: "Gols nos",
    tableSub: "Mais recentes primeiro. 2026 recebe um asterisco enquanto a temporada ainda é disputada. Clique em uma coluna para ordenar ou digite para filtrar. Os anos de pico ganham uma nota de rodapé — passe o mouse sobre o ano.",
    caption: "Gols, total acumulado da carreira e idade para cada ano civil desde a estreia de Ronaldo em 2002.",
    thYear: "Ano", thGoals: "Gols", thTotal: "Total da carreira", thAge: "Idade",
    inProgNote: "* Temporada 2026 em andamento — atualiza após cada partida.",
    filterPlaceholder: "Filtrar anos — ex. 2013",
    bestYearHtml: (best) => `<p><b>${best.year} é o ano mais prolífico da carreira de Ronaldo: ${best.goals} gols</b> — 59 pelo Real Madrid e 10 por Portugal. Trouxe o segundo Ballon d'Or, uma temporada de clube com 55 gols e três gols pela Seleção Portuguesa em 15 minutos contra a Irlanda do Norte.</p><p>Os próximos melhores anos — 2012 (63), 2014 (61) e 2011 (60) — mostram o quanto o padrão se manteve alto ao longo de cinco temporadas seguidas, de 2010 a 2014. <a href="/en/dashboard">Veja como esses gols se distribuem por competição</a>.</p>`
  };

export const BY_SEASON = {
    head: (best) => `Todas as temporadas de clube de 2002/03 a 2026/27 — <b>melhor: ${best.goals} gols em ${best.season}</b> — com divisão por liga, copa e continental, mais Portugal ano a ano.`,
    clubSub: "Jogos / gols em cada formato. 2026/27 é a temporada em andamento. Clique em uma coluna para ordenar ou digite para filtrar.",
    caption: (len) => `Todas as ${len} temporadas de clube: Sporting CP 2002/03, Manchester United 2003/04–2008/09 e 2021/22–2022/23, Real Madrid 2009/10–2017/18, Juventus 2018/19–2021/22, Al Nassr 2022/23–2026/27.`,
    thSeason: "Temporada", thClub: "Clube", thApps: "Jogos", thGoals: "Gols", thLeague: "Liga", thCup: "Copa", thCont: "Continental", thOther: "Outros",
    totalLabel: "Total de clubes", bestBadge: "Melhor temporada de clube",
    filterClubPlaceholder: "Filtrar temporadas — ex. Real Madrid, 2012",
    countrySub: "Eliminatórias e torneios oficiais, além de amistosos, mais recentes primeiro.",
    countryCaption: "Gols de Portugal por ano civil, de 2003 a 2026.",
    thYear: "Ano", thNote: "Observação", totalArgLabel: "Total de Portugal",
    filterCountryPlaceholder: "Filtrar anos de Portugal — ex. 2016",
    bestSeasonHtml: (best) => `<p><b>${best.season} — ${best.goals} gols em ${best.apps} jogos pelo ${best.club}</b> — é a temporada de clube mais prolífica da carreira: ${best.league.goals} na liga, ${best.continental.goals} na Champions League, ${best.cup.goals} na copa e ${best.other.goals} nas supercopas. Ele marcou em todas as competições em que entrou.</p><p>Supera de pouco a lendária 2011/12 — 60 gols, dos quais 46 na La Liga — dentro de uma sequência de seis temporadas em Madri nas quais ele nunca ficou abaixo de 51 gols em clubes. <a href="/en/goalsbyyear">Os mesmos gols contados por ano civil</a>.</p>`
  };

export const DASH = {
  teamNames: { all: "todos os times", real_madrid: "Real Madrid", manchester_united: "Manchester United", juventus: "Juventus", al_nassr: "Al Nassr", sporting_cp: "Sporting CP", portugal: "Portugal" },
  pills: [["all", "Todos os times"], ["real_madrid", "Real Madrid"], ["manchester_united", "Manchester United"], ["juventus", "Juventus"], ["al_nassr", "Al Nassr"], ["sporting_cp", "Sporting CP"], ["portugal", "Portugal"]],
  head: (name) => `Cada gol de Ronaldo dissecado de quatro maneiras — por competição, por temporada, por tipo de finalização e por parte do corpo — filtrado para <b>${esc(name)}</b>. Toque em um time para refazer todos os gráficos.`,
  filterNote: (name, goals, apps, T) => `Exibindo ${name}: ${n(goals)} gols em ${n(apps)} jogos` + (T === "real_madrid" ? " (Champions League: 140 gols em 183 jogos com 42 assistências — os três são recordes da competição)." : "."),
  kpis: { goals: "Gols", apps: "Jogos", gpg: "Gols por jogo", forTeam: (name) => `Pelo ${name}.` },
  chartEmpty: "Nenhuma linha para este filtro de time.",
  figCap: (T, name) => T === "all" ? "Anos civis, de 2002 a 2026." : ["portugal", "portugal_nt", "country"].includes(T) ? "Anos civis de Portugal." : "Temporadas de clube do " + esc(name) + ".",
  finishParts: { "Open play": "Bola rolando", "Penalties": "Pênaltis", "Free kicks": "Cobranças de falta" },
  finishCenter: "gols na carreira",
  finishCaveat: "Totais da carreira com todos os times somados — não existe uma divisão por time. Contagem compilada provisória.",
  finishCaveatFiltered: (d) => `Não existe divisão por tipo de finalização por time, então este gráfico cobre apenas todos os times somados — veja os totais da carreira abaixo. Os ${n(d.totals.goals)} gols de Ronaldo se distribuem em ${d.byFinish.openPlay} de bola rolando, ${d.byFinish.penalties} de pênalti e ${d.byFinish.freeKicks} de falta (contagem compilada provisória).`,
  bodyParts: { "Left foot": "Pé esquerdo", "Right foot": "Pé direito", "Head": "Cabeça", "Other": "Outro" },
  bodyCenter: "gols com o pé direito",
  bodyCaveat: "Totais da carreira com todos os times somados — uma contagem compilada provisória, até a conclusão de uma contagem manual completa.",
  ageName: (r) => `Idade ${r.age} · ${r.year}`,
  ageCaveat: (apeak) => `Cada gol profissional pela idade em que foi marcado — clubes e seleção somados. Pico: ${apeak.goals} aos ${apeak.age} anos (${apeak.year}).`,
  ageFilterNote: "As idades somam gols de clubes e da seleção, então este gráfico cobre a carreira inteira — limpe o filtro de time para vê-lo.",
  compCaption: (name) => `Gols por competição — ${esc(name)}.`,
  thComp: "Competição", thGoals: "Gols", thShare: "Participação",
  recAllTime: "Recorde histórico da competição",
  finishCaption: "Como os gols foram marcados e com qual parte do corpo — totais da carreira, todos os times.",
  thFinish: "Finalização",
  finishCaveatTable: "A divisão por tipo de finalização e por parte do corpo é uma contagem compilada provisória.",
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
    ["69", `<b>Gols em 2013</b> — o máximo que ele marcou em um ano civil.`],
    [n(comp("La Liga")), `<b>Gols na La Liga</b>, o recorde histórico da competição, todos pelo Real Madrid.`],
    ["140", `<b>Gols na Champions League</b> — o recorde na história da competição.`],
    ["5", `<b>Ballons d'Or</b> (2008, 2013, 2014, 2016, 2017).`],
    [n(d.hatTricks), `<b>Hat-tricks ou mais</b> por clubes e seleção (contagem provisória).`],
    [`${LIVE.trophies}`, `<b>Títulos coletivos</b> — 32 por clubes, 3 por Portugal.`]
  ],
  method: "Os números da Champions League (140 gols em 183 jogos, 42 assistências) são recordes da competição extraídos dos registros oficiais dos clubes e da UEFA; as demais divisões por competição e por time seguem o mapeamento de competições por temporada de clube e estão documentadas no arquivo de dados."
};

export const TIMELINE = {
  head: (t) => `Da estreia no Sporting CP em 2002 a <b>${n(t.goals)} gols na carreira</b> e contando — as noites decisivas, os recordes e os troféus, datados e em ordem.`,
  keydates: (t, lastUpdated) => [
    ["14 Ago 2002", "Estreia profissional pelo <b>Sporting CP</b> contra o Inter na terceira rodada de classificação da Champions League, aos 17 anos."],
    ["20 Ago 2003", "Estreia por <b>Portugal</b> contra o Cazaquistão, semanas depois de vestir a lendérica camisa 7 no Manchester United."],
    ["2008", "<b>Ballon d'Or</b> aos 23 anos, nomeado em 77 dos 96 votos, com a Champions League e a Copa do Mundo de Clubes da FIFA."],
    ["2013", "<b>69 gols</b> no ano civil — o seu melhor ano, incluindo um hat-trick por Portugal em 15 minutos."],
    ["2016", "Levanta o <b>Campeonato Europeu</b> como capitão de Portugal, com três gols e a Chuteira de Prata."],
    [esc(lastUpdated), `<b>${n(t.goals)} gols na carreira</b> por clubes e seleção — última verificação nesta data.`]
  ],
  inProg: "em andamento",
  goals: "gols",
  goalsInEra: (goals, share, total) => `<b>${n(goals)} gols</b> · ${share}% de ${n(total)}`,
  peakYear: (pk, tr) => `<p class="ch-callout">Ano de pico <b>${pk.year} · ${pk.goals} gols</b>` + (tr ? ` · <b>${tr}</b> ${tr === 1 ? "título de equipe" : "títulos de equipe"} conquistado neste período` : "") + `</p>`,
  empty: (val, total) => `Nada corresponde a “${val}” — limpe a busca para ver todos os ${total} marcos.`,
  tagRecord: "Recorde", tagWc: "Copa do Mundo", tagFirst: "Primeiro",
  faq: [
    ["Quando Ronaldo fez a estreia profissional?", "Pelo <b>Sporting CP</b> em <b>14 de agosto de 2002</b> contra o Inter na terceira rodada de classificação da Champions League, aos 17 anos; seus primeiros gols profissionais vieram sete semanas depois, contra o Moreirense."],
    ["Quando Ronaldo marcou seu primeiro gol?", "Seu primeiro gol por Portugal foi um cabeceio contra a <b>Grécia na Euro 2004</b>; seu primeiro gol pelo Manchester United, no mesmo ano, foi uma cobrança de falta contra o Portsmouth."],
    ["Quando Ronaldo venceu a Champions League?", "Pela primeira vez em <b>2008</b> com o Manchester United e depois quatro vezes seguidas com o Real Madrid, em <b>2014, 2016, 2017 e 2018</b>."],
    ["Quando Ronaldo foi para o Real Madrid?", "Em <b>junho de 2009</b>, por uma então recorde mundial de negociação — com 80.000 pessoas no Bernabéu para a apresentação."],
    ["Quando Ronaldo entrou no Al Nassr?", "Em <b>janeiro de 2023</b>, estreando como capitão contra o Al-Ettifaq e marcando duas vezes num empate de 2–2."]
  ],
  method: "As entradas da linha do tempo são marcos com granularidade de ano e de data; as barras de gols por era dividem os anos civis em períodos sem sobreposição, para que a soma bata com o total da carreira."
};

export const ACH = {
  head: (teamTotal) => `<b>${teamTotal} títulos coletivos</b> — 32 por clubes e 3 por Portugal — mais <b>5 Ballons d'Or</b>. Todos os títulos, clube por clube, com os anos de conquista.`,
  kpis: (per) => [
    ["Títulos coletivos", 35, `Real Madrid ${per["Real Madrid"] || 0} · Manchester United ${per["Manchester United"] || 0} · Juventus ${per["Juventus"] || 0} · Portugal ${per["Portugal"] || 0}.`],
    ["Ballons d'Or", "5", "2008, 2013, 2014, 2016, 2017."],
    ["Chuteiras de Ouro Europeias", "4", "2008, 2011, 2014, 2015."],
    ["Temporadas como artilheiro da Champions League", "7", "Artilheiro da Champions League em 2008 e depois em todas as temporadas de 2013 a 2018."]
  ],
  qa: (teamTotal, per) => [
    ["Quantos títulos Ronaldo conquistou?", `<b>${teamTotal} títulos de equipe em nível sênior</b>: ${per["Real Madrid"] || 0} Real Madrid, ${per["Manchester United"] || 0} Manchester United, ${per["Juventus"] || 0} Juventus, ${per["Al Nassr"] || 0} Al Nassr, ${per["Sporting CP"] || 0} Sporting CP e ${per["Portugal"] || 0} Portugal.`],
    ["Quantos Ballons d'Or Ronaldo conquistou?", "<b>Cinco</b> — 2008, 2013, 2014, 2016 e 2017, o primeiro aos 23 anos."],
    ["Ronaldo conquistou um título internacional de peso?", "<b>Sim</b> — a Euro 2016 da UEFA como capitão e a UEFA Nations League em 2019 e 2025."],
    ["Quantas Champions Leagues Ronaldo conquistou?", "<b>Cinco</b>: 2008 com o Manchester United e depois 2014, 2016, 2017 e 2018 com o Real Madrid."]
  ],
  teamHeader: (team, sub) => `${esc(team)} — ${sub} títulos`,
  indHeader: (indTotal) => `Honrarias individuais — ${indTotal} distinções`,
  faq: [
    ["Qual é o troféu mais importante de Ronaldo?", "O <b>Campeonato Europeu de 2016</b> — o título que ele comandou a conquistar por Portugal em Paris, como segundo maior artilheiro do torneio."],
    ["Quantos títulos de liga Ronaldo conquistou?", "<b>Oito</b> — 3 da Premier League, 2 da La Liga, 2 da Serie A e 1 da Saudi Pro League, como detalhado na lista de honrarias deste arquivo."],
    ["Quantos prêmios individuais Ronaldo conquistou?", "Cinco Ballons d'Or, quatro Chuteiras de Ouro Europeias, três prêmios de melhor jogador da UEFA, o prêmio FIFA de melhor jogador do mundo em 2008, o prêmio FIFA Puskás em 2009, a Chuteira de Ouro da Euro 2020 e o The Best FIFA Men's Player em 2016 e 2017."],
    ["Ronaldo é o jogador mais condecorado de todos os tempos?", "Apenas em títulos coletivos, Messi lidera com 46 contra 35 de Ronaldo. Ronaldo lidera os recordes de gols — 981 gols, 140 deles na Champions League, e 146 gols em 234 jogos pela Seleção Portuguesa."]
  ]
};

export const BDAY = {
    months: ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
    badgeSuccess: "🎉 Sim! Ronaldo marcou no seu aniversário!",
    badgeMessi: "🎂 O próprio aniversário do CR7!",
    badgeEmpty: "Sem gols nesta data",
    headlineSuccess: (g, m, d) => `Cristiano Ronaldo marcou <b>${g} ${g === 1 ? "gol" : "gols"}</b> em <b>${m} ${m === 1 ? "partida" : "partidas"}</b> no dia ${d} ao longo da carreira profissional!`,
    headlineMessi: `Você faz aniversário no mesmo dia que <b>Cristiano Ronaldo</b> (nascido em 5 de fevereiro de 1985, em Funchal, Madeira)!`,
    headlineEmpty: (d) => `Cristiano Ronaldo não marcou em <b>${d}</b> ao longo da carreira profissional.`,
    whyZeroTitle: "Por que 0 gols?",
    whyZeroMessi: "5 de fevereiro cai no meio da temporada europeia de clubes, então costuma ser um dia de jogo comum para Ronaldo: a lista de partidas e os minutos em campo decidem se um gol sai na data em que ele nasceu.",
    whyZeroMessiSub: "Você divide seu dia especial com Cristiano Ronaldo — CR7, nascido em 5 de fevereiro de 1985.",
    emptyExpl: "Ronaldo não tinha partida marcada, ou não marcou, neste dia específico do calendário — mas marcou na maioria dos dias do ano, entre clubes e seleção.",
    closestDay: (d, g) => `O dia do calendário mais próximo em que Ronaldo marcou é <b>${d}</b> (${g} gols na carreira).`,
    closestBtn: (d, g) => `Ver ${d} (${g} gols) &rarr;`,
    watchClip: (cnt) => `Assistir ${cnt > 1 ? cnt + " gols" : "gol"}`,
    searchYt: "🔍 Buscar lances",
    playInline: "📺 Assistir aqui",
    closeInline: "✕ Fechar vídeo",
    ytHighlights: "Destaques no YouTube",
    goalSummary: (g) => `${g} ${g === 1 ? "gol" : "gols"} marcados:`,
    goalTab: (idx, min) => `Gol ${idx}${min ? ` (${min}')` : ""}`,
    shareSuccess: (d, g, m) => `Cristiano Ronaldo marcou ${g} gols em ${m} partidas no dia do meu aniversário (${d})! Confira sua data:`,
    shareEmpty: (d) => `Cristiano Ronaldo marcou no seu aniversário? Ele marcou na maioria dos dias do ano, entre clubes e seleção. Confira o seu:`,
  };

export const LATEST_GOAL = {
    goalPrefix: "Gol #",
    scoreline: "Placar",
    didScoreTodayYes: "SIM! Cristiano Ronaldo marcou hoje: Gol #{goalNum} aos {minute} contra {opp} ({score})!",
    didScoreTodayNo: "Ronaldo marcou hoje? A partida oficial mais recente de Cristiano Ronaldo aconteceu em {date}, na {comp}, onde ele marcou o Gol #{goalNum} da carreira aos {minute} para selar a vitória por {score}. Assista ao vídeo oficial do gol logo abaixo.",
    matchResult: "Resultado da última partida: {title}",
    goalBadge: "Gol #{goalNum} marcado ({minute})",
    playHighlight: "Selecione qualquer um dos últimos gols de Cristiano Ronaldo abaixo para carregar imediatamente e assistir ao vídeo do lance no player acima:",
    viewDateGoals: "Ver os gols de {formattedDate} →",
    tagHeader: "Cabeceio 🔥",
    tagFreekick: "Falta direta 🔥",
    tagPenalty: "Pênalti",
    tagLeftFoot: "Chute de pé esquerdo",
    tagRightFoot: "Pé direito",
    tagOpenPlay: "Bola rolando",
    assist: "Assistência"
  };

export const ARG_STREAM = {
    badge: "🇵🇹 NOITE DE JOGO DE PORTUGAL",
    title: "O Portugal de Cristiano Ronaldo",
    text: "Noite de jogo de Portugal — assista à transmissão AO VIVO grátis, SEM ANÚNCIOS.",
    highlight: "Transmissão ao vivo grátis • Sem anúncios",
    cta: "Assistir grátis ▶",
    closeAria: "Fechar notificação",
    matchCardTitle: "Seleção Portuguesa • Noite de jogo ao vivo",
    matchCardDesc: "Assista a Cristiano Ronaldo e Portugal ao vivo no Koora Live — transmissão grátis, zero anúncios."
  };

export const EXPLORE_LANGS = [
  { href: "/en/birthday", page: "birthday", t: "🎂 Ronaldo marcou no seu aniversário?", d: (d) => `Busque nos 366 dias do ano, com clipes de vídeo dos ${n(d.totals.goals)} gols profissionais da carreira de Ronaldo.` },
  { href: "/en/ronaldo-vs-messi", page: "ronaldo-vs-messi", t: "🐐 Ronaldo vs Messi na história", d: () => `Estatísticas de carreira cara a cara: ${n(LIVE.goals)} vs ${n(LIVE.rGoals)} gols, ${LIVE.trophies} vs ${LIVE.rTrophies} títulos, 5 vs 8 Ballons d'Or.` },
  { href: "/en/real-madrid", page: "real-madrid", t: "🏟️ Ronaldo no Real Madrid", d: () => "Seus nove anos no Real Madrid: 450 gols, 311 na La Liga, quatro Champions League e 18 no Clássico." },
  { href: "/en/champions-league", page: "champions-league", t: "⭐ Recorde na Champions League", d: () => "140 gols na UEFA Champions League, 42 assistências e 5 títulos europeus." },
  { href: "/en/latest-goal", page: "latest-goal", t: "⚽ Último gol de Ronaldo em vídeo", d: () => "Assista ao vídeo do último gol de Ronaldo, veja se ele marcou hoje e confira os lances recentes." },
  { href: "/en", page: "home", t: "Estatísticas da carreira de Ronaldo", d: (d) => `Os números principais: ${n(d.totals.goals)} gols em ${n(d.totals.apps)} partidas profissionais.` },
  { href: "/en/dashboard", page: "dashboard", t: "Painel de estatísticas de Ronaldo", d: () => "Filtre todos os gráficos por Real Madrid, Manchester United, Juventus, Al Nassr, Sporting CP ou Portugal." },
  { href: "/en/timeline", page: "timeline", t: "Ronaldo ao longo dos anos", d: () => "Cada marco da carreira, datado e em ordem, de 2002 até hoje." },
];

/* Aberturas de capítulo por era. O renderer procura a intro pela slug da era
   primeiro (rosario, peak, msn, carry, farewell, paris, miami) e recorre ao
   nome da era como alternativa, então as duas chaves recebem o mesmo texto —
   sem qualquer alteração em app.js. */
export const ERA_INTROS = {
  "The boy from Rosario":
    `Cristiano Ronaldo chegou a Lisboa vindo de Funchal, na Madeira, ainda adolescente, com fama de veloz e o hábito de exigir a bola. Sua primeira temporada profissional no Sporting CP rendeu cinco gols em 31 partidas e, em doze meses, recebeu a lendérica camisa 7 do Manchester United por £12.24m. Marcou na final da FA Cup aos 19 anos, conquistou três títulos da Premier League, a Champions League e a Copa do Mundo de Clubes da FIFA e, em 2008, foi eleito o melhor jogador do mundo aos 23 — com 77 dos 96 votos.`,
  "The greatest peak football has seen":
    `O Real Madrid pagou uma negociação recorde mundial em 2009 e ficou com o talento ofensivo mais caro da história do esporte. Ele respondeu com um cabeceiro na final da Copa del Rey contra o Barcelona em sua primeira temporada e, em seguida, com um título da La Liga conquistado com 100 pontos recorde e 46 gols na liga. Até o fim de 2012 tinha alcançado 60 gols em um ano civil e 100 gols na La Liga para o clube, e a identidade ofensiva do Madrid estava sendo reconstruída em torno dele.`,
  "MSN and the second treble":
    `Três temporadas em Madrid levaram Ronaldo a ultrapassar quase todas as marcas do livro. Marcou 69 gols em 2013, o melhor ano civil da carreira, incluindo três pela Seleção Portuguesa em quinze minutos contra a Irlanda do Norte — um de dez hat-tricks internacionais, um recorde mundial. A Décima chegou em 2014 e, até o fim de 2015, o gol 500 da carreira o havia colocado à frente de todo artilheiro da Champions League na história.`,
  "Carrying Barcelona":
    `Depois do Campeonato Europeu de 2016 conquistado na França, Ronaldo somou a Champions League em 2017 — incluindo um hat-trick contra o Bayern de Munique que o levou a 100 gols na competição — e um quinto Ballon d'Or na mesma temporada. Superou Jimmy Greaves como maior artilheiro das cinco grandes ligas europeias e, aos 33 anos, foi para a Juventus, onde marcou um hat-trick em seu primeiro jogo na Champions League.`,
  "Farewell to Barcelona":
    `O título da Nations League e um lugar nos livros de recordes chegaram em 2019, quando o gol 700 da carreira saiu contra a Ucrânia, em outubro. Sua 1.000ª partida profissional veio contra o SPAL, em fevereiro de 2020, e, em 2021, passou Ali Daei e se tornou o maior artilheiro do futebol internacional masculino, com um décimo hat-trick internacional — um recorde mundial.`,
  "Paris and the World Cup":
    `O retorno ao Manchester United em 2021 trouxe a camisa 7 e um novo palco para o mais velho da sala e, em 2022, passou Josef Bican com um hat-trick contra o Tottenham. A ida para a Arábia Saudita em janeiro de 2023 o tornou capitão do Al Nassr e, com sua 197ª convocação, o jogador com mais jogos pela seleção no futebol internacional masculino.`,
  "Miami and the road to 1,000":
    `O Al Nassr lhe deu um novo começo e um título da Saudi Pro League, mas os recordes continuaram: o gol 900 da carreira na Nations League em 2024, o gol 800 em clubes e o gol 100 pelo Al Nassr em 2025 — fazendo dele o primeiro jogador a marcar 100 gols por quatro clubes — e, em 2026, o gol 500 marcado depois dos 30 anos e uma sexta Copa do Mundo FIFA. Cada gol agora dobra a curva rumo a 1.000.`
};
/* Chaves alias: as slugs de era (e as slugs mais curtas das eras do
   Ronaldo) levam aos mesmos sete parágrafos, de modo que os capítulos da
   linha do tempo sempre abrem com o texto do Ronaldo, seja qual for a
   chave usada pelo renderer. */
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
    { title: "Portugal & Copa do Mundo FIFA", sub: "Seis Copas do Mundo (2006–2026) e 146 gols em 234 jogos pela Seleção Portuguesa.", src: "/img/cab-wc.webp", w: 800, h: 600, pos: "50% 30%", alt: "Cristiano Ronaldo com a camisa número 7 de Portugal na Copa do Mundo da FIFA de 2018", cap: "O maior artilheiro de Portugal, em seis Copas do Mundo" },
    { title: "Ballon d'Or — 5", sub: "2008, 2013, 2014, 2016, 2017 — o primeiro aos 23 anos.", src: "/img/cab-ballon.webp", w: 800, h: 600, pos: "50% 30%", alt: "Cristiano Ronaldo com o Ballon d'Or que ganhou um recorde de cinco vezes", cap: "Cinco Ballons d'Or" },
    { title: "Champions League — 5", sub: "140 gols, o recorde da competição, em 183 jogos.", src: "/img/cab-ucl.webp", w: 800, h: 600, pos: "50% 25%", alt: "As taças da Taça Europeia e da UEFA Champions League, ganhas cinco vezes por Cristiano Ronaldo", cap: "Cinco títulos europeus e 140 gols na Champions League" },
    { title: "Copa do Mundo de Clubes FIFA — 4", sub: "2008, 2014, 2016 e 2017 com Manchester United e Real Madrid.", src: "/img/cab-cwc.webp", w: 800, h: 600, pos: "50% 25%", alt: "Os troféus Golden Ball da FIFA Club World Cup no museu CR7 da Madeira", cap: "Quatro Copas do Mundo de Clubes da FIFA" },
    { title: "La Liga — 311 gols", sub: "O recorde histórico da competição, todos pelo Real Madrid.", src: "/img/cab-liga.webp", w: 800, h: 600, pos: "50% 25%", alt: "Cristiano Ronaldo com a camisa número 7 do Real Madrid, numa La Liga que ganhou duas vezes", cap: "311 gols na La Liga pelo Real Madrid" }
  ];

export const BDAY_MEDIA = {
    "searchHighlights": "🔍 Buscar lances",
    "openArchive": "Abrir no arquivo de gols do CR7",
    "noClip": "Não há clipe publicado deste gol.",
    "noClipBody": "O registro da partida abaixo vem das atas oficiais. Os links abrem a página do gol no arquivo e uma busca pelo vídeo.",
    "clipLabel": "Clipe publicado",
    "seasonNote": "Todos os gols que o Ronaldo marcou na temporada {season}.",
    "compilationNote": "Este golo aparece numa compilação de todos os golos. Use o link do arquivo para encontrar a posição exata.",
    "compilationLabel": "Compilação de todos os gols",
    "publisher": "Publicado por",
    "assist": "Assistência: {name}",
    "finish": "Finalização: {type}",
    "goalNumber": "Gol n.º {n}",
    "watchOn": "Assistir em {publisher}",
    "sourceLine": "Registro do gol: {source} — o arquivo tira sua lista da Wikipédia, List of senior career goals by Cristiano Ronaldo (CC BY-SA 4.0, sobre o log de gols do FBref), e do StatsBomb open data. Os clipes são publicados pelos detentores de direitos.",
    "sourceNote": "As datas, competições, placares, minutos, finalizações e assistências desta página vêm do cr7allgoals.com, cuja lista de gols é a da Wikipédia, List of senior career goals by Cristiano Ronaldo (CC BY-SA 4.0, sobre o log do FBref), com o StatsBomb open data nos detalhes revisados dos jogos. A lista internacional é o registro de jogos da RSSSF: 146 gols em 234 partidas por Portugal. Quando o minuto nunca foi publicado, fica vazio em vez de ser inventado."
  };
