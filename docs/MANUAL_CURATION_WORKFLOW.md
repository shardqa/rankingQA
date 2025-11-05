# Manual Curation Workflow

**Recomendado para MVP e uso ético/legal**

Este guia explica como atualizar o ranking de QAs manualmente, sem violar termos de serviço.

---

## 📋 Overview

### Por que Manual?

✅ **Legal** - Não viola LinkedIn ToS
✅ **Ético** - Você visita perfis como usuário normal
✅ **Gratuito** - Zero custo
✅ **Qualidade** - Você controla quem entra
✅ **Baixo risco** - Zero chance de ban

---

## 🔄 Workflow Completo

### 1. Pesquisar Profissionais (30-60 min)

**Onde buscar:**
- LinkedIn search: "QA Engineer", "SDET", "Test Automation Engineer"
- Conferências: Speakers do STARWEST, Agile Testing Days, TestBash
- Listas: Ministry of Testing, QA blogs
- GitHub: Contributors em projetos de testing
- Twitter/X: Hashtags #QA, #Testing, #TestAutomation

**Critérios para inclusão:**
- Mínimo 5,000 seguidores no LinkedIn
- Ativo na comunidade (posts, talks, conteúdo)
- Perfil público
- Profissional de QA (não apenas tangencial)

### 2. Coletar Dados (10 min por perfil)

**Para cada profissional:**

1. **Visite o perfil no LinkedIn**
   ```
   https://www.linkedin.com/in/USERNAME/
   ```

2. **Anote as informações:**
   - Nome completo
   - LinkedIn username (da URL)
   - Número de seguidores (exato ou aproximado)
   - País
   - Estado/Província (se visível)
   - Cargo atual
   - Empresa atual

3. **Adicione à planilha** (veja abaixo)

### 3. Organizar em Planilha (Google Sheets ou Excel)

**Template: `scripts/utils/csv-template.csv`**

**Colunas:**
```
id, name, linkedinUsername, linkedinUrl, followers, country, countryCode, state, stateCode, title, company
```

**Exemplo:**
```csv
id,name,linkedinUsername,linkedinUrl,followers,country,countryCode,state,stateCode,title,company
1,Angie Jones,angiejones,https://www.linkedin.com/in/angiejones/,250000,United States,US,,,VP of Developer Relations,TBD
2,Júlio de Lima,juliodelimaqa,https://www.linkedin.com/in/juliodelimaqa/,38000,Brazil,BR,São Paulo,SP,QA Consultant,Iterasys
```

**Dicas:**
- Use Google Sheets para colaboração
- Mantenha histórico (crie nova aba mensalmente)
- Formate followers como número (não 250K, use 250000)
- Campos opcionais: state, stateCode, title, company

### 4. Exportar como CSV (1 min)

**Google Sheets:**
```
File → Download → Comma Separated Values (.csv)
```

**Excel:**
```
File → Save As → CSV (Comma delimited)
```

Salve como: `profiles.csv` na raiz do projeto

### 5. Converter para JSON (1 min)

**Comando:**
```bash
npm run convert:csv profiles.csv
```

Isso vai:
- Ler o CSV
- Converter para formato JSON
- Ordenar por seguidores
- Salvar em `data/qa-professionals.json`

**Output:**
```
CSV to JSON Converter
============================================================

📖 Reading CSV: profiles.csv
📝 Parsing CSV...
✓ Parsed 5 rows
🔄 Converting to JSON format...
✓ Converted 5 professionals
✓ Saved to: /path/to/data/qa-professionals.json

============================================================
Summary:
============================================================
Total professionals: 5
Last update: 2025-11-04T12:00:00.000Z

Top 5:
  1. Angie Jones - 250,000 followers
  2. Bas Dijkstra - 45,000 followers
  3. Júlio de Lima - 38,000 followers
  4. Nikolay Advolodkin - 35,000 followers
  5. Joe Colantonio - 32,000 followers

✅ Conversion complete!
```

### 6. Validar Dados (2 min)

**Verificar JSON:**
```bash
cat data/qa-professionals.json
```

**Testar site localmente:**
```bash
npm run dev
```

