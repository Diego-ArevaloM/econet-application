import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './app/globals.css'
import Header from './components/header'
import Footer from './components/footer'
import Home from './app/page'
import Catalogo from './app/catalogo/page'
import ProductsPage from './app/catalogo/[id]/page'
import ProfilePage from './app/perfil/page'
import AcercaDe from './app/paginas/acerca-de'
import Registro from './app/registro/registro'
import Login from './app/login/login'
import CambiarContrasena from './app/cambiar-contrasena/cambiar-contrasena'
import ProductoVista from './app/producto/ProductoVista'
import ProductoPopup from './components/ProductoPopup'


function Layout() {
  const location = useLocation();

  const hideLayout = ["/registro", "/login", "/cambiar-contrasena", "/producto-popup", "/producto-vista"];

  const shouldHide = hideLayout.includes(location.pathname);


  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!shouldHide && <Header />}
      <main className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/catalogo/:id" element={<ProductsPage />} />
          <Route path="/acerca-de" element={<AcercaDe />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cambiar-contrasena" element={<CambiarContrasena />} />
          <Route path="/producto-vista" element={<ProductoVista />} />
          <Route path="/producto-popup" element={<ProductoPopup />} />
        </Routes>
      </main>
      {!shouldHide && <Footer />}
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </StrictMode>
);
