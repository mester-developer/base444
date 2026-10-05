import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Breadcrumbs } from '../components/Bits.jsx'
import SceneImage from '../components/SceneImage.jsx'
import { provinces, shippingMethods } from '../data/content.js'
import { COLOR_MAP } from '../data/catalog.js'
import { faDigits, formatToman, useShop } from '../state/ShopProvider.jsx'
import { IconCheck, IconShield, IconTruck } from '../components/Icons.jsx'

const STEPS = ['اطلاعات گیرنده', 'آدرس', 'روش ارسال', 'پرداخت', 'تأیید سفارش']

export default function Checkout() {
  const navigate = useNavigate()
  const { cartLines, subtotal, discount, shippingCost, total, activeShipping, setShipping, applyCoupon, state, placeOrder, toast } = useShop()
  const [step, setStep] = useState(0)
  const [placed, setPlaced] = useState(null)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    province: 'تهران',
    city: '',
    address: '',
    postalCode: '',
    note: '',
    payment: 'online',
    coupon: '',
  })

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setErrors((x) => ({ ...x, [key]: '' }))
  }

  const validateStep = () => {
    const next = {}
    if (step === 0) {
      if (!form.firstName.trim()) next.firstName = 'نام را وارد کنید.'
      if (!form.lastName.trim()) next.lastName = 'نام خانوادگی را وارد کنید.'
      if (!/^09\d{9}$/.test(form.phone)) next.phone = 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.'
      if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'ایمیل معتبر نیست.'
    }
    if (step === 1) {
      if (!form.city.trim()) next.city = 'شهر را وارد کنید.'
      if (!form.address.trim() || form.address.trim().length < 10) next.address = 'نشانی کامل (حداقل ۱۰ نویسه) را وارد کنید.'
      if (!/^\d{10}$/.test(form.postalCode)) next.postalCode = 'کد پستی باید ۱۰ رقم باشد.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const goNext = () => {
    if (!validateStep()) return
    setStep((s) => Math.min(STEPS.length - 1, s + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goBack = () => {
    setStep((s) => Math.max(0, s - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const finish = () => {
    const order = placeOrder({
      customer: { name: `${form.firstName} ${form.lastName}`, phone: form.phone, email: form.email },
      address: { province: form.province, city: form.city, address: form.address, postalCode: form.postalCode },
      shipping: activeShipping.name,
      payment: form.payment === 'online' ? 'پرداخت آنلاین' : 'پرداخت هنگام تحویل',
      note: form.note,
    })
    setPlaced(order)
    toast('سفارش شما ثبت شد')
  }

  if (!cartLines.length && !placed) {
    return (
      <section className="section container" style={{ paddingBlockStart: 180 }}>
        <div className="empty">
          <h1 className="h-sec">برای تکمیل سفارش، سبد خرید نباید خالی باشد</h1>
          <p className="lead">ابتدا محصولی را انتخاب کنید.</p>
          <Link className="btn" to="/shop">
            رفتن به فروشگاه
          </Link>
        </div>
      </section>
    )
  }

  if (placed) {
    return (
      <section className="section container" style={{ paddingBlockStart: 170, paddingBlockEnd: 120 }}>
        <div className="empty" style={{ maxWidth: 720, marginInline: 'auto' }}>
          <div className="empty__mark" aria-hidden="true" style={{ background: 'var(--night)', color: 'var(--ice-050)', borderColor: 'var(--night)' }}>
            <IconCheck size={30} />
          </div>
          <span className="label">ORDER CONFIRMED</span>
          <h1 className="h-sec">سفارش شما ثبت شد</h1>
          <p className="lead">
            شماره سفارش <b className="tnum">{placed.id}</b> — {placed.payment}. جزئیات به شماره{' '}
            <b className="tnum">{placed.customer.phone}</b> پیامک می‌شود.
          </p>
          <div className="panel" style={{ padding: 20, width: '100%', textAlign: 'start' }}>
            <div className="totals">
              <div className="totals__row">
                <span>مبلغ نهایی</span>
                <span className="tnum">{formatToman(placed.total)}</span>
              </div>
              <div className="totals__row">
                <span>روش ارسال</span>
                <span>{placed.shipping}</span>
              </div>
              <div className="totals__row">
                <span>گیرنده</span>
                <span>{placed.customer.name}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link className="btn" to={`/account/orders/${placed.id}`}>
              پیگیری سفارش
            </Link>
            <Link className="btn btn--ghost" to="/shop">
              ادامه خرید
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <header className="page-head" style={{ paddingBlockEnd: 0 }}>
        <div className="container">
          <Breadcrumbs items={[{ label: 'سبد خرید', to: '/cart' }, { label: 'تکمیل سفارش' }]} />
          <div style={{ marginBlockStart: 18 }}>
            <span className="label">CHECKOUT / SYSTEM</span>
            <h1 className="display display--md" style={{ marginBlockStart: 12 }}>
              تکمیل سفارش
            </h1>
          </div>

          <ol className="steps">
            {STEPS.map((s, i) => (
              <li key={s} className="step" style={{ display: 'contents' }}>
                <span className={`step ${i === step ? 'is-active' : ''} ${i < step ? 'is-done' : ''}`}>
                  <span className="step__num">{faDigits(i + 1)}</span>
                  {s}
                </span>
                {i < STEPS.length - 1 && <span className="step-sep" aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container">
          <div className="checkout-layout">
            <div className="checkout-form">
              {step === 0 && (
                <div>
                  <h2 className="h-sec">۱. اطلاعات گیرنده</h2>
                  <div className="form-grid" style={{ marginBlockStart: 22 }}>
                    <div className="field">
                      <label className="field__label" htmlFor="firstName">
                        نام
                      </label>
                      <input
                        id="firstName"
                        className={`input ${errors.firstName ? 'is-invalid' : ''}`}
                        value={form.firstName}
                        onChange={set('firstName')}
                        aria-invalid={Boolean(errors.firstName)}
                        aria-describedby={errors.firstName ? 'firstName-err' : undefined}
                      />
                      {errors.firstName && (
                        <span className="field__error" id="firstName-err" role="alert">
                          {errors.firstName}
                        </span>
                      )}
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="lastName">
                        نام خانوادگی
                      </label>
                      <input
                        id="lastName"
                        className={`input ${errors.lastName ? 'is-invalid' : ''}`}
                        value={form.lastName}
                        onChange={set('lastName')}
                      />
                      {errors.lastName && (
                        <span className="field__error" role="alert">
                          {errors.lastName}
                        </span>
                      )}
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="phone">
                        شماره موبایل
                      </label>
                      <input
                        id="phone"
                        inputMode="numeric"
                        dir="ltr"
                        className={`input ${errors.phone ? 'is-invalid' : ''}`}
                        value={form.phone}
                        onChange={set('phone')}
                        placeholder="09xxxxxxxxx"
                      />
                      {errors.phone && (
                        <span className="field__error" role="alert">
                          {errors.phone}
                        </span>
                      )}
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="email">
                        ایمیل <span className="muted">(اختیاری)</span>
                      </label>
                      <input
                        id="email"
                        dir="ltr"
                        className={`input ${errors.email ? 'is-invalid' : ''}`}
                        value={form.email}
                        onChange={set('email')}
                      />
                      {errors.email && (
                        <span className="field__error" role="alert">
                          {errors.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 className="h-sec">۲. آدرس تحویل</h2>
                  <div className="form-grid" style={{ marginBlockStart: 22 }}>
                    <div className="field">
                      <label className="field__label" htmlFor="province">
                        استان
                      </label>
                      <select id="province" className="select" value={form.province} onChange={set('province')}>
                        {provinces.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="city">
                        شهر
                      </label>
                      <input id="city" className={`input ${errors.city ? 'is-invalid' : ''}`} value={form.city} onChange={set('city')} />
                      {errors.city && (
                        <span className="field__error" role="alert">
                          {errors.city}
                        </span>
                      )}
                    </div>
                    <div className="field field--full">
                      <label className="field__label" htmlFor="address">
                        نشانی کامل
                      </label>
                      <textarea
                        id="address"
                        className={`textarea ${errors.address ? 'is-invalid' : ''}`}
                        value={form.address}
                        onChange={set('address')}
                      />
                      {errors.address && (
                        <span className="field__error" role="alert">
                          {errors.address}
                        </span>
                      )}
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="postalCode">
                        کد پستی
                      </label>
                      <input
                        id="postalCode"
                        inputMode="numeric"
                        dir="ltr"
                        className={`input ${errors.postalCode ? 'is-invalid' : ''}`}
                        value={form.postalCode}
                        onChange={set('postalCode')}
                      />
                      {errors.postalCode && (
                        <span className="field__error" role="alert">
                          {errors.postalCode}
                        </span>
                      )}
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="note">
                        یادداشت برای پیک <span className="muted">(اختیاری)</span>
                      </label>
                      <input id="note" className="input" value={form.note} onChange={set('note')} />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="h-sec">۳. روش ارسال</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBlockStart: 22 }}>
                    {shippingMethods.map((m) => (
                      <label key={m.id} className={`radio-card ${activeShipping.id === m.id ? 'is-active' : ''}`}>
                        <span>
                          <span className="radio-card__title">{m.name}</span>
                          <span className="radio-card__desc" style={{ display: 'block' }}>
                            {m.desc}
                          </span>
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span className="tnum" style={{ fontSize: '0.84rem' }}>
                            {m.cost === 0 ? 'رایگان' : formatToman(m.cost)}
                          </span>
                          <input
                            type="radio"
                            name="shipping"
                            checked={activeShipping.id === m.id}
                            onChange={() => setShipping(m.id)}
                          />
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="h-sec">۴. پرداخت</h2>
                  <div className="form-grid" style={{ marginBlockStart: 22 }}>
                    <label className={`radio-card ${form.payment === 'online' ? 'is-active' : ''}`}>
                      <span>
                        <span className="radio-card__title">پرداخت آنلاین</span>
                        <span className="radio-card__desc" style={{ display: 'block' }}>
                          انتقال به درگاه بانکی
                        </span>
                      </span>
                      <input type="radio" name="payment" checked={form.payment === 'online'} onChange={() => setForm((f) => ({ ...f, payment: 'online' }))} />
                    </label>
                    <label className={`radio-card ${form.payment === 'cod' ? 'is-active' : ''}`}>
                      <span>
                        <span className="radio-card__title">پرداخت هنگام تحویل</span>
                        <span className="radio-card__desc" style={{ display: 'block' }}>
                          فقط تهران و مراکز استان‌ها
                        </span>
                      </span>
                      <input type="radio" name="payment" checked={form.payment === 'cod'} onChange={() => setForm((f) => ({ ...f, payment: 'cod' }))} />
                    </label>
                  </div>

                  <form
                    style={{ marginBlockStart: 26, maxWidth: 420 }}
                    onSubmit={(e) => {
                      e.preventDefault()
                      const value = new FormData(e.currentTarget).get('couponCheckout')
                      const res = applyCoupon(value)
                      toast(res.ok ? 'کد تخفیف اعمال شد' : 'این کد تخفیف معتبر نیست.', res.ok ? 'ok' : 'info')
                    }}
                  >
                    <span className="label">COUPON</span>
                    <div className="newsletter" style={{ borderColor: 'var(--line-strong)', background: 'rgba(244,247,248,.6)', marginBlockStart: 10 }}>
                      <input name="couponCheckout" placeholder="کد تخفیف" aria-label="کد تخفیف" style={{ color: 'var(--ink)' }} />
                      <button className="btn btn--sm" type="submit">
                        اعمال
                      </button>
                    </div>
                    {state.coupon && (
                      <p className="muted" style={{ fontSize: '0.78rem', marginBlockStart: 10 }}>
                        کد <b>{state.coupon}</b> فعال است.
                      </p>
                    )}
                  </form>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="h-sec">۵. تأیید سفارش</h2>
                  <p className="lead" style={{ marginBlockStart: 14 }}>
                    اطلاعات را بررسی کنید. پس از ثبت، سفارش در بخش «سفارش‌های من» قابل پیگیری است.
                  </p>

                  <div className="spec-list" style={{ gridTemplateColumns: '1fr', marginBlockStart: 22 }}>
                    <div className="spec">
                      <span className="spec__k">گیرنده</span>
                      <span className="spec__v">
                        {form.firstName} {form.lastName} — <span className="tnum">{form.phone}</span>
                      </span>
                    </div>
                    <div className="spec">
                      <span className="spec__k">نشانی</span>
                      <span className="spec__v">
                        {form.province}، {form.city}، {form.address} — کد پستی {faDigits(form.postalCode)}
                      </span>
                    </div>
                    <div className="spec">
                      <span className="spec__k">روش ارسال</span>
                      <span className="spec__v">
                        {activeShipping.name} ({activeShipping.desc})
                      </span>
                    </div>
                    <div className="spec">
                      <span className="spec__k">پرداخت</span>
                      <span className="spec__v">{form.payment === 'online' ? 'پرداخت آنلاین' : 'پرداخت هنگام تحویل'}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="checkout-actions">
                {step > 0 ? (
                  <button className="btn btn--ghost" onClick={goBack}>
                    مرحله قبل
                  </button>
                ) : (
                  <Link className="btn btn--ghost" to="/cart">
                    بازگشت به سبد
                  </Link>
                )}
                {step < STEPS.length - 1 ? (
                  <button className="btn" onClick={goNext}>
                    مرحله بعد
                  </button>
                ) : (
                  <button className="btn" onClick={finish}>
                    ثبت نهایی سفارش
                  </button>
                )}
              </div>
            </div>

            <aside className="summary-card panel" aria-label="خلاصه سفارش">
              <h2 className="h-card">خلاصه سفارش</h2>
              <div className="order-lines">
                {cartLines.map((l) => (
                  <div className="order-line" key={l.key}>
                    <div className="order-line__media">
                      <SceneImage variant={l.product.images[0].variant} seed={l.product.images[0].seed} ratio="3/4" alt={l.product.name} />
                    </div>
                    <div>
                      <b style={{ fontSize: '0.86rem' }}>{l.product.name}</b>
                      <div className="muted" style={{ fontSize: '0.74rem' }}>
                        سایز {l.size} · {COLOR_MAP[l.color]?.name} · {faDigits(l.qty)} عدد
                      </div>
                    </div>
                    <span className="tnum" style={{ fontSize: '0.82rem' }}>
                      {formatToman(l.lineTotal)}
                    </span>
                  </div>
                ))}
              </div>

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
                  <span>ارسال</span>
                  <span className="tnum">{shippingCost === 0 ? 'رایگان' : formatToman(shippingCost)}</span>
                </div>
                <div className="totals__row totals__row--grand">
                  <span>مبلغ نهایی</span>
                  <span className="tnum">{formatToman(total)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.78rem' }} className="muted">
                <span className="chip">
                  <IconTruck size={15} /> {activeShipping.desc}
                </span>
                <span className="chip">
                  <IconShield size={15} /> پرداخت امن
                </span>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
