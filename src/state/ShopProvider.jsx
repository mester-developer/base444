import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { products, COLOR_MAP } from '../data/catalog.js'
import { shippingMethods, sampleOrders } from '../data/content.js'

const KEY = 'friz.store.v1'
const ShopContext = createContext(null)

export const faDigits = (input) => String(input).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

export const formatToman = (value) => `${faDigits(Math.round(value).toLocaleString('en-US'))} تومان`

const initialState = {
  items: [],
  wishlist: [],
  user: null,
  addresses: [],
  orders: [],
  coupon: null,
  shippingId: 'normal',
}

const COUPONS = { FRIZ10: 0.1, WINTER15: 0.15, ARCTIC20: 0.2 }

function reducer(state, action) {
  switch (action.type) {
    case 'hydrate':
      return { ...state, ...action.payload }
    case 'items':
      return { ...state, items: action.items }
    case 'wishlist':
      return { ...state, wishlist: action.wishlist }
    case 'user':
      return { ...state, user: action.user }
    case 'addresses':
      return { ...state, addresses: action.addresses }
    case 'orders':
      return { ...state, orders: action.orders }
    case 'coupon':
      return { ...state, coupon: action.coupon }
    case 'shipping':
      return { ...state, shippingId: action.shippingId }
    default:
      return state
  }
}

