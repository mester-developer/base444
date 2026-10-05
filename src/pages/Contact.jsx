import { useState } from 'react'
import { Breadcrumbs } from '../components/Bits.jsx'
import { useShop } from '../state/ShopProvider.jsx'
import { IconInstagram, IconMail, IconPhone, IconPin, IconTelegram } from '../components/Icons.jsx'

export default function Contact() {
  const { toast } = useShop()
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: 'پشتیبانی سفارش', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = 'نام را وارد کنید.'
    if (!form.phone.trim() && !form.email.trim()) next.phone = 'یک راه تماس (شماره یا ایمیل) وارد کنید.'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'ایمیل معتبر نیست.'
    if (form.message.trim().length < 10) next.message = 'متن پیام حداقل ۱۰ نویسه باشد.'
    setErrors(next)
    if (Object.keys(next).length) return
    setSent(true)
    setForm({ name: '', phone: '', email: '', subject: 'پشتیبانی سفارش', message: '' })
    toast('پیام شما ثبت شد. حداکثر یک روز کاری پاسخ می‌دهیم.')
  }

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setErrors((x) => ({ ...x, [key]: '' }))
  }

  return (
    <>
      <header className="page-head">
        <div className="container">
          <Breadcrumbs items={[{ label: 'تماس با ما' }]} />
          <div style={{ marginBlockStart: 18 }}>
            <span className="label">CONTACT / SUPPORT</span>
            <h1 className="display display--md" style={{ marginBlockStart: 12 }}>
              تماس با فریز
            </h1>
            <p className="lead" style={{ marginBlockStart: 14 }}>
              سؤال فنی، پیگیری سفارش یا همکاری — پیام بگذارید، یک روز کاری پاسخ می‌دهیم.
            </p>
          </div>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container">
          <div className="contact-grid">
            <div>
              <span className="label">SUPPORT / CHANNELS</span>
              <div style={{ marginBlockStart: 16 }}>
                <div className="info-row">
                  <span className="info-row__icon">
                    <IconPhone />
                  </span>
                  <div>
                    <b style={{ display: 'block' }}>پشتیبانی تلفنی</b>
                    <span className="tnum muted">۰۲۱-۹۱۰۰۰۰۰۰ — شنبه تا پنجشنبه، ۹ تا ۱۸</span>
                  </div>
                </div>
                <div className="info-row">
                  <span className="info-row__icon">
                    <IconMail />
                  </span>
                  <div>
                    <b style={{ display: 'block' }}>ایمیل</b>
                    <span className="mono muted">studio@friz.example</span>
                  </div>
                </div>
                <div className="info-row">
                  <span className="info-row__icon">
                    <IconPin />
                  </span>
                  <div>
                    <b style={{ display: 'block' }}>آدرس استودیو</b>
                    <span className="muted">تهران، خیابان ولیعصر، پلاک ۱۴۰۵، طبقه سوم</span>
                  </div>
                </div>
              </div>

              <div className="socials" style={{ marginBlockStart: 22 }}>
                <a className="social" href="#instagram" aria-label="اینستاگرام فریز" style={{ borderColor: 'var(--line-strong)' }}>
                  <IconInstagram />
                </a>
                <a className="social" href="#telegram" aria-label="تلگرام فریز" style={{ borderColor: 'var(--line-strong)' }}>
                  <IconTelegram />
                </a>
                <a className="social" href="mailto:studio@friz.example" aria-label="ایمیل فریز" style={{ borderColor: 'var(--line-strong)' }}>
                  <IconMail />
                </a>
              </div>
            </div>

            <form className="form-grid" onSubmit={submit} noValidate>
              <div className="field">
                <label className="field__label" htmlFor="cName">
                  نام
                </label>
                <input id="cName" className={`input ${errors.name ? 'is-invalid' : ''}`} value={form.name} onChange={set('name')} />
                {errors.name && (
                  <span className="field__error" role="alert">
                    {errors.name}
                  </span>
                )}
              </div>
              <div className="field">
                <label className="field__label" htmlFor="cPhone">
                  شماره تماس
                </label>
                <input
                  id="cPhone"
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
              <div className="field">
                <label className="field__label" htmlFor="cEmail">
                  ایمیل <span className="muted">(اختیاری)</span>
                </label>
                <input id="cEmail" dir="ltr" className={`input ${errors.email ? 'is-invalid' : ''}`} value={form.email} onChange={set('email')} />
                {errors.email && (
                  <span className="field__error" role="alert">
                    {errors.email}
                  </span>
                )}
              </div>
              <div className="field">
                <label className="field__label" htmlFor="cSubject">
                  موضوع
                </label>
                <select id="cSubject" className="select" value={form.subject} onChange={set('subject')}>
                  <option>پشتیبانی سفارش</option>
                  <option>راهنمای سایز</option>
                  <option>مرجوعی و تعویض</option>
                  <option>سرویس تعمیر</option>
                  <option>همکاری و رسانه</option>
                </select>
              </div>
              <div className="field field--full">
                <label className="field__label" htmlFor="cMessage">
                  پیام
                </label>
                <textarea id="cMessage" className={`textarea ${errors.message ? 'is-invalid' : ''}`} value={form.message} onChange={set('message')} />
                {errors.message && (
                  <span className="field__error" role="alert">
                    {errors.message}
                  </span>
                )}
              </div>
              <div className="field field--full">
                <button className="btn" type="submit" style={{ width: 'fit-content' }}>
                  ارسال پیام
                </button>
                {sent && (
                  <p className="status status--ok" role="status" style={{ width: 'fit-content' }}>
                    پیام شما ثبت شد — به‌زودی پاسخ می‌دهیم.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
