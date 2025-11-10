import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './app/globals.css'
import Header from './components/header'
import Footer from './components/footer'
import Home from './app/page'
import Catalogo from './app/catalogo/page'
import ProductsPage from './app/catalogo/[id]/page'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/catalogo/:id" element={<ProductsPage />} /> ← Agrega esta ruta
            <Route path="/acerca-de" element={<div>Reviews Page</div>} />
            <Route path="/perfil" element={<div>Profile Page</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  </StrictMode>,
)