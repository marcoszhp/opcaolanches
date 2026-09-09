# Opção Lanches

Abra `index.html` no navegador. O site usa HTML, CSS e JavaScript puro, sem React ou outro framework no site entregue. A pasta `dist` é a versão pronta para hospedagem. O pacote ZIP contém apenas os arquivos necessários para abrir ou hospedar o site.

## Onde editar

- **Produtos, preços, ingredientes e imagens:** `menu.js`. Preços estão em centavos: `2500` representa R$ 25,00. Preencha `description` com os ingredientes e `image` com o caminho da foto, por exemplo `assets/meu-lanche.jpg`. As duas propriedades estão vazias em todos os itens.
- **WhatsApp:** `STORE.whatsapp`, no início de `script.js`. Número confirmado: `5531992220039`.
- **Endereço, mapa, textos e redes sociais:** `index.html`. Há um comentário `REDES SOCIAIS` para inserir o Instagram quando fornecido.
- **Cores e aparência:** variáveis no início de `style.css`.
- **Horários:** texto em `index.html` e `script.js`; cálculo de aberto/fechado em `order.js`. Foi usado o horário enviado na imagem: terça a domingo, 19h–23h50; segunda fechado. O estado considera o fuso de São Paulo.

## Cardápio e regras

Fonte: https://instadelivery.com.br/opcaolanchesMG, consultada em 06/09/2026. Foram preservados 121 produtos, em 20 categorias, com os preços exibidos. Os dados são uma cópia desta data e não se atualizam automaticamente. Nenhuma foto ou descrição de ingredientes foi copiada. Nomes que contêm preços antigos foram mantidos como na fonte; o preço de cobrança é o campo numérico.

Os tamanhos usam preço total, substituindo a base; adicionais somam ao preço. Essa interpretação segue o preço “a partir de” e os valores das opções. A loja estava fechada durante a consulta, por isso não foi possível comparar o total com o carrinho original nem verificar limites de seleção. Regras deste site: um tamanho, quantidade de sabores indicada no nome da pizza e acompanhamentos sujeitos à confirmação da loja. Em “Pizza 1 - 2 Sabores”, “Alho poro” aparece com acréscimo de R$ 13,00, preservado da fonte.

O subtotal não inclui entrega. A mensagem solicita confirmação de disponibilidade, entrega/retirada e pagamento. O site abre a conversa no WhatsApp; o cliente confirma o envio. O carrinho fica apenas na página atual e é esvaziado ao recarregar.

## Hospedagem e uso

Publique o conteúdo do ZIP ou da pasta `dist` em uma hospedagem estática. Fontes Google, mapa e WhatsApp exigem internet. A prévia no Sites fica privada para o proprietário até que o acesso seja alterado nas configurações.

Validação: sintaxe JavaScript, presença de arquivos, resposta HTTP, correspondência dos 121 preços com a captura, tamanhos, adicionais, subtotal e horários. Não foi enviado pedido real à loja.
