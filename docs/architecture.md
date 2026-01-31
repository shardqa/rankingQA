# Arquitetura

## Visao geral
- Next.js gera paginas estaticas a partir de dados em JSON.
- Sem backend exposto no MVP.
- Scripts opcionais fazem coleta/atualizacao de dados.

## Frontend
- Next.js App Router.
- Componentes em `components/`.
- Logica de ranking em `lib/`.

## Backend e servicos
- Nao ha API no MVP.
- Scripts de scraping/monitoramento em `scripts/` (opcionais).

## Banco de dados
- MVP usa `data/qa-professionals.json`.
- Futuro: Postgres/SQLite se precisar de filtros e historico amplo.

## Jobs / cron / filas
- Opcional: `npm run scrape:schedule` ou `npm run monitor:schedule`.
- Recomendado apenas se politica de dados permitir.
