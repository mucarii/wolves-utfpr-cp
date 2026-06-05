import { FaMapMarkerAlt, FaClock } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import { WolvesLogo } from './Navbar'
import SocialLinks from './SocialLinks'

const footerLinks = {
  Clube: [
    { label: 'Sobre o Time', path: '/time' },
    { label: 'Extensão UTFPR', path: '/extensao' },
    { label: 'Contato', path: '/contato' },
  ],
  Esporte: [
    { label: 'O Time', path: '/time' },
    { label: 'Modalidades', path: '/modalidades' },
    { label: 'Treinos', path: '/treinos' },
  ],
  Torcedor: [
    { label: 'Loja Oficial', path: '/loja' },
    { label: 'Notícias', path: '/noticias' },
    { label: 'Projetos Comunitários', path: '/extensao' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <NavLink to="/" className="inline-flex items-center gap-4 mb-6">
              <WolvesLogo size={64} />
              <div>
                <div className="text-white font-black text-lg uppercase tracking-widest leading-tight">Wolves</div>
                <div className="text-[#ffc501] font-black text-lg uppercase tracking-widest leading-tight">UTFPR-CP</div>
                <div className="text-gray-500 text-[10px] uppercase tracking-widest">Campus Cornélio Procópio, PR</div>
              </div>
            </NavLink>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-xs">
              Projeto de extensão da UTFPR — Campus Cornélio Procópio. Futebol Americano e Flag Football.
            </p>
            <img
              src="/utfpr-logo-white.png"
              alt="UTFPR"
              className="h-8 object-contain mb-4 opacity-60 hover:opacity-100 transition-opacity"
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <SocialLinks size={20} className="mb-4" />
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-5">{title}</h4>
              <ul className="space-y-3">
                {links.map(({ label, path }) => (
                  <li key={label}>
                    <NavLink to={path} className="text-gray-400 hover:text-[#0c4dbe] text-sm transition-colors">
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Info row */}
        <div className="border-t border-white/10 pt-8 pb-6 grid sm:grid-cols-3 gap-5">
          <div className="flex items-start gap-3 text-gray-400 text-sm">
            <FaMapMarkerAlt size={14} className="text-[#0c4dbe] mt-0.5 shrink-0" />
            <span>UTFPR — Cornélio Procópio, PR, Brasil</span>
          </div>
          <div className="flex items-start gap-3 text-gray-400 text-sm">
            <FaClock size={14} className="text-[#0c4dbe] mt-0.5 shrink-0" />
            <span>Ter &amp; Qui 17h30 &nbsp;|&nbsp; Sáb 09h</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-600 text-xs">
            © 2026 Wolves UTFPR-CP. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            {['Privacidade', 'Termos de Uso'].map(item => (
              <span key={item} className="text-gray-600 hover:text-gray-400 text-xs cursor-pointer transition-colors">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
