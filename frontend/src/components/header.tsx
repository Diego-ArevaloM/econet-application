import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Heart, User, Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">E</span>
            </div>
            <span className="font-serif text-xl font-bold text-foreground hidden sm:inline">
              Econet
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-primary transition-all duration-200 hover:scale-105 px-2 py-1 rounded-md hover:bg-muted/50">
              Inicio
            </Link>
            <Link to="/catalogo" className="text-foreground hover:text-primary transition-all duration-200 hover:scale-105 px-2 py-1 rounded-md hover:bg-muted/50">
              Catálogo
            </Link>
            <Link to="/acerca-de" className="text-foreground hover:text-primary transition-all duration-200 hover:scale-105 px-2 py-1 rounded-md hover:bg-muted/50">
              Acerca de
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-muted rounded-[0.5rem] transition-all duration-200 hover:scale-105">
              <Search className="w-5 h-5 text-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded-[0.5rem] transition-all duration-200 hover:scale-105">
              <Heart className="w-5 h-5 text-foreground" />
            </button>
            <Link to="/perfil">
              <button className="p-2 hover:bg-muted rounded-[0.5rem] transition-all duration-200 hover:scale-105">
                <User className="w-5 h-5 text-foreground" />
              </button>
            </Link>

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
            <Link to="/fragrances" className="block py-2 text-foreground hover:text-primary transition">
              Fragancias
            </Link>
            <Link to="/reviews" className="block py-2 text-foreground hover:text-primary transition">
              Reseñas
            </Link>
            <Link to="/community" className="block py-2 text-foreground hover:text-primary transition">
              Comunidad
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}