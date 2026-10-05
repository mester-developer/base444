import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useShop } from '../state/ShopProvider.jsx'
import { IconBag, IconClose, IconMenu, IconSearch, IconUser } from './Icons.jsx'

const NAV = [
  { to: '/', label: 'خانه', end: true },
  { to: '/shop', label: 'فروشگاه' },
  { to: '/collections', label: 'کالکشن‌ها' },
  { to: '/shop?sort=newest', label: 'جدیدها', match: '/shop' },
  { to: '/categories', label: 'دسته‌بندی‌ها' },
  { to: '/about', label: 'درباره ما' },
]

const SOLID_ROUTES = ['/shop', '/cart', '/checkout', '/login', '/register', '/account', '/wishlist', '/faq', '/contact', '/search']

export function Logo({ light = true }) {
  return (
    <span className="logo" style={light ? undefined : { color: 'var(--ink)' }}>
      <svg className="logo__mark" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M14 46 L26 18 L38 46" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinejoin="round" />
        <path d="M20 37 L32 37" stroke="currentColor" strokeWidth="4.5" opacity="0.6" />
        <circle cx="47" cy="22" r="5" fill="currentColor" opacity="0.7" />
      </svg>
      <span>
        فریز
        <span className="logo__latin">FRZN / SYSTEM 01</span>
      </span>
    </span>
  )
}

export default function Header() {
  const { count, wishlist, ui, openCart, openMenu, closeMenu, toggleSearch } = useShop()
  const { pathname } = useLocation()
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    closeMenu()
  }, [pathname, closeMenu])

  const solid = SOLID_ROUTES.includes(pathname)

  return (
    <>
      <header className={`header ${solid ? 'header--solid' : ''} ${stuck ? 'is-stuck' : ''}`}>
        <div className="container">
          <div className="header__inner">
            <Link to="/" aria-label="فریز — صفحه اصلی">
              <Logo light={!solid} />
            </Link>

            <nav className="nav" aria-label="ناوبری اصلی">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `nav__link ${isActive && item.label !== 'جدیدها' ? 'is-active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="header__tools">
              <button className="tool" onClick={() => toggleSearch(true)} aria-label="جستجو">
                <IconSearch />
                <span className="tool__label">جستجو</span>
              </button>
              <Link className="tool" to="/account" aria-label="حساب کاربری">
                <IconUser />
                <span className="tool__label">حساب</span>
              </Link>
              <button className="tool" id="cart-anchor" onClick={openCart} aria-label={`سبد خرید، ${count} کالا`}>
                <IconBag />
                <span className="tool__label">سبد</span>
                {count > 0 && <span className="tool__count">{count.toLocaleString('fa-IR')}</span>}
              </button>
              <button className="tool burger" onClick={openMenu} aria-label="منو">
                <IconMenu />
              </button>
            </div>
          </div>
        </div>
      </header>

      {ui.menuOpen && (
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="منوی موبایل">
          <div className="container">
            <div className="header__inner" style={{ color: 'var(--text-invert)' }}>
              <Logo />
              <div />
              <div className="header__tools">
                <button className="tool" onClick={() => toggleSearch(true)} aria-label="جستجو">
                  <IconSearch />
                </button>
                <button className="tool" onClick={closeMenu} aria-label="بستن منو">
                  <IconClose />
                </button>
              </div>
            </div>
            <nav className="mobile-menu__nav" aria-label="ناوبری موبایل">
              {NAV.map((item) => (
                <Link key={item.to} to={item.to} className="mobile-menu__link" onClick={closeMenu}>
                  {item.label}
                </Link>
              ))}
              <Link to="/journal" className="mobile-menu__link" onClick={closeMenu}>
                مجله
              </Link>
              <Link to="/account" className="mobile-menu__link" onClick={closeMenu}>
                حساب کاربری
              </Link>
              <Link to="/wishlist" className="mobile-menu__link" onClick={closeMenu}>
                علاقه‌مندی‌ها ({wishlist.length.toLocaleString('fa-IR')})
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
