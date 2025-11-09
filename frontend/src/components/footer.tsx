import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-foreground mb-4">Sobre Fragrantica</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-primary transition">
                  Acerca de nosotros
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/press" className="hover:text-primary transition">
                  Prensa
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-4">Categorías</h3>
            <ul className="space-y-2 text-muted-foreground">

              {/* <li>
                <Link to="/unisex" className="hover:text-primary transition">
                  Unisex
                </Link>
              </li> */}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-4">Comunidad</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link to="/forums" className="hover:text-primary transition">
                  Foros
                </Link>
              </li>
              <li>
                <Link to="/users" className="hover:text-primary transition">
                  Usuarios
                </Link>
              </li>
              <li>
                <Link to="/trending" className="hover:text-primary transition">
                  Trending
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link to="/privacy" className="hover:text-primary transition">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary transition">
                  Términos
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-primary transition">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>© 2025 Econet. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}