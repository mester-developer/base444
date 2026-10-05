import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumbs } from '../components/Bits.jsx'
import { faqs } from '../data/content.js'
import { IconChevron } from '../components/Icons.jsx'

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <>
      <header className="page-head">
        <div className="container">
          <Breadcrumbs items={[{ label: 'سؤالات متداول' }]} />
          <div style={{ marginBlockStart: 18 }}>
            <span className="label">FAQ / SUPPORT</span>
            <h1 className="display display--md" style={{ marginBlockStart: 12 }}>
              سؤالات متداول
            </h1>
            <p className="lead" style={{ marginBlockStart: 14 }}>
              ارسال، سایز، بازگشت و نگهداری — پاسخ کوتاه و روشن.
            </p>
          </div>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container">
          <div className="faq-list">
            <div className="accordion">
              {faqs.map((f, i) => (
                <div className="accordion__item" key={f.q}>
                  <button
                    className="accordion__trigger"
                    onClick={() => setOpen(open === i ? -1 : i)}
                    aria-expanded={open === i}
                    aria-controls={`faq-panel-${i}`}
                  >
                    {f.q}
                    <IconChevron dir={open === i ? 'up' : 'down'} size={16} />
                  </button>
                  {open === i && (
                    <div className="accordion__panel" id={`faq-panel-${i}`}>
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="panel" style={{ padding: 22, marginBlockStart: 34, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <b>پاسخ سؤالتان را پیدا نکردید؟</b>
                <p className="muted" style={{ fontSize: '0.86rem' }}>
                  تیم پشتیبانی فریز هر روز از ۹ تا ۱۸ پاسخ می‌دهد.
                </p>
              </div>
              <Link className="btn" to="/contact">
                تماس با ما
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
