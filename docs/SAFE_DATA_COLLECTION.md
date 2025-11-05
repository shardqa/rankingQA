# Alternativas Seguras e Legais para Coleta de Dados

Este documento explica alternativas **éticas, legais e gratuitas** para coletar dados de profissionais de QA, sem violar termos de serviço.

---

## ⚠️ Situação Atual do Scraper

### O que implementamos

O scraper atual (`scripts/scraper/`) usa **Puppeteer** para:
1. Abrir navegador automatizado
2. Navegar para perfis do LinkedIn
3. Extrair contagem de seguidores
4. Salvar dados em JSON

### ❌ Problemas com Esta Abordagem

**1. Viola Termos de Serviço do LinkedIn**
- LinkedIn proíbe explicitamente scraping automatizado
- Seção 8.2 do User Agreement
- Risco de suspensão de conta
- Possível ação legal

**2. Requer Login (ou acesso não-autenticado limitado)**
- Sem login, LinkedIn bloqueia após poucos acessos
- Com login, você arrisca sua conta

**3. Frágil e Instável**
- LinkedIn muda HTML frequentemente
- Seletores CSS quebram
- Captchas bloqueiam automação
- Rate limiting agressivo

**4. Não Escalável**
- Lento (5-10s por perfil)
- Bloqueios aumentam com volume
- Custo de manutenção alto

---

## ✅ Alternativas Legais e Gratuitas

### 1. **Curadoria Manual Comunitária** (RECOMENDADO PARA MVP)

**Como funciona:**
- Você mantém uma lista curada de profissionais de QA
- Atualiza manualmente periodicamente (mensal/bimestral)
- Comunidade sugere novos nomes via GitHub Issues ou formulário

**Vantagens:**
- ✅ 100% legal e ético
- ✅ Zero risco de ban
- ✅ Qualidade > Quantidade
- ✅ Você controla quem entra
- ✅ Gratuito

**Desvantagens:**
- ⏰ Trabalho manual (2-4h/mês para 20-30 perfis)
- 📊 Follower counts podem ficar desatualizados

**Implementação:**
```markdown
## Como adicionar profissionais:

1. Pesquisar "QA Engineer" no LinkedIn manualmente
2. Identificar perfis com > 5K seguidores
3. Verificar atividade (posts, engajamento)
4. Anotar:
   - Nome
   - URL do LinkedIn
   - Followers (aprox)
   - Localização
   - Empresa
5. Adicionar ao JSON manualmente
6. Commit e push
```

**Tempo:** 5-10 min por perfil, ~2h para 20 perfis/mês

---

### 2. **Submissões da Comunidade**

**Como funciona:**
- Usuários sugerem perfis via formulário ou GitHub Issue
- Você revisa e aprova manualmente
- Atualiza JSON com dados públicos

**Vantagens:**
- ✅ Legal e ético
- ✅ Comunidade engajada
- ✅ Descoberta orgânica
- ✅ Menos trabalho para você

**Desvantagens:**
- 🛠 Precisa de formulário/sistema
- 🔍 Precisa moderar submissões (spam, qualidade)

**Implementação:**

Opção A: **GitHub Issues Template**

```markdown
<!-- .github/ISSUE_TEMPLATE/suggest_profile.md -->

---
name: Suggest QA Professional
about: Suggest a QA professional for the ranking
title: '[PROFILE] Name Here'
labels: 'profile-suggestion'
---

## Professional Information

**Name:**
**LinkedIn URL:**
**Approximate Followers:**
**Location (Country):**
**Location (State/City):**
**Current Title:**
**Current Company:**

## Why should this person be included?

(Explain their contributions to the QA community: talks, articles, open source, etc.)

## Checklist

- [ ] LinkedIn profile is public
- [ ] Has > 5,000 followers
- [ ] Active in QA community (posts, talks, content)
- [ ] I have no affiliation with this person (if applicable)
```

Opção B: **Google Forms + Manual Review**

1. Criar Google Form simples
2. Pessoas preenchem
3. Você recebe notificação
4. Valida e adiciona ao JSON

---

### 3. **Google Custom Search API** (Gratuito até 100 buscas/dia)

**Como funciona:**
- Usar Google para encontrar perfis públicos do LinkedIn
- Buscar por: "QA Engineer site:linkedin.com/in"
- Extrair URLs dos resultados
- Visitar manualmente para coletar follower count

