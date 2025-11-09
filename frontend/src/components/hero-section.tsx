import { Link } from 'react-router-dom';


export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/5 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Image */}
        <div className="relative h-96 sm:h-[500px] rounded-2xl overflow-hidden mb-12">
          <img 
            src="https://image.jimcdn.com/app/cms/image/transf/none/path/s87b01a904e649b95/image/iadc2b8cf1b8dad91/version/1628554502/image.png" 
            alt="Hero fragrance" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Side - Discover Fragrance */}
          <div className="space-y-8">
            <h1 className="text-5xl sm:text-6xl font-serif font-bold text-foreground mb-6">
              Descubre tu producto ideal
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Econet es una plataforma web colaborativa que permite a los usuarios explorar, evaluar y compartir experiencias sobre productos naturistas.
              Su objetivo es facilitar decisiones informadas mediante un sistema de reseñas con criterios como efectividad terapéutica, zonas afectadas y relación precio–valor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
            <Link 
                to="/catalogo"
                className="px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition text-center"
            >
                Explorar catálogo
            </Link>
            <Link 
                to="/acerca-de"
                className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition text-center"
            >
                Aprender más
            </Link>
            </div>
          </div>

          {/* Right Side - Encyclopedia */}
          <div className="w-full">
            <div className="bg-gradient-to-br from-secondary/30 to-accent/20 rounded-xl p-8 border border-border h-full">
              <h3 className="text-2xl font-serif font-bold text-foreground mb-8">Enciclopedia de Fragancias</h3>
              <div className="space-y-6">
                {/* Productos Stat */}
                <div className="border-b border-border pb-4">
                  <p className="text-foreground font-semibold mb-1">Productos</p>
                  <span className="text-3xl font-bold text-primary">45,230</span>
                </div>
                {/* Reseñas Stat */}
                <div className="border-b border-border pb-4">
                  <p className="text-foreground font-semibold mb-1">Reseñas</p>
                  <span className="text-3xl font-bold text-primary">892,400</span>
                </div>
                {/* Usuarios Stat */}
                <div>
                  <p className="text-foreground font-semibold mb-1">Usuarios</p>
                  <span className="text-3xl font-bold text-primary">156,780</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}