export function ShopProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [ui, setUi] = useState({ cartOpen: false, searchOpen: false, menuOpen: false })
  const [toasts, setToasts] = useState([])
  const [flyItem, setFlyItem] = useState(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) dispatch({ type: 'hydrate', payload: JSON.parse(raw) })
    } catch {
      /* ignore unreadable storage */
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage may be unavailable */
    }
  }, [state])

  const toast = useCallback((message, tone = 'ok') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, message, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400)
  }, [])

  const keyOf = (id, size, color) => `${id}__${size}__${color}`

  // Stable UI controls: these must keep their identity across renders so
  // consumers can safely list them in effect dependencies.
  const openCart = useCallback(() => setUi((u) => (u.cartOpen ? u : { ...u, cartOpen: true })), [])
  const closeCart = useCallback(() => setUi((u) => (u.cartOpen ? { ...u, cartOpen: false } : u)), [])
  const toggleSearch = useCallback(
    (open) => setUi((u) => ({ ...u, searchOpen: open === undefined ? !u.searchOpen : open })),
    [],
  )
  const openMenu = useCallback(() => setUi((u) => (u.menuOpen ? u : { ...u, menuOpen: true })), [])
  const closeMenu = useCallback(() => setUi((u) => (u.menuOpen ? { ...u, menuOpen: false } : u)), [])

  const cartLines = state.items.map((line) => {
    const product = products.find((x) => x.id === line.id)
    return {
      ...line,
      key: keyOf(line.id, line.size, line.color),
      product,
      lineTotal: product ? product.price * line.qty : 0,
    }
  })

  const subtotal = cartLines.reduce((s, l) => s + l.lineTotal, 0)
  const count = state.items.reduce((s, l) => s + l.qty, 0)
  const activeShipping = shippingMethods.find((s) => s.id === state.shippingId) || shippingMethods[0]
  const discount = state.coupon ? Math.round(subtotal * (COUPONS[state.coupon] || 0)) : 0
  const shippingCost = subtotal === 0 ? 0 : activeShipping.cost
  const total = Math.max(0, subtotal - discount + shippingCost)

  const api = useMemo(() => {
    const base = {
      state,
      cartLines,
      count,
      subtotal,
      discount,
      shippingCost,
      total,
      activeShipping,

      ui,
      openCart,
      closeCart,
      toggleSearch,
      openMenu,
      closeMenu,

      toasts,
      toast,
      flyItem,

      setShipping: (shippingId) => dispatch({ type: 'shipping', shippingId }),

      addToCart: (product, { size, color, qty = 1, silent = false } = {}) => {
        const chosenSize = size || product.sizes[0]
        const chosenColor = color || product.colors[0]
        const key = keyOf(product.id, chosenSize, chosenColor)
        const existing = state.items.find((l) => keyOf(l.id, l.size, l.color) === key)
        const items = existing
          ? state.items.map((l) => (keyOf(l.id, l.size, l.color) === key ? { ...l, qty: l.qty + qty } : l))
          : [...state.items, { id: product.id, size: chosenSize, color: chosenColor, qty }]
        dispatch({ type: 'items', items })
        setFlyItem({
          variant: product.images[0].variant,
          seed: product.images[0].seed,
          name: product.name,
        })
        setTimeout(() => setFlyItem(null), 950)
        if (!silent) toast(`«${product.name}» به سبد اضافه شد`)
      },

      removeLine: (key) =>
        dispatch({ type: 'items', items: state.items.filter((l) => keyOf(l.id, l.size, l.color) !== key) }),

      setQty: (key, qty) =>
        dispatch({
          type: 'items',
          items: state.items
            .map((l) => (keyOf(l.id, l.size, l.color) === key ? { ...l, qty: Math.max(0, qty) } : l))
            .filter((l) => l.qty > 0),
        }),

      clearCart: () => dispatch({ type: 'items', items: [] }),

      toggleWishlist: (id) => {
        const has = state.wishlist.includes(id)
        dispatch({
          type: 'wishlist',
          wishlist: has ? state.wishlist.filter((x) => x !== id) : [...state.wishlist, id],
        })
        const product = products.find((x) => x.id === id)
        toast(
          has ? `«${product.name}» از علاقه‌مندی‌ها حذف شد` : `«${product.name}» به علاقه‌مندی‌ها اضافه شد`,
          has ? 'info' : 'ok',
        )
        return !has
      },

      login: (user) => {
        dispatch({ type: 'user', user })
        toast(`${user.name}، خوش آمدید`)
      },
      logout: () => {
        dispatch({ type: 'user', user: null })
        toast('از حساب کاربری خارج شدید', 'info')
      },

      addAddress: (address) => {
        dispatch({ type: 'addresses', addresses: [...state.addresses, { ...address, id: Date.now() }] })
        toast('آدرس جدید ذخیره شد')
      },
      removeAddress: (id) =>
        dispatch({ type: 'addresses', addresses: state.addresses.filter((a) => a.id !== id) }),

      applyCoupon: (code) => {
        const clean = String(code || '').trim().toUpperCase()
        if (COUPONS[clean]) {
          dispatch({ type: 'coupon', coupon: clean })
          return { ok: true, amount: COUPONS[clean] }
        }
        return { ok: false }
      },
      removeCoupon: () => dispatch({ type: 'coupon', coupon: null }),

      placeOrder: (payload) => {
        const order = {
          id: `FZ-1405-${Math.floor(1000 + Math.random() * 8999)}`,
          date: faDigits(new Date().toLocaleDateString('fa-IR')),
          status: 'processing',
          total,
          items: cartLines
            .filter((l) => l.product)
            .map((l) => ({
              id: l.id,
              name: l.product.name,
              size: l.size,
              color: COLOR_MAP[l.color]?.name || l.color,
              qty: l.qty,
              price: l.product.price,
              variant: l.product.images[0].variant,
              seed: l.product.images[0].seed,
            })),
          ...payload,
        }
        dispatch({ type: 'orders', orders: [order, ...state.orders] })
        dispatch({ type: 'items', items: [] })
        dispatch({ type: 'coupon', coupon: null })
        return order
      },

      allOrders: [...state.orders, ...sampleOrders],
    }
    return base
  }, [
    state,
    ui,
    toasts,
    flyItem,
    toast,
    openCart,
    closeCart,
    toggleSearch,
    openMenu,
    closeMenu,
    cartLines,
    count,
    subtotal,
    discount,
    shippingCost,
    total,
    activeShipping,
  ])

  return <ShopContext.Provider value={api}>{children}</ShopContext.Provider>
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used inside ShopProvider')
  return ctx
}
