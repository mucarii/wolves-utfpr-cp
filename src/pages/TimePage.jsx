import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import usePageTitle from '../hooks/usePageTitle'
import { db } from '../firebase'
import { FaUserTie } from 'react-icons/fa'
import { POSITIONS, POS_COLORS } from '../constants'

function PlayerCard({ player }) {
  return (
    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 card-hover group text-center">
      <div className="w-20 h-20 rounded-full bg-[#0c4dbe]/20 border-2 border-[#0c4dbe]/30 mx-auto mb-4 group-hover:border-[#0c4dbe] transition-colors overflow-hidden flex items-center justify-center">
        {player.url
          ? <img src={player.url} alt={player.nome} loading="lazy" className="w-full h-full object-cover" />
          : <span className="text-3xl font-black text-[#0c4dbe]">{player.numero}</span>
        }
      </div>
      {player.url && (
        <div className="text-[#0c4dbe] font-black text-sm mb-1">#{player.numero}</div>
      )}
      <h3 className="text-white font-bold text-base mb-2">{player.nome}</h3>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${POS_COLORS[player.posicao] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
          {player.posicao}
        </span>
        {player.modalidade && player.modalidade !== 'Full Pad' && (
          <span className="text-xs text-gray-500 font-mono">
            {player.modalidade === 'Ambos' ? 'Full Pad / Flag' : player.modalidade}
          </span>
        )}
      </div>
    </div>
  )
}

export default function TimePage() {
  usePageTitle('Time')
  const [players, setPlayers] = useState([])
  const [formacoes, setFormacoes] = useState([])
  const [diretoria, setDiretoria] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [jogSnap, fSnap, dSnap] = await Promise.all([
          getDocs(query(collection(db, 'jogadores'), orderBy('numero', 'asc'))),
          getDocs(collection(db, 'formacoes')),
          getDocs(query(collection(db, 'diretoria'), orderBy('criadoEm', 'asc'))),
        ])
        setPlayers(jogSnap.docs.map(d => ({ id: d.id, ...d.data() })))
        setFormacoes(fSnap.docs.map(d => ({ id: d.id, ...d.data() })))
        setDiretoria(dSnap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch {
        setError('Não foi possível carregar o elenco. Tente recarregar a página.')
      } finally {
        setLoading(false)
      }
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

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-5 py-4 mb-10">
          {error}
        </div>
      )}

      {/* Diretoria */}
      {diretoria.length > 0 && (
        <div className="mb-16">
          <h2 className="text-xl font-bold text-gray-300 uppercase tracking-widest border-b border-white/10 pb-3 mb-8 flex items-center gap-3">
            <FaUserTie size={16} className="text-[#0c4dbe]" /> Diretoria
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {diretoria.map(m => (
              <div key={m.id} className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden card-hover flex flex-col">
                <div className="relative h-40 bg-gradient-to-br from-[#0c4dbe]/30 to-[#080808] flex items-center justify-center">
                  {m.url
                    ? <img src={m.url} alt={m.nome} loading="lazy" className="w-full h-full object-cover object-top" />
                    : <span className="text-6xl font-black text-[#0c4dbe]/40">{m.nome?.[0]}</span>
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
                </div>
                <div className="px-5 pb-5 -mt-4 relative z-10 flex flex-col flex-1">
                  <span className="inline-block bg-[#0c4dbe] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest mb-3 w-fit">
                    {m.cargo}
                  </span>
                  <h3 className="text-white font-black text-lg mb-2">{m.nome}</h3>
                  {m.bio && (
                    <p className="text-gray-400 text-sm leading-relaxed">{m.bio}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {!loading && !error && players.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-base">Elenco sendo atualizado. Em breve!</p>
        </div>
      )}

      {!loading && players.length > 0 && POSITIONS.map(pos => {
        const group = players.filter(p => p.posicao === pos)
        if (!group.length) return null
        return (
          <div key={pos} className="mb-12">
            <h2 className="text-xl font-bold text-gray-300 uppercase tracking-widest mb-6 border-b border-white/10 pb-3">
              {pos}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {group.map(player => <PlayerCard key={player.id} player={player} />)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
