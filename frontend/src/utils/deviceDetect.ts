// Detect device performance level
export const getDevicePerformance = (): 'high' | 'medium' | 'low' => {
  // Check if running on mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )

  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 2

  // Check device memory (if available)
  const memory = (navigator as any).deviceMemory || 4

  // Check connection speed
  const connection = (navigator as any).connection
  const effectiveType = connection?.effectiveType || '4g'

  // Determine performance level
  if (isMobile) {
    if (cores >= 8 && memory >= 6 && effectiveType === '4g') {
      return 'high'
    } else if (cores >= 4 && memory >= 4) {
      return 'medium'
    }
    return 'low'
  }

  // Desktop
  if (cores >= 8 && memory >= 8) {
    return 'high'
  } else if (cores >= 4 && memory >= 4) {
    return 'medium'
  }
  return 'low'
}

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Get optimal animation config based on device
export const getAnimationConfig = () => {
  const performance = getDevicePerformance()
  const reducedMotion = prefersReducedMotion()

  if (reducedMotion) {
    return {
      enableParticles: false,
      particleCount: 0,
      enableGSAP: false,
      enableAOS: false,
      enableFramerMotion: true, // Keep basic animations
      animationDuration: 0.3,
      enableBlur: false,
      enable3D: false,
    }
  }

  switch (performance) {
    case 'high':
      return {
        enableParticles: true,
        particleCount: 40,
        enableGSAP: true,
        enableAOS: true,
        enableFramerMotion: true,
        animationDuration: 1,
        enableBlur: true,
        enable3D: true,
      }
    case 'medium':
      return {
        enableParticles: true,
        particleCount: 20,
        enableGSAP: false, // Disable GSAP on medium devices
        enableAOS: true,
        enableFramerMotion: true,
        animationDuration: 0.6,
        enableBlur: false, // Disable blur effects
        enable3D: false, // Disable 3D transforms
      }
    case 'low':
      return {
        enableParticles: false,
        particleCount: 0,
        enableGSAP: false,
        enableAOS: false,
        enableFramerMotion: true, // Keep basic animations only
        animationDuration: 0.3,
        enableBlur: false,
        enable3D: false,
      }
  }
}

// Throttle function for performance
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null
  let lastExecTime = 0

  return (...args: Parameters<T>) => {
    const currentTime = Date.now()

    if (currentTime - lastExecTime < delay) {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        lastExecTime = currentTime
        func(...args)
      }, delay)
    } else {
      lastExecTime = currentTime
      func(...args)
    }
  }
}

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

// Request animation frame throttle
export const rafThrottle = <T extends (...args: any[]) => any>(func: T) => {
  let rafId: number | null = null

  return (...args: Parameters<T>) => {
    if (rafId) {
      return
    }

    rafId = requestAnimationFrame(() => {
      func(...args)
      rafId = null
    })
  }
}