Acesse http://localhost:3000 e verifique:
- ✅ Ranking está correto (ordem por followers)
- ✅ Nomes e fotos aparecem
- ✅ Links do LinkedIn funcionam
- ✅ Indicadores de mudança corretos

### 7. Commit e Deploy (2 min)

**Commit:**
```bash
git add data/qa-professionals.json
git commit -m "Update rankings - November 2025"
git push origin main
```

**Deploy:**
- Vercel: Deploy automático
- VPS: `./deploy.sh` ou `pm2 restart`

---

## 📅 Frequência Recomendada

### Opção 1: Mensal
- **Quando:** Primeiro dia do mês
- **Duração:** 2-4 horas
- **Atualiza:** Todos os profissionais

### Opção 2: Bimestral
- **Quando:** A cada 2 meses
- **Duração:** 3-5 horas
- **Atualiza:** Todos + adiciona novos

### Opção 3: Sob Demanda
- **Quando:** Quando receber submissões comunitárias
- **Duração:** 10-15 min por submissão
- **Atualiza:** Apenas novos profissionais

---

## 🤝 Workflow com Submissões Comunitárias

### Como Funciona

1. **Usuário abre GitHub Issue**
   - Template: `.github/ISSUE_TEMPLATE/suggest_profile.md`
   - Preenche informações do profissional

2. **Você recebe notificação**
   - Email ou GitHub notification

3. **Valida submissão (5-10 min)**
   - Verifica perfil no LinkedIn
   - Confirma followers > 5K
   - Checa atividade na comunidade
   - Verifica se já está no ranking

4. **Aprova e adiciona**
   - Adiciona linha na planilha
   - Exporta CSV
   - Converte para JSON
   - Commit e push

5. **Responde issue**
   ```markdown
   ✅ Approved! Thank you for the suggestion.

   [Name] has been added to the ranking with approximately [X] followers.
   The ranking will be updated in the next deploy (within 5 minutes).

   Closing this issue.
   ```

6. **Fecha issue**

### Template de Resposta (Aprovado)

```markdown
## ✅ Profile Approved

Thank you for suggesting **[Name]**!

**Profile details:**
- Followers: ~[X]
- Location: [Country/State]
- Position: [Title] at [Company]

The profile has been added to the ranking and will appear on the website in the next few minutes.

**Ranking position:** #[Position]

Closing this issue. Thanks again for contributing! 🙏
```

### Template de Resposta (Rejeitado)

```markdown
## ❌ Profile Not Added

Thank you for your suggestion!

Unfortunately, we cannot add **[Name]** to the ranking at this time for the following reason(s):

- [ ] Less than 5,000 followers
- [ ] Profile is private/not public
- [ ] Not active in QA community (no recent posts/content)
- [ ] Already in the ranking
- [ ] Other: [explain]

**Note:** We review all suggestions carefully and prioritize professionals who actively contribute to the QA community through talks, articles, open source, courses, etc.

You're welcome to suggest other profiles or re-submit this one in the future if the situation changes.

Closing this issue.
```

---

## 📊 Exemplo de Planilha

### Google Sheets Template

