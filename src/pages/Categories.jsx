import { Link } from 'react-router-dom'
import SceneImage from '../components/SceneImage.jsx'
import Reveal from '../components/Reveal.jsx'
import { Breadcrumbs } from '../components/Bits.jsx'
import { categories } from '../data/catalog.js'
import { faDigits } from '../state/ShopProvider.jsx'
import { IconArrow } from '../components/Icons.jsx'

export default function Categories() {
  return (
    <>
      <header className="page-head page-head--night">
        <div className="container">
          <Breadcrumbs items={[{ label: 'دسته‌بندی‌ها' }]} />
          <div style={{ marginBlockStart: 18 }}>
            <span className="label">CATEGORIES / SYSTEM</span>
            <h1 className="display display--md" style={{ marginBlockStart: 12 }}>
              دسته‌بندی‌ها
            </h1>
            <p className="lead" style={{ marginBlockStart: 14 }}>
              سیستم زمستانی فریز در شش بخش: از لایه‌ی بیرونی تا جزئیات کوچک.
            </p>
          </div>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container">
          <div className="journal-row">
            {categories.map((c, i) => (
              <Reveal key={c.slug} delay={60 * i}>
                <Link className="tile" to={`/category/${c.slug}`}>
                  <SceneImage variant={c.scene.variant} seed={c.scene.seed} ratio="4/5" alt={c.name} />
                  <span className="tile__veil" />
                  <span className="tile__body">
                    <span className="mono" style={{ opacity: 0.72 }}>
                      {c.note}
                    </span>
                    <span className="h-sec" style={{ fontSize: '1.4rem' }}>
                      {c.name}
                    </span>
                    <span style={{ fontSize: '0.82rem', opacity: 0.82 }}>
                      {faDigits(c.count)} قطعه
                    </span>
                  </span>
                  <span className="tile__arrow" aria-hidden="true">
                    <IconArrow size={18} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
