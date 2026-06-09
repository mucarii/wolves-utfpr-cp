import { useEffect, useState, useRef } from 'react'
import { collection, getDocs, orderBy, query, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { FaShoppingCart, FaStar, FaTimes, FaPlus, FaMinus, FaTrash, FaCopy, FaCheck, FaWhatsapp } from 'react-icons/fa'
import { parsePrice, formatPrice, cartTotal, cartCount } from '../utils/price'

const CART_KEY = 'wolves-cart'

const gradients = [
  'from-blue-800 to-blue-950',
  'from-gray-700 to-gray-900',
  'from-indigo-800 to-indigo-950',
  'from-slate-700 to-slate-900',
  'from-blue-700 to-blue-950',
  'from-gray-600 to-gray-900',
]

const staticProducts = [
  { id: 1, nome: 'Camisa Oficial 2026', preco: 'R$ 249,90', badge: 'Lançamento', categoria: 'Uniforme' },
  { id: 2, nome: 'Camisa Away 2026', preco: 'R$ 249,90', badge: null, categoria: 'Uniforme' },
  { id: 3, nome: 'Camiseta Treino', preco: 'R$ 129,90', badge: 'Mais Vendido', categoria: 'Treino' },
  { id: 4, nome: 'Boné Wolves UTFPR-CP', preco: 'R$ 79,90', badge: null, categoria: 'Acessório' },
  { id: 5, nome: 'Agasalho Oficial', preco: 'R$ 349,90', badge: 'Novo', categoria: 'Treino' },
  { id: 6, nome: 'Mochila Esportiva', preco: 'R$ 199,90', badge: null, categoria: 'Acessório' },
]


function ProductCard({ product, index, cartQty, onAdd }) {
  return (
    <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden card-hover group">
      <div className={`relative h-52 bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center overflow-hidden`}>
        {product.url
          ? <img src={product.url} alt={product.nome} className="absolute inset-0 w-full h-full object-cover" />
          : <div className="text-7xl font-black text-white/10">W</div>
        }
        {product.badge && (
          <span className="absolute top-4 left-4 bg-[#0c4dbe] text-white text-xs font-bold px-3 py-1 rounded-full z-10">
            {product.badge}
          </span>
        )}
        {cartQty > 0 && (
          <span className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center z-10">
            {cartQty}
          </span>
        )}
        <div className="absolute bottom-4 right-4 text-xs text-white/40 uppercase tracking-widest font-semibold z-10">
          {product.categoria}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-white font-bold text-base mb-2 group-hover:text-[#6b90d4] transition-colors">
          {product.nome}
        </h3>
        {product.descricao && (
          <p className="text-gray-500 text-xs mb-2 line-clamp-1">{product.descricao}</p>
        )}
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, j) => (
            <FaStar key={j} size={12} className="text-yellow-400" />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#0c4dbe] font-black text-xl">{product.preco}</span>
          <button
            onClick={() => onAdd(product)}
            className="flex items-center gap-2 bg-[#0c4dbe] hover:bg-[#083a9e] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
          >
            <FaShoppingCart size={14} />
            {cartQty > 0 ? 'Adicionar mais' : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  )
}

function CartDrawer({ cart, onClose, onUpdateQty, onRemove, onCheckout }) {
  const total = cart.reduce((sum, i) => sum + parsePrice(i.preco) * i.quantidade, 0)

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-[#111] border-l border-white/10 z-50 flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <FaShoppingCart size={16} className="text-[#0c4dbe]" />
            <h2 className="text-white font-black text-base uppercase tracking-wide">Carrinho</h2>
            <span className="bg-[#0c4dbe] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cart.reduce((s, i) => s + i.quantidade, 0)}
            </span>
          </div>
          <button onClick={onClose} aria-label="Fechar carrinho" className="text-gray-500 hover:text-white transition-colors">
            <FaTimes size={18} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
            <FaShoppingCart size={40} className="text-gray-700" />
            <p className="text-gray-500 text-sm">Seu carrinho está vazio.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#0c4dbe]/10 flex items-center justify-center shrink-0">
                    {item.url
                      ? <img src={item.url} alt={item.nome} className="w-full h-full object-cover" />
                      : <span className="text-[#0c4dbe] font-black text-xl opacity-40">W</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{item.nome}</p>
                    <p className="text-[#0c4dbe] text-sm font-black mt-0.5">{item.preco}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onUpdateQty(item.id, -1)}
                        aria-label={`Remover uma unidade de ${item.nome}`}
                        className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                      >
                        <FaMinus size={9} className="text-white" />
                      </button>
                      <span className="text-white text-sm font-bold w-5 text-center">{item.quantidade}</span>
                      <button
                        onClick={() => onUpdateQty(item.id, +1)}
                        aria-label={`Adicionar uma unidade de ${item.nome}`}
                        className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                      >
                        <FaPlus size={9} className="text-white" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => onRemove(item.id)}
                      aria-label={`Remover ${item.nome} do carrinho`}
                      className="text-gray-600 hover:text-red-400 transition-colors"
                    >
                      <FaTrash size={12} />
                    </button>
                    <p className="text-gray-400 text-xs">
                      {formatPrice(parsePrice(item.preco) * item.quantidade)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-5 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Total</span>
                <span className="text-white font-black text-xl">{formatPrice(total)}</span>
              </div>
              {total >= 200 && (
                <p className="text-emerald-400 text-xs text-center">Frete grátis incluído!</p>
              )}
              <button
                onClick={onCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl transition-colors uppercase tracking-wide text-sm"
              >
                Finalizar Pedido
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

function CheckoutModal({ cart, config, onClose }) {
  const [copied, setCopied] = useState(false)
  const total = cart.reduce((sum, i) => sum + parsePrice(i.preco) * i.quantidade, 0)
  const pixKey = config?.pix || ''
  const whatsapp = config?.whatsapp || ''

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const buildWhatsAppMsg = () => {
    const lines = [
      '*Pedido — Wolves UTFPR-CP*',
      '',
      '*Itens:*',
      ...cart.map(i => `• ${i.nome} (x${i.quantidade}) — ${formatPrice(parsePrice(i.preco) * i.quantidade)}`),
      '',
      `*Total: ${formatPrice(total)}*`,
      '',
      'Segue o comprovante do PIX!',
    ]
    return `https://wa.me/${whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h2 className="text-white font-black text-base uppercase tracking-wide">Finalizar Pedido</h2>
          <button onClick={onClose} aria-label="Fechar checkout" className="text-gray-500 hover:text-white transition-colors">
            <FaTimes size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Resumo */}
          <div>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-semibold mb-3">Resumo do pedido</p>
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <span className="text-gray-300 text-sm truncate">
                    {item.nome} <span className="text-gray-600">x{item.quantidade}</span>
                  </span>
                  <span className="text-white text-sm font-semibold shrink-0">
                    {formatPrice(parsePrice(item.preco) * item.quantidade)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10">
              <span className="text-white font-bold text-sm">Total</span>
              <span className="text-[#0c4dbe] font-black text-xl">{formatPrice(total)}</span>
            </div>
          </div>

          {/* PIX */}
          <div>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-semibold mb-3">Pagamento via PIX</p>
            {pixKey ? (
              <>
                <div className="flex items-center gap-3 bg-black border border-white/10 rounded-xl px-4 py-3">
                  <span className="text-white text-sm flex-1 truncate font-mono">{pixKey}</span>
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                      copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {copied ? <FaCheck size={11} /> : <FaCopy size={11} />}
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
                <p className="text-gray-600 text-xs mt-2">
                  Faça o PIX no valor exato e envie o comprovante pelo WhatsApp abaixo.
                </p>
              </>
            ) : (
              <p className="text-gray-600 text-sm">Chave PIX não configurada. Entre em contato pelo WhatsApp.</p>
            )}
          </div>

          {/* WhatsApp */}
          <a
            href={buildWhatsAppMsg()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl transition-colors uppercase tracking-wide text-sm"
          >
            <FaWhatsapp size={18} />
            Enviar Comprovante
          </a>
        </div>
      </div>
    </div>
  )
}

export default function LojaPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || [] }
    catch { return [] }
  })
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [config, setConfig] = useState(null)
  const productsRef = useRef(null)

  useEffect(() => {
    const load = async () => {
      try {
        const q = query(collection(db, 'produtos'), orderBy('criadoEm', 'desc'))
        const snap = await getDocs(q)
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setProducts(data.length > 0 ? data : staticProducts)
      } catch {
        setProducts(staticProducts)
      }
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    if (!checkoutOpen || config) return
    getDoc(doc(db, 'config', 'contato'))
      .then(snap => { if (snap.exists()) setConfig(snap.data()) })
      .catch(() => {})
  }, [checkoutOpen, config])

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantidade: i.quantidade + 1 } : i)
      return [...prev, { ...product, quantidade: 1 }]
    })
    setCartOpen(true)
  }

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id))

  const updateQty = (id, delta) => {
    setCart(prev =>
      prev.map(i => i.id === id ? { ...i, quantidade: i.quantidade + delta } : i)
         .filter(i => i.quantidade > 0)
    )
  }

  const count = cartCount(cart)

  const handleCheckout = () => {
    setCartOpen(false)
    setCheckoutOpen(true)
  }

  return (
    <div className="page-enter pt-8 pb-20 px-6 max-w-7xl mx-auto w-full">
      <div className="mb-12 flex items-start justify-between gap-4">
        <div>
          <span className="text-[#0c4dbe] text-xs font-bold uppercase tracking-widest">Produtos Oficiais</span>
          <h1 className="text-4xl md:text-5xl font-black text-white mt-2">Loja Oficial</h1>
          <p className="text-gray-400 mt-3">Vista as cores do Wolves UTFPR-CP com produtos oficiais de alta qualidade.</p>
        </div>
        <button
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 bg-[#111] border border-white/10 hover:border-white/30 text-white px-4 py-2.5 rounded-xl transition-colors shrink-0 mt-2"
        >
          <FaShoppingCart size={16} />
          <span className="text-sm font-bold hidden sm:block">Carrinho</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#0c4dbe] text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
      </div>

      {/* Promo banner */}
      <div className="relative rounded-2xl overflow-hidden bg-[#0c4dbe] p-8 mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="absolute right-0 top-0 bottom-0 w-48 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div>
          <p className="text-blue-100 text-sm font-semibold uppercase tracking-widest mb-1">Oferta especial</p>
          <h2 className="text-white font-black text-2xl md:text-3xl">Frete grátis nas compras<br />acima de R$ 200,00</h2>
        </div>
        <button
          onClick={() => productsRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-white text-[#0c4dbe] font-black px-8 py-3.5 rounded-full hover:bg-blue-50 transition-colors uppercase tracking-wide text-sm shrink-0"
        >
          Aproveitar
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#0c4dbe] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && (
        <div ref={productsRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              cartQty={cart.find(c => c.id === product.id)?.quantidade || 0}
              onAdd={addToCart}
            />
          ))}
        </div>
      )}

      {cartOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setCartOpen(false)}
          onUpdateQty={updateQty}
          onRemove={removeFromCart}
          onCheckout={handleCheckout}
        />
      )}

      {checkoutOpen && (
        <CheckoutModal
          cart={cart}
          config={config}
          onClose={() => setCheckoutOpen(false)}
        />
      )}
    </div>
  )
}
