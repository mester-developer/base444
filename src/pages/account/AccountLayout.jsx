import { NavLink, Outlet, Link } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Bits.jsx'
import { useShop, faDigits } from '../../state/ShopProvider.jsx'
import { IconArrow } from '../../components/Icons.jsx'

const LINKS = [
  { to: '/account', label: 'نمای کلی', end: true },
  { to: '/account/profile', label: 'پروفایل من' },
  { to: '/account/orders', label: 'سفارش‌های من' },
  { to: '/account/addresses', label: 'آدرس‌ها' },
  { to: '/wishlist', label: 'علاقه‌مندی‌ها' },
]

export default function AccountLayout() {
  const { state, logout } = useShop()

  return (
    <>
      <header className="page-head">
        <div className="container">
          <Breadcrumbs items={[{ label: 'حساب کاربری' }]} />
          <div style={{ marginBlockStart: 18 }}>
            <span className="label">ACCOUNT / MEMBER</span>
            <h1 className="display display--md" style={{ marginBlockStart: 12 }}>
              {state.user ? state.user.name : 'حساب کاربری'}
            </h1>
          </div>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container">
          <div className="account-layout">
            <nav className="account-nav" aria-label="بخش‌های حساب کاربری">
              {LINKS.map((l) => (
                <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? 'is-active' : '')}>
                  {l.label}
                  <IconArrow size={15} />
                </NavLink>
              ))}
              {state.user ? (
                <button className="account-nav__out" onClick={logout} style={{ textAlign: 'start', padding: '13px 16px', fontSize: '0.86rem', fontWeight: 600 }}>
                  خروج از حساب
                </button>
              ) : (
                <Link to="/login" style={{ padding: '13px 16px', fontSize: '0.86rem', fontWeight: 600 }}>
                  ورود / ثبت‌نام
                </Link>
              )}
              <span className="mono" style={{ padding: '13px 16px', opacity: 0.6 }}>
                {faDigits(state.orders.length)} ORDER(S) LOCAL
              </span>
            </nav>

            <div style={{ minWidth: 0 }}>
              {!state.user && (
                <div className="panel" style={{ padding: 20, marginBlockEnd: 24 }}>
                  <b>وارد نشده‌اید</b>
                  <p className="muted" style={{ fontSize: '0.86rem', marginBlock: '8px 14px' }}>
                    برای ذخیره‌ی سفارش‌ها و آدرس‌ها وارد شوید. می‌توانید با شماره‌ی موبایل و کد آزمایشی ۱۲۳۴ وارد
                    شوید.
                  </p>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <Link className="btn btn--sm" to="/login">
                      ورود با کد تأیید
                    </Link>
                    <Link className="btn btn--ghost btn--sm" to="/register">
                      ساخت حساب
                    </Link>
                  </div>
                </div>
              )}
              <Outlet />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