**Link:** [Download Template](https://docs.google.com/spreadsheets/d/YOUR_TEMPLATE_ID)

**Estrutura:**

| Sheet | Propósito |
|-------|-----------|
| Current | Ranking atual (última atualização) |
| 2025-11 | Snapshot de novembro 2025 |
| 2025-09 | Snapshot de setembro 2025 |
| Archive | Profissionais removidos |

**Fórmulas úteis:**

**Calcular mudança de posição:**
```
=VLOOKUP(A2, '2025-09'!A:B, 2, FALSE) - B2
```

**Highlight mudanças:**
```
Conditional formatting:
- Verde: Subiu (> 0)
- Vermelho: Caiu (< 0)
- Cinza: Manteve (= 0)
```

---

## 🛠 Troubleshooting

### Erro: "CSV file is empty"

**Problema:** Arquivo CSV vazio ou corrompido

**Solução:**
1. Verificar se arquivo foi exportado corretamente
2. Abrir CSV em editor de texto (não Excel)
3. Verificar se tem conteúdo

### Erro: "Skipping incomplete row"

**Problema:** Linha do CSV falta campos obrigatórios

**Solução:**
1. Verificar se todas as linhas têm: id, name, url, followers
2. Preencher campos faltantes
3. Re-exportar CSV

### Erro: "Cannot find module tsx"

**Problema:** Dependências não instaladas

**Solução:**
```bash
npm install
```

### Ranking não atualiza no site

**Problema:** JSON não foi commitado ou deploy não rodou

**Solução:**
```bash
# Verificar se JSON foi atualizado
cat data/qa-professionals.json

# Verificar git status
git status

# Se não commitado, fazer commit
git add data/qa-professionals.json
git commit -m "Update rankings"
git push

# Verificar deploy (Vercel)
# Dashboard > Deployments > Latest
```

---

## 📝 Checklist de Atualização

Use este checklist mensalmente:

```markdown
## Atualização de [Mês/Ano]

### 1. Pesquisa
- [ ] Busquei novos profissionais no LinkedIn
- [ ] Chequei speakers de conferências recentes
- [ ] Revisei listas e diretórios
- [ ] Processei submissões comunitárias

### 2. Coleta
- [ ] Visitei perfis do LinkedIn
- [ ] Anotei followers de todos os profissionais
- [ ] Verifiquei mudanças (novos cargos, empresas)
- [ ] Atualizei planilha

### 3. Processamento
- [ ] Exportei CSV
- [ ] Converti para JSON (`npm run convert:csv`)
- [ ] Validei JSON gerado
- [ ] Testei localmente (`npm run dev`)

### 4. Deploy
- [ ] Commitei mudanças
- [ ] Pushei para repositório
- [ ] Verifiquei deploy
- [ ] Testei site em produção

### 5. Comunicação
- [ ] Respondi issues de submissão
- [ ] Postei update nas redes sociais (opcional)
- [ ] Atualizei changelog (opcional)

### Stats
- Total de profissionais: [X]
- Novos este mês: [Y]
- Top 3: [Names]
```

---

## 🎯 Metas de Tempo

**Primeira vez (setup):**
- 4-6 horas (pesquisa + setup de planilha)

**Atualizações mensais:**
- 2-3 horas (20-30 profissionais)
- Breakdown:
  - Pesquisa: 30-60 min
  - Coleta: 60-90 min (10 min × 6-9 perfis novos)
  - Processamento: 15 min
  - Deploy: 5 min

**Por submissão comunitária:**
- 10-15 min cada

---

## 💡 Dicas e Best Practices

### Eficiência

1. **Batch processing**
   - Pesquise vários perfis de uma vez
   - Anote todos em planilha
   - Processe tudo de uma vez

2. **Templates salvos**
   - Salve buscas no LinkedIn
   - Bookmark listas e diretórios
   - Use atalhos de teclado

3. **Automação parcial**
   - Google Sheets formulas
   - Script de conversão (já temos!)
   - Git hooks (auto-deploy)

### Qualidade

1. **Verifique atividade**
   - Posts recentes (< 3 meses)
   - Engajamento (likes, comments)
   - Conteúdo de valor

2. **Diversidade**
   - Múltiplos países
   - Diversos backgrounds
   - Diferentes especialidades (automation, performance, security)

3. **Documentação**
   - Anote porquê incluiu cada pessoa
   - Mantenha histórico de mudanças
   - Documente decisões

---

## 📞 Ajuda

**Problemas técnicos:**
- GitHub Issues
- Email: [seu email]

**Sugestões de profissionais:**
- GitHub Issue (template)
- Email: [seu email]

---

## 📚 Recursos

**Documentos Relacionados:**
- [SAFE_DATA_COLLECTION.md](./SAFE_DATA_COLLECTION.md) - Todas as alternativas
- [VISION.md](../VISION.md) - Visão do projeto
- [ARCHITECTURE.md](../ARCHITECTURE.md) - Arquitetura técnica

**Scripts:**
- `scripts/utils/csv-to-json.ts` - Conversor CSV → JSON
- `scripts/utils/csv-template.csv` - Template de CSV

**Templates:**
- `.github/ISSUE_TEMPLATE/suggest_profile.md` - Submissões comunitárias

---

**Tempo total estimado: 2-3 horas/mês para manter 20-30 profissionais** ⏱️

**Benefício: 100% legal, ético e sustentável** ✅
