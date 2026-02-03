# Dados e Ranking

## Origem dos dados
- Atualizacao manual via CSV e conversao para JSON (padrao do MVP).
- Scraping existe, mas e de risco legal/ToS; use apenas se aceitar o risco.

## Frequencia de atualizacao
- Sugerido: mensal ou bimestral no MVP.
- Quando automatizar: semanal (se permitido).

## Campos utilizados
Arquivo principal: `data/qa-professionals.json`
Campos por perfil:
- id, name, profilePicture, linkedinUrl, followers
- location { country, countryCode, state?, stateCode? }
- title?, company?, lastUpdated

## Formula do ranking
- Ordenacao por `followers` (desc).
- Mudanca de posicao calculada comparando o snapshot atual com o anterior.

## Como atualizar (manual)
1. Preencher planilha e exportar CSV.
2. Rodar `npm run convert:csv profiles.csv`.
3. Conferir `data/qa-professionals.json`.

## Limitacoes conhecidas
- Seguidores nao representam qualidade tecnica.
- Dados podem ficar desatualizados entre snapshots.
- Scraping pode falhar por bloqueios do LinkedIn.

## Fonta de dados
- O ranking é armazenado no Supabase em `ranking_history.data` (JSONB).
- Atualização inicial é feita via scripts locais; automação é futura.