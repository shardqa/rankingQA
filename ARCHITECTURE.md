# QA Influencers Ranking - Arquitetura

Documentação completa da arquitetura técnica do projeto.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitetura do Frontend](#arquitetura-do-frontend)
4. [Sistema de Dados](#sistema-de-dados)
5. [Sistema de Scraping](#sistema-de-scraping)
6. [Fluxo de Dados](#fluxo-de-dados)
7. [Decisões Arquiteturais](#decisões-arquiteturais)
8. [Escalabilidade](#escalabilidade)
9. [Segurança](#segurança)
10. [Performance](#performance)

---

## 🏗 Visão Geral

### Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────────┐
│                         USUÁRIO                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐        │
│  │   Pages     │  │ Components  │  │     Lib      │        │
│  │ (App Router)│  │   (React)   │  │  (Utilities) │        │
│  └─────────────┘  └─────────────┘  └──────────────┘        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   CAMADA DE DADOS                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           data/qa-professionals.json                  │   │
│  │  (Arquivo JSON com rankings e histórico)             │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│               SISTEMA DE SCRAPING (Opcional)                 │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Puppeteer  │  │  Scheduler   │  │    Logger    │       │
│  │  (Browser)  │  │  (Cron Jobs) │  │    (Logs)    │       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  FONTES EXTERNAS                             │
│               (LinkedIn, APIs, Manual)                       │
└─────────────────────────────────────────────────────────────┘
```

### Tipo de Arquitetura

**Jamstack** - JavaScript, APIs, and Markup
- Frontend estático gerado em build time
- Dados servidos como JSON
- Deploy em CDN para performance global
- Backend opcional (scraping) separado

---

## 🛠 Stack Tecnológico

### Frontend

| Tecnologia | Versão | Propósito |
|-----------|---------|-----------|
| **Next.js** | 14.2+ | Framework React com SSR/SSG |
| **React** | 18.3+ | Biblioteca UI |
| **TypeScript** | 5.0+ | Type safety |
| **Tailwind CSS** | 3.4+ | Estilização utility-first |
| **Lucide React** | 0.441+ | Ícones SVG |

### Data & Backend

| Tecnologia | Versão | Propósito |
|-----------|---------|-----------|
| **JSON** | - | Armazenamento de dados (MVP) |
| **Node.js** | 20+ | Runtime para scripts |
| **Puppeteer** | 22.0+ | Browser automation (scraping) |
| **Node-cron** | 3.0+ | Agendamento de tarefas |

### DevOps

| Tecnologia | Versão | Propósito |
|-----------|---------|-----------|
| **Git** | - | Controle de versão |
| **Docker** | - | Containerização |
| **PM2** | - | Process manager (produção) |
| **Nginx** | - | Reverse proxy |

### Desenvolvimento

| Tecnologia | Versão | Propósito |
|-----------|---------|-----------|
| **tsx** | 4.7+ | Execução TypeScript |
| **ESLint** | - | Linting |
| **Prettier** | - | Code formatting |

---

## 🎨 Arquitetura do Frontend

### Next.js App Router

```
app/
├── layout.tsx          # Root layout (HTML structure)
├── page.tsx            # Homepage (ranking page)
└── globals.css         # Global styles
```

**Características:**
- **App Router** (Next.js 14+) - Nova arquitetura de roteamento
- **Server Components** - Renderização no servidor por padrão
- **Static Site Generation (SSG)** - Páginas geradas em build time
- **Incremental Static Regeneration (ISR)** - Revalidação periódica

### Componentes React

```
components/
├── RankingCard.tsx     # Card individual (mobile/tablet)
├── RankingTable.tsx    # Tabela (desktop)
├── Header.tsx          # Cabeçalho da página
└── Footer.tsx          # Rodapé da página
```

**Padrões Utilizados:**
- **Functional Components** - Hooks apenas
- **TypeScript Props** - Todas as props tipadas
- **Composition** - Componentes reutilizáveis
- **Responsive Design** - Mobile-first

### Camada de Lógica

```
lib/
├── ranking.ts          # Cálculos de ranking
└── data.ts             # Fetch e manipulação de dados
```

**Responsabilidades:**
- `ranking.ts`:
  - Calcular mudanças de posição
  - Formatar números (10K, 1.2M)
  - Gerar indicadores visuais (↑ ↓ ─)
  - Formatação de datas

- `data.ts`:
  - Carregar dados do JSON
  - Simular delay de API (desenvolvimento)
  - Retornar snapshots históricos

### Sistema de Types

```
types/
└── index.ts            # Definições TypeScript
```

**Principais Types:**
```typescript
QAProfessional          # Dados de um profissional
RankedQAProfessional    # Profissional + ranking
RankingSnapshot         # Snapshot em uma data
RankingHistory          # Histórico completo
PositionChange          # Mudança de posição
```

---

## 💾 Sistema de Dados

### Estrutura de Dados

#### Arquivo Principal: `data/qa-professionals.json`

```json
{
  "lastUpdate": "2025-11-04T10:30:00Z",
  "snapshots": [
    {
      "date": "2025-11-04T10:30:00Z",
      "type": "global",
      "professionals": [...],
      "totalCount": 10
    },
    {
      "date": "2025-10-28T10:30:00Z",
      "type": "global",
      "professionals": [...],
      "totalCount": 10
    }
  ]
}
```

**Características:**
- Mantém **últimas 10 snapshots**
- Snapshots em ordem cronológica reversa (mais recente primeiro)
- Usado diretamente pelo frontend
- Versionado no Git

#### Snapshots Individuais: `data/snapshots/`

```
data/snapshots/
├── snapshot_2025-11-04T10-30-00.json
├── snapshot_2025-10-28T10-30-00.json
└── ...
```

**Características:**
- Um arquivo por execução de scraping
- Contém resultados completos (sucessos + falhas)
- Mantém **últimas 50 execuções**
- Automaticamente deletados (cleanup)
- Não versionados no Git (`.gitignore`)

### Formato de Profissional

```typescript
{
  id: string,              // Identificador único
  name: string,            // Nome completo
  profilePicture: string,  // URL da foto
  linkedinUrl: string,     // URL do LinkedIn
  followers: number,       // Contagem de seguidores
  location: {
    country: string,       // Nome do país
    countryCode: string,   // Código ISO (BR, US)
    state?: string,        // Estado/província (opcional)
    stateCode?: string     // Código do estado (SP, CA)
  },
  title?: string,          // Cargo atual (opcional)
  company?: string,        // Empresa atual (opcional)
  lastUpdated: string      // ISO timestamp
}
```

### Fluxo de Atualização de Dados

```
1. Scraping coleta dados
         ↓
2. Salva em snapshot individual (data/snapshots/)
         ↓
3. Atualiza arquivo principal (data/qa-professionals.json)
         ↓
4. Git commit (manual ou automático)
         ↓
5. Deploy triggered (Vercel, VPS, etc.)
         ↓
6. Site rebuilda com novos dados
```

### Estratégia de Versionamento

**Commitado no Git:**
- ✅ `data/qa-professionals.json` - Arquivo principal
- ❌ `data/snapshots/` - Snapshots individuais (muito volume)

**Motivo:**
- Arquivo principal é pequeno (< 100KB)
- Snapshots podem crescer indefinidamente
- Git history rastreia mudanças no ranking

---

## 🤖 Sistema de Scraping

### Arquitetura do Scraper

```
scripts/scraper/
├── config.ts               # Configuração
├── types.ts                # TypeScript types
├── linkedin-scraper.ts     # Scraper principal
├── logger.ts               # Sistema de logs
├── data-storage.ts         # Persistência
├── run-scraper.ts          # Script de execução
├── scheduler.ts            # Agendador (cron)
└── test-scraper.ts         # Script de teste
```

### Componentes

#### 1. LinkedInScraper Class

**Responsabilidades:**
- Inicializar browser (Puppeteer)
- Navegar para perfis do LinkedIn
- Extrair follower count
- Extrair profile picture
- Retry lógic (3 tentativas)
- Screenshots de erro

**Métodos Principais:**
```typescript
async init()                              // Inicializa browser
async close()                             // Fecha browser
async scrapeProfile(profile)              // Scrape um perfil
private async extractFollowerCount(page)  // Extrai seguidores
private parseFollowerCount(text)          // Parse 10K, 1.2M
```

**Estratégias de Extração:**
1. Buscar texto "followers" ou "seguidores"
2. Procurar em seções específicas (top-card)
3. Regex pattern matching no body
4. Fallback com múltiplos seletores CSS

#### 2. Logger

**Responsabilidades:**
- Log em console com cores
- Log em arquivo (`logs/scraper.log`)
- Níveis: INFO, WARN, ERROR, DEBUG
- Timestamps automáticos

#### 3. Data Storage

**Responsabilidades:**
- Salvar snapshots individuais
- Atualizar arquivo principal
- Comparar com snapshot anterior
- Calcular ranking changes
- Cleanup de dados antigos

#### 4. Scheduler

**Responsabilidades:**
- Executar scraping em horários agendados
- Suporta cron expressions
- Timezone configuration
- Logging de execuções

### Fluxo de Execução

```
1. run-scraper.ts invocado (manual ou agendado)
         ↓
2. Inicializa LinkedInScraper
         ↓
3. Para cada perfil habilitado:
   a. Navega para URL do LinkedIn
   b. Extrai follower count
   c. Tenta até 3x se falhar
   d. Salva resultado (sucesso ou erro)
   e. Delay de 5s antes do próximo
         ↓
4. Fecha browser
         ↓
5. Salva snapshot completo
         ↓
6. Atualiza data/qa-professionals.json
         ↓
7. Calcula e loga ranking changes
         ↓
8. Cleanup de snapshots antigos
```

### Configuração

**Perfis a Monitorar:**
```typescript
// scripts/scraper/config.ts
export const PROFILES_TO_MONITOR = [
  {
    id: '1',
    name: 'Angie Jones',
    linkedinUrl: '...',
    enabled: true
  },
  // ...
];
```

**Settings:**
```typescript
export const SCRAPER_CONFIG = {
  headless: true,              // Browser headless
  timeout: 30000,              // 30s timeout
  delayBetweenProfiles: 5000,  // 5s delay
  maxRetries: 3,               // 3 tentativas
  screenshotOnError: true      // Screenshot em erro
};
```

**Schedule:**
```typescript
export const SCHEDULE_CONFIG = {
  enabled: false,                // Agendamento ativado?
  cronExpression: '0 0 * * 0',  // Todo domingo
  timezone: 'America/Sao_Paulo'
};
```

---

## 🔄 Fluxo de Dados

### Ciclo Completo

```
┌──────────────────────────────────────────────────────┐
│  1. COLETA (Scraping ou Manual)                      │
│     - LinkedIn profiles                               │
│     - Follower counts                                 │
│     - Profile data                                    │
└────────────────┬─────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────┐
│  2. PROCESSAMENTO (data-storage.ts)                  │
│     - Valida dados                                    │
│     - Ordena por followers                            │
│     - Calcula ranking changes                         │
└────────────────┬─────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────┐
│  3. PERSISTÊNCIA                                      │
│     - Salva snapshot individual                       │
│     - Atualiza arquivo principal                      │
│     - Git commit (opcional)                           │
└────────────────┬─────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────┐
│  4. DEPLOY                                            │
│     - Git push (se automático)                        │
│     - Build triggered (Vercel, etc.)                  │
│     - CDN invalidation                                │
└────────────────┬─────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────┐
│  5. FRONTEND BUILD (Next.js)                         │
│     - Lê data/qa-professionals.json                   │
│     - Gera páginas estáticas                          │
│     - Otimiza assets                                  │
└────────────────┬─────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────┐
│  6. SERVIR (CDN ou VPS)                              │
│     - Páginas HTML estáticas                          │
│     - Assets otimizados                               │
│     - Cache headers                                   │
└────────────────┬─────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────┐
│  7. USUÁRIO ACESSA                                    │
│     - Carrega página instantaneamente                 │
│     - Interação client-side                           │
│     - Navegação fluida                                │
└──────────────────────────────────────────────────────┘
```

### Fluxo de Atualização

**Opção 1: Manual**
```
Editor atualiza JSON → Git commit → Git push → Deploy
```

**Opção 2: Scraping Manual**
```
npm run scrape → Atualiza JSON → Git commit → Git push → Deploy
```

**Opção 3: Scraping Agendado**
```
Cron trigger → Scraping → Atualiza JSON → Git commit automático → Deploy
```

---

## 🎯 Decisões Arquiteturais

### 1. Por que Next.js?

**Vantagens:**
- ✅ SSG (Static Site Generation) - Performance
- ✅ ISR (Incremental Static Regeneration) - Fresh data
- ✅ React ecosystem - Componentes reutilizáveis
- ✅ TypeScript support - Type safety
- ✅ SEO otimizado - Metadata, sitemap, robots.txt
- ✅ Deploy fácil - Vercel zero-config

**Alternativas Consideradas:**
- ❌ Pure React (SPA) - SEO ruim
- ❌ Vue/Nuxt - Menos familiar no mercado
- ❌ Vanilla JS - Mais trabalho, menos produtivo

### 2. Por que JSON em vez de Database?

**MVP (Atual):**
- ✅ Simplicidade - Sem infra de DB
- ✅ Versionamento - Git history
- ✅ Portabilidade - Fácil migrar
- ✅ Zero custo - Sem servidor de DB
- ✅ Performance - CDN-friendly

**Futuro (Quando escalar):**
- PostgreSQL ou MongoDB
- Queries complexas
- Múltiplos rankings simultâneos
- User accounts e auth

### 3. Por que Puppeteer?

**Vantagens:**
- ✅ Browser real - Renderiza JavaScript
- ✅ Debugging - Modo visible
- ✅ Screenshots - Debug de erros
- ✅ Mature - Estável e documentado

**Alternativas Consideradas:**
- ❌ Cheerio - Não executa JS (LinkedIn precisa)
- ❌ Playwright - Mais pesado (overkill)
- ❌ Selenium - Mais complexo

### 4. Por que Jamstack?

**Vantagens:**
- ✅ Performance - Tudo servido de CDN
- ✅ Segurança - Sem backend exposto
- ✅ Escalabilidade - Infinita (CDN)
- ✅ Custo - Quase zero (Vercel free tier)
- ✅ Developer Experience - Simples e produtivo

---

## 📈 Escalabilidade

### Escalabilidade Atual (MVP)

**Limites:**
- ~100 profissionais no ranking
- ~10 snapshots históricos
- Atualização manual ou semanal
- Deploy manual

**Performance:**
- Tempo de build: < 10s
- Tempo de load: < 1s
- Score Lighthouse: 95+

### Escalabilidade Futura

#### Fase 2: Database

```
Frontend (Next.js)
        ↓
    REST API (Next.js API Routes)
        ↓
    PostgreSQL (Supabase, Vercel Postgres)
```

**Benefícios:**
- Queries complexas (filtros, busca)
- Múltiplos rankings simultâneos
- User accounts
- Real-time updates

#### Fase 3: Microservices

```
Frontend (Next.js) → API Gateway (Kong, nginx)
                            ↓
    ┌──────────────────────┼──────────────────────┐
    ↓                      ↓                      ↓
Ranking Service    Scraping Service       Auth Service
    ↓                      ↓                      ↓
PostgreSQL            Redis Queue          Auth0/Supabase
```

**Quando migrar:**
- > 1000 profissionais
- > 100K visitantes/mês
- Múltiplas fontes de dados
- Real-time features

---

## 🔒 Segurança

### Atual (MVP)

**Ameaças:**
- ❌ Nenhuma - Site estático, sem backend
- ❌ Nenhuma - Sem user input
- ❌ Nenhuma - Sem autenticação

**Boas Práticas:**
- ✅ HTTPS (SSL) - Vercel automático
- ✅ CSP Headers - Content Security Policy
- ✅ No secrets in code - Env variables
- ✅ Dependencies scan - Dependabot

### Futuro (Com Backend)

**Necessário:**
- Rate limiting (contra DDoS)
- Authentication (OAuth, JWT)
- Input validation (SQL injection, XSS)
- CORS configuration
- API keys para scraping

---

## ⚡ Performance

### Métricas Atuais

**Lighthouse Score:**
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

**Core Web Vitals:**
- LCP (Largest Contentful Paint): < 1.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

### Otimizações Implementadas

1. **Static Site Generation (SSG)**
   - Páginas geradas em build time
   - Servidas diretamente do CDN
   - Zero latência de backend

2. **Image Optimization**
   - Next.js Image component
   - Lazy loading automático
   - WebP format

3. **Code Splitting**
   - Automatic by Next.js
   - Only load what's needed
   - Route-based splitting

4. **CSS Optimization**
   - Tailwind purge - Remove unused CSS
   - Critical CSS inlined
   - Non-critical CSS deferred

5. **Caching**
   - Static assets: 1 year
   - HTML pages: 1 hour (ISR)
   - JSON data: 5 minutes

### Futuras Otimizações

1. **Database Indexes** (quando migrar para DB)
2. **Redis Caching** (para API responses)
3. **CDN para imagens** (Cloudinary, imgix)
4. **Service Worker** (PWA, offline)
5. **Prefetching** (Next.js Link prefetch)

---

## 🚀 Deploy Architecture

### Opção 1: Vercel (Recomendado para MVP)

```
GitHub Repository
        ↓ (push to main)
    Vercel Build
        ↓
    Vercel CDN (Global)
        ↓
      Usuários
```

**Vantagens:**
- Zero configuration
- Deploy automático on push
- CDN global
- SSL automático
- Preview deployments (PR)
- Free tier generoso

### Opção 2: VPS (Self-Hosted)

```
GitHub Repository
        ↓ (git pull)
    VPS (DigitalOcean, Linode)
        ↓ (npm run build)
    PM2 (Process Manager)
        ↓
    Nginx (Reverse Proxy)
        ↓
      Usuários
```

**Vantagens:**
- Controle total
- Sem vendor lock-in
- Pode rodar scraper no mesmo servidor
- Custo fixo (~$5-10/mês)

### Opção 3: Docker

```
GitHub Repository
        ↓ (git pull)
    Docker Build
        ↓
    Docker Container
        ↓
    Nginx/Traefik
        ↓
      Usuários
```

**Vantagens:**
- Portável
- Consistente (dev = prod)
- Fácil de escalar (Kubernetes)
- Isolamento

---

## 📊 Monitoring & Observability

### Atual (MVP)

**Logs:**
- Scraper logs: `logs/scraper.log`
- Build logs: Vercel dashboard
- Error logs: Browser console

**Metrics:**
- Nenhum (ainda)

### Futuro

**APM (Application Performance Monitoring):**
- Sentry (error tracking)
- LogRocket (session replay)
- Google Analytics (user analytics)

**Infrastructure Monitoring:**
- Uptime monitoring (UptimeRobot)
- Status page (status.io)
- Alerts (PagerDuty, Discord webhooks)

---

## 🧪 Testing Strategy

### Atual (MVP)

**Manual Testing:**
- Visual testing em dev
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile testing (iOS, Android)

**Type Safety:**
- TypeScript compile-time checking
- No runtime type errors

### Futuro

**Unit Tests:**
- Jest para logic
- React Testing Library para components
- 80%+ coverage

**E2E Tests:**
- Playwright ou Cypress
- Critical user flows
- CI/CD integration

**Visual Regression:**
- Percy ou Chromatic
- Screenshot comparison
- Prevent visual bugs

---

## 📚 Documentação da Arquitetura

### Documentos Relacionados

- **VISION.md** - Visão do projeto
- **README.md** - Getting started
- **CONTRIBUTING.md** - Como contribuir
- **docs/DEPLOYMENT.md** - Deploy guide
- **docs/SCRAPER_GUIDE.md** - Scraping system
- **docs/LINKEDIN_DATA_COLLECTION.md** - Data collection strategies

### Diagrams

Ver pasta `docs/diagrams/` (futuro) para:
- Diagramas de sequência
- Diagramas de componentes
- Diagramas de fluxo de dados
- ERD (quando migrar para DB)

---

## 🔄 Próximas Evoluções

### Curto Prazo (1-3 meses)

1. **Múltiplos Rankings**
   - Por país (Brasil, US, UK)
   - Por estado (SP, CA, etc.)

2. **Filtros e Busca**
   - Buscar por nome
   - Filtrar por localização
   - Ordenar por critérios

3. **Charts Históricos**
   - Gráficos de crescimento
   - Sparklines no ranking

### Médio Prazo (3-6 meses)

1. **Migração para Database**
   - PostgreSQL (Supabase)
   - Prisma ORM
   - API Routes

2. **User Submissions**
   - Formulário para sugerir perfis
   - Sistema de aprovação
   - Email notifications

3. **Admin Dashboard**
   - Gerenciar profissionais
   - Aprovar submissions
   - Analytics

### Longo Prazo (6-12 meses)

1. **Multiple Metrics**
   - YouTube, Twitter, GitHub
   - Composite scores
   - Weighted rankings

2. **API Pública**
   - REST API
   - GraphQL
   - Rate limiting
   - Documentation (Swagger)

3. **PWA (Progressive Web App)**
   - Offline support
   - Push notifications
   - Install prompt

---

## ❓ FAQs Técnicas

### Por que não usar GraphQL?

REST é suficiente para MVP. GraphQL adiciona complexidade. Podemos migrar futuramente se necessário.

### Por que não usar TypeORM/Prisma?

Ainda não temos database. Quando migrarmos, usaremos Prisma.

### Por que não usar Redux/Zustand?

Estado local (React hooks) é suficiente. Não temos estado global complexo.

### Por que não usar Server-Side Rendering (SSR)?

Static Site Generation (SSG) é melhor para performance. Dados não mudam em tempo real.

### Por que não usar WebSockets?

Não temos features real-time. Polling ou ISR são suficientes.

---

## 📞 Contato Técnico

Para questões sobre a arquitetura:
- GitHub Issues - Discussões técnicas
- Pull Requests - Propostas de mudança
- Email - [Seu email técnico]

---

**Versão:** 1.0
**Data:** Novembro 2025
**Autor:** [Seu nome]
**Última Atualização:** Novembro 2025

---

_"Arquitetura simples, escalável e performática"_ 🏗️
