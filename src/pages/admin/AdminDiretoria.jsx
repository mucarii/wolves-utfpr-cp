import { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../../firebase'
import { FaTrash, FaPlus, FaImage, FaTimes, FaEdit, FaSave } from 'react-icons/fa'

const empty = { nome: '', cargo: '', bio: '' }
const MAX_IMG_SIZE = 5 * 1024 * 1024

export default function AdminDiretoria() {
  const [membros, setMembros] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [editingStorageRef, setEditingStorageRef] = useState(null)
  const [imgFile, setImgFile] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const load = async () => {
    try {
      const snap = await getDocs(query(collection(db, 'diretoria'), orderBy('criadoEm', 'asc')))
      setMembros(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch {
      setError('Erro ao carregar membros. Tente recarregar a página.')
    }
  }

  useEffect(() => { load() }, [])

  const handleImgChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Apenas imagens são permitidas.')
      return
    }
    if (file.size > MAX_IMG_SIZE) {
      setError('A imagem deve ter no máximo 5 MB.')
      return
    }
    setError(null)
    setImgFile(file)
    setImgPreview(URL.createObjectURL(file))
  }

  const clearImg = () => { setImgFile(null); setImgPreview(null) }

  const uploadImg = (file) => new Promise((resolve, reject) => {
    const storageRef = ref(storage, `diretoria/${Date.now()}_${file.name}`)
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

  const startEdit = (m) => {
    setEditingId(m.id)
    setEditingStorageRef(m.storageRef || null)
    setForm({ nome: m.nome, cargo: m.cargo, bio: m.bio || '' })
    setImgPreview(m.url || null)
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
        await updateDoc(doc(db, 'diretoria', editingId), {
          ...form,
          ...(Object.keys(imgData).length ? imgData : {}),
        })
      } else {
        await addDoc(collection(db, 'diretoria'), {
          ...form,
          ...imgData,
          criadoEm: new Date(),
        })
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      cancelEdit()
      await load()
    } catch {
      setError('Erro ao salvar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (m) => {
    if (!window.confirm(`Remover ${m.nome}?`)) return
    try {
      if (m.storageRef) try { await deleteObject(ref(storage, m.storageRef)) } catch {}
      await deleteDoc(doc(db, 'diretoria', m.id))
      await load()
    } catch {
      setError('Erro ao remover membro. Tente novamente.')
    }
  }

  const isEditing = !!editingId

  return (
    <div className="space-y-6">
      <h2 className="text-white font-black text-xl">Diretoria</h2>

      <div className={`bg-[#111] border rounded-2xl p-6 ${isEditing ? 'border-[#0c4dbe]' : 'border-white/10'}`}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-base">{isEditing ? 'Editar Membro' : 'Adicionar Membro'}</h3>
          {isEditing && (
            <button onClick={cancelEdit} className="text-gray-500 hover:text-white text-xs flex items-center gap-1 transition-colors">
              <FaTimes size={11} /> Cancelar
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl px-4 py-3 mb-4">
            {isEditing ? 'Membro atualizado com sucesso!' : 'Membro adicionado com sucesso!'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-1">Nome</label>
              <input
                type="text"
                value={form.nome}
                onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                required
                placeholder="Nome completo"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe] transition-colors"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-1">Cargo / Badge</label>
              <input
                type="text"
                value={form.cargo}
                onChange={e => setForm(f => ({ ...f, cargo: e.target.value }))}
                required
                placeholder="Ex: Head Coach, Presidente..."
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-1">Sobre (opcional)</label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="Escreva um pouco sobre esta pessoa..."
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe] transition-colors resize-none"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-1">Foto (opcional)</label>
            {imgPreview ? (
              <div className="flex items-center gap-4">
                <img src={imgPreview} alt="preview" className="w-16 h-16 rounded-full object-cover border border-white/20" />
                <button type="button" onClick={clearImg} className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 transition-colors">
                  <FaTimes size={11} /> Remover
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-3 cursor-pointer w-fit bg-black border border-white/10 rounded-xl px-4 py-2.5 hover:border-white/30 transition-colors">
                <FaImage size={14} className="text-gray-500" />
                <span className="text-gray-400 text-sm">Escolher foto</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImgChange} />
              </label>
            )}
            {loading && imgFile && (
              <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden w-48">
                <div className="h-full bg-[#0c4dbe] transition-all" style={{ width: `${progress}%` }} />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-[#0c4dbe] hover:bg-[#0a42a8] text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50"
          >
            {isEditing ? <FaSave size={13} /> : <FaPlus size={13} />}
            {loading ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Adicionar'}
          </button>
        </form>
      </div>

      {membros.length > 0 && (
        <div className="bg-[#111] border border-white/10 rounded-2xl divide-y divide-white/5">
          {membros.map(m => (
            <div key={m.id} className="flex items-center gap-4 px-5 py-4">
              <div className="w-10 h-10 rounded-full bg-[#0c4dbe]/20 border border-[#0c4dbe]/30 overflow-hidden flex items-center justify-center shrink-0">
                {m.url
                  ? <img src={m.url} alt={m.nome} className="w-full h-full object-cover" />
                  : <span className="text-[#0c4dbe] font-black text-sm">{m.nome?.[0]}</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">{m.nome}</p>
                <p className="text-gray-500 text-xs">{m.cargo}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => startEdit(m)} aria-label={`Editar ${m.nome}`} className="text-gray-500 hover:text-[#0c4dbe] transition-colors">
                  <FaEdit size={13} />
                </button>
                <button onClick={() => handleDelete(m)} aria-label={`Remover ${m.nome}`} className="text-gray-600 hover:text-red-400 transition-colors">
                  <FaTrash size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
