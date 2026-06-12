import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import AdminNoticias from './AdminNoticias'
import AdminEventos from './AdminEventos'
import AdminFotos from './AdminFotos'
import AdminJogadores from './AdminJogadores'
import AdminLoja from './AdminLoja'
import AdminContato from './AdminContato'
import AdminDiretoria from './AdminDiretoria'
import AdminTreinos from './AdminTreinos'
import AdminModalidades from './AdminModalidades'
import AdminExtensao from './AdminExtensao'
import { FaNewspaper, FaCalendarAlt, FaImages, FaSignOutAlt, FaUsers, FaShoppingBag, FaAddressCard, FaStar, FaFootballBall, FaLayerGroup, FaUniversity } from 'react-icons/fa'
import { WolvesLogo } from '../../components/Navbar'

const tabs = [
  { id: 'noticias',    label: 'Notícias',    icon: FaNewspaper,   component: AdminNoticias },
  { id: 'eventos',     label: 'Eventos',     icon: FaCalendarAlt, component: AdminEventos },
  { id: 'jogadores',   label: 'Jogadores',   icon: FaUsers,       component: AdminJogadores },
  { id: 'loja',        label: 'Loja',        icon: FaShoppingBag, component: AdminLoja },
  { id: 'fotos',       label: 'Fotos',       icon: FaImages,      component: AdminFotos },
  { id: 'diretoria',   label: 'Diretoria',   icon: FaStar,        component: AdminDiretoria },
  { id: 'treinos',     label: 'Treinos',     icon: FaFootballBall, component: AdminTreinos },
  { id: 'modalidades', label: 'Modalidades', icon: FaLayerGroup,  component: AdminModalidades },
  { id: 'extensao',    label: 'Extensão',    icon: FaUniversity,  component: AdminExtensao },
  { id: 'contato',     label: 'Contato',     icon: FaAddressCard, component: AdminContato },
]

export default function AdminDashboard() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('noticias')

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Header */}
      <header className="bg-[#0a0a0a] border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <WolvesLogo size={40} />
          <div>
            <div className="text-white font-black text-sm uppercase tracking-widest">Painel Admin</div>
            <div className="text-gray-500 text-xs">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <FaSignOutAlt size={14} />
          Sair
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Tabs — scrollable horizontally */}
        <div className="mb-8 bg-[#111] border border-white/10 rounded-2xl p-1.5 overflow-x-auto">
          <div className="flex gap-1.5 min-w-max">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors whitespace-nowrap ${
                  activeTab === id
                    ? 'bg-[#0c4dbe] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  )
}
