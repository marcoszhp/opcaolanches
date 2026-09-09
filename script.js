/* DADOS DA LOJA: edite o número sem espaços, incluindo o DDI 55 e o DDD. */
'use strict';
const STORE = { name: 'Opção Lanches', whatsapp: '5531992220039' };
const catalog = window.MENU || [];
const products = new Map(catalog.flatMap(category => category.products).map(product => [product.id, product]));
const cart = new Map();
const $ = selector => document.querySelector(selector);
const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
let configuring = null;
const lines = () => Array.from(cart.values());

function renderMenu() {
  $('#category-nav').innerHTML = catalog.map((category, index) => `<a class="${index ? '' : 'active'}" href="#${esc(category.id)}">${esc(category.name)}</a>`).join('');
  $('#menu-sections').innerHTML = catalog.map(category => `<section class="category-section" id="${esc(category.id)}" aria-labelledby="title-${esc(category.id)}"><div class="category-title"><h3 id="title-${esc(category.id)}">${esc(category.name)}</h3><span>${category.products.length}</span></div><div class="product-grid">${category.products.map(product => {
    const hasOptions = product.groups.length > 0;
    const sizes = product.groups.find(group => group.priceMode === 'replace');
    const minimumPrice = sizes ? Math.min(...sizes.choices.map(choice => choice.price)) : product.price;
    // IMAGEM E INGREDIENTES: os campos image e description ficam em menu.js.
    // Não foram copiadas fotos nem descrições da fonte. Imagens locais vão em assets/.
    const picture = product.image ? `<img src="${esc(product.image)}" alt="${esc(product.name)}" loading="lazy" width="140" height="140">` : '<span class="photo-placeholder" aria-hidden="true">IMAGEM</span>';
    return `<article class="product-card"><div class="product-top"><div class="product-image">${picture}</div><div class="product-info"><h4>${esc(product.name)}</h4>${product.description ? `<p class="product-description">${esc(product.description)}</p>` : ''}${hasOptions ? '<p class="product-options-label">Escolha as opções</p>' : ''}</div></div><div class="product-bottom"><div class="product-price">${sizes ? '<span class="price-prefix">A partir de</span>' : ''}${Order.money(minimumPrice)}</div>${product.available === false ? '<span class="unavailable">Indisponível</span>' : hasOptions ? `<button class="configure-button" data-configure="${esc(product.id)}" aria-label="Escolher opções de ${esc(product.name)}">Escolher <span aria-hidden="true">+</span></button>` : `<div class="quantity-control"><button data-product-minus="${esc(product.id)}" aria-label="Diminuir quantidade de ${esc(product.name)}" disabled>−</button><output data-product-count="${esc(product.id)}" aria-label="Quantidade de ${esc(product.name)}">0</output><button data-product-plus="${esc(product.id)}" aria-label="Adicionar ${esc(product.name)}">+</button></div>`}</div></article>`;
  }).join('')}</div></section>`).join('');
}

function renderCart() {
  const items = lines();
  const count = Order.quantity(items);
  $('#cart-count').textContent = String(count);
  $('#mobile-count').textContent = String(count);
  $('#cart-total').textContent = Order.money(Order.total(items));
  $('#mobile-total').textContent = `${Order.money(Order.total(items))} ↗`;
  $('#checkout').disabled = !count;
  $('#checkout-feedback').replaceChildren();
  $('#cart-items').innerHTML = items.length ? `<div class="cart-item-list">${items.map(item => `<div class="cart-item"><div class="cart-item-title"><strong>${esc(item.name)}</strong><span>${Order.money(item.quantity * item.unitPrice)}</span></div>${item.selections.length ? `<p>${item.selections.map(s => `${esc(s.groupName)}: ${esc(s.name)}`).join(' · ')}</p>` : ''}<p>${Order.money(item.unitPrice)} por unidade</p><div class="cart-item-bottom"><div class="quantity-control"><button data-cart-minus="${esc(item.key)}" aria-label="Diminuir ${esc(item.name)}">−</button><output aria-label="Quantidade de ${esc(item.name)}">${item.quantity}</output><button data-cart-plus="${esc(item.key)}" aria-label="Aumentar ${esc(item.name)}">+</button></div><button class="remove-item" data-remove="${esc(item.key)}" aria-label="Remover ${esc(item.name)} do pedido">Remover</button></div></div>`).join('')}</div>` : '<div class="empty-cart"><span class="empty-cart-symbol" aria-hidden="true">+</span><strong>Qual vai ser a boa?</strong><p>Adicione seus favoritos e monte o pedido por aqui.</p></div>';
  document.querySelectorAll('[data-product-count]').forEach(output => {
    const productId = output.dataset.productCount;
    const amount = items.filter(item => item.productId === productId).reduce((sum, item) => sum + item.quantity, 0);
    output.textContent = String(amount);
    output.previousElementSibling.disabled = amount === 0;
  });
}

