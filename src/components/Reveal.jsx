import { useEffect, useRef, useState } from 'react'

/* Scroll-triggered reveal. Uses IntersectionObserver so animations stay cheap
   and respect prefers-reduced-motion (handled in CSS). */
export default function Reveal({ children, className = '', delay = 0, variant = '' }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSeen(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${variant ? `reveal--${variant}` : ''} ${seen ? 'is-in' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

/* Small hook for scroll-linked parallax with rAF throttling. */
export function useParallax(strength = 0.22) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let frame = 0
    const update = () => {
      frame = 0
      const rect = node.getBoundingClientRect()
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight
      node.style.transform = `translate3d(0, ${(-offset * strength * 100).toFixed(2)}px, 0)`
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [strength])

  return ref
}
