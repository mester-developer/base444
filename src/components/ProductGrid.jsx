import ProductCard from './ProductCard.jsx'

export function ProductSkeletons({ count = 8 }) {
  return (
    <div className="pgrid" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="pcard">
          <div className="skeleton skeleton--card" />
          <div className="pcard__body">
            <div className="skeleton" style={{ height: 16, width: '70%' }} />
            <div className="skeleton" style={{ height: 14, width: '45%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ProductGrid({ products, onQuickView, columns = 4, loading = false, emptyState = null }) {
  if (loading) return <ProductSkeletons />

  if (!products.length) {
    return emptyState || (
      <div className="empty">
        <h3 className="h-card">محصولی با این فیلترها پیدا نشد</h3>
        <p className="muted">فیلترها را ساده‌تر کنید یا همه محصولات را ببینید.</p>
      </div>
    )
  }

  return (
    <div className={`pgrid ${columns === 3 ? 'pgrid--3' : ''} ${columns === 2 ? 'pgrid--2' : ''}`}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} onQuickView={onQuickView} priority={i === 0} />
      ))}
    </div>
  )
}
