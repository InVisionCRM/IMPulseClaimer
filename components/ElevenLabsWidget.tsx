import React, { useEffect, useState } from 'react'

const ElevenLabsWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // The widget should be automatically initialized by the script
    // We can add any additional configuration here if needed
    console.log('ElevenLabs Convai widget loaded')
  }, [])

  return (
    <>
      {/* Widget Container */}
      <div 
        className={`fixed right-0 top-1/2 transform -translate-y-1/2 z-30 w-80 h-96 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <elevenlabs-convai agent-id="agent_8301k1m60gtjek3bna7nd74zc2v8"></elevenlabs-convai>
      </div>

      {/* Side Tab */}
      <div 
        className={`fixed right-0 top-1/2 transform -translate-y-1/2 z-30 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-0'
        }`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-2 rounded-l-lg shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75"
          aria-label={isOpen ? 'Hide AI Assistant' : 'Show AI Assistant'}
        >
          <div className="flex flex-col items-center">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-xs font-medium">AI</span>
          </div>
        </button>
      </div>
    </>
  )
}

export default ElevenLabsWidget 