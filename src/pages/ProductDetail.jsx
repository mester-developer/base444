import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ProductGallery from '../components/Gallery.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import { Breadcrumbs } from '../components/Bits.jsx'
import { SizeGuideModal } from '../components/FilterPanel.jsx'
import SceneImage from '../components/SceneImage.jsx'
import { COLOR_MAP, findCategory, findProduct, products, reviewsFor } from '../data/catalog.js'
import { faDigits, formatToman, useShop } from '../state/ShopProvider.jsx'
import { IconCheck, IconHeart, IconShield, IconSnow, IconStar, IconTruck } from '../components/Icons.jsx'

const TABS = [
  { id: 'details', label: 'مشخصات محصول' },
  { id: 'tech', label: 'تکنولوژی' },
  { id: 'fit', label: 'اندازه و فرم' },
  { id: 'care', label: 'نگهداری' },
  { id: 'shipping', label: 'ارسال' },
  { id: 'returns', label: 'بازگشت' },
]

export default function ProductDetail() {
  const { slug } = useParams()
  const product = findProduct(slug)
  const navigate = useNavigate()
  const { addToCart, toggleWishlist, state, toast } = useShop()
  const [size, setSize] = useState(product?.sizes[0])
  const [color, setColor] = useState(product?.colors[0])
  const [qty, setQty] = useState(1)
  const [guide, setGuide] = useState(false)
  const [tab, setTab] = useState('details')
  const [openAcc, setOpenAcc] = useState('desc')

  if (!product) {
    return (
      <section className="section container" style={{ paddingBlockStart: 180 }}>
        <div className="empty">
          <h1 className="h-sec">این محصول پیدا نشد</h1>
          <p className="lead">ممکن است آدرس اشتباه باشد یا محصول از کالکشن حذف شده باشد.</p>
          <Link className="btn" to="/shop">
            بازگشت به فروشگاه
          </Link>
        </div>
      </section>
    )
  }

  const category = findCategory(product.category)
  const wished = state.wishlist.includes(product.id)
  const reviews = reviewsFor(product)
  const related = products.filter((p) => p.id !== product.id).slice(0, 4)

  const buyNow = () => {
    addToCart(product, { size, color, qty })
    navigate('/checkout')
  }

  return (
    <>
      <div className="page-head page-head--night" style={{ paddingBlockEnd: 26 }}>
        <div className="container">
          <Breadcrumbs
            items={[
              { label: 'فروشگاه', to: '/shop' },
              { label: category?.name, to: `/category/${product.category}` },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      <section className="section section--tight">
        <div className="container">
          <div className="pdp">
            <ProductGallery product={product} />

            <div className="pdp__info">
              <div>
                <span className="label">
                  {category?.note} / {product.collection.toUpperCase()}
                </span>
                <h1 className="display display--sm" style={{ marginBlockStart: 12 }}>
                  {product.name}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBlockStart: 14, flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }} className="tnum">
                    {product.rating.toLocaleString('fa-IR')}
                    <IconStar filled size={16} />
                  </span>
                  <span className="muted" style={{ fontSize: '0.82rem' }}>
                    {faDigits(product.reviewsCount)} دیدگاه
                  </span>
                  <span className={`status status--${product.inventory > 5 ? 'ok' : 'warn'}`}>
                    {product.inventory > 5 ? 'موجود در انبار' : `فقط ${faDigits(product.inventory)} عدد باقی مانده`}
                  </span>
                </div>
              </div>

              <div className="pdp__price">
                <span className="tnum">{formatToman(product.price)}</span>
                {product.oldPrice && <span className="pcard__old tnum">{formatToman(product.oldPrice)}</span>}
                {product.discount > 0 && <span className="badge badge--sale">{faDigits(product.discount)}٪ تخفیف</span>}
              </div>

              <p className="lead" style={{ fontSize: '0.94rem' }}>
                {product.shortDescription}
              </p>

              <div className="pdp__block">
                <div className="pdp__block-head">
                  <span className="label">COLOR / {COLOR_MAP[color].name}</span>
                </div>
                <div className="color-row">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      className={`color-btn ${color === c ? 'is-active' : ''}`}
                      onClick={() => setColor(c)}
                      aria-pressed={color === c}
                    >
                      <span className="color-btn__dot" style={{ background: COLOR_MAP[c].hex }} />
                      {COLOR_MAP[c].name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pdp__block">
                <div className="pdp__block-head">
                  <span className="label">SIZE</span>
                  <button className="link-underline" onClick={() => setGuide(true)} style={{ fontSize: '0.78rem' }}>
                    راهنمای سایز
                  </button>
                </div>
                <div className="size-grid">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      className={`size-btn ${size === s ? 'is-active' : ''}`}
                      onClick={() => setSize(s)}
                      aria-pressed={size === s}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {!size && <p className="field__error">برای ادامه، سایز را انتخاب کنید.</p>}
              </div>

              <div className="pdp__block">
                <div className="pdp__block-head">
                  <span className="label">QUANTITY</span>
                </div>
                <div className="qty" style={{ width: 'fit-content' }}>
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="کاهش تعداد">
                    −
                  </button>
                  <span>{faDigits(qty)}</span>
                  <button onClick={() => setQty((q) => Math.min(product.inventory, q + 1))} aria-label="افزایش تعداد">
                    +
                  </button>
                </div>
              </div>

              <div className="pdp__actions">
                <div className="pdp__cta">
                  <button
                    className="btn"
                    disabled={!size}
                    onClick={() => {
                      addToCart(product, { size, color, qty })
                      setQty(1)
                    }}
                    aria-label={size ? 'افزودن به سبد خرید' : 'ابتدا سایز را انتخاب کنید'}
                  >
                    افزودن به سبد خرید
                  </button>
                  <button className="btn btn--ghost" disabled={!size} onClick={buyNow}>
                    خرید سریع
                  </button>
                </div>
                <button
                  className="btn btn--ghost"
                  onClick={() => toggleWishlist(product.id)}
                  aria-pressed={wished}
                >
                  <IconHeart filled={wished} /> {wished ? 'در علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
                </button>
              </div>

              <div className="panel" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span className="chip">
                  <IconTruck size={16} /> ارسال سریع ۲۴ ساعته در تهران
                </span>
                <span className="chip">
                  <IconShield size={16} /> ۷ روز بازگشت بدون دلیل
                </span>
                <span className="chip">
                  <IconSnow size={16} /> تست‌شده تا {product.features[0].value}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- specs tabs ---------- */}
      <section className="section section--tight section--frost">
        <div className="container">
          <div className="tabs" role="tablist" aria-label="اطلاعات محصول">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                className={tab === t.id ? 'is-active' : ''}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ paddingBlockStart: 30 }}>
            {tab === 'details' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 'clamp(20px,3vw,50px)' }}>
                <div>
                  <h2 className="h-sec">درباره {product.name}</h2>
                  <p className="lead" style={{ marginBlockStart: 16 }}>
                    {product.description}
                  </p>
                  <ul style={{ marginBlockStart: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {product.materials.map((m) => (
                      <li key={m} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <IconCheck size={18} />
                        <span className="mono">{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="spec-list" style={{ gridTemplateColumns: '1fr' }}>
                  {product.features.map((f) => (
                    <div className="spec" key={f.label}>
                      <span className="spec__k">{f.label}</span>
                      <span className="spec__v">{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'tech' && (
              <div className="spec-list">
                {[
                  { k: 'پارچه بیرونی', v: product.materials[0] },
                  { k: 'عایق', v: product.materials[1] || 'Synthetic Thermal Fill' },
                  { k: 'درز', v: 'کاملاً چسب‌خورده / Taped' },
                  { k: 'ستون آب', v: '۱۰,۰۰۰ mm' },
                  { k: 'تنفس‌پذیری', v: '۵,۰۰۰ g/m²/24h' },
                  { k: 'زیپ', v: 'YKK Aquaguard' },
                ].map((r) => (
                  <div className="spec" key={r.k}>
                    <span className="spec__k">{r.k}</span>
                    <span className="spec__v">{r.v}</span>
                  </div>
                ))}
              </div>
            )}

            {tab === 'fit' && (
              <div style={{ maxWidth: '70ch' }}>
                <p className="lead">
                  برش این قطعه {product.tags.includes('اوورسایز') ? 'اوورسایز و مکعبی' : 'استاندارد و مستقیم'} است. اگر
                  بین دو سایز هستید، سایز بزرگ‌تر انتخاب کنید تا لایه‌ی میانی زیر آن جا شود.
                </p>
                <button className="btn btn--ghost" style={{ marginBlockStart: 20 }} onClick={() => setGuide(true)}>
                  مشاهده جدول اندازه‌ها
                </button>
              </div>
            )}

            {tab === 'care' && (
              <ul className="lead" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <li>شست‌وشو با آب سرد (۳۰ درجه) و برنامه‌ی ملایم.</li>
                <li>استفاده از مایع شوینده‌ی مخصوص لباس فنی؛ بدون نرم‌کننده.</li>
                <li>خشک کردن در سایه و به‌صورت خوابیده.</li>
                <li>اتو با دمای پایین و بدون تماس مستقیم با سطح پارچه.</li>
              </ul>
            )}

            {tab === 'shipping' && (
              <p className="lead">
                ارسال عادی ۳ تا ۵ روز کاری و ارسال سریع ۲۴ ساعته در تهران. سفارش‌های بالای ۵,۰۰۰,۰۰۰ تومان ارسال عادی
                رایگان دارند. بسته‌بندی فریز بدون پلاستیک یک‌بارمصرف است.
              </p>
            )}

            {tab === 'returns' && (
              <p className="lead">
                تا ۷ روز پس از دریافت، در صورت استفاده‌نشدن کالا و سالم بودن اتیکت، بازگشت یا تعویض سایز ممکن است.
                هزینه‌ی ارسال بازگشت برای معایب تولیدی بر عهده‌ی فریز است.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ---------- reviews ---------- */}
      <section className="section section--tight">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,0.7fr) minmax(0,1.3fr)', gap: 'clamp(20px,3vw,50px)' }}>
            <div>
              <span className="label">REVIEWS / SYSTEM</span>
              <h2 className="h-sec" style={{ marginBlockStart: 12 }}>
                دیدگاه‌ها
              </h2>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBlockStart: 16 }}>
                <span className="display display--sm">{product.rating.toLocaleString('fa-IR')}</span>
                <span className="muted">از ۵ — {faDigits(product.reviewsCount)} دیدگاه</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {reviews.map((r) => (
                <div key={r.id} style={{ paddingBlock: 18, borderBlockEnd: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <b>{r.author}</b>
                    <span className="muted" style={{ fontSize: '0.78rem' }}>
                      {r.date}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 3, marginBlock: 8 }} aria-label={`امتیاز ${r.rating} از ۵`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <IconStar key={i} size={14} filled={i < r.rating} />
                    ))}
                  </div>
                  <p className="muted" style={{ fontSize: '0.9rem' }}>
                    {r.body}
                  </p>
                </div>
              ))}
              <button
                className="btn btn--ghost btn--sm"
                style={{ marginBlockStart: 20, width: 'fit-content' }}
                onClick={() => toast('فرم ثبت دیدگاه پس از اتصال حساب کاربری فعال می‌شود.', 'info')}
              >
                ثبت دیدگاه
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- related ---------- */}
      <section className="section section--tight">
        <div className="container">
          <div className="sec-head">
            <div>
              <span className="label">RELATED / SYSTEM</span>
              <h2 className="h-sec" style={{ marginBlockStart: 10 }}>
                پیشنهاد فریز
              </h2>
            </div>
          </div>
          <ProductGrid products={related} />
        </div>
      </section>

      <SizeGuideModal open={guide} onClose={() => setGuide(false)} />
    </>
  )
}
