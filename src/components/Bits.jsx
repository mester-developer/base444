import { Link } from 'react-router-dom'
import { orderStatuses } from '../data/content.js'
import SceneImage from './SceneImage.jsx'
import { IconArrow, IconChevron } from './Icons.jsx'

export function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="مسیر صفحه">
      <Link to="/">خانه</Link>
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
          <IconChevron dir="start" size={14} />
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  )
}

export function SectionHead({ label, title, description, action, actionTo, dark = false }) {
  return (
    <div className="sec-head">
      <div className="sec-head__titles">
        {label && <span className="label">{label}</span>}
        <h2 className="h-sec">{title}</h2>
        {description && (
          <p className="lead" style={{ fontSize: '0.94rem' }}>
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link to={actionTo || '/shop'} className={`link-underline ${dark ? '' : ''}`}>
          {action}
          <IconArrow size={16} />
        </Link>
      )}
    </div>
  )
}

export function EmptyState({ title, description, actionLabel, actionTo, icon: Icon }) {
  return (
    <div className="empty">
      {Icon && (
        <div className="empty__mark" aria-hidden="true">
          <Icon size={26} />
        </div>
      )}
      <h2 className="h-sec" style={{ maxWidth: '24ch' }}>
        {title}
      </h2>
      {description && (
        <p className="lead" style={{ maxWidth: '46ch' }}>
          {description}
        </p>
      )}
      {actionLabel && (
        <Link className="btn" to={actionTo || '/shop'}>
          {actionLabel}
        </Link>
      )}
    </div>
  )
}

export function StatusBadge({ status }) {
  const s = orderStatuses[status] || orderStatuses.processing
  return <span className={`status status--${s.tone}`}>{s.label}</span>
}

export function ArticleCard({ article }) {
  return (
    <Link to={`/journal/${article.slug}`} className="article-card">
      <SceneImage variant={article.scene.variant} seed={article.scene.seed} ratio="4/3" alt={article.title} />
      <div className="article-card__meta">
        <span className="badge badge--soft">{article.category}</span>
        <span>{article.date}</span>
        <span>{article.readTime}</span>
      </div>
      <h3 className="h-card">{article.title}</h3>
      <p className="muted" style={{ fontSize: '0.86rem', lineHeight: 1.95 }}>
        {article.excerpt}
      </p>
    </Link>
  )
}

export function Marquee({ items }) {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[...items, ...items].map((item, i) => (
          <span className="marquee__item" key={`${item}-${i}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
