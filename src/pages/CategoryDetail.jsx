import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid.jsx'
import { QuickView } from '../components/Gallery.jsx'
import { Breadcrumbs } from '../components/Bits.jsx'
import { categories, collections, findCategory, productsByCategory } from '../data/catalog.js'
import { faDigits } from '../state/ShopProvider.jsx'

export default function CategoryDetail() {
  const { slug } = useParams()
  const category = findCategory(slug)
  const [quick, setQuick] = useState(null)

  if (!category) {
    return (
      <section className="section container" style={{ paddingBlockStart: 180 }}>
        <div className="empty">
          <h1 className="h-sec">این دسته‌بندی پیدا نشد</h1>
          <Link className="btn" to="/categories">
            همه دسته‌بندی‌ها
          </Link>
        </div>
      </section>
    )
  }

  const items = productsByCategory(category.slug)

  return (
    <>
      <header className="page-head page-head--night">
        <div className="container">
          <Breadcrumbs items={[{ label: 'دسته‌بندی‌ها', to: '/categories' }, { label: category.name }]} />
          <div style={{ marginBlockStart: 18 }}>
            <span className="label">{category.note}</span>
            <h1 className="display display--md" style={{ marginBlockStart: 12 }}>
              {category.name}
            </h1>
            <p className="lead" style={{ marginBlockStart: 14 }}>
              {faDigits(items.length)} قطعه در این دسته — همه با پوسته و عایق فنی.
            </p>
          </div>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container">
          <ProductGrid products={items} onQuickView={setQuick} />

          <div style={{ marginBlockStart: 50 }}>
            <span className="label">OTHER CATEGORIES</span>
            <div className="chip-row" style={{ marginBlockStart: 14 }}>
              {categories
                .filter((c) => c.slug !== category.slug)
                .map((c) => (
                  <Link key={c.slug} className="chip" to={`/category/${c.slug}`}>
                    {c.name}
                  </Link>
                ))}
            </div>
          </div>

          <div style={{ marginBlockStart: 40 }}>
            <span className="label">COLLECTIONS</span>
            <div className="chip-row" style={{ marginBlockStart: 14 }}>
              {collections.map((c) => (
                <Link key={c.slug} className="chip" to={`/collections/${c.slug}`}>
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {quick && <QuickView product={quick} onClose={() => setQuick(null)} />}
    </>
  )
}
