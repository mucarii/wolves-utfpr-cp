import { useEffect, useState, useCallback } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import usePageTitle from '../hooks/usePageTitle'
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

function Lightbox({ fotos, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  const foto = fotos[index]

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Fechar"
        className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10 p-2"
      >
        <FaTimes size={22} />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/40 text-sm z-10">
        {index + 1} / {fotos.length}
      </div>

      {/* Prev */}
      {fotos.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); onPrev() }}
          aria-label="Anterior"
          className="absolute left-3 sm:left-6 text-white/60 hover:text-white transition-colors z-10 p-3"
        >
          <FaChevronLeft size={24} />
        </button>
      )}

      {/* Image */}
      <img
        src={foto.url}
        alt={foto.album || ''}
        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
        onClick={e => e.stopPropagation()}
      />

      {/* Next */}
      {fotos.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); onNext() }}
          aria-label="Próxima"
          className="absolute right-3 sm:right-6 text-white/60 hover:text-white transition-colors z-10 p-3"
        >
          <FaChevronRight size={24} />
        </button>
      )}

      {/* Album label */}
      {foto.album && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs uppercase tracking-widest">
          {foto.album}
        </div>
      )}
    </div>
  )
}

export default function FotosPage() {
  usePageTitle('Fotos')
  const [fotos, setFotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeAlbum, setActiveAlbum] = useState('Todos')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(query(collection(db, 'fotos'), orderBy('criadoEm', 'desc')))
        setFotos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch {
        setError('Não foi possível carregar as fotos.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const albums = ['Todos', ...Array.from(new Set(fotos.map(f => f.album).filter(Boolean)))]
  const filtered = activeAlbum === 'Todos' ? fotos : fotos.filter(f => f.album === activeAlbum)

  const openLightbox = (idx) => setLightboxIndex(idx)
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prevPhoto = useCallback(() => setLightboxIndex(i => (i - 1 + filtered.length) % filtered.length), [filtered.length])
  const nextPhoto = useCallback(() => setLightboxIndex(i => (i + 1) % filtered.length), [filtered.length])

  return (
    <div className="page-enter pt-8 pb-20 px-6 max-w-7xl mx-auto w-full">
      {lightboxIndex !== null && (
        <Lightbox
          fotos={filtered}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}

      <div className="mb-10">
        <span className="text-[#0c4dbe] text-xs font-bold uppercase tracking-widest">Galeria</span>
        <h1 className="text-4xl md:text-5xl font-black text-white mt-2">Fotos</h1>
      </div>

      {/* Album filter */}
      {albums.length > 1 && (
        <div className="flex gap-2 flex-wrap mb-8">
          {albums.map(a => (
            <button key={a} onClick={() => setActiveAlbum(a)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeAlbum === a
                  ? 'bg-[#0c4dbe] text-white'
                  : 'bg-[#111] border border-white/10 text-gray-400 hover:text-white hover:border-white/30'
              }`}>
              {a}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-white/5 animate-pulse break-inside-avoid"
              style={{ height: `${140 + (i % 3) * 60}px` }} />
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-5 py-4">
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-gray-500 text-center py-20">Nenhuma foto disponível ainda.</p>
      )}

      {!loading && filtered.length > 0 && (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {filtered.map((f, i) => (
            <div
              key={f.id}
              className="break-inside-avoid rounded-xl overflow-hidden cursor-pointer group relative"
              onClick={() => openLightbox(i)}
            >
              <img
                src={f.url}
                alt={f.album || 'Foto'}
                loading="lazy"
                className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 rounded-xl" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
