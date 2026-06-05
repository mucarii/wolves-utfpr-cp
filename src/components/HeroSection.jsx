import { useState, useEffect, useCallback } from 'react'

function PhotoSlide({ src, overlay = 'from-black/70 via-black/30 to-transparent' }) {
  return (
    <div className="absolute inset-0">
      <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
      <div className={`absolute inset-0 bg-gradient-to-t ${overlay}`} />
    </div>
  )
}

const slides = [
  {
    id: 1,
    title: 'Wolves UTFPR-CP na chuva — raça e determinação em cada jogo',
    category: 'JOGO',
    accent: '#0c4dbe',
    visual: <PhotoSlide src="/time/team-0.jpg" />,
  },
  {
    id: 2,
    title: 'Equipe completa em campo — Wolves UTFPR-CP em temporada de resultados',
    category: 'TIME',
    accent: '#ffc501',
    visual: <PhotoSlide src="/time/team-1.jpg" overlay="from-black/75 via-black/25 to-transparent" />,
  },
  {
    id: 3,
    title: 'Treinos abertos na UTFPR-CP — Terça, Quinta às 17h30 e Sábado às 09h',
    category: 'VENHA JOGAR',
    accent: '#0c4dbe',
    visual: <PhotoSlide src="/time/team-2.jpg" />,
  },
  {
    id: 4,
    title: 'Wolves UTFPR-CP recebe rival no campo da universidade — futebol americano em Cornélio Procópio',
    category: 'JOGO EM CASA',
    accent: '#0c4dbe',
    visual: <PhotoSlide src="/time/team-3.jpg" />,
  },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const goTo = useCallback((idx) => {
    if (animating || idx === current) return
    setAnimating(true)
    setTimeout(() => {
      setCurrent(idx)
      setAnimating(false)
    }, 200)
  }, [animating, current])

  useEffect(() => {
    const id = setInterval(() => {
      goTo((current + 1) % slides.length)
    }, 5000)
    return () => clearInterval(id)
  }, [current, goTo])

  const slide = slides[current]

  return (
    <section className="relative w-full" style={{ marginTop: '70px' }}>
      {/* Slide area */}
      <div
        className="relative w-full overflow-hidden bg-black"
        style={{ height: 'min(560px, 60vh)' }}
      >
        {/* Visual */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: animating ? 0 : 1 }}
        >
          {slide.visual}
        </div>

        {/* Category badge top-left */}
        <div className="absolute top-6 left-8 z-20">
          <span
            className="text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full"
            style={{ background: slide.accent, color: 'white' }}
          >
            {slide.category}
          </span>
        </div>
      </div>

      {/* Caption bar — identical to Corinthians layout */}
      <div className="bg-black px-6 sm:px-10 py-4 flex items-center justify-between min-h-[56px]">
        <p
          className="text-white font-semibold text-sm sm:text-base leading-snug transition-opacity duration-300 max-w-3xl"
          style={{ opacity: animating ? 0 : 1 }}
        >
          {slide.title}
        </p>
      </div>

      {/* Dots navigation */}
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
