import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import { FaCalendarAlt, FaArrowRight, FaSearch, FaTimes } from 'react-icons/fa'

const catBadge = {
  JOGO: 'bg-blue-600',
  TREINO: 'bg-gray-600',
  EVENTO: 'bg-indigo-600',
  'FLAG FOOTBALL': 'bg-emerald-600',
  'EXTENSÃO': 'bg-orange-600',
  GERAL: 'bg-gray-600',
}

const catBg = {
  JOGO: 'from-blue-900 to-blue-950',
  TREINO: 'from-gray-800 to-gray-950',
  EVENTO: 'from-indigo-900 to-indigo-950',
  'FLAG FOOTBALL': 'from-emerald-900 to-emerald-950',
  'EXTENSÃO': 'from-orange-900 to-orange-950',
  GERAL: 'from-gray-800 to-gray-950',
}

function formatDate(val) {
  if (!val) return ''
  const d = val.toDate ? val.toDate() : new Date(val)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function NoticiaModal({ noticia, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Imagem */}
        {noticia.url ? (
          <div className="relative w-full h-64 overflow-hidden rounded-t-2xl">
            <img src={noticia.url} alt={noticia.titulo} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-colors"
            >
              <FaTimes size={16} />
            </button>
            <span className={`absolute top-4 left-4 ${catBadge[noticia.categoria] || 'bg-gray-600'} text-white text-xs font-bold px-3 py-1 rounded-full`}>
              {noticia.categoria}
            </span>
          </div>
        ) : (
          <div className={`relative w-full h-24 bg-gradient-to-br ${catBg[noticia.categoria] || 'from-gray-800 to-gray-950'} rounded-t-2xl flex items-center px-6`}>
            <span className={`${catBadge[noticia.categoria] || 'bg-gray-600'} text-white text-xs font-bold px-3 py-1 rounded-full`}>
              {noticia.categoria}
            </span>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <FaTimes size={18} />
            </button>
          </div>
        )}

        {/* Conteúdo */}
        <div className="px-7 py-6">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
            <FaCalendarAlt size={10} /> {formatDate(noticia.criadoEm)}
          </div>
          <h2 className="text-white font-black text-2xl leading-tight mb-3">{noticia.titulo}</h2>
          {noticia.resumo && (
            <p className="text-gray-300 text-base font-medium mb-5 leading-relaxed border-l-2 border-[#0c4dbe] pl-4">
              {noticia.resumo}
            </p>
          )}
          {noticia.conteudo && (
            <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
              {noticia.conteudo}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const load = async () => {
      const q = query(collection(db, 'noticias'), orderBy('criadoEm', 'desc'))
      const snap = await getDocs(q)
      setNoticias(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }
    load()
  }, [])

  const categories = ['Todos', ...Array.from(new Set(noticias.map(n => n.categoria)))]

  const filtered = noticias.filter(n => {
    const matchCat = activeCategory === 'Todos' || n.categoria === activeCategory
    const matchSearch = n.titulo.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const [featured, ...rest] = filtered

  return (
    <div className="page-enter pt-8 pb-20 px-6 max-w-7xl mx-auto w-full">
      {selected && <NoticiaModal noticia={selected} onClose={() => setSelected(null)} />}

      <div className="mb-10">
        <span className="text-[#0c4dbe] text-xs font-bold uppercase tracking-widest">Portal de Notícias</span>
        <h1 className="text-4xl md:text-5xl font-black text-white mt-2">Notícias</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <FaSearch size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar notícia..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#0c4dbe] transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? 'bg-[#0c4dbe] text-white'
                  : 'bg-[#111] border border-white/10 text-gray-400 hover:text-white hover:border-white/30'
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#0c4dbe] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && noticias.length === 0 && (
        <p className="text-gray-500 text-center py-20">Nenhuma notícia publicada ainda.</p>
      )}

      {!loading && filtered.length === 0 && noticias.length > 0 && (
        <p className="text-gray-500 text-center py-16">Nenhuma notícia encontrada para esta busca.</p>
      )}

      {!loading && filtered.length > 0 && (
        <>
          {/* Featured */}
          {featured && (
            <div
              onClick={() => setSelected(featured)}
              className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${catBg[featured.categoria] || 'from-gray-800 to-gray-950'} h-72 flex items-end p-8 mb-8 card-hover cursor-pointer group`}
            >
              {featured.url && (
                <img src={featured.url} alt={featured.titulo} className="absolute inset-0 w-full h-full object-cover opacity-40" />
              )}
              <span className={`absolute top-5 left-5 ${catBadge[featured.categoria] || 'bg-gray-600'} text-white text-xs font-bold px-3 py-1 rounded-full z-10`}>
                {featured.categoria}
              </span>
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 text-white/50 text-xs mb-2">
                  <FaCalendarAlt size={10} /> {formatDate(featured.criadoEm)}
                </div>
                <h2 className="text-white font-black text-xl md:text-2xl max-w-xl group-hover:text-[#6b90d4] transition-colors">
                  {featured.titulo}
                </h2>
                <p className="text-white/60 text-sm mt-2 max-w-lg line-clamp-2">{featured.resumo}</p>
                <div className="flex items-center gap-2 text-blue-300 text-sm mt-3 font-semibold">
                  Ler notícia <FaArrowRight size={12} />
                </div>
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map(n => (
              <div
                key={n.id}
                onClick={() => setSelected(n)}
                className={`relative rounded-xl overflow-hidden bg-gradient-to-br ${catBg[n.categoria] || 'from-gray-800 to-gray-950'} h-56 flex items-end p-5 card-hover cursor-pointer group`}
              >
                {n.url && (
                  <img src={n.url} alt={n.titulo} className="absolute inset-0 w-full h-full object-cover opacity-30" />
                )}
                <span className={`absolute top-4 left-4 ${catBadge[n.categoria] || 'bg-gray-600'} text-white text-xs font-bold px-2.5 py-0.5 rounded-full z-10`}>
                  {n.categoria}
                </span>
                <div className="relative z-10">
                  <div className="flex items-center gap-1.5 text-white/50 text-xs mb-1.5">
                    <FaCalendarAlt size={9} /> {formatDate(n.criadoEm)}
                  </div>
                  <h3 className="text-white font-bold text-sm leading-snug group-hover:text-[#6b90d4] transition-colors line-clamp-2">
                    {n.titulo}
                  </h3>
                  <p className="text-white/50 text-xs mt-1 line-clamp-1">{n.resumo}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
