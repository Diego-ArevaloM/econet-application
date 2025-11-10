"use client";

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom"
import { Search, SlidersHorizontal, Star, X } from "lucide-react";

interface Product {
  id: number;
  name: string;
  brand: string;
  image: string;
  rating: number;
  reviews: number;
  type: string;
  objective: string;
  form: string;
}

const allProducts: Product[] = [
  { id: 1, name: "Spirulina Premium", brand: "NaturaVita", image: "/spirulina-supplement.jpg", rating: 5, reviews: 2430, type: "suplemento", objective: "energia", form: "capsulas" },
  { id: 2, name: "Té de Jengibre Orgánico", brand: "HerbosMagic", image: "/ginger-tea.png", rating: 4, reviews: 1890, type: "infusion", objective: "digestion", form: "infusion" },
  { id: 3, name: "Polvo de Cúrcuma", brand: "GoldenEarth", image: "/turmeric-powder.png", rating: 5, reviews: 1650, type: "alimento", objective: "articulaciones", form: "polvo" },
  { id: 4, name: "Extracto de Equinácea", brand: "ImmunDefense", image: "/echinacea-extract.jpg", rating: 5, reviews: 2100, type: "extracto", objective: "defensas", form: "jarabe" },
  { id: 5, name: "Melatonina Natural", brand: "SleepWell", image: "/melatonin-natural.jpg", rating: 4, reviews: 1200, type: "suplemento", objective: "sueno", form: "capsulas" },
  { id: 6, name: "Crema Antiarrugas Natural", brand: "SkinPure", image: "/anti-wrinkle-cream.jpg", rating: 5, reviews: 3100, type: "cosmetica", objective: "piel", form: "crema" },
  { id: 7, name: "Aceite de Coco Virgen", brand: "CocoLove", image: "/virgin-coconut-oil.jpg", rating: 4, reviews: 980, type: "alimento", objective: "cabello", form: "aceite" },
  { id: 8, name: "Ginkgo Biloba Premium", brand: "MindBoost", image: "/ginkgo-biloba.jpg", rating: 4, reviews: 1750, type: "suplemento", objective: "memoria", form: "capsulas" },
  { id: 9, name: "Té Verde Orgánico", brand: "GreenEnergy", image: "/green-tea-organic.jpg", rating: 5, reviews: 2250, type: "alimento", objective: "energia", form: "infusion" },
  { id: 10, name: "Complemento Cardíaco", brand: "HeartCare", image: "/heart-supplement.jpg", rating: 4, reviews: 1430, type: "suplemento", objective: "corazon", form: "capsulas" },
  { id: 11, name: "Barra Energética Orgánica", brand: "EnergyBar", image: "/energy-bar.png", rating: 4, reviews: 1100, type: "alimento", objective: "energia", form: "snack" },
  { id: 12, name: "Gel Aloe Vera Puro", brand: "AloeHealing", image: "/aloe-vera-gel.png", rating: 5, reviews: 1680, type: "cosmetica", objective: "piel", form: "gel" },
];

const typeOptions: string[] = ["alimento", "suplemento", "extracto", "infusion", "cosmetica"];
const objectiveOptions: string[] = [
  "articulaciones", "digestion", "defensas", "sueno", "energia", "memoria",
  "corazon", "respiratorio", "piel", "cabello", "peso", "azucar",
];
const formOptions: string[] = ["capsulas", "polvo", "infusion", "jarabe", "aceite", "snack", "crema", "gel"];

