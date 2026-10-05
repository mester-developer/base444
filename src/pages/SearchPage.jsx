import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { products } from '../data/catalog.js'
import ProductGrid from '../components/ProductGrid.jsx'
import { QuickView } from '../components/Gallery.jsx'
import { Breadcrumbs } from '../components/Bits.jsx'
import { faDigits } from '../state/ShopProvider.jsx'
import { IconSearch } from '../components/Icons.jsx'

const CHIPS = ['پافر', 'پارکا', 'ضدآب', 'دراپ محدود', 'هودی', 'دستکش']

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const [term, setTerm] = useState(q)
  const [quick, setQuick] = useState(null)

  const results = useMemo(() => {
    const value = q.trim().toLowerCase()
    if (!value) return []
    return products.filter((p) =>
      [p.name, p.shortDescription, p.tags.join(' '), p.category, p.collection].join(' ').toLowerCase().includes(value),
    )
  }, [q])

  const submit = (e) => {
    e.preventDefault()
    setParams(term ? { q: term } : {}, { replace: true })
  }

  return (
    <>
      <header className="page-head">
        <div className="container">
          <Breadcrumbs items={[{ label: 'جستجو' }]} />
          <div style={{ marginBlockStart: 18 }}>
            <span className="label">SEARCH / SYSTEM</span>
            <h1 className="display display--md" style={{ marginBlockStart: 12 }}>
              جستجو
            </h1>
          </div>

          <form onSubmit={submit} style={{ marginBlockStart: 26, maxWidth: 720 }} role="search">
            <div className="newsletter" style={{ borderColor: 'var(--line-strong)', background: 'rgba(244,247,248,.6)' }}>
              <span style={{ display: 'grid', placeItems: 'center', paddingInline: 8 }}>
                <IconSearch />
              </span>
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="چه چیزی می‌خواهید پیدا کنید؟"
                aria-label="جستجوی محصولات"
                style={{ color: 'var(--ink)', fontSize: '1rem' }}
              />
              <button className="btn btn--sm" type="submit">
                جستجو
              </button>
            </div>
          </form>

          <div className="chip-row" style={{ marginBlockStart: 18 }}>
            {CHIPS.map((c) => (
              <button
                key={c}
                className="chip"
                onClick={() => {
                  setTerm(c)
                  setParams({ q: c }, { replace: true })
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container">
          {q ? (
            <>
              <p className="muted" style={{ marginBlockEnd: 20 }}>
                {faDigits(results.length)} نتیجه برای «{q}»
              </p>
              <ProductGrid
                products={results}
                onQuickView={setQuick}
                emptyState={
                  <div className="empty">
                    <div className="empty__mark" aria-hidden="true">
                      <IconSearch />
                    </div>
                    <h2 className="h-sec">نتیجه‌ای پیدا نشد</h2>
                    <p className="lead">عبارت دیگری را امتحان کنید یا فهرست کامل محصولات را ببینید.</p>
                    <Link className="btn" to="/shop">
                      همه محصولات
                    </Link>
                  </div>
                }
              />
            </>
          ) : (
            <div className="empty">
              <div className="empty__mark" aria-hidden="true">
                <IconSearch />
              </div>
              <h2 className="h-sec">چه چیزی برای زمستان لازم دارید؟</h2>
              <p className="lead">نام محصول، دسته‌بندی یا ویژگی فنی را وارد کنید — مثلاً «پارکا» یا «ضدآب».</p>
            </div>
          )}
        </div>
      </section>

      {quick && <QuickView product={quick} onClose={() => setQuick(null)} />}
    </>
  )
}
