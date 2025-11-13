import { Link } from "react-router-dom";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Botón volver al inicio */}
        <div className="w-full flex justify-center mb-10">
          <button
            onClick={scrollToTop}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-all duration-200 hover:scale-105 text-sm sm:text-base"
          >
            Volver al inicio
          </button>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Sección izquierda: Sobre Econet */}
          <div>
            <h3 className="font-bold text-foreground mb-4 text-lg">Sobre Econet</h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <Link to="/acerca-de" className="hover:text-primary transition">
                  Acerca de nosotros
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="hover:text-primary transition">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link to="/terminos" className="hover:text-primary transition">
                  Términos
                </Link>
              </li>
            </ul>
          </div>

          {/* Espacio central */}
          <div className="hidden md:block" />

          {/* Sección derecha: Índice */}
          <div>
            <h3 className="font-bold text-foreground mb-4 text-lg">Índice</h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <Link to="/" className="hover:text-primary transition">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="hover:text-primary transition">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/perfil" className="hover:text-primary transition">
                  Perfil
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
          <p>© 2025 Econet. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
