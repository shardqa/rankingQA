# Decisoes (ADR)

## ADR-001 — MVP com JSON versionado
Contexto: Precisavamos iniciar rapido e com baixo custo.
Decisao: Usar `data/qa-professionals.json` versionado no Git.
Consequencia: Simples e transparente, mas limitado para consultas complexas.

## ADR-002 — Metricas do MVP = LinkedIn followers
Contexto: Precisamos de uma metrica objetiva e publica.
Decisao: Ordenar por seguidores do LinkedIn.
Consequencia: Facil de coletar, mas nao mede qualidade tecnica.

## ADR-003 — Atualizacao manual como padrao
Contexto: Scraping pode violar ToS e falhar com bloqueios.
Decisao: Atualizacao manual via CSV e script de conversao.
Consequencia: Maior esforco humano, menor risco legal.

## ADR-004 — Next.js com paginas estaticas
Contexto: Site com leitura e ranking simples.
Decisao: Gerar estatico em build.
Consequencia: Performance alta e baixo custo de hosting.
