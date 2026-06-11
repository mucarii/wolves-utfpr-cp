import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { useParams, NavLink } from 'react-router-dom'
import { db } from '../firebase'
import usePageTitle from '../hooks/usePageTitle'
import { FaArrowLeft, FaCalendarAlt } from 'react-icons/fa'
import { CAT_BADGE, CAT_BG } from '../constants'

function formatDate(val) {
  if (!val) return ''
  const d = val.toDate ? val.toDate() : new Date(val)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function NoticiaDetalhe() {
  const { id } = useParams()
  const [noticia, setNoticia] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  usePageTitle(noticia?.titulo)

  useEffect(() => {
    getDoc(doc(db, 'noticias', id))
      .then(snap => {
        if (snap.exists()) setNoticia({ id: snap.id, ...snap.data() })
        else setError('Notícia não encontrada.')
      })
      .catch(() => setError('Não foi possível carregar a notícia.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="page-enter pt-8 pb-20 px-6 max-w-3xl mx-auto w-full">
      <div className="h-4 w-20 bg-white/10 rounded-full mb-8 animate-pulse" />
      <div className="h-72 bg-white/5 rounded-2xl mb-8 animate-pulse" />
      <div className="space-y-3">
        <div className="h-8 bg-white/10 rounded-xl w-3/4 animate-pulse" />
        <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
        <div className="h-4 bg-white/5 rounded w-2/3 animate-pulse" />
      </div>
    </div>
  )

  if (error || !noticia) return (
    <div className="page-enter pt-20 pb-20 px-6 max-w-3xl mx-auto w-full text-center">
      <p className="text-gray-400 mb-6">{error || 'Notícia não encontrada.'}</p>
      <NavLink to="/noticias" className="text-[#0c4dbe] hover:underline text-sm">
        ← Voltar para notícias
      </NavLink>
    </div>
  )

  return (
    <article className="page-enter pt-8 pb-20 px-6 max-w-3xl mx-auto w-full">
      <NavLink
        to="/noticias"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors mb-8"
      >
        <FaArrowLeft size={12} /> Notícias
      </NavLink>

      {noticia.url ? (
        <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
          <img src={noticia.url} alt={noticia.titulo} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <span className={`absolute top-5 left-5 ${CAT_BADGE[noticia.categoria] || 'bg-gray-600'} text-white text-xs font-bold px-3 py-1 rounded-full`}>
            {noticia.categoria}
          </span>
        </div>
      ) : (
        <div className={`w-full h-20 rounded-2xl bg-gradient-to-br ${CAT_BG[noticia.categoria] || 'from-gray-800 to-gray-950'} flex items-center px-6 mb-8`}>
          <span className={`${CAT_BADGE[noticia.categoria] || 'bg-gray-600'} text-white text-xs font-bold px-3 py-1 rounded-full`}>
            {noticia.categoria}
          </span>
        </div>
      )}

      <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-4">
        <FaCalendarAlt size={10} /> {formatDate(noticia.criadoEm)}
      </div>

      <h1 className="text-white font-black text-3xl md:text-4xl leading-tight mb-5">
        {noticia.titulo}
      </h1>

      {noticia.resumo && (
        <p className="text-gray-300 text-lg font-medium mb-8 leading-relaxed border-l-4 border-[#0c4dbe] pl-5">
          {noticia.resumo}
        </p>
      )}

      {noticia.conteudo && (
        <div className="text-gray-400 text-base leading-relaxed whitespace-pre-wrap">
          {noticia.conteudo}
        </div>
      )}
    </article>
  )
}
