import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useShop } from '../state/ShopProvider.jsx'
import { IconInstagram, IconMail, IconPhone, IconPin, IconTelegram } from './Icons.jsx'
import { Logo } from './Header.jsx'

const QUICK = [
  { to: '/shop', label: 'فروشگاه' },
  { to: '/collections', label: 'کالکشن‌ها' },
  { to: '/categories', label: 'دسته‌بندی‌ها' },
  { to: '/journal', label: 'مجله' },
  { to: '/about', label: 'درباره ما' },
  { to: '/contact', label: 'تماس' },
]

const SERVICE = [
  { to: '/account/orders', label: 'پیگیری سفارش' },
  { to: '/faq', label: 'راهنمای سایز' },
  { to: '/faq', label: 'شرایط بازگشت' },
  { to: '/faq', label: 'سؤالات متداول' },
  { to: '/wishlist', label: 'علاقه‌مندی‌ها' },
]

export default function Footer() {
  const { toast } = useShop()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('ایمیل معتبر نیست. نمونه: name@mail.com')
      return
    }
    setError('')
    setEmail('')
    toast('ثبت شد. اولین نفر از دراپ‌های بعدی باخبر می‌شوید.')
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__col">
            <Link to="/">
              <Logo />
            </Link>
            <p style={{ color: 'var(--text-invert-muted)', fontSize: '0.88rem', lineHeight: 2, maxWidth: '38ch' }}>
              فریز از کوهستان آمد، نه از ترند. ما سیستم‌هایی برای زندگی در سرما طراحی می‌کنیم — ابزار، نه مُد.
            </p>
            <div className="socials">
              <a className="social" href="#instagram" aria-label="اینستاگرام">
                <IconInstagram />
              </a>
              <a className="social" href="#telegram" aria-label="تلگرام">
                <IconTelegram />
              </a>
              <a className="social" href="mailto:studio@friz.example" aria-label="ایمیل">
                <IconMail />
              </a>
            </div>
            <div className="barcode" aria-hidden="true">
              {Array.from({ length: 26 }).map((_, i) => (
                <i key={i} style={{ height: `${12 + ((i * 7) % 22)}px` }} />
              ))}
            </div>
          </div>

          <div className="footer__col">
            <span className="label">دسترسی سریع</span>
            <div className="footer__links">
              {QUICK.map((l) => (
                <Link key={l.label} to={l.to}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="footer__col">
            <span className="label">خدمات مشتری</span>
            <div className="footer__links">
              {SERVICE.map((l) => (
                <Link key={l.label} to={l.to}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="footer__col">
            <span className="label">خبرنامه / DROP 02</span>
            <p style={{ color: 'var(--text-invert-muted)', fontSize: '0.88rem' }}>
              برای دریافت دراپ‌های جدید عضو شوید.
            </p>
            <form onSubmit={submit} noValidate>
              <div className="newsletter">
                <input
                  type="email"
                  inputMode="email"
                  placeholder="ایمیل شما"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="ایمیل برای عضویت در خبرنامه"
                  aria-invalid={Boolean(error)}
                />
                <button className="btn btn--solid-light btn--sm" type="submit">
                  عضویت
                </button>
              </div>
              {error && (
                <p className="field__error" role="alert" style={{ marginBlockStart: 8 }}>
                  {error}
                </p>
              )}
            </form>
            <div className="footer__links" style={{ marginBlockStart: 8 }}>
              <span className="mono" style={{ opacity: 0.7 }}>
                studio@friz.example
              </span>
              <span className="mono" style={{ opacity: 0.7, direction: 'rtl', fontFamily: 'inherit' }}>
                <IconPhone size={16} /> ۰۲۱-۹۱۰۰۰۰۰۰
              </span>
              <span className="mono" style={{ opacity: 0.7, direction: 'rtl', fontFamily: 'inherit' }}>
                <IconPin size={16} /> تهران، خیابان ولیعصر، استودیو فریز
              </span>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© ۱۴۰۵ فریز / FRZN — تمام حقوق محفوظ است.</span>
          <span className="mono">SYSTEM / 2026 · BUILT FOR COLD · FORGED TO LAST</span>
        </div>
      </div>
    </footer>
  )
}
