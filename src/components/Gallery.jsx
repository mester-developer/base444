import { useEffect, useState } from 'react'
import { COLOR_MAP } from '../data/catalog.js'
import { useShop, formatToman } from '../state/ShopProvider.jsx'
import SceneImage from './SceneImage.jsx'
import Modal from './Modal.jsx'
import { IconArrow, IconClose, IconHeart, IconZoom } from './Icons.jsx'

/* ---------- fullscreen viewer ---------- */
export function ImageViewer({ images, index, onIndex, onClose, name }) {
  const [zoomed, setZoomed] = useState(false)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onIndex((index + 1) % images.length)
      if (e.key === 'ArrowRight') onIndex((index - 1 + images.length) % images.length)
    }
    document.addEventListener('keydown', onKey)
    document.body.setAttribute('data-locked', 'true')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.removeAttribute('data-locked')
    }
  }, [index, images.length, onIndex, onClose])

  const img = images[index]

  return (
    <div className="viewer" role="dialog" aria-modal="true" aria-label={`نمای تمام‌صفحه ${name}`}>
      <div className="viewer__bar">
        <span className="mono">
          {(index + 1).toLocaleString('fa-IR')} / {images.length.toLocaleString('fa-IR')}
        </span>
        <span className="mono">{name}</span>
        <button className="iconbtn" onClick={onClose} aria-label="بستن" style={{ borderColor: 'var(--line-light)', color: 'inherit' }}>
          <IconClose />
        </button>
      </div>

      <div className={`viewer__stage ${zoomed ? 'is-zoomed' : ''}`} onClick={() => setZoomed((z) => !z)}>
        <SceneImage variant={img.variant} seed={img.seed} ratio="4/5" alt={name} />
      </div>

      <button
        className="viewer__nav viewer__nav--prev"
        onClick={() => onIndex((index - 1 + images.length) % images.length)}
        aria-label="تصویر قبلی"
      >
        <IconArrow />
      </button>
      <button
        className="viewer__nav viewer__nav--next"
        onClick={() => onIndex((index + 1) % images.length)}
        aria-label="تصویر بعدی"
      >
        <span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}>
          <IconArrow />
        </span>
      </button>
    </div>
  )
}

/* ---------- inline gallery with swipe support ---------- */
export default function ProductGallery({ product }) {
  const [index, setIndex] = useState(0)
  const [full, setFull] = useState(false)
  const [touch, setTouch] = useState(null)

  const onTouchStart = (e) => setTouch(e.touches[0].clientX)
  const onTouchEnd = (e) => {
    if (touch === null) return
    const delta = e.changedTouches[0].clientX - touch
    if (Math.abs(delta) > 45) {
      const next = delta > 0 ? index - 1 : index + 1
      setIndex((next + product.images.length) % product.images.length)
    }
    setTouch(null)
  }

  const img = product.images[index]

  return (
    <div className="gallery">
      <div className="gallery__main" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <SceneImage
          variant={img.variant}
          seed={img.seed}
          ratio="4/5"
          alt={`${product.name} — تصویر ${index + 1}`}
          tag="FRZN / STUDIO"
        />
        <button className="gallery__zoom" onClick={() => setFull(true)}>
          <IconZoom size={16} /> بزرگ‌نمایی
        </button>
      </div>

      <div className="gallery__thumbs" role="tablist" aria-label="تصاویر محصول">
        {product.images.map((im, i) => (
          <button
            key={`${im.variant}-${im.seed}`}
            role="tab"
            aria-selected={i === index}
            aria-label={`تصویر ${i + 1}`}
            className={`gallery__thumb ${i === index ? 'is-active' : ''}`}
            onClick={() => setIndex(i)}
          >
            <SceneImage variant={im.variant} seed={im.seed} ratio="3/4" alt="" />
          </button>
        ))}
      </div>

      {full && (
        <ImageViewer
          images={product.images}
          index={index}
          onIndex={setIndex}
          onClose={() => setFull(false)}
          name={product.name}
        />
      )}
    </div>
  )
}

/* ---------- quick view ---------- */
export function QuickView({ product, onClose }) {
  const { addToCart, toggleWishlist, state } = useShop()
  const [size, setSize] = useState(product?.sizes[0])
  const [color, setColor] = useState(product?.colors[0])

  useEffect(() => {
    if (!product) return
    setSize(product.sizes[0])
    setColor(product.colors[0])
  }, [product])

  if (!product) return null

  const wished = state.wishlist.includes(product.id)

  return (
    <Modal open onClose={onClose} title="مشاهده سریع" wide>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 'clamp(18px,3vw,40px)' }}>
        <SceneImage variant={product.images[0].variant} seed={product.images[0].seed} ratio="4/5" alt={product.name} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <span className="label">{product.category} / SYSTEM 01</span>
          <h2 className="h-sec">{product.name}</h2>
          <p className="lead" style={{ fontSize: '0.9rem' }}>
            {product.shortDescription}
          </p>
          <div className="pdp__price">
            <span className="tnum">{formatToman(product.price)}</span>
            {product.oldPrice && <span className="pcard__old tnum">{formatToman(product.oldPrice)}</span>}
          </div>

          <div className="size-grid">
            {product.sizes.map((s) => (
              <button
                key={s}
                className={`size-btn ${size === s ? 'is-active' : ''}`}
                onClick={() => setSize(s)}
                aria-pressed={size === s}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="color-row">
            {product.colors.map((c) => (
              <button
                key={c}
                className={`color-btn ${color === c ? 'is-active' : ''}`}
                onClick={() => setColor(c)}
                aria-pressed={color === c}
              >
                <span className="color-btn__dot" style={{ background: COLOR_MAP[c].hex }} />
                {COLOR_MAP[c].name}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn"
              style={{ flex: 1 }}
              onClick={() => {
                addToCart(product, { size, color })
                onClose()
              }}
            >
              افزودن به سبد
            </button>
            <button
              className={`iconbtn ${wished ? 'is-on' : ''}`}
              onClick={() => toggleWishlist(product.id)}
              aria-label="افزودن به علاقه‌مندی‌ها"
            >
              <IconHeart filled={wished} />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
