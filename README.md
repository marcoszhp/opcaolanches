# Opção Lanches

Site da Opção Lanches, em Timóteo (MG), com cardápio digital e pedidos pelo WhatsApp.

## Recursos

- 121 produtos em 20 categorias, com opções de tamanhos, sabores e adicionais.
- Carrinho com quantidades e subtotal em reais.
- Mensagem do pedido preparada para envio pelo WhatsApp.
- Layout responsivo, endereço, mapa e horários de funcionamento.
- HTML, CSS e JavaScript puro, sem dependências de execução.

## Abrir o site

Abra `index.html` no navegador. Para usar um servidor local, com Node.js instalado:

```sh
npm run dev
```

Acesse `http://127.0.0.1:5173/`. Para gerar a pasta `dist` pronta para hospedagem estática:

```sh
npm run build
```

## Personalizar

- `menu.js`: produtos, preços em centavos, fotos (`image`) e ingredientes (`description`).
- `script.js`: número do WhatsApp, em `STORE.whatsapp`.
- `index.html`: textos, localização, redes sociais e horários apresentados.
- `style.css`: cores, fontes e layout.
- `order.js`: cálculos do pedido e horário de aberto/fechado.
- `assets/`: imagens e ícone do site.

## Dados do cardápio

O cardápio foi consultado no [InstaDelivery](https://instadelivery.com.br/opcaolanchesMG) em 06/09/2026. Os preços não se atualizam automaticamente. Fotos e descrições de ingredientes estão vazias para preenchimento posterior.

O subtotal não inclui entrega. Disponibilidade, limites de acompanhamentos, entrega e pagamento são confirmados com a loja pelo WhatsApp. Os horários seguem a imagem fornecida pelo proprietário: terça a domingo, das 19h às 23h50; segunda-feira fechado.

Veja [LEIA-ME.md](LEIA-ME.md) para detalhes sobre a edição e as regras de cálculo.
