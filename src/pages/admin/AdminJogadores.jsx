import { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, deleteDoc, doc, orderBy, query, setDoc } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../../firebase'
import { FaTrash, FaPlus, FaImage, FaTimes, FaFootballBall } from 'react-icons/fa'

const positions = ['Quarterback', 'Linemen', 'Wide Receiver / TE', 'Running Back', 'Defesa', 'Safety', 'Cornerback', 'Linebacker', 'Kicker']
const emptyPlayer = { nome: '', numero: '', posicao: 'Quarterback', modalidade: 'Full Pad' }
const emptyFormacao = { nome: '', tipo: 'Ofensiva', linhas: ['', '', ''] }

// ── Jogadores ──────────────────────────────────────────────────

function AdminJogadoresTab() {
  const [jogadores, setJogadores] = useState([])
  const [form, setForm] = useState(emptyPlayer)
  const [imgFile, setImgFile] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const load = async () => {
    const q = query(collection(db, 'jogadores'), orderBy('numero', 'asc'))
    const snap = await getDocs(q)
    setJogadores(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => { load() }, [])

  const handleImgChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImgFile(file)
    setImgPreview(URL.createObjectURL(file))
  }

  const clearImg = () => { setImgFile(null); setImgPreview(null) }

  const uploadImg = (file) => new Promise((resolve, reject) => {
    const storageRef = ref(storage, `jogadores/${Date.now()}_${file.name}`)
    const task = uploadBytesResumable(storageRef, file)
    task.on('state_changed',
      snap => setProgress(Math.round(snap.bytesTransferred / snap.totalBytes * 100)),
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        resolve({ url, storageRef: storageRef.fullPath })
      }
    )
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    let imgData = {}
    if (imgFile) imgData = await uploadImg(imgFile)
    await addDoc(collection(db, 'jogadores'), { ...form, numero: Number(form.numero), ...imgData, criadoEm: new Date() })
    setForm(emptyPlayer)
    clearImg()
    setProgress(0)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    await load()
    setLoading(false)
  }

  const handleDelete = async (j) => {
    if (!confirm(`Remover ${j.nome}?`)) return
    if (j.storageRef) try { await deleteObject(ref(storage, j.storageRef)) } catch {}
    await deleteDoc(doc(db, 'jogadores', j.id))
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
            Jogador adicionado!
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Nome completo</label>
              <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                required className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe]"
                placeholder="João da Silva" />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Número</label>
              <input type="number" min="1" max="99"
                value={form.numero} onChange={e => setForm(f => ({ ...f, numero: e.target.value }))}
                required className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe]"
                placeholder="12" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Posição</label>
              <select value={form.posicao} onChange={e => setForm(f => ({ ...f, posicao: e.target.value }))}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe]">
                {positions.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Modalidade</label>
              <select value={form.modalidade} onChange={e => setForm(f => ({ ...f, modalidade: e.target.value }))}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe]">
                <option>Full Pad</option>
                <option>Flag Football</option>
                <option>Ambos</option>
              </select>
            </div>
          </div>

          {/* Foto */}
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Foto do jogador (opcional)</label>
            {imgPreview ? (
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#0c4dbe]/50">
                <img src={imgPreview} alt="preview" className="w-full h-full object-cover" />
                <button type="button" onClick={clearImg}
                  className="absolute top-0.5 right-0.5 bg-black/70 text-white p-1 rounded-full">
                  <FaTimes size={10} />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-3 w-full border border-dashed border-white/20 rounded-xl px-4 py-3 cursor-pointer hover:border-[#0c4dbe]/60 transition-colors">
                <FaImage size={18} className="text-gray-500" />
                <span className="text-gray-400 text-sm">Clique para selecionar uma foto</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImgChange} />
              </label>
            )}
          </div>

          {loading && imgFile && (
            <div className="w-full bg-black rounded-full h-1.5">
              <div className="bg-[#0c4dbe] h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}

          <button type="submit" disabled={loading}
            className="btn-primary px-6 py-2.5 rounded-xl text-white font-bold text-sm uppercase tracking-wide flex items-center gap-2 disabled:opacity-50">
            <FaPlus size={12} />
            {loading ? 'Salvando...' : 'Adicionar Jogador'}
          </button>
        </form>
      </div>

      {/* Lista */}
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
                    {j.url
                      ? <img src={j.url} alt={j.nome} className="w-10 h-10 rounded-full object-cover border-2 border-[#0c4dbe]/30 shrink-0" />
                      : <div className="w-10 h-10 rounded-full bg-[#0c4dbe]/20 border border-[#0c4dbe]/30 flex items-center justify-center shrink-0">
                          <span className="text-[#0c4dbe] font-black text-sm">#{j.numero}</span>
                        </div>
                    }
                    <div>
                      <p className="text-white font-semibold text-sm">{j.nome} <span className="text-gray-500 text-xs">#{j.numero}</span></p>
                      <p className="text-gray-500 text-xs">{j.modalidade}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(j)} className="text-gray-600 hover:text-red-400 transition-colors shrink-0">
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

// ── Formações ──────────────────────────────────────────────────

function AdminFormacoesTab() {
  const [formacoes, setFormacoes] = useState([])
  const [form, setForm] = useState(emptyFormacao)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const load = async () => {
    const snap = await getDocs(collection(db, 'formacoes'))
    setFormacoes(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => { load() }, [])

  const updateLinha = (i, val) => {
    setForm(f => {
      const linhas = [...f.linhas]
      linhas[i] = val
      return { ...f, linhas }
    })
  }

  const addLinha = () => setForm(f => ({ ...f, linhas: [...f.linhas, ''] }))
  const removeLinha = (i) => setForm(f => ({ ...f, linhas: f.linhas.filter((_, idx) => idx !== i) }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const linhasFormatadas = form.linhas.map(l =>
      l.split(',').map(p => p.trim().toUpperCase())
    )
    await addDoc(collection(db, 'formacoes'), { ...form, linhas: linhasFormatadas, criadoEm: new Date() })
    setForm(emptyFormacao)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    await load()
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Remover esta formação?')) return
    await deleteDoc(doc(db, 'formacoes', id))
    await load()
  }

  return (
    <div className="space-y-8">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
        <h2 className="text-white font-black text-lg mb-2 uppercase tracking-wide">Nova Formação</h2>
        <p className="text-gray-500 text-xs mb-5">Em cada linha, separe as posições por vírgula. Use espaço vazio para células vazias (ex: <span className="text-gray-300">WR, , , QB, , , </span>)</p>
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl px-4 py-3 mb-4">
            Formação salva!
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Nome</label>
              <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                required className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe]"
                placeholder="Pro Set, Shotgun, 4-3..." />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Tipo</label>
              <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe]">
                <option>Ofensiva</option>
                <option>Defensiva</option>
                <option>Special Teams</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block">Linhas da formação</label>
            {form.linhas.map((linha, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-gray-600 text-xs w-5 text-right shrink-0">{i + 1}</span>
                <input value={linha} onChange={e => updateLinha(i, e.target.value)}
                  className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#0c4dbe] font-mono"
                  placeholder="WR, LT, LG, C, RG, RT, TE" />
                {form.linhas.length > 1 && (
                  <button type="button" onClick={() => removeLinha(i)} className="text-gray-600 hover:text-red-400 transition-colors">
                    <FaTimes size={13} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addLinha}
              className="flex items-center gap-1.5 text-gray-500 hover:text-white text-xs transition-colors mt-1">
              <FaPlus size={10} /> Adicionar linha
            </button>
          </div>

          {/* Preview */}
          {form.linhas.some(l => l.trim()) && (
            <div className="bg-[#0a1a0a] border border-white/10 rounded-xl p-5">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-4 text-center">Preview</p>
              <div className="flex flex-col items-center gap-3">
                {form.linhas.map((linha, i) => (
                  <div key={i} className="flex gap-2 justify-center flex-wrap">
                    {linha.split(',').map((pos, j) => pos.trim() ? (
                      <div key={j} className="w-10 h-10 rounded-full bg-[#0c4dbe] flex items-center justify-center">
                        <span className="text-white text-[9px] font-bold">{pos.trim().toUpperCase()}</span>
                      </div>
                    ) : (
                      <div key={j} className="w-10 h-10" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="btn-primary px-6 py-2.5 rounded-xl text-white font-bold text-sm uppercase tracking-wide flex items-center gap-2 disabled:opacity-50">
            <FaFootballBall size={12} />
            {loading ? 'Salvando...' : 'Salvar Formação'}
          </button>
        </form>
      </div>

      {/* Lista */}
      <div className="space-y-4">
        <h3 className="text-gray-400 text-xs uppercase tracking-widest font-semibold">Formações cadastradas ({formacoes.length})</h3>
        {formacoes.length === 0 && <p className="text-gray-600 text-sm">Nenhuma formação cadastrada ainda.</p>}
        {formacoes.map(f => (
          <div key={f.id} className="bg-[#111] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white font-bold">{f.nome}</p>
                <p className="text-gray-500 text-xs">{f.tipo}</p>
              </div>
              <button onClick={() => handleDelete(f.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                <FaTrash size={13} />
              </button>
            </div>
            <div className="flex flex-col items-center gap-2">
              {f.linhas.map((linha, i) => (
                <div key={i} className="flex gap-1.5 justify-center flex-wrap">
                  {linha.map((pos, j) => pos ? (
                    <div key={j} className="w-9 h-9 rounded-full bg-[#0c4dbe] flex items-center justify-center">
                      <span className="text-white text-[8px] font-bold">{pos}</span>
                    </div>
                  ) : (
                    <div key={j} className="w-9 h-9" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Export principal ────────────────────────────────────────────

export default function AdminJogadores() {
  const [tab, setTab] = useState('jogadores')

  return (
    <div>
      <div className="flex gap-2 mb-6 bg-black/40 border border-white/10 rounded-xl p-1">
        {[{ id: 'jogadores', label: 'Elenco' }, { id: 'formacoes', label: 'Formações' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition-colors ${
              tab === t.id ? 'bg-[#0c4dbe] text-white' : 'text-gray-400 hover:text-white'
            }`}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'jogadores' ? <AdminJogadoresTab /> : <AdminFormacoesTab />}
    </div>
  )
}
