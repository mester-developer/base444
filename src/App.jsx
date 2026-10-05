import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import SearchOverlay from './components/SearchOverlay.jsx'
import CustomCursor from './components/CustomCursor.jsx'
import { FlyToCart, Toasts } from './components/Toasts.jsx'
import { ProductSkeletons } from './components/ProductGrid.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const Shop = lazy(() => import('./pages/Shop.jsx'))
const ProductDetail = lazy(() => import('./pages/ProductDetail.jsx'))
const Collections = lazy(() => import('./pages/Collections.jsx'))
const CollectionDetail = lazy(() => import('./pages/CollectionDetail.jsx'))
const Categories = lazy(() => import('./pages/Categories.jsx'))
const CategoryDetail = lazy(() => import('./pages/CategoryDetail.jsx'))
const SearchPage = lazy(() => import('./pages/SearchPage.jsx'))
const CartPage = lazy(() => import('./pages/CartPage.jsx'))
const Checkout = lazy(() => import('./pages/Checkout.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Register = lazy(() => import('./pages/Register.jsx'))
const AccountLayout = lazy(() => import('./pages/account/AccountLayout.jsx'))
const AccountDashboard = lazy(() => import('./pages/account/Dashboard.jsx'))
const AccountProfile = lazy(() => import('./pages/account/Profile.jsx'))
const AccountOrders = lazy(() => import('./pages/account/Orders.jsx'))
const AccountOrder = lazy(() => import('./pages/account/OrderDetail.jsx'))
const AccountAddresses = lazy(() => import('./pages/account/Addresses.jsx'))
const Wishlist = lazy(() => import('./pages/Wishlist.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Journal = lazy(() => import('./pages/Journal.jsx'))
const Article = lazy(() => import('./pages/Article.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const Faq = lazy(() => import('./pages/Faq.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

function ScrollToTop() {
  const { pathname, search } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname, search])
  return null
}

function RouteFallback() {
  return (
    <div className="container" style={{ paddingBlock: 'clamp(140px, 20vh, 220px) clamp(60px, 8vw, 120px)' }}>
      <ProductSkeletons count={4} />
    </div>
  )
}

export default function App() {
  return (
    <div className="shell">
      <a className="skip-link" href="#main">
        پرش به محتوای اصلی
      </a>
      <ScrollToTop />
      <CustomCursor />
      <Header />
      <SearchOverlay />
      <CartDrawer />
      <FlyToCart />
      <Toasts />
      <main id="main">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/:slug" element={<CollectionDetail />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:slug" element={<CategoryDetail />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<AccountLayout />}>
              <Route index element={<AccountDashboard />} />
              <Route path="profile" element={<AccountProfile />} />
              <Route path="orders" element={<AccountOrders />} />
              <Route path="orders/:id" element={<AccountOrder />} />
              <Route path="addresses" element={<AccountAddresses />} />
            </Route>
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/about" element={<About />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/journal/:slug" element={<Article />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
