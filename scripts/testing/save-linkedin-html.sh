#!/bin/bash

# Script para salvar o HTML do LinkedIn localmente
# Execute este script na sua máquina local (não no CI/sandbox)

echo "Salvando HTML do LinkedIn..."

curl 'https://www.linkedin.com/in/angiejones/' \
  -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
  -H 'accept-language: pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7' \
  -H 'sec-ch-ua: "Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Linux"' \
  -H 'sec-fetch-dest: document' \
  -H 'sec-fetch-mode: navigate' \
  -H 'sec-fetch-site: none' \
  -H 'sec-fetch-user: ?1' \
  -H 'upgrade-insecure-requests: 1' \
  -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36' \
  > sample-angiejones.html

echo ""
echo "HTML salvo em: sample-angiejones.html"
echo "Tamanho do arquivo: $(wc -c < sample-angiejones.html) bytes"
echo ""
echo "Procurando por 'follower' no HTML:"
grep -i "follower" sample-angiejones.html | head -10
