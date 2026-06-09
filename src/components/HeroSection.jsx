import { useState, useEffect, useCallback } from 'react'
import { collection, query, orderBy, limit, where, getDocs } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { db } from '../firebase'

const CAT_COLOR = {
  JOGO: '#2563eb',
  TREINO: '#4b5563',
  EVENTO: '#4338ca',
  'FLAG FOOTBALL': '#059669',
  'EXTENSÃO': '#ea580c',
  GERAL: '#4b5563',
}

const STATIC_SLIDES = [
  {
    id: 's1',
    title: 'Wolves UTFPR-CP na chuva — raça e determinação em cada jogo',
    category: 'JOGO',
    accent: '#0c4dbe',
    imgSrc: '/time/team-0.jpg',
  },
  {
    id: 's2',
    title: 'Equipe completa em campo — Wolves UTFPR-CP em temporada de resultados',
    category: 'TIME',
    accent: '#ffc501',
    imgSrc: '/time/team-1.jpg',
  },
  {
    id: 's3',
    title: 'Treinos abertos na UTFPR-CP — Terça, Quinta às 17h30 e Sábado às 09h',
    category: 'VENHA JOGAR',
    accent: '#0c4dbe',
    imgSrc: '/time/team-2.jpg',
  },
  {
    id: 's4',
    title: 'Wolves UTFPR-CP recebe rival no campo da universidade — futebol americano em Cornélio Procópio',
    category: 'JOGO EM CASA',
    accent: '#0c4dbe',
    imgSrc: '/time/team-3.jpg',
  },
]

function SlideVisual({ src }) {
  if (!src) return <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
  return (
    <div className="absolute inset-0">
      <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover object-center" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
    </div>
  )
}

export default function HeroSection() {
  const [slides, setSlides] = useState(STATIC_SLIDES)
  const [isNews, setIsNews] = useState(false)
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      try {
        // Prefer admin-pinned (destaque) noticias; no combined orderBy to avoid composite index
        let snap = await getDocs(
          query(collection(db, 'noticias'), where('destaque', '==', true), limit(5))
        )
        if (snap.empty) {
          snap = await getDocs(
            query(collection(db, 'noticias'), orderBy('criadoEm', 'desc'), limit(5))
          )
        }
        if (!snap.empty) {
          const items = snap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .sort((a, b) => (b.criadoEm?.seconds ?? 0) - (a.criadoEm?.seconds ?? 0))
          setSlides(items)
          setIsNews(true)
          setCurrent(0)
        }
      } catch {
        // keep static fallback on any Firestore error
      }
    }
    load()
  }, [])

  const goTo = useCallback((idx) => {
    if (animating || idx === current) return
    setAnimating(true)
    setTimeout(() => {
      setCurrent(idx)
      setAnimating(false)
    }, 200)
  }, [animating, current])

  useEffect(() => {
    const id = setInterval(() => goTo((current + 1) % slides.length), 5000)
    return () => clearInterval(id)
  }, [current, goTo, slides.length])

  const slide = slides[current]
  const title    = isNews ? slide.titulo    : slide.title
  const category = isNews ? slide.categoria : slide.category
  const imgSrc   = isNews ? slide.url       : slide.imgSrc
  const accent   = isNews ? (CAT_COLOR[category] ?? '#0c4dbe') : slide.accent

  return (
    <section className="relative w-full" style={{ marginTop: '70px' }}>
      <div
        className={`relative w-full overflow-hidden bg-black${isNews ? ' cursor-pointer' : ''}`}
        style={{ height: 'min(560px, 60vh)' }}
        onClick={() => isNews && navigate('/noticias')}
      >
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: animating ? 0 : 1 }}
        >
          <SlideVisual src={imgSrc} />
        </div>

        <div className="absolute top-6 left-8 z-20">
          <span
            className="text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full"
            style={{ background: accent, color: 'white' }}
          >
            {category}
          </span>
        </div>

      </div>

      <div
        className="bg-black px-6 sm:px-10 py-3 transition-opacity duration-300"
        style={{ opacity: animating ? 0 : 1 }}
      >
        <p className="text-white font-semibold text-sm sm:text-base leading-snug max-w-3xl">
          {title}
        </p>
        {isNews && slide.resumo && (
          <p className="text-gray-400 text-xs sm:text-sm leading-snug max-w-3xl mt-1 line-clamp-1">
            {slide.resumo}
          </p>
        )}
      </div>

      <div className="bg-black/90 flex items-center justify-center gap-2.5 py-3 border-t border-white/5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className="transition-all duration-300 rounded-full focus:outline-none"
            style={{
              width: i === current ? 28 : 10,
              height: 10,
              background: i === current ? '#ffc501' : 'rgba(255,255,255,0.25)',
            }}
          />
        ))}
      </div>
    </section>
  )
}
