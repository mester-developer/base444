import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SceneImage from '../components/SceneImage.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import { QuickView } from '../components/Gallery.jsx'
import { Breadcrumbs } from '../components/Bits.jsx'
import { categories, findCollection, productsByCollection } from '../data/catalog.js'
import { faDigits } from '../state/ShopProvider.jsx'
import { IconArrow } from '../components/Icons.jsx'

export default function CollectionDetail() {
  const { slug } = useParams()
  const collection = findCollection(slug)
  const [quick, setQuick] = useState(null)

  if (!collection) {
    return (
      <section className="section container" style={{ paddingBlockStart: 180 }}>
        <div className="empty">
          <h1 className="h-sec">این کالکشن پیدا نشد</h1>
          <Link className="btn" to="/collections">
            همه کالکشن‌ها
          </Link>
        </div>
      </section>
    )
  }

  const items = productsByCollection(collection.slug)

  return (
    <>
      <header className="manifesto" style={{ paddingBlock: 'clamp(120px, 18vh, 220px) clamp(60px, 9vw, 120px)' }}>
        <div className="manifesto__media">
          <SceneImage variant={collection.scene.variant} seed={collection.scene.seed} alt={collection.name} />
        </div>
        <div className="grain" aria-hidden="true" />
        <span className="manifesto__stamp">{collection.latin}</span>
        <div className="container manifesto__inner">
          <Breadcrumbs items={[{ label: 'کالکشن‌ها', to: '/collections' }, { label: collection.name }]} />
          <span className="label" style={{ display: 'block', marginBlockStart: 22 }}>
            {collection.latin} / SEASON {collection.season}
          </span>
          <h1 className="display" style={{ marginBlockStart: 14 }}>
            {collection.name}
          </h1>
          <p className="lead" style={{ marginBlockStart: 20, maxWidth: '56ch' }}>
            {collection.description}
          </p>
          <div style={{ display: 'flex', gap: 22, marginBlockStart: 24, flexWrap: 'wrap' }}>
            <span className="mono">{faDigits(items.length)} PIECES IN STOCK</span>
            <span className="mono">DROP WINDOW / 2026</span>
          </div>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container">
          <ProductGrid products={items} onQuickView={setQuick} />

          <div style={{ marginBlockStart: 56 }}>
            <span className="label">BROWSE / CATEGORIES</span>
            <div className="chip-row" style={{ marginBlockStart: 14 }}>
              {categories.map((c) => (
                <Link key={c.slug} className="chip" to={`/category/${c.slug}`}>
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          <div style={{ marginBlockStart: 48, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <Link className="link-underline" to="/shop">
              همه محصولات
              <IconArrow size={16} />
            </Link>
            <Link className="link-underline" to="/collections">
              کالکشن‌های دیگر
              <IconArrow size={16} />
            </Link>
          </div>
        </div>
      </section>

      {quick && <QuickView product={quick} onClose={() => setQuick(null)} />}
    </>
  )
}
