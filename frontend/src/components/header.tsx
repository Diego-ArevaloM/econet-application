import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMenuOpen(false); // cerrar menú en móvil
  };

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("/")}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">E</span>
            </div>
            <span className="font-serif text-xl font-bold text-foreground hidden sm:inline">
              Econet
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleNavClick("/")}
              className="text-foreground hover:text-primary transition-all duration-200 hover:scale-105 px-2 py-1 rounded-md hover:bg-muted/50"
            >
              Inicio
            </button>
            <button
              onClick={() => handleNavClick("/catalogo")}
              className="text-foreground hover:text-primary transition-all duration-200 hover:scale-105 px-2 py-1 rounded-md hover:bg-muted/50"
            >
              Catálogo
            </button>
            <button
              onClick={() => handleNavClick("/acerca-de")}
              className="text-foreground hover:text-primary transition-all duration-200 hover:scale-105 px-2 py-1 rounded-md hover:bg-muted/50"
            >
              Acerca de
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNavClick("/perfil")}
              className="p-2 hover:bg-muted rounded-[0.5rem] transition-all duration-200 hover:scale-105"
            >
              <User className="w-5 h-5 text-foreground" />
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-muted rounded-[0.5rem] transition-all duration-200 hover:scale-105"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            <button
              onClick={() => handleNavClick("/")}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition px-2"
            >
              Inicio
            </button>
            <button
              onClick={() => handleNavClick("/catalogo")}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition px-2"
            >
              Catálogo
            </button>
            <button
              onClick={() => handleNavClick("/acerca-de")}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition px-2"
            >
              Acerca de
            </button>
            <button
              onClick={() => handleNavClick("/perfil")}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition px-2"
            >
              Perfil
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
