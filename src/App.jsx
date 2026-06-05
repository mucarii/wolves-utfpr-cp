import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import TimePage from './pages/TimePage'
import ModalidadesPage from './pages/ModalidadesPage'
import LojaPage from './pages/LojaPage'
import NoticiasPage from './pages/NoticiasPage'
import ContatoPage from './pages/ContatoPage'
import TreinosPage from './pages/TreinosPage'
import ExtensaoPage from './pages/ExtensaoPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <main className="flex-1 pt-[70px]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/time" element={<TimePage />} />
            <Route path="/modalidades" element={<ModalidadesPage />} />
            <Route path="/loja" element={<LojaPage />} />
            <Route path="/noticias" element={<NoticiasPage />} />
            <Route path="/contato" element={<ContatoPage />} />
            <Route path="/treinos" element={<TreinosPage />} />
            <Route path="/extensao" element={<ExtensaoPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
