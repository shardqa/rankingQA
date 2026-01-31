# Qualidade e Riscos

## O que precisa funcionar sempre
- Ranking ordenado por followers.
- Links de perfis validos.
- Pagina carrega com bom desempenho.

## Principais riscos
- Dados desatualizados (cadencia lenta).
- Risco legal/ToS se usar scraping.
- Performance em build se o dataset crescer muito.

## Como testar
- Manual: abrir home e validar ordem/links.
- Scripts: `npm run type-check` e `npm run lint`.
- Dados: validar JSON gerado apos conversao de CSV.

## Definicao de pronto
- Dados atualizados com snapshot novo.
- UI sem erros visiveis.
- Build passa localmente.
