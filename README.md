# Ranking QA — Documentacao

Porta de entrada do projeto. Se voce ler so um arquivo, e este.

## O que e a aplicacao
Web app que exibe um ranking de profissionais de QA baseado em seguidores no LinkedIn,
com mudancas de posicao entre snapshots historicos.

## Como rodar

### Desenvolvimento
```bash
npm install
npm run dev
```
Acesse http://localhost:3000

### Producao
```bash
npm install
npm run build
npm run start
```
## Deploy e Dados (Supabase + Vercel)
- Frontend publicado na Vercel.
- Dados do ranking vêm do Supabase (tabela `ranking_history`, coluna JSONB `data`).
- Leitura pública via RLS + policy de SELECT para 'anon'.
- Variáveis obrigatórias: 'NEXT_PUBLIC_SUPABASE_URL' e 'NEXT_PUBLIC_SUPABASE_ANON_KEY'.

## Variaveis de ambiente
Opcional:
- NEXT_PUBLIC_SITE_URL=https://seu-dominio.com

## Exemplo rapido de uso
Atualizar dados via CSV e visualizar:
```bash
npm run convert:csv profiles.csv
npm run dev
```

## Links uteis
- Repo: https://github.com/seu-org/qa-influencers-ranking
- App: https://seu-dominio.com
- Dashboards: https://seu-monitoramento.com

## Outros documentos
- Visao: docs/vision.md
- Escopo: docs/scope.md
- Dados e ranking: docs/data.md
- Arquitetura: docs/architecture.md
- Qualidade: docs/quality.md
- Decisoes (ADR): docs/decisions.md
- Backlog: docs/TODO.md
