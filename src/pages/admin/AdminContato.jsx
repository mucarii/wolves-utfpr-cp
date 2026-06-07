import { useEffect, useState } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { FaSave } from 'react-icons/fa'

const defaultForm = {
  email: '',
  instagram: '',
  whatsapp: '',
  endereco: '',
  enderecoSub: '',
}

export default function AdminContato() {
  const [form, setForm] = useState(defaultForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, 'config', 'contato'))
      if (snap.exists()) setForm({ ...defaultForm, ...snap.data() })
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await setDoc(doc(db, 'config', 'contato'), form)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const field = (key, label, placeholder, hint) => (
    <div>
      <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-1">{label}</label>
      {hint && <p className="text-gray-600 text-xs mb-2">{hint}</p>}
      <input
        type="text"
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe] transition-colors"
      />
    </div>
  )

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-6 h-6 border-2 border-[#0c4dbe] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <h2 className="text-white font-black text-xl">Informações de Contato</h2>

      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-5">
        {field('email', 'E-mail', 'wolvescp.utfpr@gmail.com')}
        {field('instagram', 'Instagram (usuário sem @)', 'wolvesutfcp', 'Apenas o nome de usuário, ex: wolvesutfcp')}
        {field('whatsapp', 'WhatsApp (número com DDI)', '5543999999999', 'Formato: 5543999999999 (sem espaços ou traços)')}
        {field('endereco', 'Endereço — linha principal', 'UTFPR — Campus Cornélio Procópio')}
        {field('enderecoSub', 'Endereço — linha secundária', 'Av. Alberto Carazzai, 1640 · Cornélio Procópio, PR')}

        {saved && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-xl px-4 py-3">
            Informações salvas com sucesso!
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#0c4dbe] hover:bg-[#0a42a8] text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50"
        >
          <FaSave size={14} />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </div>
  )
}
