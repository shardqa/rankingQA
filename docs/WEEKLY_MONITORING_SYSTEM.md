# Sistema de Monitoramento Semanal Automático

Sistema completo para atualização automática de follower counts toda semana.

---

## 📖 Overview

Este sistema:
- ✅ Monitora **TODOS os perfis da lista** (não só top 10)
- ✅ Roda **automaticamente toda semana**
- ✅ Atualiza follower counts do LinkedIn
- ✅ Calcula mudanças de posição
- ✅ Gera relatório de quem subiu/caiu
- ✅ É **menos agressivo** que scraping completo

---

## 🎯 Como Funciona

### 1. Lista de Perfis (Seed)

Temos **21 profissionais de QA** pré-configurados:

**Top Tier (reconhecidos globalmente):**
- Angie Jones
- Joe Colantonio
- Bas Dijkstra
- Alan Richardson (Evil Tester)
- Richard Bradshaw (Ministry of Testing)
- Lisa Crispin
- E mais 15 profissionais...

**Lista completa:** `scripts/scraper/seed-profiles.ts`

### 2. Monitoramento Semanal

**Frequência:** Todo domingo às 2 AM (configurável)

**Processo:**
```
1. Lê lista de perfis
2. Para cada perfil:
   a. Acessa LinkedIn
   b. Extrai follower count
   c. Compara com semana anterior
   d. Registra mudanças
   e. DELAY de 90 segundos (evita detecção)
3. Atualiza ranking
4. Gera relatório
5. Salva snapshot histórico
```

**Duração:** ~30-40 minutos para 21 perfis

### 3. Relatório de Mudanças

Exemplo de relatório gerado:

```
📈 CHANGE REPORT - Notable Changes This Week

1. 📈 Angie Jones
   248,000 → 250,000
   +2,000 (+0.81%)

2. 📉 Bas Dijkstra
   45,500 → 45,000
   -500 (-1.10%)

3. 📈 Joe Colantonio
   31,800 → 32,100
   +300 (+0.94%)
```

---

## 🚀 Setup Rápido

### Passo 1: Instalar Dependências

```bash
npm install
```

### Passo 2: Inicializar Dados

Você precisa fornecer os follower counts iniciais **uma única vez**.

**Opção A: Manual (Recomendado)**

```bash
npm run monitor:init
```

Isso vai pedir que você:
1. Visite cada perfil no LinkedIn
2. Anote o número de seguidores
3. Digite no terminal

**Tempo:** ~20-30 minutos (fazendo 1x)

**Opção B: CSV (Mais Rápido)**

Se você já tem os dados em planilha:

```bash
npm run monitor:init
# Escolher opção 2 (CSV)
# Fornecer caminho do CSV
```

Formato CSV:
```csv
id,followers
angie-jones,250000
joe-colantonio,32000
bas-dijkstra,45000
```

### Passo 3: Testar

Teste o site localmente:

```bash
npm run dev
```

Acesse http://localhost:3000 e verifique se os dados aparecem.

### Passo 4: Ativar Monitoramento Automático

**Editar configuração:**

```typescript
// scripts/monitoring/scheduler.ts

const SCHEDULE = {
  cronExpression: '0 2 * * 0', // Domingo 2 AM
  timezone: 'America/Sao_Paulo',
  enabled: true,  // ⬅️ Certifique-se que está true
};
```

**Iniciar scheduler:**

```bash
npm run monitor:schedule
```

Isso vai:
- Rodar continuamente
- Executar todo domingo às 2 AM
- Monitorar todos os perfis
- Atualizar ranking automaticamente

**Para manter rodando em produção:**

```bash
# Com PM2
pm2 start npm --name "qa-monitoring" -- run monitor:schedule
pm2 save

# Ou com systemd (ver DEPLOYMENT.md)
```

---

## 📅 Comandos Disponíveis

### Inicialização (executar 1x)

```bash
npm run monitor:init
```

Configura dados iniciais de followers.

### Monitoramento Manual (testar)

```bash
npm run monitor:weekly
```

Roda o monitoramento uma vez manualmente (útil para testar).

### Agendamento Automático (produção)

```bash
npm run monitor:schedule
```

Inicia o scheduler que roda automaticamente toda semana.

---

## ⚙️ Configuração

### Ajustar Frequência

Edite `scripts/monitoring/scheduler.ts`:

```typescript
const SCHEDULE = {
  // Exemplos de cronExpression:
  cronExpression: '0 2 * * 0',    // Domingo 2 AM (PADRÃO)
  // cronExpression: '0 2 * * 1',  // Segunda 2 AM
  // cronExpression: '0 2 1 * *',  // Primeiro dia do mês 2 AM
  // cronExpression: '0 2 * * 1,4', // Segunda e quinta 2 AM

  timezone: 'America/Sao_Paulo',
};
```

