import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { FaBars, FaTimes, FaSearch } from 'react-icons/fa'
import SocialLinks from './SocialLinks'

const leftNav = [
  { label: 'Home', path: '/' },
  { label: 'Time', path: '/time' },
  { label: 'Modalidades', path: '/modalidades' },
  { label: 'Treinos', path: '/treinos' },
]

const rightNav = [
  { label: 'Loja', path: '/loja' },
  { label: 'Extensão', path: '/extensao' },
  { label: 'Notícias', path: '/noticias' },
  { label: 'Contato', path: '/contato' },
]

const allNav = [...leftNav, ...rightNav]

function WolvesLogo({ size = 56 }) {
  const [imgFailed, setImgFailed] = useState(false)

  if (imgFailed) {
    return (
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="38" fill="#0c4dbe" stroke="#ffc501" strokeWidth="3"/>
        <path d="M40 12 L52 22 L56 36 L52 50 L40 58 L28 50 L24 36 L28 22 Z" fill="white" opacity="0.1"/>
        <text x="40" y="50" textAnchor="middle" fontSize="32" fontWeight="900" fontFamily="Arial Black, Arial" fill="white">W</text>
        <text x="40" y="66" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="Arial" fill="#ffc501" letterSpacing="2">UTFPR-CP</text>
      </svg>
    )
  }

  return (
    <img
      src="/wolves-logo.png"
      alt="Wolves UTFPR-CP"
      width={size}
      height={size}
      className="object-contain"
      onError={() => setImgFailed(true)}
    />
  )
}

export { WolvesLogo }

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  const navLinkClass = ({ isActive }) =>
    `text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors duration-200 pb-0.5 border-b-2 ${
      isActive
        ? 'text-white border-[#ffc501]'
        : 'text-gray-300 border-transparent hover:text-white hover:border-white/40'
    }`

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${
        scrolled ? 'shadow-xl shadow-black/60' : ''
      }`}
    >
      {/* ── Top bar ── */}
      <div className="bg-black border-b border-white/10 h-10">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          {/* left */}
          <div className="flex items-center gap-5">
            <button className="flex items-center gap-1.5 text-gray-400 hover:text-white text-[11px] uppercase tracking-widest transition-colors">
              <FaSearch size={11} />
              Buscar
            </button>
            <span className="text-white/10">|</span>
            <span className="text-gray-500 text-[11px] uppercase tracking-widest hidden sm:block">
              UTFPR · Cornélio Procópio
            </span>
          </div>
          {/* right */}
          <SocialLinks size={14} />
        </div>
      </div>

      {/* ── Main nav bar ── */}
      <div className="bg-[#080808] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex items-center h-[60px] relative">

          {/* Left nav — hidden on mobile */}
          <nav className="hidden lg:flex items-center gap-7 flex-1 justify-end pr-10">
            {leftNav.map(({ label, path }) => (
              <NavLink key={path} to={path} end={path === '/'} className={navLinkClass}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Centered logo — extends above into top bar */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
            <NavLink to="/" aria-label="Wolves UTFPR-CP Home">
              <div className="drop-shadow-2xl hover:scale-105 transition-transform duration-300">
                <WolvesLogo size={90} />
              </div>
            </NavLink>
          </div>

          {/* Right nav — hidden on mobile */}
          <nav className="hidden lg:flex items-center gap-7 flex-1 justify-start pl-10">
            {rightNav.map(({ label, path }) => (
              <NavLink key={path + label} to={path} className={navLinkClass}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile: logo left + hamburger right */}
          <div className="flex lg:hidden items-center justify-between w-full">
            <NavLink to="/" className="-mt-8">
              <WolvesLogo size={76} />
            </NavLink>
            <button
              onClick={() => setMenuOpen(p => !p)}
              className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 bg-[#0a0a0a] border-b border-white/10 ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="px-6 py-4 flex flex-col gap-1">
          {allNav.map(({ label, path }) => (
            <NavLink
              key={path + label}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `py-3 px-4 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors ${
                  isActive ? 'bg-[#0c4dbe] text-white' : 'text-gray-300 hover:bg-white/8 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-white/10 mt-2">
            <SocialLinks size={20} />
          </div>
        </nav>
      </div>
    </header>
  )
}
