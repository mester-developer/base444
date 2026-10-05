import { Link } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid.jsx'
import { Breadcrumbs, EmptyState } from '../components/Bits.jsx'
import { products } from '../data/catalog.js'
import { useShop } from '../state/ShopProvider.jsx'
import { IconHeart } from '../components/Icons.jsx'

export default function Wishlist() {
  const { state } = useShop()
  const items = products.filter((p) => state.wishlist.includes(p.id))

  return (
    <>
      <header className="page-head">
        <div className="container">
          <Breadcrumbs items={[{ label: 'علاقه‌مندی‌ها' }]} />
          <div style={{ marginBlockStart: 18 }}>
            <span className="label">WISHLIST / SAVED</span>
            <h1 className="display display--md" style={{ marginBlockStart: 12 }}>
              علاقه‌مندی‌ها
            </h1>
          </div>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container">
          {items.length === 0 ? (
            <EmptyState
              icon={IconHeart}
              title="هنوز چیزی برای زمستان انتخاب نکرده‌اید."
              description="قطعه‌هایی که دوست دارید را ذخیره کنید تا بعداً سریع پیدایشان کنید."
              actionLabel="مرور فروشگاه"
              actionTo="/shop"
            />
          ) : (
            <>
              <p className="muted" style={{ marginBlockEnd: 22 }}>
                {items.length.toLocaleString('fa-IR')} قطعه ذخیره‌شده — برای افزودن به سبد، روی «افزودن به سبد» بزنید.
              </p>
              <ProductGrid products={items} />
              <div style={{ marginBlockStart: 40 }}>
                <Link className="link-underline" to="/shop">
                  ادامه‌ی خرید
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
