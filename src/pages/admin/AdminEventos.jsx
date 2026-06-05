import { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../../firebase'
import { FaTrash, FaPlus, FaImage, FaTimes } from 'react-icons/fa'

const empty = { titulo: '', descricao: '', data: '', horario: '', local: '', tipo: 'JOGO' }

export default function AdminEventos() {
  const [eventos, setEventos] = useState([])
  const [form, setForm] = useState(empty)
  const [imgFile, setImgFile] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const load = async () => {
    const q = query(collection(db, 'eventos'), orderBy('data', 'desc'))
    const snap = await getDocs(q)
    setEventos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => { load() }, [])

  const handleImgChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImgFile(file)
    setImgPreview(URL.createObjectURL(file))
  }

  const clearImg = () => {
    setImgFile(null)
    setImgPreview(null)
  }

  const uploadImg = (file) => new Promise((resolve, reject) => {
    const storageRef = ref(storage, `eventos/${Date.now()}_${file.name}`)
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
    if (imgFile) {
      imgData = await uploadImg(imgFile)
    }
    await addDoc(collection(db, 'eventos'), { ...form, ...imgData, criadoEm: new Date() })
    setForm(empty)
    clearImg()
    setProgress(0)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    await load()
    setLoading(false)
  }

  const handleDelete = async (ev) => {
    if (!confirm('Remover este evento?')) return
    if (ev.storageRef) {
      try { await deleteObject(ref(storage, ev.storageRef)) } catch {}
    }
    await deleteDoc(doc(db, 'eventos', ev.id))
    await load()
  }

  return (
    <div className="space-y-8">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
        <h2 className="text-white font-black text-lg mb-5 uppercase tracking-wide">Novo Evento</h2>
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl px-4 py-3 mb-4">
            Evento criado com sucesso!
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Título</label>
              <input
                value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                required className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe]"
                placeholder="Jogo contra Leões FC..."
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Tipo</label>
              <select
                value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe]"
              >
                {['JOGO', 'TREINO', 'EVENTO', 'CAMPEONATO', 'EXTENSÃO'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Data</label>
              <input type="date"
                value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))}
                required className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe]"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Horário</label>
              <input type="time"
                value={form.horario} onChange={e => setForm(f => ({ ...f, horario: e.target.value }))}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe]"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Local</label>
              <input
                value={form.local} onChange={e => setForm(f => ({ ...f, local: e.target.value }))}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe]"
                placeholder="UTFPR-CP"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Descrição</label>
            <textarea
              value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
              rows={3} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe] resize-none"
              placeholder="Detalhes do evento..."
            />
          </div>

          {/* Image upload */}
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Imagem (opcional)</label>
            {imgPreview ? (
              <div className="relative w-full rounded-xl overflow-hidden border border-white/10">
                <img src={imgPreview} alt="preview" className="w-full max-h-48 object-cover" />
                <button type="button" onClick={clearImg}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1.5 rounded-lg transition-colors">
                  <FaTimes size={12} />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-3 w-full border border-dashed border-white/20 rounded-xl px-4 py-4 cursor-pointer hover:border-[#0c4dbe]/60 transition-colors">
                <FaImage size={20} className="text-gray-500" />
                <span className="text-gray-400 text-sm">Clique para selecionar uma imagem</span>
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
            {loading ? 'Salvando...' : 'Criar Evento'}
          </button>
        </form>
      </div>

      <div className="space-y-3">
        <h3 className="text-gray-400 text-xs uppercase tracking-widest font-semibold">Eventos ({eventos.length})</h3>
        {eventos.length === 0 && <p className="text-gray-600 text-sm">Nenhum evento cadastrado ainda.</p>}
        {eventos.map(ev => (
          <div key={ev.id} className="bg-[#111] border border-white/10 rounded-xl overflow-hidden flex items-stretch">
            {ev.url && (
              <img src={ev.url} alt={ev.titulo} className="w-20 object-cover shrink-0" />
            )}
            <div className="flex-1 px-5 py-4 flex items-start justify-between gap-4">
              <div>
                <span className="text-[#ffc501] text-[10px] font-bold uppercase tracking-widest">{ev.tipo}</span>
                <p className="text-white font-semibold text-sm mt-0.5">{ev.titulo}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {ev.data}{ev.horario ? ` · ${ev.horario}` : ''}{ev.local ? ` · ${ev.local}` : ''}
                </p>
              </div>
              <button onClick={() => handleDelete(ev)}
                className="text-gray-600 hover:text-red-400 transition-colors shrink-0 mt-1">
                <FaTrash size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
