import { Link, useParams } from 'react-router-dom'
import SceneImage from '../components/SceneImage.jsx'
import Reveal from '../components/Reveal.jsx'
import { ArticleCard, Breadcrumbs } from '../components/Bits.jsx'
import { journal } from '../data/content.js'

export default function Article() {
  const { slug } = useParams()
  const article = journal.find((a) => a.slug === slug)

  if (!article) {
    return (
      <section className="section container" style={{ paddingBlockStart: 180 }}>
        <div className="empty">
          <h1 className="h-sec">این مقاله پیدا نشد</h1>
          <Link className="btn" to="/journal">
            بازگشت به مجله
          </Link>
        </div>
      </section>
    )
  }

  const related = journal.filter((a) => a.slug !== article.slug).slice(0, 3)

  return (
    <>
      <header className="page-head page-head--night" style={{ paddingBlockEnd: 'clamp(28px, 4vw, 56px)' }}>
        <div className="container">
          <Breadcrumbs items={[{ label: 'مجله', to: '/journal' }, { label: article.category }]} />
          <div style={{ marginBlockStart: 20 }}>
            <span className="label">{article.category} / EDITORIAL</span>
            <h1 className="display display--md" style={{ marginBlockStart: 14, maxWidth: '32ch' }}>
              {article.title}
            </h1>
            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginBlockStart: 20 }} className="mono">
              <span>{article.author}</span>
              <span>{article.date}</span>
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container">
          <Reveal variant="scale">
            <SceneImage variant={article.scene.variant} seed={article.scene.seed} ratio="16/9" alt={article.title} />
          </Reveal>

          <div className="article-body" style={{ marginBlockStart: 40 }}>
            <p className="article-lead">{article.excerpt}</p>
            {article.body.map((para, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                <p>{para}</p>
                {i === 0 && (
                  <blockquote className="pull-quote">
                    «در ارتفاع، خطا گران تمام می‌شود؛ پس هر لایه باید کار کند.»
                  </blockquote>
                )}
              </div>
            ))}
            <div className="chip-row" style={{ marginBlockStart: 10 }}>
              {article.tags.map((t) => (
                <span key={t} className="chip">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="sec-head">
            <div>
              <span className="label">RELATED / JOURNAL</span>
              <h2 className="h-sec" style={{ marginBlockStart: 10 }}>
                مقالات مرتبط
              </h2>
            </div>
            <Link className="link-underline" to="/journal">
              همه مقالات
            </Link>
          </div>
          <div className="journal-row">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
