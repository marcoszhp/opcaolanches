/* Regras do pedido. Valores armazenados em centavos para evitar erros de arredondamento. */
(function (global) {
  'use strict';
  const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const money = cents => currency.format(cents / 100);
  const total = lines => lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const quantity = lines => lines.reduce((sum, line) => sum + line.quantity, 0);
  function lineKey(productId, selections) {
    return `${productId}|${selections.map(s => `${s.groupId}:${s.id}`).sort().join('|')}`;
  }
  function unitPrice(product, selections) {
    const size = selections.find(s => s.priceMode === 'replace');
    return (size ? size.price : product.price) + selections.filter(s => s.priceMode !== 'replace').reduce((sum, s) => sum + s.price, 0);
  }
  function message(lines) {
    const result = ['Olá, Opção Lanches! Gostaria de fazer este pedido:', ''];
    for (const line of lines) {
      result.push(`*${line.quantity}× ${line.name}*`);
      line.selections.forEach(s => result.push(`  • ${s.groupName}: ${s.name}${s.price ? ` (${s.priceMode === 'replace' ? '' : '+'}${money(s.price)})` : ''}`));
      result.push(`  Unidade: ${money(line.unitPrice)} · Itens: ${money(line.unitPrice * line.quantity)}`, '');
    }
    result.push(`*Subtotal dos itens: ${money(total(lines))}*`, '', 'Podem confirmar a disponibilidade, a entrega ou retirada e a forma de pagamento?', 'Taxa de entrega a confirmar.');
    return result.join('\n');
  }
  function isOpen(date = new Date()) {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date).map(p => [p.type, p.value]));
    const minutes = Number(parts.hour) * 60 + Number(parts.minute);
    return parts.weekday !== 'Mon' && minutes >= 19 * 60 && minutes < 23 * 60 + 50;
  }
  global.Order = Object.freeze({ money, total, quantity, lineKey, unitPrice, message, isOpen });
})(globalThis);
