import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'logo' | 'text' | 'disclaimer' | 'complete'>('logo')
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    // Phase 1: Logo fades in
    const timer1 = setTimeout(() => {
      setOpacity(1)
    }, 100)

    // Phase 2: Text appears
    const timer2 = setTimeout(() => {
      setPhase('text')
    }, 1500)

    // Phase 3: Disclaimer appears
    const timer3 = setTimeout(() => {
      setPhase('disclaimer')
    }, 3500)

    // Phase 4: Complete and fade out
    const timer4 = setTimeout(() => {
      setPhase('complete')
      setOpacity(0)
    }, 6500)

    // Phase 5: Call onComplete
    const timer5 = setTimeout(() => {
      onComplete()
    }, 7000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      clearTimeout(timer5)
    }
  }, [onComplete])

  return (
    <div 
      className="fixed inset-0 bg-[#131313] flex flex-col items-center justify-center z-50 transition-opacity duration-1000"
      style={{ opacity }}
    >
      {phase === 'logo' && (
        <div className="flex flex-col items-center">
          <Image
            src="/crypto_logos_/TIME-2d-500.png"
            alt="TIME Token"
            width={120}
            height={120}
            className="animate-pulse"
          />
        </div>
      )}

      {phase === 'text' && (
        <div className="flex flex-col items-center">
          <Image
            src="/crypto_logos_/TIME-2d-500.png"
            alt="TIME Token"
            width={120}
            height={120}
            className="mb-8"
          />
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-2">
              <span className="font-serif">My</span>{' '}
              <span className="font-mono">TIME</span>{' '}
              <span className="font-sans">Rewards</span>
            </h1>
          </div>
        </div>
      )}

      {phase === 'disclaimer' && (
        <div className="flex flex-col items-center max-w-md mx-auto px-4 text-center">
          <Image
            src="/crypto_logos_/TIME-2d-500.png"
            alt="TIME Token"
            width={80}
            height={80}
            className="mb-6"
          />
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              <span className="font-serif">My</span>{' '}
              <span className="font-mono">TIME</span>{' '}
              <span className="font-sans">Rewards</span>
            </h1>
          </div>
          
          <div className="bg-[#1C1C1C] rounded-lg p-6 border border-gray-700">
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              This application is not affiliated with or endorsed by the Internet Money team. 
              It was created independently out of love and appreciation for the TIME project 
              and the broader Internet Money ecosystem.
            </p>
            <p className="text-amber-400 font-semibold text-lg">
              Coming Soon
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SplashScreen 