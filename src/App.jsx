import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { LanguageProvider } from './hooks/useLanguage.jsx'
import Layout from './components/layout/Layout'
import Home from './pages/Home.jsx'
import About from './pages/About'
import NotFound from './pages/NotFound'
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
            </Routes>
          </AnimatePresence>
        </Layout>
      </Router>
    </LanguageProvider>
  )
}

export default App