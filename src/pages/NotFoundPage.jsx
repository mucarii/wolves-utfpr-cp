import { NavLink } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import { FaHome, FaFootballBall } from 'react-icons/fa'

export default function NotFoundPage() {
  usePageTitle('Página não encontrada')
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <FaFootballBall size={48} className="text-[#0c4dbe] opacity-40 mb-6" />
      <h1 className="text-8xl font-black text-white mb-2">404</h1>
      <p className="text-gray-400 text-lg mb-8">Essa página saiu de campo e não voltou mais.</p>
      <NavLink
        to="/"
        className="btn-primary px-6 py-3 rounded-xl text-white font-bold text-sm uppercase tracking-wide flex items-center gap-2"
      >
        <FaHome size={14} /> Voltar para a Home
      </NavLink>
    </div>
  )
}
