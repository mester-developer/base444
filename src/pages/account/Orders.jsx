import { useState } from 'react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '../../components/Bits.jsx'
import SceneImage from '../../components/SceneImage.jsx'
import { orderStatuses } from '../../data/content.js'
import { faDigits, formatToman, useShop } from '../../state/ShopProvider.jsx'
import { IconArrow } from '../../components/Icons.jsx'

const FILTERS = [
  { id: 'all', label: 'همه' },
  ...Object.entries(orderStatuses).map(([id, s]) => ({ id, label: s.label })),
]

export default function Orders() {
  const { allOrders } = useShop()
  const [filter, setFilter] = useState('all')
  const list = filter === 'all' ? allOrders : allOrders.filter((o) => o.status === filter)

  return (
    <div>
      <span className="label">ORDERS / HISTORY</span>
      <h2 className="h-sec" style={{ marginBlockStart: 10, fontSize: '1.6rem' }}>
        سفارش‌های من
      </h2>

      <div className="chip-row" style={{ marginBlock: 22 }}>
        {FILTERS.map((f) => (
          <button key={f.id} className={`chip ${filter === f.id ? 'is-active' : ''}`} onClick={() => setFilter(f.id)} aria-pressed={filter === f.id}>
            {f.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="empty">
          <h3 className="h-sec" style={{ fontSize: '1.3rem' }}>
            سفارشی با این وضعیت ندارید
          </h3>
          <p className="lead">فیلتر را تغییر دهید یا خرید جدیدی را شروع کنید.</p>
          <Link className="btn" to="/shop">
            رفتن به فروشگاه
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {list.map((o) => (
            <article className="order-card" key={o.id}>
              <div className="order-card__head">
                <div>
                  <span className="label">ORDER NO.</span>
                  <b className="tnum" style={{ display: 'block' }}>
                    {o.id}
                  </b>
                </div>
                <div>
                  <span className="label">DATE</span>
                  <span className="tnum">{o.date}</span>
                </div>
                <div>
                  <span className="label">TOTAL</span>
                  <b className="tnum" style={{ display: 'block' }}>
                    {formatToman(o.total)}
                  </b>
                </div>
                <div style={{ textAlign: 'end', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                  <StatusBadge status={o.status} />
                  <Link className="link-underline" to={`/account/orders/${o.id}`} style={{ fontSize: '0.76rem' }}>
                    جزئیات
                    <IconArrow size={14} />
                  </Link>
                </div>
              </div>
              <div className="order-card__body">
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {o.items.map((it) => (
                    <div key={`${o.id}-${it.id}-${it.size}`} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{ width: 46, borderRadius: 'var(--radius-1)', overflow: 'hidden' }}>
                        <SceneImage variant={it.variant} seed={it.seed} ratio="3/4" alt={it.name} />
                      </div>
                      <div style={{ fontSize: '0.8rem' }}>
                        <b style={{ display: 'block' }}>{it.name}</b>
                        <span className="muted">
                          سایز {it.size} · {faDigits(it.qty)} عدد
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
