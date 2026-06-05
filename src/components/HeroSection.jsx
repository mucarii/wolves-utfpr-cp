import { useState, useEffect, useCallback } from 'react'

const slides = [
  {
    id: 1,
    title: 'Wolves UTFPR-CP derrota rival e assume liderança do campeonato de tackle 2026',
    category: 'JOGO',
    bg: 'bg-gradient-to-br from-[#00102e] via-[#0a2a7a] to-black',
    accent: '#0c4dbe',
    visual: (
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* Simulated stadium atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        <div className="w-full h-full bg-gradient-to-br from-[#00102e] via-[#0c4dbe]/30 to-black" />
        {/* Player silhouettes */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-8 z-20 opacity-20">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-12 bg-white rounded-t-full" style={{ height: `${120 + i * 15}px` }} />
          ))}
        </div>
        {/* Big W watermark */}
        <span className="absolute text-[300px] font-black text-white/5 select-none leading-none z-0">W</span>
      </div>
    ),
  },
  {
    id: 2,
    title: 'Flag Football: equipe dos Wolves UTFPR-CP avança ao Campeonato Nacional',
    category: 'FLAG FOOTBALL',
    bg: 'bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#00102e]',
    accent: '#6b90d4',
    visual: (
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
        <div className="w-full h-full bg-gradient-to-br from-black via-[#00102e] to-[#0c4dbe]/20" />
        <span className="absolute inset-0 flex items-center justify-center text-[300px] font-black text-white/4 select-none leading-none">🏈</span>
      </div>
    ),
  },
  {
    id: 3,
    title: 'Treinos abertos na UTFPR CP — Terça, Quinta às 17h30 e Sábado às 09h',
    category: 'VENHA JOGAR',
    bg: 'bg-gradient-to-br from-[#00102e] to-black',
    accent: '#0c4dbe',
    visual: (
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
        <div className="w-full h-full"
          style={{
            background: 'radial-gradient(ellipse at 60% 50%, rgba(0,87,255,0.3) 0%, rgba(0,26,80,0.8) 50%, #000 100%)',
          }}
        />
        {/* Field lines */}
        <div className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, white 0px, white 2px, transparent 2px, transparent 60px)`,
          }}
        />
        <span className="absolute text-[300px] font-black text-white/4 select-none leading-none inset-0 flex items-center justify-center">W</span>
      </div>
    ),
  },
  {
    id: 4,
    title: 'Wolves UTFPR-CP: nova temporada, novos objetivos. Rumo ao Bowl 2026!',
    category: 'TEMPORADA 2026',
    bg: 'bg-black',
    accent: '#0c4dbe',
    visual: (
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        <div className="w-full h-full bg-gradient-to-br from-black via-[#0c4dbe]/15 to-black" />
        <span className="absolute text-[300px] font-black text-white/4 select-none leading-none inset-0 flex items-center justify-center">W</span>
      </div>
    ),
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
        className={`relative w-full overflow-hidden ${slide.bg}`}
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