function addProduct(product, selections = []) {
  const key = Order.lineKey(product.id, selections);
  const existing = cart.get(key);
  if (existing) existing.quantity += 1;
  else cart.set(key, { key, productId: product.id, name: product.name, selections, quantity: 1, unitPrice: Order.unitPrice(product, selections) });
  renderCart();
  $('#announcement').textContent = `${product.name} adicionado. ${Order.quantity(lines())} itens no pedido.`;
}

function changeQuantity(key, delta) {
  const item = cart.get(key);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) cart.delete(key);
  renderCart();
  $('#announcement').textContent = `Pedido atualizado. Subtotal ${Order.money(Order.total(lines()))}.`;
}

function openOptions(product) {
  configuring = product;
  $('#options-title').textContent = product.name;
  $('#options-error').textContent = '';
  $('#options-body').innerHTML = product.groups.map(group => {
    const hint = group.hint || (group.max === 1 ? (group.min ? 'Escolha uma opção.' : 'Opcional.') : `${group.min ? `Escolha ${group.max === group.min ? group.min : `de ${group.min} a ${group.max}`} opções.` : 'Adicionais opcionais.'}`);
    return `<fieldset class="option-group"><legend>${esc(group.name)}</legend><p class="option-hint">${esc(hint)}</p>${group.choices.map(choice => `<label class="option-row"><input type="${group.max === 1 ? 'radio' : 'checkbox'}" name="${esc(group.id)}" data-group="${esc(group.id)}" data-exclusive="${choice.exclusive ? 'true' : 'false'}" value="${esc(choice.id)}" ${group.choices.length === 1 ? 'checked' : ''}><span>${esc(choice.name)}</span><strong>${group.priceMode === 'replace' ? Order.money(choice.price) : choice.price ? `+ ${Order.money(choice.price)}` : 'Sem custo'}</strong></label>`).join('')}</fieldset>`;
  }).join('');
  updateOptionsPrice();
  $('#options-dialog').showModal();
  document.body.classList.add('modal-open');
}

function updateOptionsPrice() {
  const selected = getSelectionsSafe();
  const needsSize = configuring.groups.some(g => g.priceMode === 'replace') && !selected.some(s => s.priceMode === 'replace');
  $('#options-price').textContent = needsSize ? 'Escolha o tamanho' : Order.money(Order.unitPrice(configuring, selected));
}

function getSelectionsSafe() {
  if (!configuring) return [];
  return Array.from($('#options-form').querySelectorAll('input[data-group]:checked')).map(input => {
    const group = configuring.groups.find(g => g.id === input.dataset.group);
    const choice = group.choices.find(c => c.id === input.value);
    return { ...choice, groupId: group.id, groupName: group.name, priceMode: group.priceMode };
  });
}