**Vantagens:**
- ✅ Legal (usando Google, não LinkedIn diretamente)
- ✅ Gratuito (100 queries/dia)
- ✅ Bom para discovery

**Desvantagens:**
- 🚫 Não retorna follower count (ainda precisa visitar perfil)
- 📊 Limitado (100 buscas/dia)

**Implementação:**

```bash
# 1. Criar projeto no Google Cloud
# 2. Ativar Custom Search API
# 3. Criar Custom Search Engine
# 4. Configurar para buscar apenas linkedin.com/in

# Exemplo de busca:
curl "https://www.googleapis.com/customsearch/v1?key=YOUR_API_KEY&cx=YOUR_CX&q=QA+Engineer+site:linkedin.com/in"
```

Resultado: Lista de URLs do LinkedIn

Depois, você visita manualmente cada URL e anota followers.

---

### 4. **Listas Públicas e Diretórios**

**Como funciona:**
- Usar listas já existentes de QAs influentes
- Exemplos:
  - Ministry of Testing
  - QA blogs
  - Listas de speakers de conferências (Agile Testing Days, STARWEST, etc.)
  - GitHub Awesome Lists
  - Twitter Lists

**Vantagens:**
- ✅ Legal
- ✅ Pré-curado (qualidade)
- ✅ Gratuito

**Desvantagens:**
- 🔍 Precisa encontrar essas listas
- 📊 Ainda precisa coletar follower counts manualmente

**Fontes:**

1. **Ministry of Testing**
   - https://www.ministryoftesting.com/
   - Forum members, contributors

2. **Conferências de QA**
   - STARWEST/STAREAST speakers
   - Agile Testing Days
   - TestBash

3. **GitHub Awesome Lists**
   - https://github.com/search?q=awesome+qa
   - https://github.com/topics/testing

4. **Medium, Dev.to, Hashnode**
   - Top authors em tags "QA", "Testing", "Test Automation"

---

### 5. **LinkedIn Sales Navigator (Pago, mas trial gratuito)**

**Como funciona:**
- LinkedIn Sales Navigator tem trial de 1 mês grátis
- Permite fazer buscas avançadas
- Exporta listas de perfis
- Você coleta dados manualmente durante o trial

**Vantagens:**
- ✅ Legal (produto oficial LinkedIn)
- ✅ Buscas avançadas (localização, cargo, etc.)
- ✅ Trial gratuito de 1 mês

**Desvantagens:**
- 💰 Pago após trial ($79/mês)
- 🕒 Trial limitado (apenas 1 mês)
- 📊 Não exporta follower counts (só URLs)

**Estratégia:**

1. Usar trial de 1 mês
2. Fazer busca: "QA Engineer" + filtros
3. Exportar lista de perfis (CSV)
4. Visitar cada perfil e anotar followers
5. Criar dataset inicial robusto (50-100 perfis)
6. Cancelar assinatura antes de cobrar

**Nota:** Isso dá um "kickstart" forte, depois você mantém manualmente.

---

### 6. **Scraping Público SEM Login (Área Cinzenta)**

**Como funciona:**
- Visitar URLs públicas do LinkedIn sem fazer login
- Extrair dados que são publicamente visíveis
- Usar delays longos, respeitar robots.txt
- User-agent real (não bot)

**Vantagens:**
- 📊 Semi-automatizado
- 🆓 Gratuito
- 🕒 Mais rápido que manual

**Desvantagens:**
- ⚖️ Área cinzenta legal (tecnicamente ainda pode violar ToS)
- 🚫 LinkedIn bloqueia rapidamente sem login
- 🔒 Captchas frequentes
- 📉 Dados limitados (poucos perfis por sessão)

**Implementação Mais Segura:**

