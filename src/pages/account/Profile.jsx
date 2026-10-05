import { useState } from 'react'
import { useShop } from '../../state/ShopProvider.jsx'

export default function Profile() {
  const { state, login, toast } = useShop()
  const [form, setForm] = useState({
    name: state.user?.name || '',
    phone: state.user?.phone || '',
    email: state.user?.email || '',
  })
  const [errors, setErrors] = useState({})

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'نام را وارد کنید.'
    if (!/^09\d{9}$/.test(form.phone)) next.phone = 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'ایمیل معتبر نیست.'
    setErrors(next)
    if (Object.keys(next).length) return
    login(form)
    toast('پروفایل ذخیره شد')
  }

  return (
    <div>
      <span className="label">PROFILE / MEMBER DATA</span>
      <h2 className="h-sec" style={{ marginBlockStart: 10, fontSize: '1.6rem' }}>
        پروفایل من
      </h2>

      <form className="form-grid" style={{ marginBlockStart: 24, maxWidth: 720 }} onSubmit={submit} noValidate>
        <div className="field">
          <label className="field__label" htmlFor="pName">
            نام و نام خانوادگی
          </label>
          <input
            id="pName"
            className={`input ${errors.name ? 'is-invalid' : ''}`}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          {errors.name && (
            <span className="field__error" role="alert">
              {errors.name}
            </span>
          )}
        </div>
        <div className="field">
          <label className="field__label" htmlFor="pPhone">
            شماره موبایل
          </label>
          <input
            id="pPhone"
            dir="ltr"
            inputMode="numeric"
            className={`input ${errors.phone ? 'is-invalid' : ''}`}
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 11) }))}
          />
          {errors.phone && (
            <span className="field__error" role="alert">
              {errors.phone}
            </span>
          )}
        </div>
        <div className="field field--full">
          <label className="field__label" htmlFor="pEmail">
            ایمیل <span className="muted">(اختیاری)</span>
          </label>
          <input
            id="pEmail"
            dir="ltr"
            className={`input ${errors.email ? 'is-invalid' : ''}`}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          {errors.email && (
            <span className="field__error" role="alert">
              {errors.email}
            </span>
          )}
        </div>
        <div className="field field--full">
          <button className="btn" type="submit" style={{ width: 'fit-content' }}>
            ذخیره تغییرات
          </button>
        </div>
      </form>

      <div className="pdp__block" style={{ marginBlockStart: 34, maxWidth: 720 }}>
        <span className="label">SETTINGS / NOTIFICATIONS</span>
        <label className="check">
          <input type="checkbox" defaultChecked />
          <span>اطلاع‌رسانی پیامکی برای دراپ‌های محدود</span>
        </label>
        <label className="check">
          <input type="checkbox" defaultChecked />
          <span>ایمیل خبرنامه‌ی فریز</span>
        </label>
        <label className="check">
          <input type="checkbox" />
          <span>پیشنهادهای شخصی‌سازی‌شده بر اساس علاقه‌مندی‌ها</span>
        </label>
      </div>
    </div>
  )
}
