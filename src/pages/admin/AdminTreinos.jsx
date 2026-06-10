import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { FaPlus, FaTrash, FaSave } from 'react-icons/fa'

const DEFAULT_SCHEDULE = [
  { day: 'Terça-feira', time: '17h30', type: 'Treino Geral' },
  { day: 'Quinta-feira', time: '17h30', type: 'Treino Técnico' },
  { day: 'Sábado', time: '09h00', type: 'Treino & Scrimmage' },
]

const emptyItem = { day: '', time: '', type: '' }

export default function AdminTreinos() {
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDoc(doc(db, 'config', 'treinos'))
        if (snap.exists() && snap.data().schedule?.length) {
          setSchedule(snap.data().schedule)
        }
      } catch {
        setError('Erro ao carregar horários.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const update = (i, field, value) =>
    setSchedule(s => s.map((item, idx) => idx === i ? { ...item, [field]: value } : item))

  const addRow = () => setSchedule(s => [...s, { ...emptyItem }])

  const removeRow = (i) => setSchedule(s => s.filter((_, idx) => idx !== i))

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      await setDoc(doc(db, 'config', 'treinos'), { schedule })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Erro ao salvar horários. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-gray-500 text-sm">Carregando...</div>

  return (
    <div className="space-y-6">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
        <h2 className="text-white font-black text-lg mb-1 uppercase tracking-wide">Horários de Treino</h2>
        <p className="text-gray-500 text-sm mb-6">Estas informações aparecem na página pública de Treinos.</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl px-4 py-3 mb-4">
            Horários salvos com sucesso!
          </div>
        )}

        <div className="space-y-3 mb-4">
          {schedule.map((item, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto_1fr_auto] sm:grid-cols-[2fr_1fr_2fr_auto] gap-3 items-center">
              <input
                value={item.day}
                onChange={e => update(i, 'day', e.target.value)}
                placeholder="Dia (ex: Terça-feira)"
                className="bg-black border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0c4dbe]"
              />
              <input
                value={item.time}
                onChange={e => update(i, 'time', e.target.value)}
                placeholder="Hora (ex: 17h30)"
                className="bg-black border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0c4dbe]"
              />
              <input
                value={item.type}
                onChange={e => update(i, 'type', e.target.value)}
                placeholder="Tipo (ex: Treino Geral)"
                className="bg-black border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#0c4dbe]"
              />
              <button onClick={() => removeRow(i)} aria-label="Remover"
                className="text-gray-600 hover:text-red-400 transition-colors p-1">
                <FaTrash size={13} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-3 flex-wrap">
          <button onClick={addRow}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
            <FaPlus size={11} /> Adicionar linha
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 btn-primary text-white text-sm font-bold px-6 py-2 rounded-xl disabled:opacity-50">
            <FaSave size={13} />
            {saving ? 'Salvando...' : 'Salvar horários'}
          </button>
        </div>
      </div>
    </div>
  )
}
