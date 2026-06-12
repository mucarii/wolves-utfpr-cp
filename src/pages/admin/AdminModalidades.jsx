import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { FaSave } from 'react-icons/fa'

const DEFAULTS = {
  fullPad: 'A modalidade completa com equipamento — capacete, ombreira, joelheira e caneleira. Os atletas disputam partidas de tackle em competições regionais e nacionais, enfrentando equipes de outras universidades e clubes do Paraná e do Brasil.',
  flag: 'Versão do futebol americano sem contato físico direto — o marcador arranca a flag da cintura do portador da bola no lugar do tackle. É uma modalidade mais acessível, aberta a mais idades e muito popular em torneios regionais e campeonatos estaduais do Paraná.',
}

export default function AdminModalidades() {
  const [form, setForm] = useState(DEFAULTS)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getDoc(doc(db, 'config', 'modalidades')).then(snap => {
      if (snap.exists()) setForm({ ...DEFAULTS, ...snap.data() })
    }).catch(() => {})
  }, [])

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    try {
      await setDoc(doc(db, 'config', 'modalidades'), form)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Erro ao salvar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const labelClass = 'text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2'
  const textareaClass = 'w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe] resize-none'

  return (
    <div className="space-y-8">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
        <h2 className="text-white font-black text-lg uppercase tracking-wide mb-5">Descrições das Modalidades</h2>
        <p className="text-gray-500 text-sm mb-6">Edite o texto de apresentação de cada modalidade exibido na página pública.</p>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
        {success && <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl px-4 py-3 mb-4">Salvo com sucesso!</div>}

        <div className="space-y-5">
          <div>
            <label className={labelClass}>Futebol Americano — Full Pad</label>
            <textarea
              value={form.fullPad}
              onChange={e => setForm(f => ({ ...f, fullPad: e.target.value }))}
              rows={4}
              className={textareaClass}
            />
          </div>
          <div>
            <label className={labelClass}>Flag Football</label>
            <textarea
              value={form.flag}
              onChange={e => setForm(f => ({ ...f, flag: e.target.value }))}
              rows={4}
              className={textareaClass}
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary mt-5 px-6 py-2.5 rounded-xl text-white font-bold text-sm uppercase tracking-wide flex items-center gap-2 disabled:opacity-50"
        >
          <FaSave size={13} />
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </div>
  )
}
