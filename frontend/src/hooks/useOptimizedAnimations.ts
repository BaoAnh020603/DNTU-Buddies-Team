import { useEffect, useState, useMemo } from 'react'
import { getAnimationConfig, prefersReducedMotion } from '../utils/deviceDetect'

export const useOptimizedAnimations = () => {
  const [isReady, setIsReady] = useState(false)
  const config = useMemo(() => getAnimationConfig(), [])
  const reducedMotion = useMemo(() => prefersReducedMotion(), [])

  useEffect(() => {
    // Lazy load animation libraries based on device performance
    const loadAnimations = async () => {
      try {
        // Always load Framer Motion (lightweight)
        // Already imported in components

        // Load AOS only if enabled
        if (config.enableAOS && !reducedMotion) {
          const AOS = await import('aos')
          await import('aos/dist/aos.css')
          AOS.init({
            duration: config.animationDuration * 1000,
            once: true, // Animate only once for better performance
            mirror: false, // Don't animate on scroll up
            offset: 100,
            easing: 'ease-out-cubic',
          })
        }

        // Load GSAP only if enabled
        if (config.enableGSAP && !reducedMotion) {
          const { gsap } = await import('gsap')
          const { ScrollTrigger } = await import('gsap/ScrollTrigger')
          gsap.registerPlugin(ScrollTrigger)
        }

        setIsReady(true)
      } catch (error) {
        console.error('Error loading animations:', error)
        setIsReady(true) // Continue without animations
      }
    }

    loadAnimations()
  }, [config, reducedMotion])

  return {
    isReady,
    config,
    reducedMotion,
  }
}

// Hook for intersection observer (lazy load content)
export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
      if (entry.isIntersecting && !hasIntersected) {
        setHasIntersected(true)
      }
    }, options)

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [ref, options, hasIntersected])

  return { isIntersecting, hasIntersected }
}

// Hook for lazy loading images
export const useLazyImage = (src: string) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.src = src

    img.onload = () => {
      setImageSrc(src)
      setIsLoading(false)
    }

    img.onerror = () => {
      setError(true)
      setIsLoading(false)
    }

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src])

  return { imageSrc, isLoading, error }
}

// Hook for debounced window resize
export const useDebounceResize = (callback: () => void, delay: number = 250) => {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(callback, delay)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [callback, delay])
}

// Hook for RAF-based scroll listener
export const useRAFScroll = (callback: (scrollY: number) => void) => {
  useEffect(() => {
    let rafId: number | null = null
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      if (rafId) return

      rafId = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY
        if (currentScrollY !== lastScrollY) {
          callback(currentScrollY)
          lastScrollY = currentScrollY
        }
        rafId = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [callback])
}
