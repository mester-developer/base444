import { useState } from 'react'
import { Link } from 'react-router-dom'
import SceneImage from '../components/SceneImage.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import { QuickView } from '../components/Gallery.jsx'
import Reveal, { useParallax } from '../components/Reveal.jsx'
import { ArticleCard, Marquee, SectionHead } from '../components/Bits.jsx'
import { categories, collections, products } from '../data/catalog.js'
import { journal } from '../data/content.js'
import { formatToman } from '../state/ShopProvider.jsx'
import { IconArrow, IconSnow, IconShield, IconTruck } from '../components/Icons.jsx'

export default function Home() {
  const [quick, setQuick] = useState(null)
  const parallax = useParallax(0.18)
  const featured = products[1]
  const side = products.filter((p) => p.id !== featured.id).slice(0, 3)
  const newest = products.slice(0, 4)
  const heroMeta = ['DROP / 01', 'WINTER SYSTEM', '2026', 'ALTITUDE 09.00']

  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="hero">
        <div className="hero__media" ref={parallax}>
          <SceneImage variant="peak" seed={7} alt="کوهستان برفی — کالکشن زمستان فریز" />
        </div>
        <div className="hero__veil" />
        <div className="grain" aria-hidden="true" />

        <div className="hero__meta mono">
          {heroMeta.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>

        <div className="container hero__inner">
          <div>
            <span className="kicker hero-fade">کالکشن زمستان ۱۴۰۵</span>
            <h1 className="display hero__title hero-fade" style={{ marginBlockStart: 18 }}>
              <span>سرما را</span>
              <span>به سبک خودت</span>
              <span>تسخیر کن</span>
            </h1>
            <p className="hero__sub hero-fade">
              سیستم پوشش فنی فریز، برای ارتفاع و شهر طراحی شده است: پوسته‌های ضدآب، عایق‌های سبک و سیلوئت‌هایی که
              مرز بین ابزار و استایل را برمی‌دارند.
            </p>
            <div className="hero__cta hero-fade">
              <Link className="btn btn--solid-light" to="/collections/winter-2026">
                مشاهده کالکشن
                <IconArrow size={18} />
              </Link>
              <Link className="btn btn--light" to="/shop?sort=newest">
                خرید جدیدترین‌ها
              </Link>
            </div>
          </div>

          <aside className="hero__aside hero-fade">
            <div className="hero__stat">
              <b>−۳۵°C</b>
              <span>سقف عملکرد حرارتی خط آرکتیک</span>
            </div>
            <div className="hero__stat">
              <b>۱۰,۰۰۰ mm</b>
              <span>مقاومت ستون آب در پوسته‌های فنی</span>
            </div>
            <div className="hero__stat">
              <b>۱۴۰۵ / SYSTEM 01</b>
              <span>تولید محدود، بدون تکرار فصل</span>
            </div>
          </aside>
        </div>

        <span className="hero__scroll mono">
          SCROLL
          <i />
        </span>
      </section>

      <Marquee items={['BUILT FOR COLD', 'MADE FOR HEIGHT', 'FORGED TO LAST', 'TECHNICAL OUTERWEAR', 'DROP 01 / 2026']} />

      {/* ---------- brand statement ---------- */}
      <section className="section editorial">
        <div className="container">
          <Reveal>
            <span className="label">BRAND STATEMENT / 01</span>
            <h2 className="editorial__words" style={{ marginBlockStart: 22 }}>
              ساخته شده برای سرما.
              <br />
              طراحی شده برای <em>ارتفاع.</em>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="lead" style={{ marginBlockStart: 30 }}>
              پوششی که مرز بین عملکرد، فرم و سبک شهری را از بین می‌برد. هر قطعه در ارتفاع تست می‌شود، نه در
              اتاق طراحی.
            </p>
          </Reveal>
        </div>

        <Reveal className="editorial__frag editorial__frag--a" variant="scale">
          <SceneImage variant="ridge" seed={44} ratio="3/4" alt="قله برفی در مه" />
        </Reveal>
        <Reveal className="editorial__frag editorial__frag--b" variant="scale" delay={100}>
          <SceneImage variant="ice" seed={30} ratio="4/3" alt="سطح یخی" />
        </Reveal>
      </section>

      {/* ---------- featured collection ---------- */}
      <section className="section section--frost" style={{ background: 'var(--frost)' }}>
        <div className="container">
          <SectionHead
            label="WINTER SYSTEM / 01"
            title="کالکشن جدید"
            description="یک قطعه‌ی شاخص و سه گزینه‌ی مکمل؛ ترکیب آماده برای زیر صفر."
            action="مشاهده همه"
            actionTo="/shop"
          />

          <div className="feature-split">
            <Reveal>
              <article className="pcard" style={{ padding: 'clamp(14px,1.6vw,22px)' }}>
                <Link to={`/product/${featured.slug}`}>
                  <SceneImage
                    variant={featured.images[0].variant}
                    seed={featured.images[0].seed}
                    ratio="4/5"
                    alt={featured.name}
                    tag="FEATURED / 01"
                  />
                </Link>
                <div className="pcard__body">
                  <span className="label">FEATURED DROP / 2026</span>
                  <h3 className="display--sm" style={{ fontWeight: 900, marginBlock: 6 }}>
                    {featured.name}
                  </h3>
                  <p className="muted" style={{ fontSize: '0.92rem' }}>
                    {featured.shortDescription}
                  </p>
                  <div className="pcard__price" style={{ marginBlockStart: 12 }}>
                    <span className="tnum">{formatToman(featured.price)}</span>
                    {featured.oldPrice && <span className="pcard__old tnum">{formatToman(featured.oldPrice)}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginBlockStart: 16 }}>
                    <Link className="btn btn--sm" to={`/product/${featured.slug}`}>
                      مشاهده محصول
                    </Link>
                    <button className="btn btn--ghost btn--sm" onClick={() => setQuick(featured)}>
                      مشاهده سریع
                    </button>
                  </div>
                </div>
              </article>
            </Reveal>

            <div className="feature-split__side">
              {side.map((p, i) => (
                <Reveal key={p.id} delay={80 * (i + 1)}>
                  <ProductGrid products={[p]} onQuickView={setQuick} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- new arrivals ---------- */}
      <section className="section">
        <div className="container">
          <SectionHead
            label="NEW ARRIVALS / DROP 01"
            title="تازه رسیده‌ها"
            description="آخرین قطعات اضافه‌شده به سیستم زمستانی."
            action="فروشگاه"
            actionTo="/shop?sort=newest"
          />
          <div className="new-rail">
            {newest.map((p, i) => (
              <Reveal key={p.id} delay={60 * i}>
                <ProductGrid products={[p]} onQuickView={setQuick} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- categories ---------- */}
      <section className="section section--tight section--deep">
        <div className="container">
          <SectionHead label="CATEGORIES / SYSTEM" title="دسته‌بندی‌ها" action="همه دسته‌ها" actionTo="/categories" dark />
          <div className="cat-row">
            {categories.map((c, i) => (
              <Reveal key={c.slug} delay={50 * i}>
                <Link className="tile" to={`/category/${c.slug}`}>
                  <SceneImage variant={c.scene.variant} seed={c.scene.seed} ratio="3/4" alt={c.name} />
                  <span className="tile__veil" />
                  <span className="tile__body">
                    <span className="mono" style={{ opacity: 0.7 }}>
                      {c.note}
                    </span>
                    <span className="h-card">{c.name}</span>
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

      {/* ---------- editorial campaign ---------- */}
      <section className="manifesto">
        <div className="manifesto__media">
          <SceneImage variant="peak" seed={7} alt="کوهستان زمستانی" />
        </div>
        <div className="grain" aria-hidden="true" />
        <span className="manifesto__stamp">ALTITUDE</span>
        <div className="container manifesto__inner">
          <Reveal>
            <span className="label">CAMPAIGN / METHOD — ALTITUDE 09.00</span>
            <div className="three-lines" style={{ marginBlockStart: 22 }}>
              <span>برای سرما ساخته شد</span>
              <span>برای ارتفاع طراحی شد</span>
              <span>برای ماندن دوخته شد</span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <p className="lead" style={{ marginBlockStart: 28, maxWidth: '52ch' }}>
              فریز در کوهستان به دنیا آمد؛ نه به‌عنوان یک ترند، بلکه به‌عنوان یک پاسخ. خطا در ارتفاع گران تمام
              می‌شود، پس هر قطعه باید کار کند.
            </p>
          </Reveal>
          <div className="hero__cta" style={{ marginBlockStart: 26 }}>
            <Link className="btn btn--solid-light" to="/about">
              فلسفه برند
            </Link>
            <Link className="btn btn--light" to="/journal">
              مجله
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- technical feature ---------- */}
      <section className="section section--steel">
        <div className="container">
          <div className="tech-feature">
            <Reveal variant="scale">
              <SceneImage variant="puffer" seed={201} ratio="4/5" alt="جزئیات کانال‌های پافر" tag="TECH / SHELL 3L" />
            </Reveal>
            <div>
              <Reveal>
                <span className="label">TECHNICAL OUTERWEAR / 02</span>
                <h2 className="h-sec" style={{ marginBlockStart: 14 }}>
                  سیستم، نه یک تکه لباس
                </h2>
                <p className="lead" style={{ marginBlockStart: 16 }}>
                  پوسته‌ی سه‌لایه با درز چسب‌خورده، عایق مصنوعی با پایداری حرارتی و جزئیاتی که در سرما معنا دارند:
                  آستین راگلان، مچ طوفانی و یقه‌ی بلند.
                </p>
              </Reveal>
              <Reveal delay={100}>
                <div className="spec-list" style={{ marginBlockStart: 26 }}>
                  <div className="spec">
                    <span className="spec__k">پارچه</span>
                    <span className="spec__v">Nylon Technical Shell</span>
                  </div>
                  <div className="spec">
                    <span className="spec__k">عایق</span>
                    <span className="spec__v">Synthetic Thermal Fill</span>
                  </div>
                  <div className="spec">
                    <span className="spec__k">مقاومت</span>
                    <span className="spec__v">Water Resistant / 10,000mm</span>
                  </div>
                  <div className="spec">
                    <span className="spec__k">گرما</span>
                    <span className="spec__v">−۱۵°C تا −۳۵°C</span>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={160}>
                <div className="chip-row" style={{ marginBlockStart: 24 }}>
                  <span className="chip">
                    <IconSnow size={16} /> ضد سرما
                  </span>
                  <span className="chip">
                    <IconShield size={16} /> ضدآب
                  </span>
                  <span className="chip">
                    <IconTruck size={16} /> ارسال رایگان بالای ۵ میلیون
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- collections strip ---------- */}
      <section className="section">
        <div className="container">
          <SectionHead label="COLLECTIONS / 2026" title="کالکشن‌ها" action="همه کالکشن‌ها" actionTo="/collections" />
          <div className="journal-row">
            {collections.slice(0, 3).map((c, i) => (
              <Reveal key={c.slug} delay={60 * i}>
                <Link className="tile" to={`/collections/${c.slug}`} style={{ display: 'block' }}>
                  <SceneImage variant={c.scene.variant} seed={c.scene.seed} ratio="4/5" alt={c.name} />
                  <span className="tile__veil" />
                  <span className="tile__body">
                    <span className="mono" style={{ opacity: 0.72 }}>
                      {c.latin}
                    </span>
                    <span className="h-sec" style={{ fontSize: '1.3rem' }}>
                      {c.name}
                    </span>
                    <span style={{ fontSize: '0.82rem', opacity: 0.8 }}>{c.count.toLocaleString('fa-IR')} قطعه</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- journal ---------- */}
      <section className="section section--tight">
        <div className="container">
          <SectionHead label="JOURNAL / EDITORIAL" title="مجله فریز" action="همه مقالات" actionTo="/journal" />
          <div className="journal-row">
            {journal.slice(0, 3).map((a, i) => (
              <Reveal key={a.slug} delay={60 * i}>
                <ArticleCard article={a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {quick && <QuickView product={quick} onClose={() => setQuick(null)} />}
    </>
  )
}
