import { Link } from 'react-router-dom'
import { StatusBadge } from '../../components/Bits.jsx'
import { useShop, faDigits, formatToman } from '../../state/ShopProvider.jsx'
import { IconArrow, IconHeart, IconTruck, IconUser } from '../../components/Icons.jsx'

export default function Dashboard() {
  const { state, allOrders } = useShop()
  const active = allOrders.filter((o) => o.status !== 'delivered' && o.status !== 'canceled')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
      <div className="dash-grid">
        <div className="stat-card">
          <span className="label">ORDERS</span>
          <b>{faDigits(allOrders.length)}</b>
          <span className="muted" style={{ fontSize: '0.8rem' }}>
            {faDigits(active.length)} سفارش در جریان
          </span>
        </div>
        <div className="stat-card">
          <span className="label">WISHLIST</span>
          <b>{faDigits(state.wishlist.length)}</b>
          <span className="muted" style={{ fontSize: '0.8rem' }}>
            قطعه ذخیره‌شده
          </span>
        </div>
        <div className="stat-card">
          <span className="label">ADDRESSES</span>
          <b>{faDigits(state.addresses.length)}</b>
          <span className="muted" style={{ fontSize: '0.8rem' }}>
            آدرس ثبت‌شده
          </span>
        </div>
      </div>

      <div>
        <div className="sec-head" style={{ marginBlockEnd: 18 }}>
          <div>
            <span className="label">RECENT / ORDERS</span>
            <h2 className="h-sec" style={{ marginBlockStart: 8, fontSize: '1.4rem' }}>
              آخرین سفارش‌ها
            </h2>
          </div>
          <Link className="link-underline" to="/account/orders">
            همه سفارش‌ها
            <IconArrow size={15} />
          </Link>
        </div>

        <div className="orders-list">
          {allOrders.slice(0, 3).map((o) => (
            <Link className="order-card" key={o.id} to={`/account/orders/${o.id}`} style={{ display: 'block' }}>
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
                <div style={{ textAlign: 'end' }}>
                  <StatusBadge status={o.status} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="dash-grid">
        <Link className="stat-card" to="/account/profile">
          <IconUser />
          <b style={{ fontSize: '1rem' }}>پروفایل من</b>
          <span className="muted" style={{ fontSize: '0.8rem' }}>
            نام، شماره تماس و ایمیل
          </span>
        </Link>
        <Link className="stat-card" to="/wishlist">
          <IconHeart />
          <b style={{ fontSize: '1rem' }}>علاقه‌مندی‌ها</b>
          <span className="muted" style={{ fontSize: '0.8rem' }}>
            قطعه‌های ذخیره‌شده برای بعد
          </span>
        </Link>
        <Link className="stat-card" to="/account/orders">
          <IconTruck />
          <b style={{ fontSize: '1rem' }}>پیگیری سفارش</b>
          <span className="muted" style={{ fontSize: '0.8rem' }}>
            وضعیت ارسال و مرجوعی
          </span>
        </Link>
      </div>
    </div>
  )
}
