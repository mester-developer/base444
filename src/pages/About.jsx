import SceneImage from '../components/SceneImage.jsx'
import Reveal from '../components/Reveal.jsx'
import { Breadcrumbs, Marquee } from '../components/Bits.jsx'
import { Link } from 'react-router-dom'
import { IconArrow } from '../components/Icons.jsx'

const PILLARS = [
  {
    title: 'فلسفه برند',
    body: 'ما لباس نمی‌سازیم؛ ما سیستم‌هایی برای زندگی در شرایط سخت طراحی می‌کنیم. هر قطعه باید در ارتفاع کار کند و در شهر درست به نظر برسد.',
    scene: { variant: 'peak', seed: 71 },
  },
  {
    title: 'متریال',
    body: 'پوسته‌های نیلون بافته‌شده با پوشش ضدآب، درز چسب‌خورده و عایق‌های مصنوعی با پایداری حرارتی. هیچ جزئیاتی بدون توجیه فنی وارد محصول نمی‌شود.',
    scene: { variant: 'channel', seed: 72 },
  },
  {
    title: 'طراحی',
    body: 'برش‌ها برای حرکت ساخته شده‌اند: آستین راگلان، شانه‌ی افتاده و طول‌هایی که در باد ثابت می‌مانند. سیلوئت، نتیجه‌ی عملکرد است نه هدف.',
    scene: { variant: 'puffer', seed: 73 },
  },
  {
    title: 'پایداری',
    body: 'عمر محصول مهم‌تر از جنس آن است. هر قطعه با پکیج تعمیر عرضه می‌شود و سرویس ترمیم درز و زیپ تا دو سال رایگان است.',
    scene: { variant: 'ice', seed: 74 },
  },
  {
    title: 'فرآیند تولید',
    body: 'نمونه‌ها در ارتفاع تست می‌شوند، نه در استودیو. تولید محدود و شماره‌دار است تا کیفیت قابل ردیابی بماند.',
    scene: { variant: 'ridge', seed: 75 },
  },
]

export default function About() {
  return (
    <>
      <header className="page-head page-head--night">
        <div className="container">
          <Breadcrumbs items={[{ label: 'درباره ما' }]} />
          <div style={{ marginBlockStart: 18 }}>
            <span className="label">ABOUT / MANIFESTO</span>
            <h1 className="display" style={{ marginBlockStart: 14 }}>
              ما لباس نمی‌سازیم.
              <br />
              ما سیستم طراحی می‌کنیم.
            </h1>
            <p className="lead" style={{ marginBlockStart: 20, maxWidth: '56ch' }}>
              فریز از کوهستان آمد؛ جایی که خطا گران تمام می‌شود. از همان روز اول، معیار ما این بود: آیا این قطعه در
              سرما کار می‌کند؟
            </p>
          </div>
        </div>
      </header>

      <Marquee items={['BUILT FOR COLD', 'MADE FOR HEIGHT', 'FORGED TO LAST', 'NOT FOR THE CROWD']} />

      <section className="section">
        <div className="container">
          <div className="grid12">
            <div style={{ gridColumn: 'span 7' }}>
              <Reveal variant="scale">
                <SceneImage variant="peak" seed={7} ratio="4/3" alt="کوهستان فریز" tag="ALTITUDE 09.00" />
              </Reveal>
            </div>
            <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: 18, justifyContent: 'center' }}>
              <Reveal>
                <span className="label">ORIGIN / 1398</span>
                <h2 className="h-sec">فریز از یک سرما شروع شد</h2>
                <p className="lead" style={{ marginBlockStart: 14 }}>
                  اولین نمونه‌ها برای صعودهای زمستانی دوخته شدند. آن‌قدر بازخورد گرفتیم که تصمیم گرفتیم همان منطق را به
                  شهر بیاوریم: پوشش سبک، فنی و بی‌ادعا.
                </p>
              </Reveal>
              <Reveal delay={120}>
                <div className="three-lines">
                  <span>برای سرما ساخته شد</span>
                  <span>برای ارتفاع طراحی شد</span>
                  <span>برای ماندن دوخته شد</span>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="philosophy-grid">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={50 * i}>
                <article className="philosophy">
                  <SceneImage variant={p.scene.variant} seed={p.scene.seed} ratio="16/9" alt={p.title} />
                  <h3 className="h-sec" style={{ fontSize: '1.25rem', marginBlockStart: 6 }}>
                    {p.title}
                  </h3>
                  <p className="muted" style={{ fontSize: '0.9rem', lineHeight: 2 }}>
                    {p.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="manifesto" style={{ paddingBlock: 'clamp(70px, 11vw, 150px)' }}>
        <div className="manifesto__media">
          <SceneImage variant="ridge" seed={44} alt="مه کوهستان" />
        </div>
        <div className="grain" aria-hidden="true" />
        <div className="container manifesto__inner">
          <Reveal>
            <span className="label">MANIFESTO</span>
            <h2 className="display display--md" style={{ marginBlockStart: 16 }}>
              برای آن‌ها که صعود می‌کنند، نه برای جمعیت.
            </h2>
            <p className="lead" style={{ marginBlockStart: 18, maxWidth: '56ch' }}>
              ما محصول را برای عکس‌گرفتن نمی‌سازیم. برای صبح‌های سردی می‌سازیم که راه‌رفتن تنها گزینه است.
            </p>
            <div className="hero__cta" style={{ marginBlockStart: 24 }}>
              <Link className="btn btn--solid-light" to="/collections/winter-2026">
                کالکشن زمستان ۱۴۰۵
                <IconArrow size={18} />
              </Link>
              <Link className="btn btn--light" to="/journal">
                مجله فریز
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
