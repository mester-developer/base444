import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { products } from '../data/catalog.js'
import { useShop, formatToman } from '../state/ShopProvider.jsx'
import SceneImage from './SceneImage.jsx'
import { IconClose, IconSearch } from './Icons.jsx'

const SUGGESTIONS = ['پافر', 'پارکا', 'کاپشن آیس پرو', 'ضدآب', 'دراپ محدود', 'هودی']
const RECENT_KEY = 'friz.searches'

export default function SearchOverlay() {
  const { ui, toggleSearch } = useShop()
  const [q, setQ] = useState('')
  const [recent, setRecent] = useState([])
  const inputRef = useRef(null)

  useEffect(() => {
    if (!ui.searchOpen) return undefined
    document.body.setAttribute('data-locked', 'true')
    const t = setTimeout(() => inputRef.current?.focus(), 60)
    const onKey = (e) => e.key === 'Escape' && toggleSearch(false)
    document.addEventListener('keydown', onKey)
    try {
      setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'))
    } catch {
      setRecent([])
    }
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      document.body.removeAttribute('data-locked')
    }
  }, [ui.searchOpen, toggleSearch])

  const results = useMemo(() => {
    const term = q.trim()
    if (!term) return []
    return products
      .filter((p) =>
        [p.name, p.shortDescription, p.tags.join(' '), p.category, p.collection]
          .join(' ')
          .toLowerCase()
          .includes(term.toLowerCase()),
      )
      .slice(0, 8)
  }, [q])

  const commit = (term) => {
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 5)
    setRecent(next)
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }

  if (!ui.searchOpen) return null

  const popular = products.slice(0, 3)

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="جستجو">
      <div className="search-overlay__top container">
        <span className="label">SEARCH / SYSTEM 01</span>
        <button className="iconbtn" onClick={() => toggleSearch(false)} aria-label="بستن جستجو">
          <IconClose />
        </button>
      </div>

      <div className="search-overlay__field">
        <IconSearch size={26} />
        <input
          ref={inputRef}
          className="search-overlay__input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && commit(q)}
          placeholder="چه چیزی می‌خواهید پیدا کنید؟"
          aria-label="جستجوی محصولات"
        />
      </div>

      <div className="container" style={{ paddingBlock: 'clamp(24px, 4vw, 48px)' }}>
        {q.trim() ? (
          results.length ? (
            <>
              <span className="label">{results.length.toLocaleString('fa-IR')} نتیجه</span>
              <div className="pgrid pgrid--3" style={{ marginBlockStart: 18 }}>
                {results.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.slug}`}
                    onClick={() => {
                      commit(q)
                      toggleSearch(false)
                    }}
                    className="pcard"
                  >
                    <div className="pcard__media">
                      <SceneImage variant={p.images[0].variant} seed={p.images[0].seed} alt={p.name} />
                    </div>
                    <div className="pcard__body">
                      <span className="h-card">{p.name}</span>
                      <span className="pcard__price">{formatToman(p.price)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="empty">
              <div className="empty__mark" aria-hidden="true">
                <IconSearch />
              </div>
              <h3 className="h-card">چیزی پیدا نشد</h3>
              <p className="muted">عبارت دیگری را امتحان کنید یا از دسته‌بندی‌ها شروع کنید.</p>
              <Link to="/shop" className="btn btn--ghost" onClick={() => toggleSearch(false)}>
                مشاهده همه محصولات
              </Link>
            </div>
          )
        ) : (
          <div className="search-suggest">
            <div>
              <span className="label">پیشنهادهای جستجو</span>
              <div className="chip-row" style={{ marginBlockStart: 14 }}>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    className="chip"
                    onClick={() => {
                      setQ(s)
                      commit(s)
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {recent.length > 0 && (
                <>
                  <span className="label" style={{ display: 'block', marginBlockStart: 28 }}>
                    آخرین جستجوها
                  </span>
                  <div className="chip-row" style={{ marginBlockStart: 14 }}>
                    {recent.map((r) => (
                      <button key={r} className="chip" onClick={() => setQ(r)}>
                        {r}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <span className="label">محصولات محبوب</span>
              <div className="pgrid pgrid--3" style={{ marginBlockStart: 14 }}>
                {popular.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.slug}`}
                    onClick={() => toggleSearch(false)}
                    className="pcard"
                  >
                    <div className="pcard__media">
                      <SceneImage variant={p.images[0].variant} seed={p.images[0].seed} alt={p.name} />
                    </div>
                    <div className="pcard__body">
                      <span className="h-card">{p.name}</span>
                      <span className="pcard__price">{formatToman(p.price)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
