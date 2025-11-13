"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Heart, MessageSquare, Settings, Edit2 } from "lucide-react"

const mockUser = {
  id: 1,
  name: "María García",
  username: "maria_fragances",
  email: "maria@example.com",
  joinDate: "2022-05-15",
  bio: "Amante de las fragancias finas y los perfumes únicos. Experta en notas florales.",
  avatar: "MG",
  stats: {
    reviews: 47,
    favorites: 156,
    followers: 234,
    following: 89,
  },
}

const mockFavorites = [
  {
    id: 1,
    name: "Midnight Elegance",
    brand: "Luxury House",
    image: "/placeholder.svg?key=9zgnt",
    rating: 4.8,
    price: 89,
    addedDate: "2024-01-10",
  },
  {
    id: 2,
    name: "Rose Garden",
    brand: "Classic Perfumes",
    image: "/placeholder.svg?key=ypcr7",
    rating: 4.7,
    price: 79,
    addedDate: "2024-01-08",
  },
  {
    id: 3,
    name: "Violet Dreams",
    brand: "Floral Essence",
    image: "/placeholder.svg?key=violet",
    rating: 4.9,
    price: 95,
    addedDate: "2024-01-05",
  },
  {
    id: 4,
    name: "Ocean Breeze",
    brand: "Fresh Scents",
    image: "/placeholder.svg?key=eowci",
    rating: 4.5,
    price: 65,
    addedDate: "2024-01-01",
  },
]

const mockReviews = [
  {
    id: 1,
    fragrance: "Midnight Elegance",
    rating: 5,
    title: "Fragancia excepcional",
    content: "Un aroma absolutamente hermoso. Las notas florales son delicadas pero duraderas.",
    date: "2024-01-15",
    helpful: 234,
  },
  {
    id: 2,
    fragrance: "Rose Garden",
    rating: 4,
    title: "Muy buen producto",
    content: "Excelente calidad. El único detalle es que la longevidad podría ser un poco mayor.",
    date: "2024-01-10",
    helpful: 156,
  },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("favorites")
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header with user info */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end justify-between">
            <div className="flex gap-6 items-start">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {mockUser.avatar}
              </div>

              {/* User Info */}
              <div>
                <h1 className="text-4xl font-serif font-bold text-foreground mb-2">{mockUser.name}</h1>
                <p className="text-muted-foreground mb-4">@{mockUser.username}</p>
                <p className="text-foreground mb-4 max-w-md">{mockUser.bio}</p>
                <p className="text-sm text-muted-foreground">
                  Se unió en{" "}
                  {new Date(mockUser.joinDate).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex-1 sm:flex-none px-6 py-2 border border-border rounded-lg font-semibold hover:bg-muted transition flex items-center justify-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
              <button className="flex-1 sm:flex-none px-6 py-2 border border-border rounded-lg font-semibold hover:bg-muted transition flex items-center justify-center gap-2">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary mb-1">{mockUser.stats.reviews}</p>
              <p className="text-muted-foreground text-sm">Reseñas</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary mb-1">{mockUser.stats.favorites}</p>
              <p className="text-muted-foreground text-sm">Favoritos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary mb-1">{mockUser.stats.followers}</p>
              <p className="text-muted-foreground text-sm">Seguidores</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary mb-1">{mockUser.stats.following}</p>
              <p className="text-muted-foreground text-sm">Siguiendo</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab("favorites")}
            className={`pb-4 px-2 font-semibold border-b-2 transition ${
              activeTab === "favorites"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart className="inline w-4 h-4 mr-2" />
            Mis Favoritos ({mockFavorites.length})
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-4 px-2 font-semibold border-b-2 transition ${
              activeTab === "reviews"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare className="inline w-4 h-4 mr-2" />
            Mis Reseñas ({mockReviews.length})
          </button>
        </div>

        {/* Favorites Tab */}
        {activeTab === "favorites" && (
          <div>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Fragancias Favoritas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockFavorites.map((fragrance) => (
                <div
                  key={fragrance.id}
                  className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition group"
                >
                  {/* Image */}
                  <div className="relative h-64 bg-muted overflow-hidden">
                    <img
                      src={fragrance.image || "/placeholder.svg"}
                      alt={fragrance.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full hover:bg-muted transition shadow-lg">
                      <Heart className="w-5 h-5 text-primary fill-current" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">{fragrance.brand}</p>
                    <h3 className="font-semibold text-foreground mb-3 line-clamp-2">{fragrance.name}</h3>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-primary">{fragrance.rating}</span>
                      <span className="text-xs text-muted-foreground">
                        Agregado hace{" "}
                        {Math.floor(
                          (new Date().getTime() - new Date(fragrance.addedDate).getTime()) / (1000 * 60 * 60 * 24),
                        )}{" "}
                        días
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">${fragrance.price}</span>
                      <Link to={`/fragrances/${fragrance.id}`}>
                        <button className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm font-semibold hover:bg-primary/90 transition">
                          Ver
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Mis Reseñas</h2>
            <div className="space-y-6">
              {mockReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">{review.fragrance}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-xl ${i < review.rating ? "text-secondary" : "text-border"}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <h4 className="font-semibold text-foreground mb-2">{review.title}</h4>
                  <p className="text-foreground mb-4">{review.content}</p>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <button className="hover:text-primary transition">👍 Útil ({review.helpful})</button>
                    <button className="hover:text-primary transition">✏️ Editar</button>
                    <button className="hover:text-destructive transition">🗑️ Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
