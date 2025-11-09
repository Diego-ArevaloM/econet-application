"use client"

import { useState, useMemo } from "react"
import { Link } from 'react-router-dom'
import { Search, SlidersHorizontal, Heart, Star } from "lucide-react"

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
  },
  {
    id: 4,
    name: "Rose Garden",
    brand: "Classic Perfumes",
    image: "/placeholder.svg?key=ypcr7",
    rating: 4.7,
    reviews: 2100,
    price: 79,
    category: "Floral",
    gender: "women",
    concentration: "Eau de Parfum",
  },
  {
    id: 5,
    name: "Spice Route",
    brand: "Exotic Scents",
    image: "/placeholder.svg?key=spice",
    rating: 4.4,
    reviews: 1200,
    price: 85,
    category: "Oriental",
    gender: "men",
    concentration: "Eau de Parfum",
  },
  {
    id: 6,
    name: "Violet Dreams",
    brand: "Floral Essence",
    image: "/placeholder.svg?key=violet",
    rating: 4.9,
    reviews: 3100,
    price: 95,
    category: "Floral",
    gender: "women",
    concentration: "Parfum",
  },
  {
    id: 7,
    name: "Cedar Nights",
    brand: "Woody Collection",
    image: "/placeholder.svg?key=cedar",
    rating: 4.3,
    reviews: 980,
    price: 72,
    category: "Woody",
    gender: "men",
    concentration: "Eau de Toilette",
  },
  {
    id: 8,
    name: "Citrus Sunrise",
    brand: "Fresh Scents",
    image: "/placeholder.svg?key=citrus",
    rating: 4.6,
    reviews: 1750,
    price: 60,
    category: "Citrus",
    gender: "unisex",
    concentration: "Eau de Toilette",
  },
  {
    id: 9,
    name: "Jasmine Paradise",
    brand: "Luxury House",
    image: "/placeholder.svg?key=jasmine",
    rating: 4.7,
    reviews: 2250,
    price: 88,
    category: "Floral",
    gender: "women",
    concentration: "Eau de Parfum",
  },
  {
    id: 10,
    name: "Tobacco & Leather",
    brand: "Rugged Scents",
    image: "/placeholder.svg?key=tobacco",
    rating: 4.5,
    reviews: 1430,
    price: 82,
    category: "Woody",
    gender: "men",
    concentration: "Eau de Parfum",
  },
  {
    id: 11,
    name: "Peach Blossom",
    brand: "Fruity Dreams",
    image: "/placeholder.svg?key=peach",
    rating: 4.4,
    reviews: 1100,
    price: 68,
    category: "Fruity",
    gender: "women",
    concentration: "Eau de Toilette",
  },
  {
    id: 12,
    name: "Vetiver Elite",
    brand: "Premium Collection",
    image: "/placeholder.svg?key=vetiver",
    rating: 4.6,
    reviews: 1680,
    price: 76,
    category: "Woody",
    gender: "men",
    concentration: "Eau de Parfum",
  },
]

export default function Catalogo() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedGender, setSelectedGender] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)

  const categories = ["all", "Floral", "Citrus", "Woody", "Oriental", "Fruity", "Ambroxan"]
  const genders = ["all", "men", "women", "unisex"]

  const filteredFragrances = useMemo(() => {
    const result = allFragrances.filter((fragrance) => {
      const matchesSearch =
        fragrance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fragrance.brand.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "all" || fragrance.category === selectedCategory
      const matchesGender = selectedGender === "all" || fragrance.gender === selectedGender

      return matchesSearch && matchesCategory && matchesGender
    })

    // Sort
    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === "reviews") {
      result.sort((a, b) => b.reviews - a.reviews)
    }

    return result
  }, [searchQuery, selectedCategory, selectedGender, sortBy])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por marca o nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 border border-border rounded-lg hover:bg-muted transition flex items-center gap-2 px-4"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filtros</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? "block" : "hidden"} lg:block space-y-6`}>
            {/* Categories */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4">Categoría</h3>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={selectedCategory === cat}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="accent-primary"
                    />
                    <span className="text-foreground capitalize">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4">Género</h3>
              <div className="space-y-3">
                {genders.map((gender) => (
                  <label key={gender} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={selectedGender === gender}
                      onChange={(e) => setSelectedGender(e.target.value)}
                      className="accent-primary"
                    />
                    <span className="text-foreground capitalize">{gender === "all" ? "Todos" : gender}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4">Ordenar por</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="featured">Destacados</option>
                <option value="rating">Mejor calificados</option>
                <option value="reviews">Más reseñas</option>
                <option value="price-low">Precio: Menor a Mayor</option>
                <option value="price-high">Precio: Mayor a Menor</option>
              </select>
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="mb-6 text-muted-foreground">
              Mostrando <span className="font-semibold text-foreground">{filteredFragrances.length}</span> fragancias
            </div>

            {filteredFragrances.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFragrances.map((fragrance) => (
                  <Link key={fragrance.id} to={`/catalogo/${fragrance.id}`}>
                    <div className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition group cursor-pointer">
                      {/* Image Container */}
                      <div className="relative h-80 bg-muted overflow-hidden">
                        <img
                          src={fragrance.image || "/placeholder.svg"}
                          alt={fragrance.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          className="absolute top-3 right-3 p-2 bg-white rounded-full hover:bg-muted transition shadow-lg"
                        >
                          <Heart className="w-5 h-5 text-primary" />
                        </button>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                            }}
                            className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
                          >
                            Ver detalles
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <p className="text-sm text-muted-foreground mb-1">{fragrance.brand}</p>
                        <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{fragrance.name}</h3>
                        <p className="text-xs text-muted-foreground mb-3">{fragrance.concentration}</p>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-secondary text-secondary" />
                            <span className="font-semibold text-foreground text-sm">{fragrance.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">({fragrance.reviews})</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">${fragrance.price}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-2">No se encontraron fragancias</p>
                <p className="text-muted-foreground">Intenta cambiar los filtros o tu búsqueda</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
