"use client"

import { useState, useMemo } from "react"
import { useParams, Link } from 'react-router-dom'
import { Heart, Share2, ShoppingCart, Star, ChevronLeft, ThumbsUp, Activity, Scale, Droplet, Medal  } from "lucide-react"

const product = {
  id: 1,
  name: "Spirulina Premium",
  brand: "NaturaVita",
  image: "/spirulina-supplement.jpg",
  brandImage: "/naturavita-logo.jpg",
  rating: 5,
  reviews: 2430,
  type: "suplemento",
  objective: "energia",
  form: "capsulas",
  description:
    "La Spirulina Premium es un superalimento natural rico en proteínas, vitaminas y minerales esenciales. Perfecta para aumentar tu energía y vitalidad de forma natural y sostenible.",
  healthSeals: ["Certificado Orgánico", "Sin GMO", "Vegano"],
  additionalImages: ["/spirulina-supplement.jpg", "/spirulina-bottle.jpg", "/spirulina-powder.jpg"],
  affectedAreas: ["Energía general", "Sistema inmunológico"],
  metrics: {
    effectiveness: 5,
    valuePrice: 4,
    easeOfUse: 5,
    quality: 5,
  },
}

// Array completo de fragancias - deberías moverlo a un archivo separado como data/fragrances.ts
const allFragrances = [
  {
    id: 1,
    name: "Midnight Elegance",
    brand: "Luxury House",
    image: "/placeholder.svg?key=9zgnt",
    rating: 4.8,
    reviews: 2430,
    price: 89,
    category: "Floral",
    gender: "women",
    concentration: "Eau de Parfum",
    year: 2023,
    description:
      "Una fragancia sofisticada que captura la esencia de la medianoche con notas florales profundas y misterio. Perfecta para ocasiones especiales y tardes románticas.",
    topNotes: ["Bergamota", "Limón", "Pimienta rosa"],
    middleNotes: ["Jazmín", "Rosa", "Lirio"],
    baseNotes: ["Ambroxán", "Almizcares", "Vetiver"],
    longevity: "8-10 horas",
    sillage: "Fuerte",
    availability: "In Stock",
    sizes: [
      { ml: 30, price: 45 },
      { ml: 50, price: 65 },
      { ml: 100, price: 89 },
    ],
  },
  {
    id: 2,
    name: "Golden Hour",
    brand: "Premium Collection",
    image: "/placeholder.svg?key=tvinv",
    rating: 4.6,
    reviews: 1890,
    price: 75,
    category: "Ambroxan",
    gender: "unisex",
    concentration: "Eau de Toilette",
    year: 2023,
    description: "Captura la magia de la hora dorada con notas cálidas y envolventes que evocan atardeceres inolvidables.",
    topNotes: ["Naranja", "Bergamota", "Cardamomo"],
    middleNotes: ["Ambroxán", "Iris", "Violeta"],
    baseNotes: ["Ámbar", "Cedro", "Vainilla"],
    longevity: "6-8 horas",
    sillage: "Moderado",
    availability: "In Stock",
    sizes: [
      { ml: 30, price: 38 },
      { ml: 50, price: 55 },
      { ml: 100, price: 75 },
    ],
  },
  {
    id: 3,
    name: "Ocean Breeze",
    brand: "Fresh Scents",
    image: "/placeholder.svg?key=eowci",
    rating: 4.5,
    reviews: 1650,
    price: 65,
    category: "Citrus",
    gender: "men",
    concentration: "Eau de Toilette",
    year: 2022,
    description: "Frescura marina con toques cítricos que transportan a costas soleadas y brisas oceánicas.",
    topNotes: ["Limón", "Menta", "Sal marina"],
    middleNotes: ["Lavanda", "Geranio", "Romero"],
    baseNotes: ["Cedro", "Musgo", "Ámbar gris"],
    longevity: "5-7 horas",
    sillage: "Moderado",
    availability: "In Stock",
    sizes: [
      { ml: 30, price: 33 },
      { ml: 50, price: 48 },
      { ml: 100, price: 65 },
    ],
  },
]

