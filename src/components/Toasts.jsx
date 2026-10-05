import { useShop } from '../state/ShopProvider.jsx'
import { IconBag, IconCheck } from './Icons.jsx'

export function Toasts() {
  const { toasts } = useShop()
  if (!toasts.length) return null
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.tone === 'info' ? 'toast--info' : ''}`}>
          <span className="toast__icon" aria-hidden="true">
            {t.tone === 'info' ? <IconBag size={18} /> : <IconCheck size={18} />}
          </span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}

export function FlyToCart() {
  const { flyItem } = useShop()
  if (!flyItem) return null

  const target = document.getElementById('cart-anchor')
  const rect = target ? target.getBoundingClientRect() : { left: window.innerWidth - 60, top: 20, width: 40, height: 40 }
  const startX = window.innerWidth / 2 - 38
  const startY = window.innerHeight / 2 - 50

  const style = {
    left: `${startX}px`,
    top: `${startY}px`,
    '--fx': `${rect.left + rect.width / 2 - startX}px`,
    '--fy': `${rect.top + rect.height / 2 - startY}px`,
  }

  return (
    <div className="fly" style={style} aria-hidden="true">
      <svg viewBox="0 0 300 400" width="100%">
        <rect width="300" height="400" fill="#afc4d2" />
        <rect x="84" y="124" width="132" height="236" fill="#8fa8b8" />
        <rect x="104" y="90" width="92" height="40" fill="#617b8c" />
      </svg>
    </div>
  )
}
