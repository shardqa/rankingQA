# TODO

## MVP pendente
- Definir links reais (repo, app, dashboards).
- Validar dados iniciais e snapshot base.

## Supabase + Vercel (ordem recomendada)
1. Criar projeto no Supabase e anotar `Project URL` e `anon key`.
2. Criar tabela `ranking_history` com colunas `id`, `data` (JSONB), `updated_at`.
3. Configurar RLS: permitir `SELECT` público para `ranking_history` (somente leitura).
4. Inserir um primeiro snapshot manual em `ranking_history.data` (JSONB compatível com `RankingHistory`).
5. Definir variáveis de ambiente locais: `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` em `.env.local`.
6. Validar no app local que o fetch do Supabase funciona (fallback não acionado).
7. Criar projeto na Vercel e conectar o repositório.
8. Configurar as mesmas env vars no projeto Vercel.
9. Executar build e deploy inicial.
10. Validar em produção que o app lê o dado do Supabase (sem erros).
11. Definir rotina de atualização de snapshot (manual ou script) e registrar a cadência.

## Melhorias futuras
- Ranking por pais/estado.
- Filtros e busca.
- Historico visual (charts).
- Multimetricas (YouTube, GitHub, etc.).

## Dividas tecnicas
- Revisar scripts de scraping e riscos legais.
- Melhorar validacao de dados no CSV.

## Ideias avaliadas (nao priorizadas)
- Sistema de votos da comunidade.
- Badges de verificacao.
- API publica.