```typescript
// scripts/safe-scraper/public-linkedin-scraper.ts

/**
 * Scraper mais seguro:
 * - Sem login
 * - Delays longos (30-60s entre perfis)
 * - User-agent real
 * - Respeita robots.txt
 * - Apenas perfis públicos
 * - Apenas dados públicos
 */

import puppeteer from 'puppeteer';

async function scrapePublicProfile(url: string) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();

  // User-agent real (Chrome em Windows)
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  );

  try {
    // Acessa perfil público (sem login)
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // LinkedIn pode redirecionar para login
    // Se redirecionar, pular
    if (page.url().includes('/authwall')) {
      console.log('Profile requires login, skipping');
      await browser.close();
      return null;
    }

    // Tentar extrair dados públicos visíveis
    const data = await page.evaluate(() => {
      // LinkedIn mostra informações limitadas sem login
      const nameElement = document.querySelector('h1');
      const name = nameElement?.textContent?.trim() || null;

      // Follower count geralmente NÃO está disponível sem login
      // LinkedIn esconde isso atrás de authwall

      return {
        name,
        followers: null, // Geralmente não disponível
      };
    });

    await browser.close();
    return data;

  } catch (error) {
    console.error('Error:', error);
    await browser.close();
    return null;
  }
}

// IMPORTANTE: Delay LONGO entre perfis
async function scrapMultipleProfiles(urls: string[]) {
  const results = [];

  for (const url of urls) {
    console.log(`Scraping: ${url}`);
    const data = await scrapePublicProfile(url);
    results.push(data);

    // DELAY DE 60 SEGUNDOS entre perfis
    // Parece humano, evita bloqueio
    console.log('Waiting 60s before next profile...');
    await new Promise(resolve => setTimeout(resolve, 60000));
  }

  return results;
}
```

**Problema:** LinkedIn esconde follower counts atrás de authwall (precisa login). Então essa abordagem **não funciona** para coletar followers.

---

## 🎯 Recomendação: Estratégia Híbrida

### Fase 1: Curadoria Manual (Agora)

**Processo:**
1. Pesquisar manualmente no LinkedIn: "QA Engineer"
2. Filtros: Localização, > 500 connections
3. Visitar perfis interessantes
4. Anotar dados em planilha (Google Sheets ou Excel)
5. Transferir para `data/qa-professionals.json`
6. Commit e deploy

**Frequência:** Mensal ou bimestral

**Planilha Exemplo:**

| Nome | LinkedIn URL | Followers | País | Estado | Empresa | Cargo |
|------|--------------|-----------|------|--------|---------|-------|
| Angie Jones | https://... | 250000 | US | - | TBD | VP DevRel |
| Júlio de Lima | https://... | 38000 | BR | SP | Iterasys | QA Consultant |

**Tempo:** 2-4 horas/mês para 20-30 perfis

---

### Fase 2: Submissões da Comunidade (3-6 meses)

**Processo:**
1. Adicionar GitHub Issue Template (submissões)
2. Comunidade sugere perfis
3. Você valida (verifica LinkedIn, followers, atividade)
4. Aprova e adiciona ao JSON
5. Responde issue agradecendo e fechando

**Frequência:** Contínua (conforme submissões chegam)

**Tempo:** 10-15 min por submissão

---

### Fase 3: Ferramentas Pagas (Se projeto crescer)

**Quando considerar:**
- Site com > 10K visitantes/mês
- Orçamento disponível ($50-100/mês)
- Precisa escalar para 100+ perfis
- Múltiplas métricas (YouTube, Twitter, etc.)

**Opções:**
- PhantomBuster ($30-300/mês)
- Apify ($49/mês)
- Bright Data (Enterprise)

---

## 📋 Template de Planilha para Curadoria Manual

### Google Sheets Template

**Colunas:**
1. ID (1, 2, 3...)
2. Nome Completo
3. LinkedIn Username (johndoe)
4. LinkedIn URL Completa
5. Followers (número exato ou aproximado)
6. País
7. Código do País (BR, US)
8. Estado/Província (opcional)
9. Código do Estado (SP, CA)
10. Cargo Atual
11. Empresa Atual
12. Data da Coleta (quando você coletou)
13. Notas (por que incluir, contribuições)