**Gerador de cron:** https://crontab.guru/

### Ajustar Delays

Edite `scripts/monitoring/weekly-update.ts`:

```typescript
const WEEKLY_CONFIG = {
  delayBetweenProfiles: 90000,  // 90s (padrão)
  // delayBetweenProfiles: 120000, // 120s (mais seguro)
  // delayBetweenProfiles: 60000,  // 60s (mais rápido, mais risco)

  randomDelay: true,            // Adiciona 0-60s aleatórios
  maxRetries: 2,
};
```

**Recomendações:**
- **60s:** Mais rápido, mas mais chance de detecção
- **90s:** Balanceado (PADRÃO)
- **120s:** Mais seguro, mas mais demorado

### Adicionar/Remover Perfis

Edite `scripts/scraper/seed-profiles.ts`:

```typescript
export const SEED_PROFILES: ProfileConfig[] = [
  {
    id: 'unique-id',
    name: 'Nome Completo',
    linkedinUsername: 'username',
    linkedinUrl: 'https://www.linkedin.com/in/username/',
    location: {
      country: 'Country',
      countryCode: 'US',
    },
    title: 'Job Title',
    company: 'Company Name',
    enabled: true,  // false para desabilitar temporariamente
  },
  // Adicione mais aqui...
];
```

**Depois de adicionar novos perfis:**

```bash
# Re-inicializar com novos perfis
npm run monitor:init

# Testar
npm run dev
```

---

## 📊 Visualizar Resultados

### Site (Frontend)

```bash
npm run dev
# Acesse http://localhost:3000
```

Mostra:
- Ranking completo
- Indicadores de mudança (↑ ↓ ─)
- Follower counts atualizados
- Último update

### Logs

```bash
# Ver logs do monitoramento
tail -f logs/scraper.log

# Buscar mudanças específicas
grep "CHANGE REPORT" logs/scraper.log
```

### Snapshots Históricos

```bash
# Ver snapshots salvos
ls -lh data/snapshots/

# Ver snapshot específico
cat data/snapshots/snapshot_2025-11-10T02-00-00.json
```

### Dados Principais

```bash
# Ver arquivo principal (usado pelo site)
cat data/qa-professionals.json
```

---

## 🔔 Notificações (Opcional)

O sistema pode enviar notificações de mudanças significativas.

### Discord Webhook (Futuro)

```typescript
// scripts/monitoring/notifications.ts

async function sendDiscordNotification(changes: any[]) {
  const webhook = process.env.DISCORD_WEBHOOK_URL;

  await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: '📊 Weekly Ranking Update',
      embeds: [
        {
          title: 'Notable Changes',
          description: changes.map(c => `${c.name}: ${c.change > 0 ? '+' : ''}${c.change}`).join('\n'),
          color: 0x0ea5e9,
        },
      ],
    }),
  });
}
```

### Email (Futuro)

Usando Nodemailer ou SendGrid para enviar relatórios por email.

---

## 🐛 Troubleshooting

### Problema: Scraping falha para alguns perfis

**Causa:** LinkedIn bloqueou ou perfil mudou

**Solução:**
1. Sistema continua e usa dados anteriores
2. Checar logs: `tail -f logs/scraper.log`
3. Ver screenshots: `ls logs/screenshots/`
4. Se persistir, atualizar manualmente:

```bash
# Adicionar followers manualmente no CSV
id,followers
angie-jones,250500

# Re-importar
npm run convert:csv manual-update.csv
```

### Problema: Scheduler não está rodando

**Verificar:**

```bash
# Checar se processo está ativo
ps aux | grep "monitor:schedule"

# Com PM2
pm2 list
pm2 logs qa-monitoring

# Verificar schedule config
grep "enabled" scripts/monitoring/scheduler.ts
```

### Problema: Mudanças não aparecem no site

**Solução:**

```bash
# Rebuild site
npm run build

# Deploy (Vercel)
git push origin main

# Deploy (VPS)
pm2 restart qa-ranking
```

### Problema: Follower counts parecem errados

**Verificar:**

```bash
# Ver última atualização
cat data/qa-professionals.json | grep lastUpdate

# Ver logs da última execução
grep "Weekly Monitoring" logs/scraper.log | tail -20
```

**Correção manual:**

```bash
# Editar data/qa-professionals.json
# Ou re-inicializar
npm run monitor:init
```

---

## 📈 Estatísticas do Sistema

### Performance

**Para 21 perfis:**
- Tempo: ~30-40 minutos
- Delay médio: 90-120s por perfil
- Taxa de sucesso: 80-90%
- CPU: Baixo (~5% média)
- Memória: ~200MB

### Escalabilidade

