import { FaCalendarAlt, FaArrowRight, FaSearch } from 'react-icons/fa'
import { useState } from 'react'

const allNews = [
  { id: 1, category: 'Jogo', title: 'Wolves UTFPR-CP derrota rival e assume liderança do campeonato de tackle', date: '04 Jun 2026', color: 'from-blue-900 to-blue-950', featured: true },
  { id: 2, category: 'Recrutamento', title: 'Novo wide receiver reforça o ataque para o restante da temporada', date: '02 Jun 2026', color: 'from-purple-900 to-purple-950', featured: false },
  { id: 3, category: 'Flag Football', title: 'Equipe de Flag vence torneio regional e se classifica para o nacional', date: '01 Jun 2026', color: 'from-emerald-900 to-emerald-950', featured: false },
  { id: 4, category: 'Análise', title: 'Análise tática: como o QB liderou o comeback no quarto período', date: '30 Mai 2026', color: 'from-blue-900 to-blue-950', featured: false },
  { id: 5, category: 'Clube', title: 'Wolves UTFPR-CP inaugura novo campo de treino com capacidade para 200 atletas', date: '28 Mai 2026', color: 'from-gray-800 to-gray-950', featured: false },
  { id: 6, category: 'Parceria', title: 'Acordo de patrocínio garante novos equipamentos para a temporada', date: '25 Mai 2026', color: 'from-indigo-900 to-indigo-950', featured: false },
  { id: 7, category: 'Jogo', title: 'Bowl regional: Wolves UTFPR-CP avança à grande final com goleada de touchdowns', date: '22 Mai 2026', color: 'from-blue-900 to-blue-950', featured: false },
  { id: 8, category: 'Entrevista', title: 'Capitão fala sobre preparação e metas dos Wolves UTFPR-CP para o nacional', date: '20 Mai 2026', color: 'from-red-900 to-red-950', featured: false },
]

const categories = ['Todos', 'Jogo', 'Recrutamento', 'Flag Football', 'Clube', 'Análise', 'Entrevista']

const catColors = {
  Jogo: 'bg-blue-600',
  Recrutamento: 'bg-purple-600',
  'Flag Football': 'bg-emerald-600',
  Clube: 'bg-gray-600',
  Parceria: 'bg-indigo-600',
  Análise: 'bg-sky-600',
  Entrevista: 'bg-red-600',
}

export default function NoticiasPage() {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [search, setSearch] = useState('')

  const filtered = allNews.filter(n => {
    const matchCat = activeCategory === 'Todos' || n.category === activeCategory
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const [featured, ...rest] = filtered

  return (
    <div className="page-enter pt-8 pb-20 px-6 max-w-7xl mx-auto w-full">
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
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? 'bg-[#0c4dbe] text-white'
                  : 'bg-[#111] border border-white/10 text-gray-400 hover:text-white hover:border-white/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-16">Nenhuma notícia encontrada.</p>
      ) : (
        <>
          {featured && (
            <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${featured.color} h-72 flex items-end p-8 mb-8 card-hover cursor-pointer group`}>
              <span className={`absolute top-5 left-5 ${catColors[featured.category] || 'bg-gray-600'} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                {featured.category}
              </span>
              <div>
                <div className="flex items-center gap-1.5 text-white/50 text-xs mb-2">
                  <FaCalendarAlt size={10} /> {featured.date}
                </div>
                <h2 className="text-white font-black text-xl md:text-2xl max-w-xl group-hover:text-[#6b90d4] transition-colors">
                  {featured.title}
                </h2>
                <div className="flex items-center gap-2 text-blue-300 text-sm mt-3 font-semibold">
                  Ler notícia <FaArrowRight size={12} />
                </div>
              </div>
            </div>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map(n => (
              <div key={n.id} className={`relative rounded-xl overflow-hidden bg-gradient-to-br ${n.color} h-48 flex items-end p-5 card-hover cursor-pointer group`}>
                <span className={`absolute top-4 left-4 ${catColors[n.category] || 'bg-gray-600'} text-white text-xs font-bold px-2.5 py-0.5 rounded-full`}>
                  {n.category}
                </span>
                <div>
                  <div className="flex items-center gap-1.5 text-white/50 text-xs mb-1.5">
                    <FaCalendarAlt size={9} /> {n.date}
                  </div>
                  <h3 className="text-white font-bold text-sm leading-snug group-hover:text-[#6b90d4] transition-colors line-clamp-2">
                    {n.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
