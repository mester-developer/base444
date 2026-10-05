import { useEffect, useRef } from 'react'

/* Minimal desktop cursor follower — hidden on touch devices and when the user
   prefers reduced motion (see ui.css). */
export default function CustomCursor() {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    if (window.matchMedia('(pointer: coarse)').matches) return undefined

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let frame = 0

    const render = () => {
      frame = 0
      node.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
    }
    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      const interactive = e.target.closest('a, button, .pcard, input, .chip, .swatch')
      node.style.width = interactive ? '46px' : '26px'
      node.style.height = interactive ? '46px' : '26px'
      if (!frame) frame = window.requestAnimationFrame(render)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return <div className="cursor" ref={ref} aria-hidden="true" />
}