**Quantos perfis posso monitorar?**

| Perfis | Tempo | Recomendação |
|--------|-------|--------------|
| 10-20  | 20-40 min | ✅ Ideal |
| 20-50  | 40-100 min | ✅ OK |
| 50-100 | 1.5-3 horas | ⚠️ Considere dividir |
| 100+   | 3+ horas | ❌ Use serviço pago |

**Dica:** Se tiver muitos perfis, divida em grupos e monitore em dias diferentes.

---

## 🔐 Segurança e Privacidade

### Dados Coletados

- ✅ Nome (público)
- ✅ Follower count (público)
- ✅ URL do LinkedIn (público)
- ✅ Localização (público)

**NÃO coletamos:**
- ❌ Emails
- ❌ Mensagens privadas
- ❌ Conexões
- ❌ Dados não-públicos

### Respeito aos Termos

**Este sistema:**
- Apenas monitora perfis conhecidos (não descobre novos)
- Usa delays longos (90-120s)
- Roda apenas 1x por semana
- Respeita robots.txt
- Não faz login automático

**MAS:** Tecnicamente ainda pode violar ToS do LinkedIn.

**Riscos:**
- ⚠️ Menor que scraping agressivo
- ⚠️ Mas ainda existe

**Alternativa mais segura:**
- Atualize manualmente 1x por mês
- Ou use PhantomBuster ($50/mês)

---

## 📚 Arquivos do Sistema

```
scripts/
├── monitoring/
│   ├── initialize.ts       # Configuração inicial
│   ├── weekly-update.ts    # Monitoramento semanal
│   └── scheduler.ts        # Agendador automático
├── scraper/
│   ├── seed-profiles.ts    # Lista de 21 profissionais
│   ├── linkedin-scraper.ts # Scraper core
│   ├── logger.ts           # Sistema de logs
│   └── data-storage.ts     # Salvar/carregar dados

data/
├── qa-professionals.json   # Dados principais (site)
└── snapshots/              # Histórico semanal

logs/
├── scraper.log             # Logs detalhados
└── screenshots/            # Screenshots de erro
```

---

## 🆘 Suporte

### Logs não ajudam?

```bash
# Rodar em modo debug
npm run monitor:weekly

# Vai mostrar output completo no terminal
```

### Ainda com problemas?

1. Verificar logs: `logs/scraper.log`
2. Verificar screenshots: `logs/screenshots/`
3. Abrir issue no GitHub
4. Considerar atualização manual

---

## 🎯 Próximos Passos

Após configurar o sistema:

1. **Testar localmente:**
   ```bash
   npm run monitor:weekly
   npm run dev
   ```

2. **Ativar scheduler:**
   ```bash
   npm run monitor:schedule
   # Ou com PM2 em produção
   ```

3. **Monitorar:**
   ```bash
   tail -f logs/scraper.log
   ```

4. **Deploy:**
   ```bash
   git commit && git push
   ```

5. **Adicionar mais perfis** (opcional):
   - Editar `seed-profiles.ts`
   - Re-inicializar
   - Testar

---

## 💡 Dicas e Best Practices

### Performance

1. **Use delays longos** (90-120s) para evitar bloqueio
2. **Monitore em horário de baixo tráfego** (2-4 AM)
3. **Divida perfis** se tiver > 50
4. **Mantenha logs** para debug

### Manutenção

1. **Verifique logs semanalmente**
2. **Teste antes de mudanças** grandes
3. **Backup do `data/`** antes de atualizar
4. **Documente mudanças** em perfis

### Escalabilidade

1. **Comece pequeno** (10-20 perfis)
2. **Adicione gradualmente**
3. **Monitore taxa de sucesso**
4. **Considere serviço pago** se > 100 perfis

---

## ✅ Checklist de Setup

Use este checklist para configurar:

```markdown
## Setup Inicial

- [ ] npm install
- [ ] npm run monitor:init (configurar dados iniciais)
- [ ] npm run dev (testar site)
- [ ] Verificar dados no localhost:3000
- [ ] Ajustar SCHEDULE.enabled = true
- [ ] npm run monitor:schedule (iniciar)
- [ ] pm2 save (se usar PM2)
- [ ] Testar aguardando próxima execução
- [ ] Monitorar logs após primeira execução
- [ ] Commit e deploy

## Manutenção Semanal

- [ ] Verificar logs: tail -f logs/scraper.log
- [ ] Checar taxa de sucesso
- [ ] Ver relatório de mudanças
- [ ] Verificar site está atualizado
- [ ] Adicionar novos perfis (se necessário)
```

---

**Sistema pronto para uso! 🚀**

**Tempo de setup:** 30-60 minutos
**Manutenção:** < 10 minutos/semana
**Automação:** 100% após setup