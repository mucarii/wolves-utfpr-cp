import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import AdminNoticias from './AdminNoticias'
import AdminEventos from './AdminEventos'
import AdminFotos from './AdminFotos'
import { FaNewspaper, FaCalendarAlt, FaImages, FaSignOutAlt } from 'react-icons/fa'
import { WolvesLogo } from '../../components/Navbar'

const tabs = [
  { id: 'noticias', label: 'Notícias', icon: FaNewspaper, component: AdminNoticias },
  { id: 'eventos', label: 'Eventos', icon: FaCalendarAlt, component: AdminEventos },
  { id: 'fotos', label: 'Fotos', icon: FaImages, component: AdminFotos },
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
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-[#111] border border-white/10 rounded-2xl p-1.5">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wide transition-colors ${
                activeTab === id
                  ? 'bg-[#0c4dbe] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  )
}
