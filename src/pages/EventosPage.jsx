import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import usePageTitle from '../hooks/usePageTitle'
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaFootballBall } from 'react-icons/fa'

const TIPO_COLORS = {
  JOGO:        { badge: 'bg-blue-600',    text: 'text-blue-400',    border: 'border-blue-500/30',    bg: 'bg-blue-500/10' },
  TREINO:      { badge: 'bg-gray-600',    text: 'text-gray-400',    border: 'border-gray-500/30',    bg: 'bg-gray-500/10' },
  EVENTO:      { badge: 'bg-indigo-600',  text: 'text-indigo-400',  border: 'border-indigo-500/30',  bg: 'bg-indigo-500/10' },
  CAMPEONATO:  { badge: 'bg-yellow-500',  text: 'text-yellow-400',  border: 'border-yellow-500/30',  bg: 'bg-yellow-500/10' },
  'EXTENSÃO':  { badge: 'bg-orange-600',  text: 'text-orange-400',  border: 'border-orange-500/30',  bg: 'bg-orange-500/10' },
}

function getTodayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatDateFull(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return new Date(Number(y), Number(m) - 1, Number(d))
    .toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function formatDayMonth(dateStr) {
  if (!dateStr) return { day: '--', month: '' }
  const [y, m, d] = dateStr.split('-')
  const date = new Date(Number(y), Number(m) - 1, Number(d))
  return {
    day: date.toLocaleDateString('pt-BR', { day: '2-digit' }),
    month: date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
    year: date.toLocaleDateString('pt-BR', { year: 'numeric' }),
  }
}

function EventCard({ ev, past }) {
  const colors = TIPO_COLORS[ev.tipo] || TIPO_COLORS.EVENTO
  const { day, month, year } = formatDayMonth(ev.data)

  return (
    <div className={`bg-[#111] border border-white/10 rounded-2xl overflow-hidden flex flex-col sm:flex-row gap-0 ${past ? 'opacity-70' : ''}`}>
      {ev.url && (
        <div className="sm:w-48 h-40 sm:h-auto shrink-0 overflow-hidden">
          <img src={ev.url} alt={ev.titulo} className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}

      <div className="flex flex-1 items-stretch">
        {/* Date badge */}
        <div className={`flex flex-col items-center justify-center px-5 py-4 shrink-0 min-w-[80px] ${colors.bg} border-r ${colors.border}`}>
          <span className={`text-3xl font-black leading-none ${colors.text}`}>{day}</span>
          <span className="text-gray-400 text-xs uppercase tracking-widest mt-1">{month}</span>
          <span className="text-gray-600 text-[10px] mt-0.5">{year}</span>
        </div>

        {/* Info */}
        <div className="flex-1 px-6 py-5">
          <div className="flex items-center gap-2 mb-2">
            <span className={`${colors.badge} text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest`}>
              {ev.tipo}
            </span>
            {past && (
              <span className="text-gray-600 text-[10px] uppercase tracking-widest">Encerrado</span>
            )}
          </div>

          <h3 className="text-white font-bold text-base leading-snug mb-3">{ev.titulo}</h3>

          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-gray-400 text-xs mb-3">
            {ev.horario && (
              <span className="flex items-center gap-1.5">
                <FaClock size={10} className={colors.text} /> {ev.horario.replace(':', 'h')}
              </span>
            )}
            {ev.local && (
              <span className="flex items-center gap-1.5">
                <FaMapMarkerAlt size={10} className={colors.text} /> {ev.local}
              </span>
            )}
          </div>

          {ev.descricao && (
            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{ev.descricao}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function EventosPage() {
  usePageTitle('Eventos')
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getDocs(query(collection(db, 'eventos'), orderBy('data', 'asc')))
      .then(snap => setEventos(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
      .catch(() => setError('Não foi possível carregar os eventos.'))
      .finally(() => setLoading(false))
  }, [])

  const today = getTodayStr()
  const upcoming = eventos.filter(e => e.data >= today)
  const past = eventos.filter(e => e.data < today).reverse()

  return (
    <div className="page-enter pt-8 pb-20 px-6 max-w-4xl mx-auto w-full">
      <div className="mb-12">
        <span className="text-[#0c4dbe] text-xs font-bold uppercase tracking-widest">Calendário</span>
        <h1 className="text-4xl md:text-5xl font-black text-white mt-2">Eventos</h1>
        <p className="text-gray-400 mt-3 max-w-xl">
          Jogos, treinos abertos, campeonatos e eventos de extensão do Wolves UTFPR-CP.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-5 py-4 mb-8">
          {error}
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {!loading && eventos.length === 0 && (
        <div className="text-center py-20">
          <FaFootballBall size={40} className="text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500">Nenhum evento cadastrado ainda.</p>
        </div>
      )}

      {!loading && upcoming.length > 0 && (
        <div className="mb-12">
          <h2 className="text-white font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
            <FaCalendarAlt size={13} className="text-[#0c4dbe]" /> Próximos eventos
          </h2>
          <div className="space-y-4">
            {upcoming.map(ev => <EventCard key={ev.id} ev={ev} past={false} />)}
          </div>
        </div>
      )}

      {!loading && past.length > 0 && (
        <div>
          <h2 className="text-gray-500 font-bold text-sm uppercase tracking-widest mb-5 border-t border-white/10 pt-8">
            Eventos anteriores
          </h2>
          <div className="space-y-4">
            {past.map(ev => <EventCard key={ev.id} ev={ev} past={true} />)}
          </div>
        </div>
      )}
    </div>
  )
}
