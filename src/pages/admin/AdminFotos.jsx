import { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../../firebase'
import { FaTrash, FaCloudUploadAlt } from 'react-icons/fa'

const albums = ['Time', 'Wolves nas Escolas', 'Wolves na APAE', 'Jogos', 'Treinos', 'Geral']
const MAX_IMG_SIZE = 5 * 1024 * 1024

export default function AdminFotos() {
  const [fotos, setFotos] = useState([])
  const [album, setAlbum] = useState('Time')
  const [files, setFiles] = useState([])
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const load = async () => {
    try {
      const q = query(collection(db, 'fotos'), orderBy('criadoEm', 'desc'))
      const snap = await getDocs(q)
      setFotos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch {
      setError('Erro ao carregar fotos. Tente recarregar a página.')
    }
  }

  useEffect(() => { load() }, [])

  const handleFilesChange = (e) => {
    const selected = Array.from(e.target.files)
    const invalid = selected.filter(f => !f.type.startsWith('image/'))
    const oversized = selected.filter(f => f.size > MAX_IMG_SIZE)
    if (invalid.length) {
      setError('Apenas imagens são permitidas.')
      return
    }
    if (oversized.length) {
      setError(`${oversized.length} arquivo(s) excedem o limite de 5 MB.`)
      return
    }
    setError(null)
    setFiles(selected)
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!files.length) return
    setError(null)
    setUploading(true)
    setProgress(0)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const storageRef = ref(storage, `fotos/${album}/${Date.now()}_${file.name}`)
        await new Promise((resolve, reject) => {
          const task = uploadBytesResumable(storageRef, file)
          task.on('state_changed',
            snap => setProgress(Math.round(((i + snap.bytesTransferred / snap.totalBytes) / files.length) * 100)),
            reject,
            async () => {
              const url = await getDownloadURL(task.snapshot.ref)
              await addDoc(collection(db, 'fotos'), {
                url, album, nome: file.name,
                storageRef: storageRef.fullPath,
                criadoEm: new Date(),
              })
              resolve()
            }
          )
        })
      }

      setFiles([])
      setProgress(0)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      await load()
    } catch {
      setError('Erro ao enviar fotos. Tente novamente.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (foto) => {
    if (!confirm('Remover esta foto?')) return
    try {
      try { await deleteObject(ref(storage, foto.storageRef)) } catch {}
      await deleteDoc(doc(db, 'fotos', foto.id))
      await load()
    } catch {
      setError('Erro ao remover foto. Tente novamente.')
    }
  }

  const filtered = fotos.filter(f => f.album === album)

  return (
    <div className="space-y-8">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
        <h2 className="text-white font-black text-lg mb-5 uppercase tracking-wide">Upload de Fotos</h2>
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl px-4 py-3 mb-4">
            Fotos enviadas com sucesso!
          </div>
        )}
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Álbum</label>
            <select
              value={album} onChange={e => setAlbum(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe]"
            >
              {albums.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">
              Fotos (pode selecionar várias — máx. 5 MB cada)
            </label>
            <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-white/20 rounded-xl py-8 cursor-pointer hover:border-[#0c4dbe]/60 transition-colors">
              <FaCloudUploadAlt size={32} className="text-gray-500 mb-2" />
              <span className="text-gray-400 text-sm">
                {files.length ? `${files.length} arquivo(s) selecionado(s)` : 'Clique para selecionar fotos'}
              </span>
              <input type="file" multiple accept="image/*" className="hidden"
                onChange={handleFilesChange} />
            </label>
          </div>
          {uploading && (
            <div className="w-full bg-black rounded-full h-2">
              <div className="bg-[#0c4dbe] h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
          <button type="submit" disabled={uploading || !files.length}
            className="btn-primary px-6 py-2.5 rounded-xl text-white font-bold text-sm uppercase tracking-wide flex items-center gap-2 disabled:opacity-50">
            <FaCloudUploadAlt size={14} />
            {uploading ? `Enviando... ${progress}%` : 'Enviar Fotos'}
          </button>
        </form>
      </div>

      <div>
        <div className="flex gap-2 mb-5 flex-wrap">
          {albums.map(a => (
            <button key={a} onClick={() => setAlbum(a)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-colors ${
                album === a ? 'bg-[#0c4dbe] text-white' : 'bg-[#111] border border-white/10 text-gray-400 hover:text-white'
              }`}>
              {a}
            </button>
          ))}
        </div>
        {filtered.length === 0 && <p className="text-gray-600 text-sm">Nenhuma foto neste álbum.</p>}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {filtered.map(foto => (
            <div key={foto.id} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10">
              <img src={foto.url} alt={foto.nome} className="w-full h-full object-cover" />
              <button onClick={() => handleDelete(foto)}
                className="absolute top-2 right-2 bg-black/70 text-gray-400 hover:text-red-400 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <FaTrash size={11} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
