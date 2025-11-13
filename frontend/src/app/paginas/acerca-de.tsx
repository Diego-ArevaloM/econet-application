import { Link, useNavigate } from "react-router-dom";

export default function AcercaDe() {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/catalogo");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative bg-background py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo Econet */}
        <div className="mb-10">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Placeholder_view_vector.svg"
            alt="Logo Econet"
            className="mx-auto w-24 h-24 object-contain opacity-90"
          />
        </div>

        {/* Título principal */}
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-6">
          Acerca de <span className="text-primary">Econet</span>
        </h1>

        {/* Descripción del proyecto */}
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-12">
          <strong>Econet</strong> es una plataforma web desarrollada como parte del{" "}
          <em>Proyecto de Interacción Humano–Computadora</em> de la
          <strong> Universidad San Marcos</strong>.  
          Su propósito es ofrecer un espacio digital que promueva el conocimiento y consumo consciente de productos naturistas,
          permitiendo a los usuarios descubrir, evaluar y compartir experiencias de manera colaborativa.
        </p>

        {/* Funcionalidades principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-foreground mb-3">Catálogo Interactivo</h3>
            <p className="text-muted-foreground">
              Explora productos naturistas organizados por categorías, ingredientes y beneficios terapéuticos.
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-foreground mb-3">Sistema de Reseñas</h3>
            <p className="text-muted-foreground">
              Califica la efectividad, calidad y relación precio–valor para orientar las decisiones de otros usuarios.
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-foreground mb-3">Aprendizaje Colaborativo</h3>
            <p className="text-muted-foreground">
              Participa en una comunidad que fomenta la educación y el intercambio de experiencias sobre bienestar natural.
            </p>
          </div>
        </div>

        {/* Equipo desarrollador */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary/10 border border-border rounded-2xl p-8 max-w-4xl mx-auto shadow-sm mb-10">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
            Equipo desarrollador
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="text-center">
                <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-2 flex items-center justify-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                    alt={`Integrante ${num}`}
                    className="rounded-full w-20 h-20 object-cover"
                  />
                </div>
                <p className="text-foreground font-semibold text-sm">Integrante {num}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Botón explorar */}
        <div className="mt-6 mb-2">
          <button
            onClick={handleExploreClick}
            className="px-10 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition text-center"
          >
            Explorar catálogo
          </button>
        </div>
      </div>
    </section>
  );
}
