import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import { FaShoppingCart, FaStar } from 'react-icons/fa'

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

function ProductCard({ product, index }) {
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
            <FaStar key={j} size={12} className={j < 5 ? 'text-yellow-400' : 'text-gray-600'} />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#0c4dbe] font-black text-xl">{product.preco}</span>
          <button className="flex items-center gap-2 bg-[#0c4dbe] hover:bg-[#083a9e] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
            <FaShoppingCart size={14} />
            Comprar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LojaPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="page-enter pt-8 pb-20 px-6 max-w-7xl mx-auto w-full">
      <div className="mb-12">
        <span className="text-[#0c4dbe] text-xs font-bold uppercase tracking-widest">Produtos Oficiais</span>
        <h1 className="text-4xl md:text-5xl font-black text-white mt-2">Loja Oficial</h1>
        <p className="text-gray-400 mt-3">Vista as cores do Wolves UTFPR-CP com produtos oficiais de alta qualidade.</p>
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
        <button className="bg-white text-[#0c4dbe] font-black px-8 py-3.5 rounded-full hover:bg-blue-50 transition-colors uppercase tracking-wide text-sm shrink-0">
          Aproveitar
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#0c4dbe] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
