import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SceneImage from '../components/SceneImage.jsx'
import { useShop, faDigits } from '../state/ShopProvider.jsx'

export default function Login() {
  const navigate = useNavigate()
  const { login, toast } = useShop()
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState(['', '', '', ''])
  const [phase, setPhase] = useState('phone')
  const [error, setError] = useState('')

  const sendCode = (e) => {
    e.preventDefault()
    if (!/^09\d{9}$/.test(phone)) {
      setError('شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.')
      return
    }
    setError('')
    setPhase('otp')
    toast('کد تأیید ارسال شد. کد آزمایشی: ۱۲۳۴', 'info')
  }

  const verify = (e) => {
    e.preventDefault()
    const value = code.join('')
    if (value.length !== 4) {
      setError('کد ۴ رقمی را کامل وارد کنید.')
      return
    }
    if (value !== '1234') {
      setError('کد وارد‌شده درست نیست. کد آزمایشی ۱۲۳۴ است.')
      return
    }
    setError('')
    login({ name: 'کاربر فریز', phone, email: '' })
    navigate('/account')
  }

  const onOtpChange = (i, value) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    setCode((c) => c.map((x, idx) => (idx === i ? digit : x)))
    setError('')
    if (digit) {
      const next = document.querySelectorAll('.otp-row input')[i + 1]
      if (next) next.focus()
    }
  }

  return (
    <div className="auth-wrap" style={{ paddingBlockStart: 76 }}>
      <div className="auth-visual">
        <SceneImage variant="peak" seed={7} alt="کوهستان برفی فریز" />
        <div className="auth-visual__quote">
          <span className="label" style={{ color: 'var(--text-invert-muted)' }}>
            FRZN / SYSTEM 01
          </span>
          <h2 className="display display--sm" style={{ marginBlockStart: 12 }}>
            برای سرما ساخته شد
          </h2>
          <p className="lead" style={{ color: 'var(--text-invert-muted)', marginBlockStart: 12, maxWidth: '40ch' }}>
            با ورود به حساب، سفارش‌ها، آدرس‌ها و علاقه‌مندی‌هایتان در همه‌ی دستگاه‌ها همگام می‌شود.
          </p>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <span className="label">LOGIN / OTP</span>
          <h1 className="h-sec">ورود به حساب</h1>

          {phase === 'phone' ? (
            <form onSubmit={sendCode} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="field">
                <label className="field__label" htmlFor="loginPhone">
                  شماره موبایل
                </label>
                <input
                  id="loginPhone"
                  dir="ltr"
                  inputMode="numeric"
                  className={`input ${error ? 'is-invalid' : ''}`}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))
                    setError('')
                  }}
                  placeholder="09xxxxxxxxx"
                  aria-invalid={Boolean(error)}
                  autoComplete="tel"
                />
                {error && (
                  <span className="field__error" role="alert">
                    {error}
                  </span>
                )}
              </div>
              <button className="btn btn--block" type="submit">
                دریافت کد تأیید
              </button>
            </form>
          ) : (
            <form onSubmit={verify} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p className="muted" style={{ fontSize: '0.86rem' }}>
                کد ۴ رقمی ارسال‌شده به <b className="tnum">{phone}</b> را وارد کنید.
              </p>
              <div className="otp-row">
                {code.map((digit, i) => (
                  <input
                    key={i}
                    value={digit}
                    onChange={(e) => onOtpChange(i, e.target.value)}
                    inputMode="numeric"
                    maxLength={1}
                    aria-label={`رقم ${faDigits(i + 1)} کد تأیید`}
                    className={error ? 'is-invalid' : ''}
                  />
                ))}
              </div>
              {error && (
                <span className="field__error" role="alert">
                  {error}
                </span>
              )}
              <button className="btn btn--block" type="submit">
                تأیید و ورود
              </button>
              <button
                type="button"
                className="link-underline"
                onClick={() => {
                  setPhase('phone')
                  setCode(['', '', '', ''])
                  setError('')
                }}
              >
                تغییر شماره موبایل
              </button>
            </form>
          )}

          <p className="muted" style={{ fontSize: '0.84rem' }}>
            حساب کاربری ندارید؟{' '}
            <Link className="link-underline" to="/register">
              ثبت‌نام
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