export default function ProductsPage(): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [displayedCount, setDisplayedCount] = useState<number>(12);

  // Tipado correcto del setState para evitar incompatibilidades
  const toggleFilter = (
    item: string,
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (array.includes(item)) {
      setArray(array.filter((i) => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const clearAllFilters = (): void => {
    setSearchQuery("");
    setSortBy("featured");
    setSelectedTypes([]);
    setSelectedObjectives([]);
    setSelectedForms([]);
    setSelectedRating(null);
  };

  const filteredProducts = useMemo<Product[]>(() => {
    const result = allProducts.filter((product) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q);

      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(product.type);
      const matchesObjective = selectedObjectives.length === 0 || selectedObjectives.includes(product.objective);
      const matchesForm = selectedForms.length === 0 || selectedForms.includes(product.form);
      const matchesRating = selectedRating === null || product.rating >= selectedRating;

      return matchesSearch && matchesType && matchesObjective && matchesForm && matchesRating;
    });

    // Copia para no mutar el original
    const sorted = [...result];
    if (sortBy === "rating") sorted.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "reviews") sorted.sort((a, b) => b.reviews - a.reviews);
    else if (sortBy === "recent") sorted.reverse();

    return sorted;
  }, [searchQuery, selectedTypes, selectedObjectives, selectedForms, selectedRating, sortBy]);

  const displayedProducts = filteredProducts.slice(0, displayedCount);

  const renderStars = (rating: number): React.ReactElement => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "fill-secondary text-secondary" : "text-muted-foreground"}`}
        />
      ))}
    </div>
  );

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
            
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-72 ${showFilters ? "block" : "hidden"} lg:block space-y-4`} aria-labelledby="filters-heading">
            <button
              onClick={clearAllFilters}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-semibold"
            >
              <X className="w-4 h-4" />
              Borrar todos los filtros
            </button>

            {/* Populares */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">Populares</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="featured">Destacados</option>
                <option value="rating">Mejor calificados</option>
                <option value="reviews">Más reseñados</option>
                <option value="recent">Más recientes</option>
              </select>
            </div>

            {/* Tipo */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">Tipo</h3>
              <div className="space-y-2">
                {typeOptions.map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleFilter(type, selectedTypes, setSelectedTypes)}
                      className="accent-primary"
                    />
                    <span className="text-foreground text-sm capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Objetivo */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">Objetivo</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {objectiveOptions.map((objective) => (
                  <label key={objective} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedObjectives.includes(objective)}
                      onChange={() => toggleFilter(objective, selectedObjectives, setSelectedObjectives)}
                      className="accent-primary"
                    />
                    <span className="text-foreground text-sm capitalize">
                      {objective === "sueno" ? "Sueño/Relajación"
                        : objective === "energia" ? "Energía/Vitalidad"
                        : objective === "azucar" ? "Azúcar en sangre"
                        : objective === "peso" ? "Control de peso"
                        : objective === "piel" ? "Piel y cabello"
                        : objective === "respiratorio" ? "Respiratorio"
                        : objective.charAt(0).toUpperCase() + objective.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Forma */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">Forma</h3>
              <div className="space-y-2">
                {formOptions.map((form) => (
                  <label key={form} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedForms.includes(form)}
                      onChange={() => toggleFilter(form, selectedForms, setSelectedForms)}
                      className="accent-primary"
                    />
                    <span className="text-foreground text-sm capitalize">{form === "snack" ? "Snack/Barra" : form === "crema" ? "Crema/Gel" : form}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Calificación */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">Calificación</h3>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((stars) => (
                  <label key={stars} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={selectedRating === stars}
                      onChange={() => setSelectedRating(selectedRating === stars ? null : stars)}
                      className="accent-primary"
                    />
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < stars ? "fill-secondary text-secondary" : "text-muted-foreground"}`} />
                      ))}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <main className="flex-1">
            <div className="mb-6 text-muted-foreground text-sm">
              Mostrando <span className="font-semibold text-foreground">{displayedProducts.length}</span> de{" "}
              <span className="font-semibold">{filteredProducts.length}</span> productos
            </div>

            {displayedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {displayedProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/catalogo/${product.id}`}
                      className="group bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition cursor-pointer h-full flex flex-col"
                    >
                      <div className="relative h-64 bg-muted overflow-hidden">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                          <button
                            onClick={(e) => {
                              e.preventDefault(); // evita que Link navegue
                              e.stopPropagation(); // evita que el click se propague al Link
                              console.log("Ver detalles:", product.id); // aquí puedes abrir modal o lo que quieras
                            }}
                            className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition text-sm"
                          >
                            Ver detalles
                          </button>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col">
                        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                          {product.brand}
                        </p>
                        <h3 className="font-semibold text-foreground mb-3 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-auto">
                          {renderStars(product.rating)}
                          <span className="text-xs text-muted-foreground ml-1">
                            ({product.reviews})
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                {displayedProducts.length < filteredProducts.length && (
                  <div className="flex justify-center">
                    <button
                      onClick={() => setDisplayedCount((c) => c + 12)}
                      className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
                    >
                      Cargar más productos
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-2">No se encontraron productos</p>
                <p className="text-muted-foreground">Intenta cambiar los filtros o tu búsqueda</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
