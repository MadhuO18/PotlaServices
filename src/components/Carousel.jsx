import { useEffect, useLayoutEffect, useRef, useState } from 'react'

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200,
  )
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return width
}

/**
 * Lightweight React recreation of the Owl Carousel behaviour used by the
 * original template (autoplay, loop, nav arrows, dots, responsive items).
 */
export default function Carousel({
  slides,
  className = '',
  responsive = { 0: 1 },
  nav = false,
  dots = true,
  autoplay = true,
  autoplayControl = false,
  interval = 5000,
  speed = 600,
  ariaLabel,
}) {
  const outerRef = useRef(null)
  const [outerWidth, setOuterWidth] = useState(0)
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focusWithin, setFocusWithin] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const windowWidth = useWindowWidth()
  const paused = hovered || focusWithin || userPaused || reducedMotion
  const shouldAutoplay = autoplay && !paused

  useLayoutEffect(() => {
    const el = outerRef.current
    if (!el) return
    const measure = () => setOuterWidth(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(preference.matches)
    updatePreference()
    preference.addEventListener('change', updatePreference)
    return () => preference.removeEventListener('change', updatePreference)
  }, [])

  const perView = (() => {
    const breakpoints = Object.keys(responsive)
      .map(Number)
      .sort((a, b) => a - b)
    let items = responsive[breakpoints[0]] ?? 1
    for (const bp of breakpoints) {
      if (windowWidth >= bp) items = responsive[bp]
    }
    return items
  })()

  const count = slides.length
  const maxIndex = Math.max(0, count - perView)
  const itemWidth = outerWidth > 0 ? outerWidth / perView : 0

  useEffect(() => {
    if (index > maxIndex) setIndex(maxIndex)
  }, [maxIndex, index])

  useEffect(() => {
    if (!shouldAutoplay || count <= perView) return
    const id = setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1))
    }, interval)
    return () => clearInterval(id)
  }, [shouldAutoplay, count, perView, maxIndex, interval])

  const go = (i) => {
    if (i < 0) i = maxIndex
    if (i > maxIndex) i = 0
    setIndex(i)
  }

  const dotCount = maxIndex + 1

  return (
    <div
      className={`owl-carousel owl-loaded owl-theme rtl-carousel ${className}`}
      role={ariaLabel ? 'region' : undefined}
      aria-roledescription={ariaLabel ? 'carousel' : undefined}
      aria-label={ariaLabel}
      aria-live={shouldAutoplay ? 'off' : 'polite'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false)
      }}
    >
      <div className="owl-stage-outer" ref={outerRef}>
        <div
          className="owl-stage"
          style={{
            width: itemWidth * count,
            transform: `translate3d(${-index * itemWidth}px,0,0)`,
            transition: `transform ${speed}ms ease`,
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`owl-item ${i >= index && i < index + perView ? 'rtl-active' : ''}`}
              style={{ width: itemWidth }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i < index || i >= index + perView}
              inert={i < index || i >= index + perView}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {nav && (
        <div className="owl-nav">
          <button type="button" className="owl-prev" aria-label="Previous slide" onClick={() => go(index - 1)}>
            <i className="icofont-rounded-left" />
          </button>
          <button type="button" className="owl-next" aria-label="Next slide" onClick={() => go(index + 1)}>
            <i className="icofont-rounded-right" />
          </button>
        </div>
      )}

      {(dots && dotCount > 1) || (autoplay && autoplayControl && !reducedMotion) ? (
        <div className="owl-controls">
          {dots && dotCount > 1 && (
            <div className="owl-dots">
              {Array.from({ length: dotCount }).map((_, i) => (
                <button
                  type="button"
                  key={i}
                  className={`owl-dot ${i === index ? 'active' : ''}`}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index ? 'true' : undefined}
                  onClick={() => go(i)}
                >
                  <span />
                </button>
              ))}
            </div>
          )}
          {autoplay && autoplayControl && !reducedMotion && (
            <button
              type="button"
              className="owl-autoplay-toggle"
              aria-label={userPaused ? 'Resume automatic slide rotation' : 'Pause automatic slide rotation'}
              onClick={() => {
                if (userPaused) {
                  setUserPaused(false)
                  setFocusWithin(false)
                  setHovered(false)
                } else {
                  setUserPaused(true)
                }
              }}
            >
              <i className={userPaused ? 'icofont-play-alt-3' : 'icofont-ui-pause'} aria-hidden="true" />
              <span>{userPaused ? 'Play' : 'Pause'}</span>
            </button>
          )}
        </div>
      ) : null}
    </div>
  )
}
