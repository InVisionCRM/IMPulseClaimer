import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface SplashScreenProps {
  onComplete: () => void;
}

const TERMS_OF_SERVICE = `
1. This application is not affiliated with or endorsed by the Internet Money team.
2. Use at your own risk - cryptocurrency transactions carry inherent risks.
3. We are not responsible for any financial losses or technical issues.
4. Always verify transaction details before confirming.
5. Keep your private keys secure and never share them.
6. This app is provided "as is" without warranties.
7. By using this app, you acknowledge these terms and accept responsibility for your actions.
`

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'logo' | 'text' | 'disclaimer' | 'complete'>('logo')
  const [opacity, setOpacity] = useState(0)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  useEffect(() => {
    // Phase 1: Logo fades in immediately
    const timer1 = setTimeout(() => {
      setOpacity(1)
    }, 50)

    // Phase 2: Disclaimer appears
    const timer2 = setTimeout(() => {
      setPhase('disclaimer')
    }, 2000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  // Handle terms acceptance
  useEffect(() => {
    if (acceptedTerms && phase === 'disclaimer') {
      // Wait a moment then proceed
      const timer = setTimeout(() => {
        setPhase('complete')
        setOpacity(0)
        setTimeout(() => {
          onComplete()
        }, 1000)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [acceptedTerms, phase, onComplete])

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
          
          <div className="bg-[#1C1C1C] rounded-lg p-6 border border-gray-700">
            <div className="flex items-start space-x-2 sm:space-x-3 mb-4">
              <div className="text-amber-400 mt-0.5 flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-amber-400 font-semibold mb-1 text-sm sm:text-base">Disclaimer</h4>
                <p className="text-gray-400 text-xs sm:text-sm">
                  This application is not affiliated with or endorsed by the Internet Money team. 
                  It was created independently out of love and appreciation for the TIME project 
                  and the broader Internet Money ecosystem.
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-600 pt-4">
              <h5 className="text-white font-semibold mb-3 text-sm">Terms of Service</h5>
              <div className="text-left text-xs text-gray-400 mb-4 max-h-32 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans">{TERMS_OF_SERVICE}</pre>
              </div>
              
              <div className="flex items-center justify-center space-x-2">
                <input
                  type="checkbox"
                  id="accept-terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-500 focus:ring-2"
                />
                <label htmlFor="accept-terms" className="text-white text-sm cursor-pointer">
                  I accept the Terms of Service
                </label>
              </div>
            </div>
          </div>
          

        </div>
      )}
    </div>
  )
}

export default SplashScreen 