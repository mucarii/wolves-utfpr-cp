import { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore'
import { db } from '../../firebase'
import { FaTrash, FaPlus } from 'react-icons/fa'

const positions = ['Quarterback', 'Linemen', 'Wide Receiver / TE', 'Running Back', 'Defesa', 'Kicker', 'Safety', 'Cornerback', 'Linebacker']
const empty = { nome: '', numero: '', posicao: 'Quarterback', modalidade: 'Full Pad' }

export default function AdminJogadores() {
  const [jogadores, setJogadores] = useState([])
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const load = async () => {
    const q = query(collection(db, 'jogadores'), orderBy('numero', 'asc'))
    const snap = await getDocs(q)
    setJogadores(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await addDoc(collection(db, 'jogadores'), { ...form, numero: Number(form.numero), criadoEm: new Date() })
    setForm(empty)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    await load()
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Remover este jogador?')) return
    await deleteDoc(doc(db, 'jogadores', id))
    await load()
  }

  const byPos = positions.reduce((acc, pos) => {
    const group = jogadores.filter(j => j.posicao === pos)
    if (group.length) acc[pos] = group
    return acc
  }, {})

  return (
    <div className="space-y-8">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
        <h2 className="text-white font-black text-lg mb-5 uppercase tracking-wide">Adicionar Jogador</h2>
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl px-4 py-3 mb-4">
            Jogador adicionado com sucesso!
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Nome completo</label>
              <input
                value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                required className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe]"
                placeholder="João da Silva"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Número</label>
              <input
                type="number" min="1" max="99"
                value={form.numero} onChange={e => setForm(f => ({ ...f, numero: e.target.value }))}
                required className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe]"
                placeholder="12"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Posição</label>
              <select
                value={form.posicao} onChange={e => setForm(f => ({ ...f, posicao: e.target.value }))}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe]"
              >
                {positions.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Modalidade</label>
              <select
                value={form.modalidade} onChange={e => setForm(f => ({ ...f, modalidade: e.target.value }))}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe]"
              >
                <option>Full Pad</option>
                <option>Flag Football</option>
                <option>Ambos</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="btn-primary px-6 py-2.5 rounded-xl text-white font-bold text-sm uppercase tracking-wide flex items-center gap-2 disabled:opacity-50">
            <FaPlus size={12} />
            {loading ? 'Salvando...' : 'Adicionar Jogador'}
          </button>
        </form>
      </div>

      {/* List by position */}
      <div className="space-y-6">
        <h3 className="text-gray-400 text-xs uppercase tracking-widest font-semibold">Elenco ({jogadores.length} jogadores)</h3>
        {jogadores.length === 0 && <p className="text-gray-600 text-sm">Nenhum jogador cadastrado ainda.</p>}
        {Object.entries(byPos).map(([pos, group]) => (
          <div key={pos}>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-3 border-b border-white/10 pb-2">{pos}</h4>
            <div className="space-y-2">
              {group.map(j => (
                <div key={j.id} className="bg-[#111] border border-white/10 rounded-xl px-5 py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#0c4dbe]/20 border border-[#0c4dbe]/30 flex items-center justify-center shrink-0">
                      <span className="text-[#0c4dbe] font-black text-sm">#{j.numero}</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{j.nome}</p>
                      <p className="text-gray-500 text-xs">{j.modalidade}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(j.id)}
                    className="text-gray-600 hover:text-red-400 transition-colors shrink-0">
                    <FaTrash size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
