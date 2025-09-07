import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { LanguageProvider } from './hooks/useLanguage.jsx'
import Layout from './components/layout/Layout'
import Home from './pages/Home.jsx'
import About from './pages/About'
import NotFound from './pages/NotFound'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import TermsConditions from './pages/TermsConditions.jsx'
import LegalNotice from './pages/LegalNotice.jsx'
import CookiePolicy from './pages/CookiePolicy.jsx'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
// Futures pàgines admin
import AdminReserves from './pages/admin/AdminReserves'
import AdminTPV from './pages/admin/AdminTPV'
import AdminInventory from './pages/admin/AdminInventory'
import AdminClients from './pages/admin/AdminClients'
import AdminCash from './pages/admin/AdminCash'
import AdminReports from './pages/admin/AdminReports'
import AdminSettings from './pages/admin/AdminSettings'
import './styles/globals.css'

function App() {
  return (
    <LanguageProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <AnimatePresence mode="wait">
          <Routes>
            {/* Rutes públiques amb Layout normal */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/politica-privacitat" element={<Layout><PrivacyPolicy /></Layout>} />
            <Route path="/condicions" element={<Layout><TermsConditions /></Layout>} />
            <Route path="/avis-legal" element={<Layout><LegalNotice /></Layout>} />
            <Route path="/cookies" element={<Layout><CookiePolicy /></Layout>} />

            {/* Ruta admin login (sense layout) */}
            <Route path="/admin" element={<AdminLogin />} />

            {/* Rutes admin amb AdminLayout (sense header públic) */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/reserves" element={<AdminReserves />} />
            <Route path="/admin/reserves/:id" element={<AdminReserves />} />
            <Route path="/admin/tpv" element={<AdminTPV />} />
            <Route path="/admin/inventari" element={<AdminInventory />} />
            <Route path="/admin/clients" element={<AdminClients />} />
            <Route path="/admin/clients/:id" element={<AdminClients />} />
            <Route path="/admin/caixa" element={<AdminCash />} />
            <Route path="/admin/informes" element={<AdminReports />} />
            <Route path="/admin/configuracio" element={<AdminSettings />} />

            {/* 404 amb layout normal */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </AnimatePresence>
      </Router>
    </LanguageProvider>
  )
}

export default App