export default function FragranceDetailPage() {
  const { id } = useParams()
  const [selectedSize, setSelectedSize] = useState(100)
  const [isFavorite, setIsFavorite] = useState(false)
  const [quantity, setQuantity] = useState(1)

  // Buscar la fragancia por ID
  const fragrance = useMemo(() => {
    return allFragrances.find(f => f.id === Number(id))
  }, [id])

  // Si no se encuentra la fragancia
  if (!fragrance) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Fragancia no encontrada</h1>
          <p className="text-muted-foreground mb-6">La fragancia que buscas no existe</p>
          <Link to="/catalogo" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition">
            Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  const sizePrice = fragrance.sizes.find((s) => s.ml === selectedSize)?.price || fragrance.price



  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: "María García",
      avatar: "M",
      date: "2024-01-15",
      time: "10:30",
      title: "Excelente para la energía",
      content: "He estado usando esta Spirulina por un mes y noto mucha más energía durante el día. Recomendado.",
      effectiveness: 5,
      valuePrice: 4,
      easeOfUse: 5,
      quality: 5,
    },
    {
      id: 2,
      author: "Juan López",
      avatar: "J",
      date: "2024-01-10",
      time: "14:20",
      title: "Muy bueno",
      content: "Calidad excelente, aunque el sabor tarda en acostumbrarse.",
      effectiveness: 4,
      valuePrice: 4,
      easeOfUse: 4,
      quality: 5,
    },
  ])

  const renderMetricIcon = (type: string) => {
    switch (type) {
      case "effectiveness":
        return <ThumbsUp className="w-6 h-6" />
      case "valuePrice":
        return <Scale className="w-6 h-6" />
      case "easeOfUse":
        return <Droplet className="w-6 h-6" />
      case "quality":
        return <Medal className="w-6 h-6" />
      default:
        return null
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full ${i < rating ? "bg-secondary" : "bg-muted-foreground"}`} />
        ))}
      </div>
    )
  }



  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/catalogo" className="flex items-center gap-2 text-primary hover:text-primary/80 transition">
            <ChevronLeft className="w-4 h-4" />
            Volver al catálogo
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            
          {/* Image Section */}
          <div>
            <p className="text-muted-foreground text-sm mb-2">{fragrance.brand}</p>
            <h1 className="text-4xl font-serif font-bold text-foreground mb-4">{fragrance.name}</h1>
            <div className="relative h-96 sm:h-[500px] bg-muted rounded-lg overflow-hidden border border-border">
              <img
                src={fragrance.image || "/placeholder.svg"}
                alt={fragrance.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Four Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="flex justify-center mb-2 text-secondary">{renderMetricIcon("effectiveness")}</div>
            <p className="text-xs text-muted-foreground mb-1">Efectividad</p>
            <p className="text-2xl font-bold text-foreground">{product.metrics.effectiveness}</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="flex justify-center mb-2 text-secondary">{renderMetricIcon("valuePrice")}</div>
            <p className="text-xs text-muted-foreground mb-1">Valor/Precio</p>
            <p className="text-2xl font-bold text-foreground">{product.metrics.valuePrice}</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="flex justify-center mb-2 text-secondary">{renderMetricIcon("easeOfUse")}</div>
            <p className="text-xs text-muted-foreground mb-1">Facilidad de Uso</p>
            <p className="text-2xl font-bold text-foreground">{product.metrics.easeOfUse}</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="flex justify-center mb-2 text-secondary">{renderMetricIcon("quality")}</div>
            <p className="text-xs text-muted-foreground mb-1">Calidad</p>
            <p className="text-2xl font-bold text-foreground">{product.metrics.quality}</p>
          </div>
        </div>

          </div>

          {/* Details Section */}
            <div>
            <div className="mt-4 flex gap-3 py-6">
                <div className="flex-1 p-3 bg-muted border border-border rounded-lg hover:border-primary transition">
                <img
                    src={"/placeholder.svg"}
                    alt="thumbnail"
                    className="w-full h-20 object-cover rounded"
                />
                </div>
            </div>

            <div className="mb-6">


              {/* Price */}
              <div className="mb-6 p-6 bg-muted/50 border border-border rounded-lg">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Descripción</h2>
          <p className="text-foreground leading-relaxed">{fragrance.description}</p>

            </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-muted/50 border border-border rounded-lg">
                  <p className="text-muted-foreground mb-1">Género</p>
                  <p className="font-semibold text-foreground capitalize">{fragrance.gender}</p>
                </div>
                <div className="p-3 bg-muted/50 border border-border rounded-lg">
                  <p className="text-muted-foreground mb-1">Concentración</p>
                  <p className="font-semibold text-foreground">{fragrance.concentration}</p>
                </div>
                <div className="p-3 bg-muted/50 border border-border rounded-lg">
                  <p className="text-muted-foreground mb-1">Longevidad</p>
                  <p className="font-semibold text-foreground">{fragrance.longevity}</p>
                </div>
                <div className="p-3 bg-muted/50 border border-border rounded-lg">
                  <p className="text-muted-foreground mb-1">Sillage</p>
                  <p className="font-semibold text-foreground">{fragrance.sillage}</p>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Pirámide Olfativa */}
        <div className="mb-16 p-8 bg-card border border-border rounded-lg">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Pirámide Olfativa</h2>
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <span className="text-amber-600">▲</span> Notas de Salida
              </h3>
              <p className="text-muted-foreground">{fragrance.topNotes.join(", ")}</p>
            </div>
            <div className="p-4 bg-rose-50 border-l-4 border-rose-400 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <span className="text-rose-600">♥</span> Notas de Corazón
              </h3>
              <p className="text-muted-foreground">{fragrance.middleNotes.join(", ")}</p>
            </div>
            <div className="p-4 bg-slate-50 border-l-4 border-slate-400 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <span className="text-slate-600">■</span> Notas de Fondo
              </h3>
              <p className="text-muted-foreground">{fragrance.baseNotes.join(", ")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}