import { describe, it, expect } from 'vitest'
import { parsePrice, formatPrice, cartTotal, cartCount } from '../utils/price'

describe('parsePrice', () => {
  it('converte preço brasileiro para número', () => {
    expect(parsePrice('R$ 249,90')).toBe(249.9)
    expect(parsePrice('R$ 1.299,90')).toBe(1299.9)
    expect(parsePrice('R$ 0,00')).toBe(0)
  })

  it('retorna 0 para valores inválidos', () => {
    expect(parsePrice('')).toBe(0)
    expect(parsePrice(null)).toBe(0)
    expect(parsePrice(undefined)).toBe(0)
    expect(parsePrice('sem preço')).toBe(0)
  })
})

describe('formatPrice', () => {
  it('formata número para moeda brasileira', () => {
    expect(formatPrice(249.9)).toBe('R$ 249,90')
    expect(formatPrice(1299.9)).toBe('R$ 1.299,90')
    expect(formatPrice(0)).toBe('R$ 0,00')
  })

  it('ida e volta: parse → format', () => {
    const original = 'R$ 349,90'
    expect(formatPrice(parsePrice(original))).toBe(original)
  })
})

describe('cartTotal', () => {
  const items = [
    { preco: 'R$ 249,90', quantidade: 2 },
    { preco: 'R$ 79,90',  quantidade: 1 },
  ]

  it('soma corretamente itens com quantidades', () => {
    expect(cartTotal(items)).toBeCloseTo(579.7)
  })

  it('retorna 0 para carrinho vazio', () => {
    expect(cartTotal([])).toBe(0)
  })
})

describe('cartCount', () => {
  it('soma total de unidades no carrinho', () => {
    const items = [
      { quantidade: 2 },
      { quantidade: 3 },
    ]
    expect(cartCount(items)).toBe(5)
  })

  it('retorna 0 para carrinho vazio', () => {
    expect(cartCount([])).toBe(0)
  })
})
