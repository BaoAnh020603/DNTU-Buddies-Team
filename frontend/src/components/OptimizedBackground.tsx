import { motion } from 'framer-motion'
import { Star, Sparkles, Zap, Rocket } from 'lucide-react'
import { useMemo } from 'react'
import { getAnimationConfig } from '../utils/deviceDetect'

export const OptimizedBackground = () => {
  const config = useMemo(() => getAnimationConfig(), [])

  // Don't render particles on low-end devices
  if (!config.enableParticles) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Simple gradient background for low-end devices */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0072CE]/5 to-[#003F87]/5" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0072CE08_1px,transparent_1px),linear-gradient(to_bottom,#0072CE08_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating Particles - Optimized count */}
      {[...Array(config.particleCount)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.random() * 80 - 40, 0],
            opacity: [0.1, 0.5, 0.1],
            scale: [1, 2, 1],
          }}
          transition={{
            duration: 6 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: 'easeInOut',
          }}
          className="absolute rounded-full"
          style={{
            width: `${4 + Math.random() * 6}px`,
            height: `${4 + Math.random() * 6}px`,
            background: `linear-gradient(135deg, ${['#0072CE', '#00A0DC', '#003F87'][Math.floor(Math.random() * 3)]}, transparent)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: config.enableBlur ? 'blur(2px)' : 'none',
          }}
        />
      ))}

      {/* Rotating Orbs - Only on high performance */}
      {config.enable3D && (
        <>
          <motion.div
            animate={{
              y: [0, -60, 0],
              x: [0, 50, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute top-20 left-20 w-[400px] h-[400px] bg-gradient-to-br from-[#0072CE]/15 to-[#00A0DC]/15 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, 70, 0],
              x: [0, -60, 0],
              rotate: [360, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gradient-to-br from-[#003F87]/15 to-[#0072CE]/15 rounded-full blur-3xl"
          />
        </>
      )}

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0072CE08_1px,transparent_1px),linear-gradient(to_bottom,#0072CE08_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Stars & Icons - Reduced count */}
      {config.enable3D &&
        [...Array(Math.min(20, config.particleCount / 2))].map((_, i) => (
          <motion.div
            key={`icon-${i}`}
            animate={{
              rotate: [0, 360],
              scale: [1, 2, 1],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: 5 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            {i % 4 === 0 ? (
              <Star className="text-[#0072CE]/30" size={12 + Math.random() * 12} fill="currentColor" />
            ) : i % 4 === 1 ? (
              <Sparkles className="text-[#00A0DC]/30" size={12 + Math.random() * 12} />
            ) : i % 4 === 2 ? (
              <Zap className="text-[#003F87]/30" size={12 + Math.random() * 12} fill="currentColor" />
            ) : (
              <Rocket className="text-[#0072CE]/30" size={12 + Math.random() * 12} />
            )}
          </motion.div>
        ))}
    </div>
  )
}
