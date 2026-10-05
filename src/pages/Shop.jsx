import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { products } from '../data/catalog.js'
import FilterPanel, { SORTS, applyFilters, defaultFilters } from '../components/FilterPanel.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import { QuickView } from '../components/Gallery.jsx'
import Modal from '../components/Modal.jsx'
import { Breadcrumbs } from '../components/Bits.jsx'
import { faDigits } from '../state/ShopProvider.jsx'
import { IconFilter } from '../components/Icons.jsx'

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const sort = params.get('sort') || 'newest'
  const [filters, setFilters] = useState(defaultFilters)
  const [quick, setQuick] = useState(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const result = useMemo(() => applyFilters(products, filters, sort), [filters, sort])

  const setSort = (id) => {
    const next = new URLSearchParams(params)
    next.set('sort', id)
    setParams(next, { replace: true })
  }

  const reset = () => setFilters(defaultFilters)

  return (
    <>
      <header className="page-head page-head--night">
        <div className="container">
          <Breadcrumbs items={[{ label: 'فروشگاه' }]} />
          <div style={{ marginBlockStart: 18 }}>
            <span className="label">SHOP / ALL PRODUCTS</span>
            <h1 className="display display--md" style={{ marginBlockStart: 12 }}>
              فروشگاه
            </h1>
            <p className="lead" style={{ marginBlockStart: 14 }}>
              تمام محصولات — {faDigits(products.length)} قطعه در سیستم زمستانی فریز.
            </p>
          </div>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container">
          <div className="shop-layout">
            <aside className="shop-layout__sidebar" aria-label="فیلترها">
              <FilterPanel filters={filters} setFilters={setFilters} onReset={reset} />
            </aside>

            <div className="shop-layout__main">
              <div className="toolbar">
                <div className="mobile-filter-bar">
                  <button className="btn btn--ghost btn--sm" onClick={() => setSheetOpen(true)}>
                    <IconFilter size={16} /> فیلترها
                  </button>
                </div>
                <span className="muted" style={{ fontSize: '0.84rem' }}>
                  {faDigits(result.length)} محصول
                </span>
                <div className="seg" role="group" aria-label="ترتیب نمایش">
                  {SORTS.map((s) => (
                    <button
                      key={s.id}
                      className={sort === s.id ? 'is-active' : ''}
                      onClick={() => setSort(s.id)}
                      aria-pressed={sort === s.id}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBlockStart: 26 }}>
                <ProductGrid
                  products={result}
                  onQuickView={setQuick}
                  emptyState={
                    <div className="empty">
                      <div className="empty__mark" aria-hidden="true">
                        <IconFilter />
                      </div>
                      <h2 className="h-sec">با این فیلترها چیزی پیدا نشد</h2>
                      <p className="lead">فیلترها را ساده‌تر کنید یا همه‌ی محصولات را ببینید.</p>
                      <button className="btn" onClick={reset}>
                        حذف فیلترها
                      </button>
                    </div>
                  }
                />
              </div>

              <div className="toolbar" style={{ marginBlockStart: 40 }}>
                <span className="muted" style={{ fontSize: '0.8rem' }}>
                  نمایش {faDigits(result.length)} از {faDigits(products.length)} محصول
                </span>
                <Link className="link-underline" to="/collections">
                  مرور کالکشن‌ها
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal open={sheetOpen} onClose={() => setSheetOpen(false)} title="فیلترها">
        <FilterPanel filters={filters} setFilters={setFilters} onReset={reset} />
        <button className="btn btn--block" style={{ marginBlockStart: 20 }} onClick={() => setSheetOpen(false)}>
          نمایش {faDigits(result.length)} محصول
        </button>
      </Modal>

      {quick && <QuickView product={quick} onClose={() => setQuick(null)} />}
    </>
  )
}
