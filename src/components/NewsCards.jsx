import { FaArrowRight, FaCalendarAlt, FaTags } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'

const news = [
  {
    id: 1,
    category: 'Jogo',
    title: 'Wolves UTFPR-CP derrota rival e garante liderança no Campeonato Brasileiro de Tackle',
    excerpt: 'Em jogo eletrizante, o QB titular liderou 3 touchdowns no quarto período e a defesa segurou o adversário no último drive.',
    date: '04 Jun 2026',
    color: 'from-blue-900/60',
    badge: 'bg-blue-600',
  },
  {
    id: 2,
    category: 'Recrutamento',
    title: 'Novo wide receiver reforça o ataque dos Wolves para o restante da temporada',
    excerpt: 'Atleta com passagem por equipes universitárias dos EUA chega para elevar o nível do passing game.',
    date: '02 Jun 2026',
    color: 'from-purple-900/60',
    badge: 'bg-purple-600',
  },
  {
    id: 3,
    category: 'Flag Football',
    title: 'Equipe de Flag vence torneio regional e se classifica para o nacional',
    excerpt: 'Time de flag masculino foi invicto no torneio estadual e agora mira o campeonato nacional em agosto.',
    date: '01 Jun 2026',
    color: 'from-emerald-900/60',
    badge: 'bg-emerald-600',
  },
]

function NewsCard({ item }) {
  return (
    <article className="relative bg-[#111] border border-white/10 rounded-2xl overflow-hidden card-hover group">
      <div className="h-1 bg-[#0c4dbe]" />
      <div className={`relative h-48 bg-gradient-to-br ${item.color} to-black/80 flex items-center justify-center`}>
        <div className="text-6xl opacity-20 font-black text-white">W</div>
        <span className={`absolute top-4 left-4 ${item.badge} text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1`}>
          <FaTags size={9} />
          {item.category}
        </span>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
          <FaCalendarAlt size={11} />
          {item.date}
        </div>
        <h3 className="text-white font-bold text-base leading-snug mb-3 group-hover:text-[#6b90d4] transition-colors line-clamp-2">
          {item.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-5">
          {item.excerpt}
        </p>
        <NavLink
          to="/noticias"
          className="inline-flex items-center gap-2 text-[#0c4dbe] text-sm font-semibold hover:gap-3 transition-all"
        >
          Ler mais <FaArrowRight size={12} />
        </NavLink>
      </div>
    </article>
  )
}

export default function NewsCards() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
        <div>
          <span className="text-[#0c4dbe] text-xs font-bold uppercase tracking-widest">Últimas</span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-1">Notícias</h2>
        </div>
        <NavLink
          to="/noticias"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#0c4dbe] text-sm font-semibold transition-colors self-start sm:self-auto"
        >
          Ver todas <FaArrowRight size={12} />
        </NavLink>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map(item => <NewsCard key={item.id} item={item} />)}
      </div>
    </section>
  )
}
