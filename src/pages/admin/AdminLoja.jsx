import { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, orderBy, query } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../../firebase'
import { FaTrash, FaPlus, FaImage, FaTimes, FaEdit, FaCheck } from 'react-icons/fa'

const categories = ['Uniforme', 'Treino', 'Acessório', 'Equipamento', 'Outro']
const badges = ['', 'Lançamento', 'Mais Vendido', 'Novo', 'Promoção', 'Últimas unidades']
const empty = { nome: '', preco: '', categoria: 'Uniforme', badge: '', descricao: '' }

export default function AdminLoja() {
  const [produtos, setProdutos] = useState([])
  const [form, setForm] = useState(empty)
  const [imgFile, setImgFile] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [editingPrice, setEditingPrice] = useState(null)
  const [newPrice, setNewPrice] = useState('')

  const load = async () => {
    const q = query(collection(db, 'produtos'), orderBy('criadoEm', 'desc'))
    const snap = await getDocs(q)
    setProdutos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
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
    const storageRef = ref(storage, `produtos/${Date.now()}_${file.name}`)
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
    await addDoc(collection(db, 'produtos'), { ...form, ...imgData, criadoEm: new Date() })
    setForm(empty)
    clearImg()
    setProgress(0)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    await load()
    setLoading(false)
  }

  const handleDelete = async (p) => {
    if (!confirm(`Remover "${p.nome}"?`)) return
    if (p.storageRef) {
      try { await deleteObject(ref(storage, p.storageRef)) } catch {}
    }
    await deleteDoc(doc(db, 'produtos', p.id))
    await load()
  }

  const handleSavePrice = async (id) => {
    if (!newPrice) return
    await updateDoc(doc(db, 'produtos', id), { preco: newPrice })
    setEditingPrice(null)
    setNewPrice('')
    await load()
  }

  return (
    <div className="space-y-8">
      {/* Form */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
        <h2 className="text-white font-black text-lg mb-5 uppercase tracking-wide">Novo Produto</h2>
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl px-4 py-3 mb-4">
            Produto adicionado com sucesso!
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Nome do produto</label>
              <input
                value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                required className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe]"
                placeholder="Camisa Oficial 2026"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Preço</label>
              <input
                value={form.preco} onChange={e => setForm(f => ({ ...f, preco: e.target.value }))}
                required className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe]"
                placeholder="R$ 249,90"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Categoria</label>
              <select
                value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe]"
              >
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Badge (opcional)</label>
              <select
                value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe]"
              >
                {badges.map(b => <option key={b} value={b}>{b || '— Sem badge —'}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Descrição (opcional)</label>
            <input
              value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0c4dbe]"
              placeholder="Detalhes do produto..."
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold block mb-2">Foto do produto (opcional)</label>
            {imgPreview ? (
              <div className="relative w-40 rounded-xl overflow-hidden border border-white/10">
                <img src={imgPreview} alt="preview" className="w-full aspect-square object-cover" />
                <button type="button" onClick={clearImg}
                  className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-black text-white p-1 rounded-lg transition-colors">
                  <FaTimes size={11} />
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
            {loading ? 'Salvando...' : 'Adicionar Produto'}
          </button>
        </form>
      </div>

      {/* Product list */}
      <div className="space-y-3">
        <h3 className="text-gray-400 text-xs uppercase tracking-widest font-semibold">Produtos na loja ({produtos.length})</h3>
        {produtos.length === 0 && <p className="text-gray-600 text-sm">Nenhum produto cadastrado ainda.</p>}
        {produtos.map(p => (
          <div key={p.id} className="bg-[#111] border border-white/10 rounded-xl overflow-hidden flex items-stretch">
            {p.url
              ? <img src={p.url} alt={p.nome} className="w-20 object-cover shrink-0" />
              : <div className="w-20 bg-[#0c4dbe]/10 flex items-center justify-center shrink-0">
                  <span className="text-[#0c4dbe] text-2xl font-black opacity-30">W</span>
                </div>
            }
            <div className="flex-1 px-5 py-4 flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-white font-semibold text-sm">{p.nome}</p>
                  {p.badge && (
                    <span className="bg-[#0c4dbe] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{p.badge}</span>
                  )}
                </div>
                <p className="text-gray-500 text-xs">{p.categoria}</p>
              </div>

              {/* Editable price */}
              <div className="flex items-center gap-2 shrink-0">
                {editingPrice === p.id ? (
                  <>
                    <input
                      value={newPrice}
                      onChange={e => setNewPrice(e.target.value)}
                      className="w-28 bg-black border border-[#0c4dbe] rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none"
                      placeholder="R$ 0,00"
                      autoFocus
                    />
                    <button onClick={() => handleSavePrice(p.id)}
                      className="text-green-400 hover:text-green-300 transition-colors">
                      <FaCheck size={13} />
                    </button>
                    <button onClick={() => setEditingPrice(null)}
                      className="text-gray-500 hover:text-gray-300 transition-colors">
                      <FaTimes size={13} />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-[#0c4dbe] font-black text-sm">{p.preco}</span>
                    <button onClick={() => { setEditingPrice(p.id); setNewPrice(p.preco) }}
                      className="text-gray-500 hover:text-[#0c4dbe] transition-colors">
                      <FaEdit size={13} />
                    </button>
                  </>
                )}
              </div>

              <button onClick={() => handleDelete(p)}
                className="text-gray-600 hover:text-red-400 transition-colors shrink-0">
                <FaTrash size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
