import { Link, useParams } from 'react-router-dom'
import { StatusBadge } from '../../components/Bits.jsx'
import SceneImage from '../../components/SceneImage.jsx'
import { orderStatuses } from '../../data/content.js'
import { faDigits, formatToman, useShop } from '../../state/ShopProvider.jsx'
import { IconCheck } from '../../components/Icons.jsx'

const TIMELINE = ['pending', 'processing', 'shipped', 'delivered']

export default function OrderDetail() {
  const { id } = useParams()
  const { allOrders } = useShop()
  const order = allOrders.find((o) => o.id === id)

  if (!order) {
    return (
      <div className="empty">
        <h2 className="h-sec" style={{ fontSize: '1.4rem' }}>
          سفارش پیدا نشد
        </h2>
        <p className="lead">شماره سفارش را بررسی کنید یا به فهرست سفارش‌ها برگردید.</p>
        <Link className="btn" to="/account/orders">
          سفارش‌های من
        </Link>
      </div>
    )
  }

  const currentIndex = TIMELINE.indexOf(order.status)

  return (
    <div>
      <span className="label">ORDER / {order.id}</span>
      <h2 className="h-sec" style={{ marginBlockStart: 10, fontSize: '1.6rem' }}>
        جزئیات سفارش
      </h2>

      <div className="dash-grid" style={{ marginBlock: 24 }}>
        <div className="stat-card">
          <span className="label">DATE</span>
          <b className="tnum">{order.date}</b>
        </div>
        <div className="stat-card">
          <span className="label">TOTAL</span>
          <b>{formatToman(order.total)}</b>
        </div>
        <div className="stat-card">
          <span className="label">STATUS</span>
          <StatusBadge status={order.status} />
        </div>
      </div>

      {order.status !== 'canceled' && (
        <div className="panel" style={{ padding: 20, marginBlockEnd: 26 }}>
          <span className="label">TRACKING / TIMELINE</span>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBlockStart: 16 }}>
            {TIMELINE.map((t, i) => (
              <span key={t} className={`status ${i <= currentIndex ? 'status--ok' : ''}`}>
                {i <= currentIndex && <IconCheck size={14} />}
                {orderStatuses[t].label}
              </span>
            ))}
          </div>
          {order.tracking && (
            <p className="muted" style={{ fontSize: '0.82rem', marginBlockStart: 14 }}>
              کد رهگیری مرسوله: <b className="tnum">{order.tracking}</b>
            </p>
          )}
        </div>
      )}

      <span className="label">ITEMS</span>
      <div className="order-lines" style={{ marginBlockStart: 14 }}>
        {order.items.map((it) => (
          <div className="order-line" key={`${it.id}-${it.size}`}>
            <div className="order-line__media">
              <SceneImage variant={it.variant} seed={it.seed} ratio="3/4" alt={it.name} />
            </div>
            <div>
              <b style={{ fontSize: '0.88rem' }}>{it.name}</b>
              <div className="muted" style={{ fontSize: '0.76rem' }}>
                سایز {it.size} · {it.color} · {faDigits(it.qty)} عدد
              </div>
            </div>
            <span className="tnum" style={{ fontSize: '0.84rem' }}>
              {formatToman(it.price * it.qty)}
            </span>
          </div>
        ))}
      </div>

      {order.address && (
        <div className="spec-list" style={{ gridTemplateColumns: '1fr', marginBlockStart: 26 }}>
          <div className="spec">
            <span className="spec__k">نشانی تحویل</span>
            <span className="spec__v">
              {order.address.province}، {order.address.city}، {order.address.address}
            </span>
          </div>
          <div className="spec">
            <span className="spec__k">روش ارسال / پرداخت</span>
            <span className="spec__v">
              {order.shipping} — {order.payment}
            </span>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginBlockStart: 30, flexWrap: 'wrap' }}>
        <Link className="btn btn--ghost" to="/account/orders">
          بازگشت به سفارش‌ها
        </Link>
        <Link className="btn" to="/contact">
          پیگیری با پشتیبانی
        </Link>
      </div>
    </div>
  )
}
