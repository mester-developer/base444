import { Link } from 'react-router-dom'
import SceneImage from '../components/SceneImage.jsx'
import Reveal from '../components/Reveal.jsx'
import { Breadcrumbs, SectionHead } from '../components/Bits.jsx'
import { collections } from '../data/catalog.js'
import { faDigits } from '../state/ShopProvider.jsx'
import { IconArrow } from '../components/Icons.jsx'

export default function Collections() {
  return (
    <>
      <header className="page-head page-head--night">
        <div className="container">
          <Breadcrumbs items={[{ label: 'کالکشن‌ها' }]} />
          <div style={{ marginBlockStart: 18 }}>
            <span className="label">COLLECTIONS / SEASON 1405</span>
            <h1 className="display display--md" style={{ marginBlockStart: 12 }}>
              کالکشن‌ها
            </h1>
            <p className="lead" style={{ marginBlockStart: 14 }}>
              پنج خط تولید، پنج دمای کاری متفاوت. از زمستان شهری تا خط قطب.
            </p>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(34px, 6vw, 96px)' }}>
            {collections.map((c, i) => (
              <Reveal key={c.slug}>
                <Link
                  to={`/collections/${c.slug}`}
                  className={`collection-item ${i % 2 === 1 ? 'collection-item--flip' : ''}`}
                >
                  <SceneImage
                    variant={c.scene.variant}
                    seed={c.scene.seed}
                    ratio={i % 2 === 1 ? '4/3' : '4/5'}
                    alt={c.name}
                    tag={c.latin}
                  />
                  <div>
                    <span className="label">
                      {c.latin} / {c.season}
                    </span>
                    <h2 className="display display--sm" style={{ marginBlockStart: 14 }}>
                      {c.name}
                    </h2>
                    <p className="lead" style={{ marginBlockStart: 16 }}>
                      {c.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBlockStart: 22 }}>
                      <span className="mono">{faDigits(c.count)} PIECES</span>
                      <span className="link-underline">
                        مشاهده کالکشن
                        <IconArrow size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight section--deep">
        <div className="container">
          <SectionHead
            label="NEXT / SYSTEM"
            title="همه محصولات"
            description="اگر دنبال قطعه‌ی مشخصی هستید، فهرست کامل با فیلترهای دقیق در دسترس است."
            action="فروشگاه"
            actionTo="/shop"
            dark
          />
        </div>
      </section>
    </>
  )
}
