import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SceneImage from '../components/SceneImage.jsx'
import { useShop } from '../state/ShopProvider.jsx'

export default function Register() {
  const navigate = useNavigate()
  const { login, toast } = useShop()
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [errors, setErrors] = useState({})

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'نام را وارد کنید.'
    if (!/^09\d{9}$/.test(form.phone)) next.phone = 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'ایمیل معتبر نیست.'
    setErrors(next)
    if (Object.keys(next).length) return
    login({ name: form.name, phone: form.phone, email: form.email })
    toast('حساب شما ساخته شد — کد تأیید در حساب موجود است.', 'ok')
    navigate('/account')
  }

  return (
    <div className="auth-wrap" style={{ paddingBlockStart: 76 }}>
      <div className="auth-visual">
        <SceneImage variant="urban" seed={12} alt="زمستان شهری فریز" />
        <div className="auth-visual__quote">
          <span className="label" style={{ color: 'var(--text-invert-muted)' }}>
            JOIN / SYSTEM 01
          </span>
          <h2 className="display display--sm" style={{ marginBlockStart: 12 }}>
            عضو سیستم شوید
          </h2>
          <p className="lead" style={{ color: 'var(--text-invert-muted)', marginBlockStart: 12, maxWidth: '40ch' }}>
            اعضای فریز پیش از عرضه‌ی عمومی به دراپ‌های محدود دسترسی دارند.
          </p>
        </div>
      </div>

      <div className="auth-form-side">
        <form className="auth-card" onSubmit={submit} noValidate>
          <span className="label">REGISTER / NEW MEMBER</span>
          <h1 className="h-sec">ساخت حساب کاربری</h1>

          <div className="field">
            <label className="field__label" htmlFor="regName">
              نام
            </label>
            <input
              id="regName"
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
            <label className="field__label" htmlFor="regPhone">
              شماره موبایل
            </label>
            <input
              id="regPhone"
              dir="ltr"
              inputMode="numeric"
              className={`input ${errors.phone ? 'is-invalid' : ''}`}
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 11) }))}
              placeholder="09xxxxxxxxx"
            />
            {errors.phone && (
              <span className="field__error" role="alert">
                {errors.phone}
              </span>
            )}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="regEmail">
              ایمیل <span className="muted">(اختیاری)</span>
            </label>
            <input
              id="regEmail"
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

          <label className="check">
            <input type="checkbox" defaultChecked />
            <span>می‌خواهم از دراپ‌ها و اخبار فریز باخبر شوم.</span>
          </label>

          <button className="btn btn--block" type="submit">
            ساخت حساب
          </button>

          <p className="muted" style={{ fontSize: '0.84rem' }}>
            حساب دارید؟{' '}
            <Link className="link-underline" to="/login">
              ورود
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
