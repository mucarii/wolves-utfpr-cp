import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'

const positions = ['Quarterback', 'Linemen', 'Wide Receiver / TE', 'Running Back', 'Defesa', 'Safety', 'Cornerback', 'Linebacker', 'Kicker']

const posColors = {
  'Quarterback':        'bg-red-500/20 text-red-400 border-red-500/30',
  'Linemen':            'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Wide Receiver / TE': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Running Back':       'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Defesa':             'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Safety':             'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Cornerback':         'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'Linebacker':         'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'Kicker':             'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

const staticPlayers = [
  { nome: 'Matheus Rodrigues', numero: 1,  posicao: 'Quarterback' },
  { nome: 'Carlos Henrique',   numero: 50, posicao: 'Linemen' },
  { nome: 'Diego Souza',       numero: 52, posicao: 'Linemen' },
  { nome: 'Leonardo Castro',   numero: 55, posicao: 'Linemen' },
  { nome: 'André Lima',        numero: 58, posicao: 'Linemen' },
  { nome: 'Felipe Torres',     numero: 80, posicao: 'Wide Receiver / TE' },
  { nome: 'Bruno Alves',       numero: 84, posicao: 'Wide Receiver / TE' },
  { nome: 'Thiago Moreira',    numero: 88, posicao: 'Wide Receiver / TE' },
  { nome: 'Rafael Cunha',      numero: 32, posicao: 'Running Back' },
  { nome: 'Lucas Ferreira',    numero: 35, posicao: 'Running Back' },
  { nome: 'Rodrigo Melo',      numero: 90, posicao: 'Defesa' },
  { nome: 'Eduardo Nunes',     numero: 93, posicao: 'Defesa' },
  { nome: 'Gabriel Pinto',     numero: 22, posicao: 'Defesa' },
]

function PlayerCard({ player }) {
  return (
    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 card-hover group text-center">
      <div className="w-20 h-20 rounded-full bg-[#0c4dbe]/20 border-2 border-[#0c4dbe]/30 mx-auto mb-4 group-hover:border-[#0c4dbe] transition-colors overflow-hidden flex items-center justify-center">
        {player.url
          ? <img src={player.url} alt={player.nome} className="w-full h-full object-cover" />
          : <span className="text-3xl font-black text-[#0c4dbe]">{player.numero}</span>
        }
      </div>
      {player.url && (
        <div className="text-[#0c4dbe] font-black text-sm mb-1">#{player.numero}</div>
      )}
      <h3 className="text-white font-bold text-base mb-2">{player.nome}</h3>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${posColors[player.posicao] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
          {player.posicao}
        </span>
        {player.modalidade && player.modalidade !== 'Full Pad' && (
          <span className="text-xs text-gray-500 font-mono">{player.modalidade}</span>
        )}
      </div>
    </div>
  )
}

export default function TimePage() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)

  const [formacoes, setFormacoes] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const q = query(collection(db, 'jogadores'), orderBy('numero', 'asc'))
        const snap = await getDocs(q)
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setPlayers(data.length > 0 ? data : staticPlayers)

        const fSnap = await getDocs(collection(db, 'formacoes'))
        setFormacoes(fSnap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch {
        setPlayers(staticPlayers)
      }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="page-enter pt-8 pb-20 px-6 max-w-7xl mx-auto w-full">
      <div className="mb-12">
        <span className="text-[#0c4dbe] text-xs font-bold uppercase tracking-widest">Futebol Americano · Elenco 2026</span>
        <h1 className="text-4xl md:text-5xl font-black text-white mt-2">O Time</h1>
        <p className="text-gray-400 mt-3">Conheça os atletas que vestem o uniforme do Wolves UTFPR-CP.</p>
      </div>

      {/* Formações */}
      {formacoes.length > 0 && (
        <div className="mb-16 space-y-6">
          <h2 className="text-xl font-bold text-gray-300 uppercase tracking-widest border-b border-white/10 pb-3">Formações</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formacoes.map(f => (
              <div key={f.id} className="bg-[#0a1a0a] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                }} />
                <div className="relative z-10">
                  <h3 className="text-white font-bold text-center mb-1">{f.nome}</h3>
                  <p className="text-gray-500 text-xs text-center uppercase tracking-widest mb-5">{f.tipo}</p>
                  <div className="flex flex-col items-center gap-3">
                    {f.linhas.map((linha, i) => (
                      <div key={i} className="flex gap-1.5 justify-center flex-wrap">
                        {linha.map((pos, j) => pos ? (
                          <div key={j} className="w-10 h-10 rounded-full bg-[#0c4dbe] flex items-center justify-center">
                            <span className="text-white text-[9px] font-bold">{pos}</span>
                          </div>
                        ) : (
                          <div key={j} className="w-10 h-10" />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#0c4dbe] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && positions.map(pos => {
        const group = players.filter(p => p.posicao === pos)
        if (!group.length) return null
        return (
          <div key={pos} className="mb-12">
            <h2 className="text-xl font-bold text-gray-300 uppercase tracking-widest mb-6 border-b border-white/10 pb-3">
              {pos}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {group.map(player => <PlayerCard key={player.id || player.numero} player={player} />)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
