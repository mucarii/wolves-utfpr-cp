import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { FaPlus, FaTrash, FaSave, FaTimes } from 'react-icons/fa'

const TAGS = ['Esporte & Comunidade', 'Educação', 'Inclusão', 'Inclusão Social', 'Parceria', 'Geral']

const DEFAULT_PROJECTS = [
  { nome: 'Futebol Americano para Todos', tag: 'Esporte & Comunidade', desc: 'Treinos abertos à comunidade de Cornélio Procópio — não é necessário ser aluno da UTFPR. O projeto apresenta o futebol americano a qualquer pessoa interessada, sem custo e sem exigência de experiência prévia.', highlight: 'Treinos: Ter, Qui 17h30 · Sáb 09h' },
  { nome: 'Wolves nas Escolas', tag: 'Educação', desc: 'Visitas a escolas públicas da cidade para apresentar o futebol americano, promover valores como trabalho em equipe, disciplina e fair play entre jovens estudantes do ensino fundamental e médio.', highlight: 'Público: ensino fundamental e médio' },
  { nome: 'Flag Inclusivo', tag: 'Inclusão', desc: 'Projeto de flag football voltado para ampliar a participação de grupos que ainda têm pouca representação no esporte — incluindo mulheres e pessoas que preferem a modalidade sem contato físico.', highlight: 'Modalidade: Flag Football' },
  { nome: 'Wolves na APAE', tag: 'Inclusão Social', desc: 'Visitas e atividades de flag football com alunos da APAE de Cornélio Procópio. O projeto leva o esporte como ferramenta de integração, alegria e desenvolvimento para pessoas com deficiência intelectual.', highlight: 'Parceria: APAE Cornélio Procópio' },
]

const emptyProject = { nome: '', tag: 'Esporte & Comunidade', desc: '', highlight: '' }

export default function AdminExtensao() {
  const [projects, setProjects] = useState(DEFAULT_PROJECTS)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyProject)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getDoc(doc(db, 'config', 'extensao')).then(snap => {
      if (snap.exists() && snap.data().projetos?.length) setProjects(snap.data().projetos)
    }).catch(() => {})
  }, [])

  const save = async (newProjects) => {
    setLoading(true)
    setError(null)
    try {
      await setDoc(doc(db, 'config', 'extensao'), { projetos: newProjects })
      setProjects(newProjects)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Erro ao salvar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nome.trim() || !form.desc.trim()) return
    const updated = editing !== null
      ? projects.map((p, i) => i === editing ? form : p)
      : [...projects, form]
    await save(updated)
    setEditing(null)
    setForm(emptyProject)
  }

  const handleDelete = async (i) => {
    if (!confirm('Remover este projeto?')) return
    await save(projects.filter((_, idx) => idx !== i))
  }

  const startEdit = (i) => {
    setEditing(i)
    setForm({ ...projects[i] })
  }

  const cancelEdit = () => { setEditing(null); setForm(emptyProject) }

  const inputClass = 'w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe]'
  const labelClass = 'text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2'

  return (
    <div className="space-y-8">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-black text-lg uppercase tracking-wide">
            {editing !== null ? 'Editar Projeto' : 'Novo Projeto'}
          </h2>
          {editing !== null && (
            <button onClick={cancelEdit} className="text-gray-500 hover:text-white text-xs flex items-center gap-1.5 transition-colors">
              <FaTimes size={11} /> Cancelar
            </button>
          )}
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
        {success && <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl px-4 py-3 mb-4">Salvo!</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nome do projeto</label>
              <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} required className={inputClass} placeholder="Wolves nas Escolas..." />
            </div>
            <div>
              <label className={labelClass}>Tag / Categoria</label>
              <select value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} className={inputClass}>
                {TAGS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Descrição</label>
            <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} required rows={3} className={`${inputClass} resize-none`} placeholder="Descreva o projeto..." />
          </div>
          <div>
            <label className={labelClass}>Destaque (caixa de info)</label>
            <input value={form.highlight} onChange={e => setForm(f => ({ ...f, highlight: e.target.value }))} className={inputClass} placeholder="Público: ensino fundamental e médio" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary px-6 py-2.5 rounded-xl text-white font-bold text-sm uppercase tracking-wide flex items-center gap-2 disabled:opacity-50">
            {editing !== null ? <FaSave size={12} /> : <FaPlus size={12} />}
            {loading ? 'Salvando...' : editing !== null ? 'Salvar' : 'Adicionar Projeto'}
          </button>
        </form>
      </div>

      <div className="space-y-3">
        <h3 className="text-gray-400 text-xs uppercase tracking-widest font-semibold">Projetos ({projects.length})</h3>
        {projects.map((p, i) => (
          <div key={i} className={`bg-[#111] border rounded-xl px-5 py-4 flex items-start justify-between gap-4 ${editing === i ? 'border-[#0c4dbe]/60' : 'border-white/10'}`}>
            <div className="flex-1 min-w-0">
              <div className="text-[#0c4dbe] text-[10px] font-bold uppercase tracking-widest mb-0.5">{p.tag}</div>
              <p className="text-white font-semibold text-sm">{p.nome}</p>
              <p className="text-gray-500 text-xs mt-1 line-clamp-1">{p.desc}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => startEdit(i)} className="text-gray-600 hover:text-[#0c4dbe] transition-colors text-xs font-bold">Editar</button>
              <button onClick={() => handleDelete(i)} className="text-gray-600 hover:text-red-400 transition-colors"><FaTrash size={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
