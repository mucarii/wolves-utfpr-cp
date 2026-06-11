import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore'
import { db } from '../firebase'
import { FaArrowRight, FaCalendarAlt, FaTags } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import { CAT_BADGE } from '../constants'

function formatDate(val) {
  if (!val) return ''
  const d = val.toDate ? val.toDate() : new Date(val)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function NewsCard({ item }) {
  return (
    <article className="relative bg-[#111] border border-white/10 rounded-2xl overflow-hidden card-hover group flex flex-col">
      <div className="h-1 bg-[#0c4dbe]" />
      <div className="relative h-48 bg-gradient-to-br from-blue-900/60 to-black/80 flex items-center justify-center overflow-hidden">
        {item.url
          ? <img src={item.url} alt={item.titulo} className="absolute inset-0 w-full h-full object-cover" />
          : <div className="text-6xl opacity-20 font-black text-white">W</div>
        }
        <span className={`absolute top-4 left-4 ${CAT_BADGE[item.categoria] || 'bg-gray-600'} text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 z-10`}>
          <FaTags size={9} />
          {item.categoria}
        </span>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
          <FaCalendarAlt size={11} />
          {formatDate(item.criadoEm)}
        </div>
        <h3 className="text-white font-bold text-base leading-snug mb-3 group-hover:text-[#6b90d4] transition-colors line-clamp-2">
          {item.titulo}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-5 flex-1">
          {item.resumo}
        </p>
        <NavLink to={`/noticias/${item.id}`} className="inline-flex items-center gap-2 text-[#0c4dbe] text-sm font-semibold hover:gap-3 transition-all">
          Ler mais <FaArrowRight size={12} />
        </NavLink>
      </div>
    </article>
  )
}

export default function NewsCards() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const q = query(collection(db, 'noticias'), orderBy('criadoEm', 'desc'), limit(3))
      const snap = await getDocs(q)
      setNews(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <section className="py-20 px-6 max-w-7xl mx-auto w-full">
      <div className="mb-12">
        <div className="h-3 w-16 bg-white/10 rounded-full mb-3 animate-pulse" />
        <div className="h-8 w-32 bg-white/10 rounded-xl animate-pulse" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden animate-pulse">
            <div className="h-1 bg-white/10" />
            <div className="h-48 bg-white/5" />
            <div className="p-6 space-y-3">
              <div className="h-3 w-24 bg-white/10 rounded-full" />
              <div className="h-4 w-full bg-white/10 rounded-full" />
              <div className="h-4 w-3/4 bg-white/10 rounded-full" />
              <div className="h-3 w-full bg-white/5 rounded-full" />
              <div className="h-3 w-2/3 bg-white/5 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )

  if (news.length === 0) return null

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
        <div>
          <span className="text-[#0c4dbe] text-xs font-bold uppercase tracking-widest">Últimas</span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-1">Notícias</h2>
        </div>
        <NavLink to="/noticias" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#0c4dbe] text-sm font-semibold transition-colors self-start sm:self-auto">
          Ver todas <FaArrowRight size={12} />
        </NavLink>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map(item => <NewsCard key={item.id} item={item} />)}
      </div>
    </section>
  )
}
