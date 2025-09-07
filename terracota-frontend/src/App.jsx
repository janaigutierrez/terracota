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
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
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
        <Layout>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/politica-privacitat" element={<PrivacyPolicy />} />
              <Route path="/condicions" element={<TermsConditions />} />
              <Route path="/avis-legal" element={<LegalNotice />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              {/* Rutes admin */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </AnimatePresence>
        </Layout>
      </Router>
    </LanguageProvider>
  )
}

export default App