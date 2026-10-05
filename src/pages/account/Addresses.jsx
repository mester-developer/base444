import { useState } from 'react'
import { provinces } from '../../data/content.js'
import { faDigits, useShop } from '../../state/ShopProvider.jsx'
import { IconPin, IconTrash } from '../../components/Icons.jsx'

const empty = { title: '', province: 'تهران', city: '', address: '', postalCode: '' }

export default function Addresses() {
  const { state, addAddress, removeAddress, toast } = useShop()
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.title.trim()) next.title = 'برای آدرس یک عنوان بگذارید (مثلاً خانه).'
    if (!form.city.trim()) next.city = 'شهر را وارد کنید.'
    if (!form.address.trim()) next.address = 'نشانی کامل را وارد کنید.'
    if (!/^\d{10}$/.test(form.postalCode)) next.postalCode = 'کد پستی باید ۱۰ رقم باشد.'
    setErrors(next)
    if (Object.keys(next).length) return
    addAddress(form)
    setForm(empty)
  }

  return (
    <div>
      <span className="label">ADDRESSES / BOOK</span>
      <h2 className="h-sec" style={{ marginBlockStart: 10, fontSize: '1.6rem' }}>
        آدرس‌ها
      </h2>

      {state.addresses.length === 0 ? (
        <div className="panel" style={{ padding: 20, marginBlock: 22 }}>
          <b>هنوز آدرسی ثبت نکرده‌اید</b>
          <p className="muted" style={{ fontSize: '0.86rem', marginBlockStart: 8 }}>
            آدرس‌ها برای تکمیل سریع‌تر سفارش‌های بعدی ذخیره می‌شوند.
          </p>
        </div>
      ) : (
        <div className="orders-list" style={{ marginBlock: 22 }}>
          {state.addresses.map((a) => (
            <div className="order-card" key={a.id}>
              <div className="order-card__head" style={{ gridTemplateColumns: '1fr auto' }}>
                <div>
                  <span className="label">{a.title}</span>
                  <b style={{ display: 'block' }}>
                    {a.province}، {a.city}
                  </b>
                  <span className="muted" style={{ fontSize: '0.84rem' }}>
                    {a.address} — کد پستی {faDigits(a.postalCode)}
                  </span>
                </div>
                <button
                  className="iconbtn"
                  onClick={() => {
                    removeAddress(a.id)
                    toast('آدرس حذف شد', 'info')
                  }}
                  aria-label={`حذف آدرس ${a.title}`}
                >
                  <IconTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <form className="form-grid" style={{ maxWidth: 720, marginBlockStart: 10 }} onSubmit={submit} noValidate>
        <div className="field">
          <label className="field__label" htmlFor="aTitle">
            عنوان
          </label>
          <input
            id="aTitle"
            className={`input ${errors.title ? 'is-invalid' : ''}`}
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="خانه / محل کار"
          />
          {errors.title && (
            <span className="field__error" role="alert">
              {errors.title}
            </span>
          )}
        </div>
        <div className="field">
          <label className="field__label" htmlFor="aProvince">
            استان
          </label>
          <select id="aProvince" className="select" value={form.province} onChange={(e) => setForm((f) => ({ ...f, province: e.target.value }))}>
            {provinces.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="aCity">
            شهر
          </label>
          <input
            id="aCity"
            className={`input ${errors.city ? 'is-invalid' : ''}`}
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
          />
          {errors.city && (
            <span className="field__error" role="alert">
              {errors.city}
            </span>
          )}
        </div>
        <div className="field">
          <label className="field__label" htmlFor="aPostal">
            کد پستی
          </label>
          <input
            id="aPostal"
            dir="ltr"
            inputMode="numeric"
            className={`input ${errors.postalCode ? 'is-invalid' : ''}`}
            value={form.postalCode}
            onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
          />
          {errors.postalCode && (
            <span className="field__error" role="alert">
              {errors.postalCode}
            </span>
          )}
        </div>
        <div className="field field--full">
          <label className="field__label" htmlFor="aAddress">
            نشانی کامل
          </label>
          <textarea
            id="aAddress"
            className={`textarea ${errors.address ? 'is-invalid' : ''}`}
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          />
          {errors.address && (
            <span className="field__error" role="alert">
              {errors.address}
            </span>
          )}
        </div>
        <div className="field field--full">
          <button className="btn" type="submit" style={{ width: 'fit-content' }}>
            <IconPin size={16} /> ذخیره آدرس
          </button>
        </div>
      </form>
    </div>
  )
}
