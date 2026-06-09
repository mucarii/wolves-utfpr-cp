export const parsePrice = (str) => {
  if (!str) return 0
  const match = str.match(/[\d.]+,\d{2}|[\d]+/)
  if (!match) return 0
  return parseFloat(match[0].replace(/\./g, '').replace(',', '.')) || 0
}

export const formatPrice = (num) =>
  'R$ ' + num.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')

export const cartTotal = (items) =>
  items.reduce((sum, item) => sum + parsePrice(item.preco) * item.quantidade, 0)

export const cartCount = (items) =>
  items.reduce((sum, item) => sum + item.quantidade, 0)
