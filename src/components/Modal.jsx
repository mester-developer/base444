import { useEffect, useRef } from 'react'
import { IconClose } from './Icons.jsx'

export default function Modal({ open, onClose, title, children, wide = false, labelledBy = 'modal-title' }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && ref.current) {
        const nodes = ref.current.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (!nodes.length) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.setAttribute('data-locked', 'true')
    const target = ref.current?.querySelector('[data-autofocus]')
    if (target) target.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.removeAttribute('data-locked')
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className={`modal ${wide ? 'modal--wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? labelledBy : undefined}
        ref={ref}
      >
        {title && (
          <div className="modal__head">
            <h2 className="h-card" id={labelledBy}>
              {title}
            </h2>
            <button className="iconbtn" onClick={onClose} aria-label="بستن">
              <IconClose />
            </button>
          </div>
        )}
        <div className="modal__body">{children}</div>
      </div>
    </div>
  )
}
