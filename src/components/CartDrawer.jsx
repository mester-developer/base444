import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useShop, formatToman } from '../state/ShopProvider.jsx'
import { COLOR_MAP } from '../data/catalog.js'
import SceneImage from './SceneImage.jsx'
import { IconClose, IconMinus, IconPlus, IconTrash } from './Icons.jsx'

export default function CartDrawer() {
  const {
    ui, closeCart, cartLines, count, subtotal, discount, shippingCost, total,
    removeLine, setQty, applyCoupon, removeCoupon, state, toast,
  } = useShop()
  const [code, setCode] = useState('')
  const [couponError, setCouponError] = useState('')

  useEffect(() => {
    if (!ui.cartOpen) return undefined
    const onKey = (e) => e.key === 'Escape' && closeCart()
    document.addEventListener('keydown', onKey)
    document.body.setAttribute('data-locked', 'true')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.removeAttribute('data-locked')
    }
  }, [ui.cartOpen, closeCart])

  if (!ui.cartOpen) return null

  const submitCoupon = (e) => {
    e.preventDefault()
    const res = applyCoupon(code)
    if (res.ok) {
      setCouponError('')
      setCode('')
      toast('کد تخفیف اعمال شد')
    } else {
      setCouponError('این کد تخفیف معتبر نیست.')
    }
  }

  return (
    <>
      <div className="drawer-scrim" onClick={closeCart} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="سبد خرید">
        <div className="drawer__head">
          <div>
            <span className="label">CART / SYSTEM</span>
            <h2 className="h-card" style={{ marginBlockStart: 4 }}>
              سبد خرید ({count.toLocaleString('fa-IR')})
            </h2>
          </div>
          <button className="iconbtn" onClick={closeCart} aria-label="بستن سبد">
            <IconClose />
          </button>
        </div>

        <div className="drawer__body">
          {cartLines.length === 0 ? (
            <div className="empty">
              <div className="empty__mark" aria-hidden="true">
                <IconTrash />
              </div>
              <h3 className="h-card">سبد خرید خالی است</h3>
              <p className="muted">هنوز چیزی برای زمستان انتخاب نکرده‌اید.</p>
              <Link to="/shop" className="btn btn--ghost" onClick={closeCart}>
                رفتن به فروشگاه
              </Link>
            </div>
          ) : (
            <ul>
              {cartLines.map((line) => (
                <li className="cline" key={line.key}>
                  <Link
                    className="cline__media"
                    to={`/product/${line.product.slug}`}
                    onClick={closeCart}
                    aria-label={line.product.name}
                  >
                    <SceneImage
                      variant={line.product.images[0].variant}
                      seed={line.product.images[0].seed}
                      ratio="3/4"
                      alt={line.product.name}
                    />
                  </Link>
                  <div className="cline__info">
                    <Link to={`/product/${line.product.slug}`} onClick={closeCart} className="h-card">
                      {line.product.name}
                    </Link>
                    <div className="cline__opts">
                      <span className="cline__opt">
                        سایز <b>{line.size}</b>
                      </span>
                      <span className="cline__opt">
                        رنگ <b>{COLOR_MAP[line.color]?.name}</b>
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBlockStart: 4 }}>
                      <div className="qty">
                        <button
                          onClick={() => setQty(line.key, line.qty - 1)}
                          aria-label="کاهش تعداد"
                        >
                          <IconMinus size={16} />
                        </button>
                        <span>{line.qty.toLocaleString('fa-IR')}</span>
                        <button
                          onClick={() => setQty(line.key, line.qty + 1)}
                          aria-label="افزایش تعداد"
                        >
                          <IconPlus size={16} />
                        </button>
                      </div>
                      <button
                        className="link-underline"
                        onClick={() => removeLine(line.key)}
                        style={{ fontSize: '0.76rem' }}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                  <div style={{ textAlign: 'end', fontWeight: 700, fontSize: '0.86rem' }}>
                    {formatToman(line.lineTotal)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartLines.length > 0 && (
          <div className="drawer__foot">
            <form onSubmit={submitCoupon} style={{ width: '100%' }}>
              <div className="newsletter" style={{ borderColor: 'var(--line-strong)', background: 'rgba(244,247,248,.5)' }}>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="کد تخفیف (مثلاً FRIZ10)"
                  aria-label="کد تخفیف"
                  style={{ color: 'var(--ink)' }}
                />
                <button className="btn btn--sm" type="submit">
                  اعمال
                </button>
              </div>
              {couponError && <p className="field__error" role="alert" style={{ marginBlockStart: 8 }}>{couponError}</p>}
              {state.coupon && (
                <p className="muted" style={{ fontSize: '0.78rem', marginBlockStart: 8 }}>
                  کد <b>{state.coupon}</b> فعال است.{' '}
                  <button className="link-underline" onClick={removeCoupon} type="button">
                    حذف کد
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

            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/cart" className="btn btn--ghost" onClick={closeCart} style={{ flex: 1 }}>
                ادامه خرید
              </Link>
              <Link to="/checkout" className="btn" onClick={closeCart} style={{ flex: 1 }}>
                تکمیل سفارش
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
