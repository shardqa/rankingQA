#!/usr/bin/env node

/**
 * Analisa um arquivo HTML do LinkedIn salvo localmente
 * para encontrar onde está o número de followers
 *
 * Usage: tsx scripts/testing/analyze-linkedin-html.ts <arquivo.html>
 */

import fs from 'fs';

function analyzeLinkedInHtml(filePath: string) {
  console.log('='.repeat(70));
  console.log('🔍 Analisando HTML do LinkedIn');
  console.log('='.repeat(70));
  console.log(`Arquivo: ${filePath}\n`);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Arquivo não encontrado: ${filePath}`);
    console.log('\nPara gerar o HTML, execute localmente:');
    console.log('  bash scripts/testing/save-linkedin-html.sh');
    process.exit(1);
  }

  const html = fs.readFileSync(filePath, 'utf-8');
  console.log(`✅ HTML carregado: ${html.length} bytes\n`);

  // 1. Procurar por padrões simples de texto
  console.log('📝 Buscando padrões de texto simples:');
  const textPatterns = [
    { name: 'Followers (inglês)', regex: /(\d[\d,\.]*)\s*followers?/gi },
    { name: 'Seguidores (português)', regex: /(\d[\d,\.]*)\s*seguidores?/gi },
    { name: 'Follower count', regex: /follower[_-]?count["\s:]+(\d+)/gi },
  ];

  textPatterns.forEach(({ name, regex }) => {
    const matches = Array.from(html.matchAll(regex));
    if (matches.length > 0) {
      console.log(`  ✅ ${name}:`);
      matches.slice(0, 3).forEach((match, i) => {
        const context = html.substring(
          Math.max(0, match.index! - 50),
          Math.min(html.length, match.index! + match[0].length + 50)
        );
        console.log(`     ${i + 1}. "${match[0]}" (contexto: ${context.replace(/\s+/g, ' ')})`);
      });
    } else {
      console.log(`  ❌ ${name}: não encontrado`);
    }
  });

  // 2. Procurar por JSON-LD (structured data)
  console.log('\n📊 Buscando JSON-LD (structured data):');
  const jsonLdMatches = html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gis);
  let jsonLdCount = 0;
  for (const match of jsonLdMatches) {
    jsonLdCount++;
    try {
      const json = JSON.parse(match[1]);
      console.log(`  ✅ JSON-LD #${jsonLdCount}:`);
      console.log(`     ${JSON.stringify(json, null, 2).substring(0, 300)}...`);

      // Procurar por propriedades relacionadas a followers
      const jsonStr = JSON.stringify(json);
      if (jsonStr.match(/follower/i)) {
        console.log(`     ⭐ CONTÉM INFORMAÇÃO DE FOLLOWERS!`);
      }
    } catch (e) {
      console.log(`  ⚠️  JSON-LD #${jsonLdCount}: erro ao parsear`);
    }
  }
  if (jsonLdCount === 0) {
    console.log('  ❌ Nenhum JSON-LD encontrado');
  }

  // 3. Procurar por dados de hydração do React/Next.js
  console.log('\n⚛️  Buscando dados de hydração (React/Next.js):');
  const hydrationPatterns = [
    { name: '__NEXT_DATA__', regex: /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s },
    { name: 'window.__INITIAL_STATE__', regex: /window\.__INITIAL_STATE__\s*=\s*({.*?});/s },
    { name: 'window.__APOLLO_STATE__', regex: /window\.__APOLLO_STATE__\s*=\s*({.*?});/s },
  ];

  hydrationPatterns.forEach(({ name, regex }) => {
    const match = html.match(regex);
    if (match) {
      console.log(`  ✅ ${name} encontrado!`);
      try {
        const json = JSON.parse(match[1]);
        const preview = JSON.stringify(json, null, 2).substring(0, 500);
        console.log(`     Preview: ${preview}...`);

        // Procurar por "follower" no JSON
        const jsonStr = JSON.stringify(json);
        const followerMatches = jsonStr.match(/.{0,100}follower.{0,100}/gi);
        if (followerMatches) {
          console.log(`     ⭐ ENCONTROU ${followerMatches.length} MENÇÕES A FOLLOWERS:`);
          followerMatches.slice(0, 3).forEach((m, i) => {
            console.log(`        ${i + 1}. ${m}`);
          });
        }
      } catch (e) {
        console.log(`     ⚠️  Erro ao parsear JSON: ${(e as Error).message}`);
        console.log(`     Raw data (primeiros 300 chars): ${match[1].substring(0, 300)}`);
      }
    } else {
      console.log(`  ❌ ${name}: não encontrado`);
    }
  });

  // 4. Procurar em meta tags
  console.log('\n🏷️  Buscando meta tags:');
  const metaMatches = html.matchAll(/<meta\s+([^>]+)>/gi);
  let foundMeta = false;
  for (const match of metaMatches) {
    const metaContent = match[1];
    if (metaContent.match(/follower/i)) {
      console.log(`  ✅ Meta tag com "follower": ${metaContent}`);
      foundMeta = true;
    }
  }
  if (!foundMeta) {
    console.log('  ❌ Nenhuma meta tag com "follower" encontrada');
  }

  // 5. Procurar por qualquer número com vírgula/ponto que possa ser followers
  console.log('\n🔢 Buscando números grandes (possíveis contadores de followers):');
  const largeNumbers = html.matchAll(/(\d{1,3}[,\.]\d{3}|\d{5,})/g);
  const uniqueNumbers = new Set<string>();
  for (const match of largeNumbers) {
    uniqueNumbers.add(match[1]);
  }

  if (uniqueNumbers.size > 0) {
    console.log(`  ✅ Encontrados ${uniqueNumbers.size} números grandes:`);
    Array.from(uniqueNumbers).slice(0, 10).forEach((num) => {
      // Buscar contexto
      const index = html.indexOf(num);
      const context = html.substring(
        Math.max(0, index - 100),
        Math.min(html.length, index + num.length + 100)
      ).replace(/\s+/g, ' ').replace(/[<>]/g, ' ');
      console.log(`     - ${num}: ...${context}...`);
    });
  } else {
    console.log('  ❌ Nenhum número grande encontrado');
  }

  console.log('\n' + '='.repeat(70));
  console.log('✅ Análise completa!');
  console.log('='.repeat(70));
}

const filePath = process.argv[2];
if (!filePath) {
  console.error('❌ Uso: tsx scripts/testing/analyze-linkedin-html.ts <arquivo.html>');
  console.log('\nExemplo:');
  console.log('  1. Salve o HTML localmente:');
  console.log('     curl \'https://www.linkedin.com/in/angiejones/\' -H \'...\' > sample.html');
  console.log('  2. Analise o HTML:');
  console.log('     tsx scripts/testing/analyze-linkedin-html.ts sample.html');
  process.exit(1);
}

analyzeLinkedInHtml(filePath);
