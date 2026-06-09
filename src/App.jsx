import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import HomePage from './pages/HomePage'
import TimePage from './pages/TimePage'
import ModalidadesPage from './pages/ModalidadesPage'
import LojaPage from './pages/LojaPage'
import NoticiasPage from './pages/NoticiasPage'
import ContatoPage from './pages/ContatoPage'
import TreinosPage from './pages/TreinosPage'
import ExtensaoPage from './pages/ExtensaoPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main className="flex-1 pt-[70px]">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <AuthProvider>
        <Routes>
          {/* Admin routes — sem navbar/footer */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Public routes */}
          <Route path="*" element={
            <PublicLayout>
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
            </PublicLayout>
          } />
        </Routes>
      </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
