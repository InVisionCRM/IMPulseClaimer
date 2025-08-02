import React from 'react'
import Modal from './Modal'

interface TestTransactionProps {
  isOpen: boolean;
  onClose: () => void;
}

const TestTransaction: React.FC<TestTransactionProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center p-6">
        <div className="mb-6">
          <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12L11 14L15 10" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Test Transaction</h2>
          <p className="text-gray-400">Verify your wallet connection</p>
        </div>

        <div className="bg-[#131313] rounded-lg p-4 mb-6 border border-gray-700">
          <p className="text-gray-300 text-sm leading-relaxed">
            This transaction will claim a very small amount of pulse from your rewards to ensure proper initialization. 
            <span className="text-amber-400 font-semibold"> Gas is on us!</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75"
          >
            Coming Soon
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default TestTransaction 