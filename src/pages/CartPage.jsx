import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../components/Bits.jsx'
import SceneImage from '../components/SceneImage.jsx'
import { COLOR_MAP, products } from '../data/catalog.js'
import { shippingMethods } from '../data/content.js'
import { faDigits, formatToman, useShop } from '../state/ShopProvider.jsx'
import { IconBag, IconMinus, IconPlus, IconTrash } from '../components/Icons.jsx'

export default function CartPage() {
  const {
    cartLines, subtotal, discount, shippingCost, total, setQty, removeLine, applyCoupon, removeCoupon,
    state, activeShipping, setShipping, toast,
  } = useShop()

  const recommended = products.filter((p) => !state.items.some((l) => l.id === p.id)).slice(0, 4)

  if (!cartLines.length) {
    return (
      <section className="section container" style={{ paddingBlockStart: 180, paddingBlockEnd: 120 }}>
        <div className="empty">
          <div className="empty__mark" aria-hidden="true">
            <IconBag />
          </div>
          <h1 className="h-sec">سبد خرید خالی است</h1>
          <p className="lead">هنوز چیزی برای زمستان انتخاب نکرده‌اید.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link className="btn" to="/shop">
              رفتن به فروشگاه
            </Link>
            <Link className="btn btn--ghost" to="/collections">
              مرور کالکشن‌ها
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <header className="page-head">
        <div className="container">
          <Breadcrumbs items={[{ label: 'سبد خرید' }]} />
          <div style={{ marginBlockStart: 18 }}>
            <span className="label">CART / SYSTEM</span>
            <h1 className="display display--md" style={{ marginBlockStart: 12 }}>
              سبد خرید
            </h1>
          </div>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container">
          <div className="cart-layout">
            <div>
              {cartLines.map((line) => (
                <div className="cline" key={line.key} style={{ gridTemplateColumns: '110px 1fr auto' }}>
                  <Link className="cline__media" to={`/product/${line.product.slug}`}>
                    <SceneImage
                      variant={line.product.images[0].variant}
                      seed={line.product.images[0].seed}
                      ratio="3/4"
                      alt={line.product.name}
                    />
                  </Link>
                  <div className="cline__info">
                    <Link to={`/product/${line.product.slug}`} className="h-card">
                      {line.product.name}
                    </Link>
                    <span className="label">{line.product.category}</span>
                    <div className="cline__opts">
                      <span className="cline__opt">
                        سایز <b>{line.size}</b>
                      </span>
                      <span className="cline__opt">
                        رنگ <b>{COLOR_MAP[line.color]?.name}</b>
                      </span>
                      <span className="cline__opt">
                        موجودی <b>{faDigits(line.product.inventory)}</b>
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBlockStart: 6 }}>
                      <div className="qty">
                        <button onClick={() => setQty(line.key, line.qty - 1)} aria-label="کاهش تعداد">
                          <IconMinus size={16} />
                        </button>
                        <span>{faDigits(line.qty)}</span>
                        <button onClick={() => setQty(line.key, line.qty + 1)} aria-label="افزایش تعداد">
                          <IconPlus size={16} />
                        </button>
                      </div>
                      <button
                        className="link-underline"
                        onClick={() => {
                          removeLine(line.key)
                          toast(`«${line.product.name}» از سبد حذف شد`, 'info')
                        }}
                        style={{ fontSize: '0.78rem' }}
                      >
                        <IconTrash size={14} /> حذف
                      </button>
                    </div>
                  </div>
                  <div style={{ textAlign: 'end', fontWeight: 700 }} className="tnum">
                    {formatToman(line.lineTotal)}
                  </div>
                </div>
              ))}

              <div style={{ marginBlockStart: 34 }}>
                <span className="label">RECOMMENDED / SYSTEM</span>
                <div className="pgrid pgrid--2" style={{ marginBlockStart: 16 }}>
                  {recommended.slice(0, 2).map((p) => (
                    <Link key={p.id} className="pcard" to={`/product/${p.slug}`}>
                      <div className="pcard__media">
                        <SceneImage variant={p.images[0].variant} seed={p.images[0].seed} alt={p.name} />
                      </div>
                      <div className="pcard__body">
                        <span className="h-card">{p.name}</span>
                        <span className="pcard__price">{formatToman(p.price)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <aside className="summary-card panel" aria-label="خلاصه سفارش">
              <h2 className="h-card">خلاصه سفارش</h2>

              <div>
                <span className="label">SHIPPING METHOD</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBlockStart: 12 }}>
                  {shippingMethods.map((m) => (
                    <label key={m.id} className={`radio-card ${activeShipping.id === m.id ? 'is-active' : ''}`}>
                      <span>
                        <span className="radio-card__title">{m.name}</span>
                        <span className="radio-card__desc" style={{ display: 'block' }}>
                          {m.desc}
                        </span>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span className="tnum" style={{ fontSize: '0.82rem' }}>
                          {m.cost === 0 ? 'رایگان' : formatToman(m.cost)}
                        </span>
                        <input
                          type="radio"
                          name="shipping-page"
                          checked={activeShipping.id === m.id}
                          onChange={() => setShipping(m.id)}
                        />
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const value = new FormData(e.currentTarget).get('coupon')
                  const res = applyCoupon(value)
                  toast(res.ok ? 'کد تخفیف اعمال شد' : 'این کد تخفیف معتبر نیست.', res.ok ? 'ok' : 'info')
                }}
              >
                <span className="label">COUPON</span>
                <div className="newsletter" style={{ borderColor: 'var(--line-strong)', background: 'rgba(244,247,248,.6)', marginBlockStart: 10 }}>
                  <input name="coupon" placeholder="کد تخفیف" aria-label="کد تخفیف" style={{ color: 'var(--ink)' }} />
                  <button className="btn btn--sm" type="submit">
                    اعمال
                  </button>
                </div>
                {state.coupon && (
                  <p className="muted" style={{ fontSize: '0.78rem', marginBlockStart: 10 }}>
                    کد <b>{state.coupon}</b> فعال است.{' '}
                    <button type="button" className="link-underline" onClick={removeCoupon}>
                      حذف
                    </button>
                  </p>
                )}
              </form>

              <div className="totals">
                <div className="totals__row">
                  <span>جمع سبد</span>
                  <span className="tnum">{formatToman(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="totals__row totals__row--off">
                    <span>تخفیف</span>
                    <span className="tnum">− {formatToman(discount)}</span>
                  </div>
                )}
                <div className="totals__row">
                  <span>هزینه ارسال</span>
                  <span className="tnum">{shippingCost === 0 ? 'رایگان' : formatToman(shippingCost)}</span>
                </div>
                <div className="totals__row totals__row--grand">
                  <span>مبلغ نهایی</span>
                  <span className="tnum">{formatToman(total)}</span>
                </div>
              </div>

              <Link className="btn btn--block" to="/checkout">
                تکمیل سفارش
              </Link>
              <Link className="btn btn--ghost btn--block" to="/shop">
                ادامه خرید
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
