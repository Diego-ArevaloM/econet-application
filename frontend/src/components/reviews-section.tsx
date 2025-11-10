
export default function ReviewsSection({
  productId,
  reviews,
  onAddReview,
  showMetrics,
}: {
  productId: number
  reviews: any[]
  onAddReview?: (review: any) => void
  showMetrics?: boolean
}) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full ${i < rating ? "bg-secondary" : "bg-muted-foreground"}`} />
        ))}
      </div>
    )
  }

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-serif font-bold text-foreground mb-8">Reseñas de Usuarios</h2>

      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-card border border-border rounded-lg p-6">
              {/* Header with User Info */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                  {review.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{review.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {review.date} - {review.time}
                  </p>
                </div>
              </div>

              {/* Review Title and Content */}
              <h4 className="font-semibold text-foreground mb-2">{review.title}</h4>
              <p className="text-foreground mb-4">{review.content}</p>

              {/* Metrics if provided */}
              {showMetrics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Efectividad</p>
                    {renderStars(review.effectiveness)}
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Valor/Precio</p>
                    {renderStars(review.valuePrice)}
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Facilidad Uso</p>
                    {renderStars(review.easeOfUse)}
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Calidad</p>
                    {renderStars(review.quality)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <p className="text-muted-foreground">Aún no hay reseñas. ¡Sé el primero en comentar!</p>
        </div>
      )}
    </section>
  )
}
