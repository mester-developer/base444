import { useState } from 'react'
import { Link } from 'react-router-dom'
import { categories, collections, COLOR_MAP, SIZES } from '../data/catalog.js'
import { useShop, faDigits } from '../state/ShopProvider.jsx'
import Modal from './Modal.jsx'
import { IconChevron } from './Icons.jsx'

const PRICE_BANDS = [
  { id: 'a', label: 'تا ۵ میلیون تومان', test: (p) => p.price < 5000000 },
  { id: 'b', label: '۵ تا ۱۰ میلیون تومان', test: (p) => p.price >= 5000000 && p.price < 10000000 },
  { id: 'c', label: 'بالای ۱۰ میلیون تومان', test: (p) => p.price >= 10000000 },
]

export const SORTS = [
  { id: 'newest', label: 'جدیدترین' },
  { id: 'popular', label: 'محبوب‌ترین' },
  { id: 'cheap', label: 'ارزان‌ترین' },
  { id: 'expensive', label: 'گران‌ترین' },
]

export const defaultFilters = { category: [], size: [], color: [], price: [], collection: [], stock: false }

export function applyFilters(products, filters, sort) {
  let out = products.filter((p) => {
    if (filters.category.length && !filters.category.includes(p.category)) return false
    if (filters.collection.length && !filters.collection.includes(p.collection)) return false
    if (filters.color.length && !p.colors.some((c) => filters.color.includes(c))) return false
    if (filters.stock && p.inventory <= 0) return false
    if (filters.size.length) {
      const has = p.sizes.some((s) => filters.size.includes(s))
      if (!has) return false
    }
    if (filters.price.length) {
      const ok = PRICE_BANDS.some((b) => filters.price.includes(b.id) && b.test(p))
      if (!ok) return false
    }
    return true
  })

  out = [...out]
  if (sort === 'cheap') out.sort((a, b) => a.price - b.price)
  else if (sort === 'expensive') out.sort((a, b) => b.price - a.price)
  else if (sort === 'popular') out.sort((a, b) => b.rating - a.rating)
  else out.sort((a, b) => Number(b.tags.includes('کالکشن اصلی')) - Number(a.tags.includes('کالکشن اصلی')))

  return out
}

function Group({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="fgroup">
      <button className="fgroup__head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {title}
        <IconChevron dir={open ? 'up' : 'down'} size={16} />
      </button>
      {open && <div className="fgroup__body">{children}</div>}
    </div>
  )
}

export default function FilterPanel({ filters, setFilters, onReset }) {
  const toggle = (key, value) =>
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }))

  const activeCount =
    filters.category.length +
    filters.size.length +
    filters.color.length +
    filters.price.length +
    filters.collection.length +
    (filters.stock ? 1 : 0)

  return (
    <div className="filters">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="label">FILTERS</span>
        {activeCount > 0 && (
          <button className="link-underline" onClick={onReset} style={{ fontSize: '0.74rem' }}>
            حذف همه ({faDigits(activeCount)})
          </button>
        )}
      </div>

      <Group title="دسته‌بندی">
        {categories.map((c) => (
          <label key={c.slug} className="check">
            <input
              type="checkbox"
              checked={filters.category.includes(c.slug)}
              onChange={() => toggle('category', c.slug)}
            />
            <span>
              {c.name} <span className="muted">({faDigits(c.count)})</span>
            </span>
          </label>
        ))}
      </Group>

      <Group title="سایز">
        <div className="chip-row">
          {SIZES.map((s) => (
            <button
              key={s}
              className={`chip ${filters.size.includes(s) ? 'is-active' : ''}`}
              onClick={() => toggle('size', s)}
              aria-pressed={filters.size.includes(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </Group>

      <Group title="رنگ">
        <div className="chip-row">
          {Object.entries(COLOR_MAP).map(([key, c]) => (
            <button
              key={key}
              className={`chip ${filters.color.includes(key) ? 'is-active' : ''}`}
              onClick={() => toggle('color', key)}
              aria-pressed={filters.color.includes(key)}
            >
              <span
                className="color-btn__dot"
                style={{ background: c.hex, width: 12, height: 12 }}
                aria-hidden="true"
              />
              {c.name}
            </button>
          ))}
        </div>
      </Group>

      <Group title="قیمت">
        {PRICE_BANDS.map((b) => (
          <label key={b.id} className="check">
            <input type="checkbox" checked={filters.price.includes(b.id)} onChange={() => toggle('price', b.id)} />
            <span>{b.label}</span>
          </label>
        ))}
      </Group>

      <Group title="کالکشن">
        {collections.map((c) => (
          <label key={c.slug} className="check">
            <input
              type="checkbox"
              checked={filters.collection.includes(c.slug)}
              onChange={() => toggle('collection', c.slug)}
            />
            <span>
              {c.name} <span className="mono muted">{c.latin}</span>
            </span>
          </label>
        ))}
      </Group>

      <Group title="موجودی">
        <label className="check">
          <input
            type="checkbox"
            checked={filters.stock}
            onChange={() => setFilters((f) => ({ ...f, stock: !f.stock }))}
          />
          <span>فقط کالاهای موجود</span>
        </label>
      </Group>

      <Link to="/categories" className="btn btn--ghost btn--sm btn--block">
        مرور دسته‌بندی‌ها
      </Link>
    </div>
  )
}

export function SizeGuideModal({ open, onClose }) {
  const rows = [
    { size: 'XS', chest: 88, waist: 74, length: 66, sleeve: 60 },
    { size: 'S', chest: 94, waist: 80, length: 68, sleeve: 62 },
    { size: 'M', chest: 100, waist: 86, length: 70, sleeve: 64 },
    { size: 'L', chest: 106, waist: 92, length: 72, sleeve: 66 },
    { size: 'XL', chest: 112, waist: 98, length: 74, sleeve: 68 },
    { size: 'XXL', chest: 118, waist: 104, length: 76, sleeve: 70 },
  ]

  return (
    <Modal open={open} onClose={onClose} title="راهنمای سایز" wide>
      <p className="lead" style={{ fontSize: '0.9rem', marginBlockEnd: 20 }}>
        اندازه‌ها بر حسب سانتی‌متر و روی بدن اندازه‌گیری شده‌اند. اگر بین دو سایز هستید، برای پافر و پارکا سایز
        بزرگ‌تر را انتخاب کنید.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <caption className="label" style={{ textAlign: 'start', paddingBlockEnd: 10 }}>
            SIZE CHART / CM
          </caption>
          <thead>
            <tr>
              <th>سایز</th>
              <th>دور سینه</th>
              <th>دور کمر</th>
              <th>قد</th>
              <th>قد آستین</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.size}>
                <td className="mono">{r.size}</td>
                <td className="tnum">{faDigits(r.chest)}</td>
                <td className="tnum">{faDigits(r.waist)}</td>
                <td className="tnum">{faDigits(r.length)}</td>
                <td className="tnum">{faDigits(r.sleeve)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  )
}
