import { NavLink } from 'react-router-dom'

const tabs = [
  { label: 'Home', path: '/' },
  { label: 'Time', path: '/time' },
  { label: 'Modalidades', path: '/modalidades' },
  { label: 'Loja', path: '/loja' },
  { label: 'Notícias', path: '/noticias' },
  { label: 'Contato', path: '/contato' },
]

export default function NavigationTabs() {
  return (
    <div className="sticky top-16 z-40 bg-[#111]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          {tabs.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `px-5 py-4 text-sm font-semibold uppercase tracking-wider border-b-2 transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'border-[#0c4dbe] text-[#0c4dbe]'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-white/30'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}