**Download Template:**
[Google Sheets Template](https://docs.google.com/spreadsheets/d/TEMPLATE_ID)

---

## 🤖 Script para Converter Planilha → JSON

Posso criar um script que converte sua planilha Google Sheets ou CSV para o formato JSON:

```typescript
// scripts/utils/csv-to-json.ts

import * as fs from 'fs';
import * as path from 'path';

/**
 * Convert CSV to qa-professionals.json format
 *
 * CSV format:
 * id,name,username,url,followers,country,countryCode,state,stateCode,title,company
 */

interface CSVRow {
  id: string;
  name: string;
  username: string;
  url: string;
  followers: string;
  country: string;
  countryCode: string;
  state?: string;
  stateCode?: string;
  title?: string;
  company?: string;
}

function convertCSVToJSON(csvPath: string): void {
  // Read CSV
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');

  const professionals = lines.slice(1).map(line => {
    const values = line.split(',');
    const row: any = {};

    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim();
    });

    return {
      id: row.id,
      name: row.name,
      profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&size=150&background=0ea5e9&color=fff`,
      linkedinUrl: row.url,
      followers: parseInt(row.followers),
      location: {
        country: row.country,
        countryCode: row.countryCode,
        ...(row.state && { state: row.state }),
        ...(row.stateCode && { stateCode: row.stateCode }),
      },
      ...(row.title && { title: row.title }),
      ...(row.company && { company: row.company }),
      lastUpdated: new Date().toISOString(),
    };
  });

  // Create snapshot format
  const snapshot = {
    lastUpdate: new Date().toISOString(),
    snapshots: [
      {
        date: new Date().toISOString(),
        type: 'global',
        professionals: professionals.sort((a, b) => b.followers - a.followers),
        totalCount: professionals.length,
      },
    ],
  };

  // Write to file
  const outputPath = path.resolve('./data/qa-professionals.json');
  fs.writeFileSync(outputPath, JSON.stringify(snapshot, null, 2));

  console.log(`✓ Converted ${professionals.length} professionals`);
  console.log(`✓ Saved to: ${outputPath}`);
}

// Usage: tsx scripts/utils/csv-to-json.ts profiles.csv
const csvPath = process.argv[2];
if (!csvPath) {
  console.error('Usage: tsx scripts/utils/csv-to-json.ts <csv-file>');
  process.exit(1);
}

convertCSVToJSON(csvPath);
```

**Como usar:**
```bash
# 1. Exportar planilha como CSV
# 2. Salvar como profiles.csv
# 3. Rodar script
tsx scripts/utils/csv-to-json.ts profiles.csv

# 4. Verificar
cat data/qa-professionals.json

# 5. Commit
git add data/qa-professionals.json
git commit -m "Update rankings - [Date]"
git push
```

---

## 📝 Conclusão e Recomendação Final

### Para MVP (Agora)

**Recomendo: Curadoria Manual**

**Processo:**
1. Dedique 2-4 horas por mês
2. Pesquise no LinkedIn manualmente
3. Anote em planilha (Google Sheets)
4. Converta para JSON (script acima)
5. Commit e deploy

**Vantagens:**
- ✅ 100% legal
- ✅ Zero risco
- ✅ Qualidade alta
- ✅ Gratuito
- ✅ Controle total

**Desvantagens:**
- ⏰ Trabalho manual

**Custo/benefício:** Excelente para MVP

---

### Para Crescimento (3-6 meses)

**Adicione: Submissões Comunitárias**

**Processo:**
1. GitHub Issue Template
2. Comunidade sugere
3. Você valida e aprova
4. Script converte para JSON

**Benefícios:**
- Escala com comunidade
- Menos trabalho para você
- Engajamento maior

---

### Para Escala (6-12 meses)

**Considere: Ferramentas Pagas**

Quando:
- > 100 profissionais no ranking
- > 10K visitantes/mês
- Orçamento disponível

Opções:
- PhantomBuster (~$50/mês)
- Apify (~$50/mês)

---

## ❓ FAQs

**Q: Posso usar o scraper atual se eu rodar apenas 1x por mês?**
A: Tecnicamente ainda viola ToS. Risco é menor, mas existe.

**Q: E se eu usar um VPN ou proxy?**
A: Ainda viola ToS. Você só está escondendo, não resolvendo o problema legal.

**Q: Posso fazer scraping com minha conta pessoal?**
A: NÃO RECOMENDADO. Alto risco de ban.

**Q: Google Custom Search API funciona bem?**
A: Sim para discovery (encontrar perfis), mas não retorna follower counts.

**Q: Curadoria manual é escalável?**
A: Para MVP (20-50 perfis), sim. Acima de 100, não.

**Q: Qual a melhor opção gratuita?**
A: Curadoria manual + submissões comunitárias.

---

**Minha recomendação forte: Comece com curadoria manual. É legal, ético, e funciona para MVP.** 👍
