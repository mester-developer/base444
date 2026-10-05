import { useState } from 'react'
import { Link } from 'react-router-dom'
import SceneImage from './SceneImage.jsx'
import { COLOR_MAP, findCategory } from '../data/catalog.js'
import { useShop, formatToman } from '../state/ShopProvider.jsx'
import { IconArrow, IconHeart } from './Icons.jsx'

export default function ProductCard({ product, onQuickView, priority = false }) {
  const { addToCart, toggleWishlist, state } = useShop()
  const [color, setColor] = useState(product.colors[0])
  const wished = state.wishlist.includes(product.id)
  const category = findCategory(product.category)
  const image = product.images[0]

  return (
    <article className="pcard">
      <div className="pcard__media">
        <Link to={`/product/${product.slug}`} aria-label={product.name}>
          <SceneImage
            variant={image.variant}
            seed={image.seed}
            alt={`${product.name} — ${category?.name}`}
            tag={priority ? 'DROP / 01' : undefined}
          />
        </Link>

        <div className="pcard__badges">
          {product.discount > 0 && <span className="badge badge--sale">{product.discount.toLocaleString('fa-IR')}٪ تخفیف</span>}
          {product.inventory <= 5 && <span className="badge badge--soft">موجودی محدود</span>}
        </div>

        <button
          className={`wish ${wished ? 'is-on' : ''}`}
          onClick={() => toggleWishlist(product.id)}
          aria-label={wished ? `حذف ${product.name} از علاقه‌مندی‌ها` : `افزودن ${product.name} به علاقه‌مندی‌ها`}
          aria-pressed={wished}
        >
          <IconHeart filled={wished} size={18} />
        </button>

        <div className="pcard__actions">
          {onQuickView && (
            <button className="btn btn--light btn--sm" onClick={() => onQuickView(product)}>
              مشاهده سریع
            </button>
          )}
          <button className="btn btn--solid-light btn--sm" onClick={() => addToCart(product, { color })}>
            افزودن به سبد
          </button>
        </div>
      </div>

      <div className="pcard__body">
        <div className="pcard__meta">
          <Link to={`/product/${product.slug}`} className="h-card pcard__name">
            {product.name}
          </Link>
          <Link to={`/category/${product.category}`} className="label" style={{ display: 'inline-flex', gap: 5 }}>
            {category?.name}
            <IconArrow size={14} />
          </Link>
        </div>

        <div className="pcard__meta">
          <div className="swatches" role="group" aria-label="انتخاب رنگ">
            {product.colors.map((c) => (
              <button
                key={c}
                className={`swatch ${color === c ? 'is-active' : ''}`}
                style={{ background: COLOR_MAP[c].hex }}
                onClick={() => setColor(c)}
                aria-label={COLOR_MAP[c].name}
                aria-pressed={color === c}
                title={COLOR_MAP[c].name}
              />
            ))}
          </div>
          <span className="mono" style={{ color: 'var(--text-muted)' }}>
            {product.sizes.slice(0, 4).join(' / ')}
          </span>
        </div>

        <div className="pcard__price">
          <span className="tnum">{formatToman(product.price)}</span>
          {product.oldPrice && <span className="pcard__old tnum">{formatToman(product.oldPrice)}</span>}
        </div>
      </div>
    </article>
  )
}
