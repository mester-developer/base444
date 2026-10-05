import { useMemo, useState } from 'react'
import { Breadcrumbs, ArticleCard } from '../components/Bits.jsx'
import { journal } from '../data/content.js'
import { faDigits } from '../state/ShopProvider.jsx'

export default function Journal() {
  const cats = useMemo(() => ['همه', ...new Set(journal.map((a) => a.category))], [])
  const [cat, setCat] = useState('همه')
  const list = cat === 'همه' ? journal : journal.filter((a) => a.category === cat)

  return (
    <>
      <header className="page-head page-head--night">
        <div className="container">
          <Breadcrumbs items={[{ label: 'مجله' }]} />
          <div style={{ marginBlockStart: 18 }}>
            <span className="label">JOURNAL / EDITORIAL</span>
            <h1 className="display display--md" style={{ marginBlockStart: 12 }}>
              مجله فریز
            </h1>
            <p className="lead" style={{ marginBlockStart: 14 }}>
              یادداشت‌هایی درباره‌ی سرما، پارچه، استایل و زندگی در ارتفاع.
            </p>
          </div>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container">
          <div className="chip-row" style={{ marginBlockEnd: 30 }}>
            {cats.map((c) => (
              <button key={c} className={`chip ${cat === c ? 'is-active' : ''}`} onClick={() => setCat(c)} aria-pressed={cat === c}>
                {c}
              </button>
            ))}
          </div>

          <p className="muted" style={{ marginBlockEnd: 20 }}>
            {faDigits(list.length)} مقاله در دسته «{cat}»
          </p>

          <div className="journal-row">
            {list.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
