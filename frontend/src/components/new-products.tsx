const products = [
  {
    id: 1,
    name: "Crema para piel grasa",
    brand: "Myryan",
    image: "https://natuzem.com/cdn/shop/products/image_bcf7e292-1e66-42e4-b770-ff608e1d1205_533x.png",
    rating: 4.8,
    reviews: 2430,
    category: "Crema",
  },
  {
    id: 2,
    name: "Crema Concha Nactar",
    brand: "Shanaturals",
    image: "https://natuzem.com/cdn/shop/products/image_df2dc4dc-cdee-4298-b237-4d581a0d2c45_1100x.png",
    rating: 4.6,
    reviews: 1890,
    category: "Crema",
  },
  {
    id: 3,
    name: "Cúrcuma en polvo",
    brand: "Inkanal",
    image: "https://vivanaturalmarket.pe/wp-content/uploads/2024/12/B2.png",
    rating: 4.5,
    reviews: 1650,
    category: "Polvo",
  },
  {
    id: 4,
    name: "Probióticos y Prebióticos",
    brand: "Perú Nutrition",
    image: "https://tikafarma.com/cdn/shop/files/probioticos-prebitoicos-peru-nutrtition-tikafarma.jpg",
    rating: 4.7,
    reviews: 2100,
    category: "Gomitas",
  },
]

export default function NewProducts() {
  const renderStars = (rating: number) => {
    return [1, 2, 3, 4, 5].map((star) => {
      const filled = star <= Math.floor(rating)
      const partial = star === Math.ceil(rating) && rating % 1 !== 0
      
      return (
        <svg
          key={star}
          className={`w-4 h-4 ${filled ? 'fill-secondary text-secondary' : partial ? 'fill-secondary/50 text-secondary' : 'fill-gray-200 text-gray-200'}`}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )
    })
  }

  return (
    <section className=" bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Nuevos productos</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/50 transition group cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative h-64 bg-muted overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <button className="absolute top-3 right-3 p-2 bg-white rounded-full hover:bg-muted transition shadow-lg">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <span className="absolute top-3 left-3 px-3 py-1 bg-secondary text-secondary-foreground text-sm font-semibold rounded-full">
                  {product.category}
                </span>
              </div>
              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-1 text-lg">{product.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{product.brand}</p>
                {/* Rating - 5 Stars */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-0.5">
                    {renderStars(product.rating)}
                  </div>
                  <span className="font-semibold text-foreground text-sm">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">({product.reviews})</span>
                </div>
                {/* Button */}
                <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition text-sm">
                  Ver más
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}