function closeOptions() { $('#options-dialog').close(); }
$('#options-dialog').addEventListener('close', () => { document.body.classList.remove('modal-open'); configuring = null; });
$('#close-options').addEventListener('click', closeOptions);
$('#options-form').addEventListener('change', event => {
  const input = event.target;
  // “Sem acompanhamentos” é mutuamente exclusivo com os acompanhamentos.
  if (input.checked && input.dataset.group) {
    $('#options-form').querySelectorAll('input[data-group]').forEach(other => {
      if (other !== input && other.dataset.group === input.dataset.group && (input.dataset.exclusive === 'true' || other.dataset.exclusive === 'true')) other.checked = false;
    });
  }
  $('#options-error').textContent = ''; updateOptionsPrice();
});
$('#options-form').addEventListener('submit', event => {
  event.preventDefault();
  const selected = getSelectionsSafe();
  for (const group of configuring.groups) {
    const count = selected.filter(s => s.groupId === group.id).length;
    if (count < group.min || count > group.max) {
      $('#options-error').textContent = group.min === group.max ? `Em “${group.name}”, escolha ${group.min} ${group.min === 1 ? 'opção' : 'opções'}.` : `Em “${group.name}”, escolha de ${group.min} a ${group.max} opções.`;
      $('#options-error').scrollIntoView({ block: 'nearest' }); return;
    }
  }
  addProduct(configuring, selected);
  closeOptions();
});

$('#menu-sections').addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.configure) openOptions(products.get(button.dataset.configure));
  else if (button.dataset.productPlus) addProduct(products.get(button.dataset.productPlus));
  else if (button.dataset.productMinus) changeQuantity(Order.lineKey(button.dataset.productMinus, []), -1);
});
$('#cart-content').addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  // Restaurar foco no controle correspondente após re-renderizar o carrinho.
  const action = button.dataset.cartPlus ? 'cartPlus' : button.dataset.cartMinus ? 'cartMinus' : null;
  const key = action ? button.dataset[action] : null;
  if (action) changeQuantity(key, action === 'cartPlus' ? 1 : -1);
  else if (button.dataset.remove) { cart.delete(button.dataset.remove); renderCart(); }
  if (action) {
    const replacement = Array.from($('#cart-items').querySelectorAll('button')).find(b => b.dataset[action] === key);
    (replacement || $('#checkout')).focus();
  }
});

const cartDialog = $('#cart-dialog');
$('#open-cart').addEventListener('click', () => {
  cartDialog.append($('#cart-content'));
  cartDialog.showModal();
  document.body.classList.add('modal-open');
});
$('#close-cart').addEventListener('click', () => cartDialog.close());
cartDialog.addEventListener('close', () => { $('.cart-panel').append($('#cart-content')); document.body.classList.remove('modal-open'); });
window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches && cartDialog.open) cartDialog.close(); });
for (const dialog of [cartDialog, $('#options-dialog')]) dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });

$('#checkout').addEventListener('click', () => {
  if (!cart.size) return;
  const url = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(Order.message(lines()))}`;
  window.open(url, '_blank', 'noopener,noreferrer');
  const fallback = document.createElement('a');
  fallback.href = url; fallback.target = '_blank'; fallback.rel = 'noopener noreferrer'; fallback.textContent = 'Não abriu? Toque aqui para continuar.';
  $('#checkout-feedback').replaceChildren(fallback);
});
document.querySelectorAll('.whatsapp-link').forEach(link => { link.href = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent('Olá, Opção Lanches! Gostaria de uma informação.')}`; });

function updateHours() {
  const open = Order.isOpen();
  const status = $('#store-status');
  status.classList.toggle('is-open', open);
  status.lastElementChild.textContent = open ? 'Aberto agora · até 23h50' : 'Fechado agora';
}
renderMenu();
renderCart();
updateHours();
setInterval(updateHours, 60000);
$('#category-nav').addEventListener('click', event => { const link = event.target.closest('a'); if (!link) return; $('#category-nav').querySelectorAll('a').forEach(a => a.classList.toggle('active', a === link)); });
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('reveal'); observer.unobserve(entry.target); }
  }), { threshold: .04 });
  document.querySelectorAll('.category-section').forEach(section => observer.observe(section));
}
