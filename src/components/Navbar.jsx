import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { FaBars, FaTimes, FaSearch } from 'react-icons/fa'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase'
import SocialLinks from './SocialLinks'

const leftNav = [
  { label: 'Home', path: '/' },
  { label: 'Time', path: '/time' },
  { label: 'Modalidades', path: '/modalidades' },
  { label: 'Treinos', path: '/treinos' },
  { label: 'Eventos', path: '/eventos' },
]

const rightNav = [
  { label: 'Loja', path: '/loja' },
  { label: 'Fotos', path: '/fotos' },
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
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [noticias, setNoticias] = useState([])
  const [noticiasLoaded, setNoticiasLoaded] = useState(false)

  const searchInputRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
    setSearchQuery('')
  }, [location])

  useEffect(() => {
    if (!searchOpen) return
    setTimeout(() => searchInputRef.current?.focus(), 50)
    if (noticiasLoaded) return
    getDocs(query(collection(db, 'noticias'), orderBy('criadoEm', 'desc'), limit(50)))
      .then(snap => {
        setNoticias(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        setNoticiasLoaded(true)
      })
      .catch(() => {})
  }, [searchOpen, noticiasLoaded])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setSearchOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const q = searchQuery.toLowerCase().trim()
  const pageResults = allNav.filter(n => !q || n.label.toLowerCase().includes(q))
  const noticiaResults = q
    ? noticias
        .filter(n =>
          n.titulo?.toLowerCase().includes(q) ||
          n.resumo?.toLowerCase().includes(q) ||
          n.categoria?.toLowerCase().includes(q)
        )
        .slice(0, 4)
    : []
  const hasResults = pageResults.length > 0 || noticiaResults.length > 0

  const handleSearchResult = (path) => {
    navigate(path)
    setSearchOpen(false)
    setSearchQuery('')
  }

  const navLinkClass = ({ isActive }) =>
    `text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors duration-200 pb-0.5 border-b-2 ${
      isActive
        ? 'text-white border-[#ffc501]'
        : 'text-gray-300 border-transparent hover:text-white hover:border-white/40'
    }`

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${
          scrolled ? 'shadow-xl shadow-black/60' : ''
        }`}
      >
        {/* ── Top bar ── */}
        <div className="bg-black border-b border-white/10 h-10">
          <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-1.5 text-gray-400 hover:text-white text-[11px] uppercase tracking-widest transition-colors"
              >
                <FaSearch size={11} />
                Buscar
              </button>
              <span className="text-white/10">|</span>
              <span className="text-gray-500 text-[11px] uppercase tracking-widest hidden sm:block">
                UTFPR · Cornélio Procópio
              </span>
            </div>
            <SocialLinks size={14} />
          </div>
        </div>

        {/* ── Main nav bar ── */}
        <div className="bg-[#080808] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 flex items-center h-[60px] relative">

            <nav className="hidden lg:flex items-center gap-7 flex-1 justify-end pr-10">
              {leftNav.map(({ label, path }) => (
                <NavLink key={path} to={path} end={path === '/'} className={navLinkClass}>
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
              <NavLink to="/" aria-label="Wolves UTFPR-CP Home">
                <div className="drop-shadow-2xl hover:scale-105 transition-transform duration-300">
                  <WolvesLogo size={90} />
                </div>
              </NavLink>
            </div>

            <nav className="hidden lg:flex items-center gap-7 flex-1 justify-start pl-10">
              {rightNav.map(({ label, path }) => (
                <NavLink key={path + label} to={path} className={navLinkClass}>
                  {label}
                </NavLink>
              ))}
            </nav>

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

      {/* ── Search overlay ── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
              <FaSearch size={14} className="text-gray-500 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar páginas, notícias..."
                className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 focus:outline-none"
              />
              <button onClick={() => setSearchOpen(false)} aria-label="Fechar busca">
                <FaTimes size={14} className="text-gray-500 hover:text-white transition-colors" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto py-2">
              {pageResults.length > 0 && (
                <>
                  <p className="text-gray-600 text-[10px] uppercase tracking-widest px-5 py-2">Páginas</p>
                  {pageResults.map(({ label, path }) => (
                    <button
                      key={path}
                      onClick={() => handleSearchResult(path)}
                      className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-white/5 transition-colors text-left"
                    >
                      <span className="text-white text-sm">{label}</span>
                    </button>
                  ))}
                </>
              )}

              {noticiaResults.length > 0 && (
                <>
                  <p className="text-gray-600 text-[10px] uppercase tracking-widest px-5 pt-3 pb-2 border-t border-white/5 mt-1">Notícias</p>
                  {noticiaResults.map(n => (
                    <button
                      key={n.id}
                      onClick={() => handleSearchResult(`/noticias/${n.id}`)}
                      className="w-full flex items-start gap-3 px-5 py-2.5 hover:bg-white/5 transition-colors text-left"
                    >
                      {n.url && (
                        <img src={n.url} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{n.titulo}</p>
                        <p className="text-gray-500 text-xs">{n.categoria}</p>
                      </div>
                    </button>
                  ))}
                </>
              )}

              {q && !hasResults && (
                <p className="text-gray-600 text-sm text-center py-8">
                  Nenhum resultado para &ldquo;{searchQuery}&rdquo;
                </p>
              )}
            </div>

            <div className="px-5 py-2.5 border-t border-white/5">
              <p className="text-gray-700 text-[10px]">ESC para fechar</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
