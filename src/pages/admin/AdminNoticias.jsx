import { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, orderBy, query } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../../firebase'
import { FaTrash, FaPlus, FaImage, FaTimes, FaStar, FaEdit } from 'react-icons/fa'

const empty = { titulo: '', resumo: '', conteudo: '', categoria: 'JOGO', destaque: false }
const MAX_IMG_SIZE = 5 * 1024 * 1024

export default function AdminNoticias() {
  const [noticias, setNoticias] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [editingStorageRef, setEditingStorageRef] = useState(null)
  const [imgFile, setImgFile] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const load = async () => {
    try {
      const q = query(collection(db, 'noticias'), orderBy('criadoEm', 'desc'))
      const snap = await getDocs(q)
      setNoticias(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch {
      setError('Erro ao carregar notícias. Tente recarregar a página.')
    }
  }

  useEffect(() => { load() }, [])

  const handleImgChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Apenas imagens são permitidas.'); return }
    if (file.size > MAX_IMG_SIZE) { setError('A imagem deve ter no máximo 5 MB.'); return }
    setError(null)
    setImgFile(file)
    setImgPreview(URL.createObjectURL(file))
  }

  const clearImg = () => { setImgFile(null); setImgPreview(null) }

  const uploadImg = (file) => new Promise((resolve, reject) => {
    const storageRef = ref(storage, `noticias/${Date.now()}_${file.name}`)
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

  const startEdit = (n) => {
    setEditingId(n.id)
    setEditingStorageRef(n.storageRef || null)
    setForm({ titulo: n.titulo, resumo: n.resumo, conteudo: n.conteudo, categoria: n.categoria, destaque: n.destaque || false })
    setImgPreview(n.url || null)
    setImgFile(null)
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingStorageRef(null)
    setForm(empty)
    clearImg()
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      let imgData = {}
      if (imgFile) {
        if (editingStorageRef) try { await deleteObject(ref(storage, editingStorageRef)) } catch {}
        imgData = await uploadImg(imgFile)
      } else if (editingId && !imgPreview) {
        imgData = { url: null, storageRef: null }
      }

      if (editingId) {
        await updateDoc(doc(db, 'noticias', editingId), {
          ...form,
          ...(Object.keys(imgData).length ? imgData : {}),
        })
        setEditingId(null)
        setEditingStorageRef(null)
      } else {
        await addDoc(collection(db, 'noticias'), { ...form, criadoEm: new Date() })
      }

      setForm(empty)
      clearImg()
      setProgress(0)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      await load()
    } catch {
      setError(editingId ? 'Erro ao atualizar notícia. Tente novamente.' : 'Erro ao publicar notícia. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const toggleDestaque = async (n) => {
    try {
      await updateDoc(doc(db, 'noticias', n.id), { destaque: !n.destaque })
      await load()
    } catch {
      setError('Erro ao atualizar destaque. Tente novamente.')
    }
  }

  const handleDelete = async (n) => {
    if (!confirm('Remover esta notícia?')) return
    try {
      if (n.storageRef) try { await deleteObject(ref(storage, n.storageRef)) } catch {}
      await deleteDoc(doc(db, 'noticias', n.id))
      if (editingId === n.id) cancelEdit()
      await load()
    } catch {
      setError('Erro ao remover notícia. Tente novamente.')
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-black text-lg uppercase tracking-wide">
            {editingId ? 'Editar Notícia' : 'Nova Notícia'}
          </h2>
          {editingId && (
            <button onClick={cancelEdit} className="text-gray-500 hover:text-white text-xs flex items-center gap-1.5 transition-colors">
              <FaTimes size={11} /> Cancelar edição
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl px-4 py-3 mb-4">
            Notícia {editingId ? 'atualizada' : 'publicada'} com sucesso!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Título</label>
              <input
                value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                required className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe]"
                placeholder="Wolves vence jogo decisivo..."
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Categoria</label>
              <select
                value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe]"
              >
                {['JOGO', 'TREINO', 'EVENTO', 'FLAG FOOTBALL', 'EXTENSÃO', 'GERAL'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Resumo</label>
            <input
              value={form.resumo} onChange={e => setForm(f => ({ ...f, resumo: e.target.value }))}
              required className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe]"
              placeholder="Breve descrição para o card..."
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Conteúdo</label>
            <textarea
              value={form.conteudo} onChange={e => setForm(f => ({ ...f, conteudo: e.target.value }))}
              required rows={5}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe] resize-none"
              placeholder="Texto completo da notícia..."
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">
              Imagem de capa (opcional)
              <span className="normal-case tracking-normal font-normal text-gray-600 ml-2">— recomendado: horizontal 16:9 (ex: 1280×720)</span>
            </label>
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

          <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
            <input
              type="checkbox"
              checked={form.destaque}
              onChange={e => setForm(f => ({ ...f, destaque: e.target.checked }))}
              className="w-4 h-4 rounded accent-yellow-400"
            />
            <span className="text-gray-300 text-sm flex items-center gap-1.5">
              <FaStar size={12} className="text-yellow-400" />
              Destaque no carrossel da Home
            </span>
          </label>

          <button type="submit" disabled={loading}
            className="btn-primary px-6 py-2.5 rounded-xl text-white font-bold text-sm uppercase tracking-wide flex items-center gap-2 disabled:opacity-50">
            {editingId ? <FaEdit size={12} /> : <FaPlus size={12} />}
            {loading ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Publicar Notícia'}
          </button>
        </form>
      </div>

      <div className="space-y-3">
        <h3 className="text-gray-400 text-xs uppercase tracking-widest font-semibold">Notícias publicadas ({noticias.length})</h3>
        {noticias.length === 0 && <p className="text-gray-600 text-sm">Nenhuma notícia publicada ainda.</p>}
        {noticias.map(n => (
          <div key={n.id} className={`bg-[#111] border rounded-xl overflow-hidden flex items-stretch gap-0 transition-colors ${editingId === n.id ? 'border-[#0c4dbe]/60' : 'border-white/10'}`}>
            {n.url && <img src={n.url} alt={n.titulo} className="w-20 object-cover shrink-0" />}
            <div className="flex-1 px-5 py-4 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[#0c4dbe] text-[10px] font-bold uppercase tracking-widest">{n.categoria}</span>
                  {n.destaque && (
                    <span className="flex items-center gap-1 text-yellow-400 text-[10px] font-bold uppercase tracking-widest">
                      <FaStar size={9} /> Destaque
                    </span>
                  )}
                </div>
                <p className="text-white font-semibold text-sm mt-0.5">{n.titulo}</p>
                <p className="text-gray-500 text-xs mt-1">{n.resumo}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 mt-1">
                <button
                  onClick={() => toggleDestaque(n)}
                  aria-label={n.destaque ? `Remover destaque de ${n.titulo}` : `Destacar ${n.titulo} no carrossel`}
                  title={n.destaque ? 'Remover do carrossel' : 'Destacar no carrossel'}
                  className={`transition-colors ${n.destaque ? 'text-yellow-400 hover:text-yellow-200' : 'text-gray-600 hover:text-yellow-400'}`}
                >
                  <FaStar size={13} />
                </button>
                <button onClick={() => startEdit(n)} aria-label={`Editar notícia ${n.titulo}`}
                  className="text-gray-600 hover:text-[#0c4dbe] transition-colors">
                  <FaEdit size={13} />
                </button>
                <button onClick={() => handleDelete(n)} aria-label={`Remover notícia ${n.titulo}`}
                  className="text-gray-600 hover:text-red-400 transition-colors">
                  <FaTrash size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
