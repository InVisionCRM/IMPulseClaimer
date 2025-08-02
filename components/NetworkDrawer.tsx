import React from 'react'
import { Network, networks } from '@/data/networks'
import { SettingsIcon } from './icons/NavIcons'
import Modal from './Modal'

interface NetworkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNetwork: Network;
  onNetworkSelect: (network: Network) => void;
}

const NetworkDrawer: React.FC<NetworkDrawerProps> = ({
  isOpen,
  onClose,
  selectedNetwork,
  onNetworkSelect
}) => {
  const [networkForConfigModal, setNetworkForConfigModal] = React.useState<Network | null>(null);

  const handleOpenConfig = (network: Network, e: React.MouseEvent) => {
    e.stopPropagation();
    setNetworkForConfigModal(network);
  };

  const handleCloseModal = () => {
    setNetworkForConfigModal(null);
  };

  const handleNetworkClick = (network: Network) => {
    onNetworkSelect(network);
    onClose();
  };

  const NetworkConfigDisplay = ({ network }: { network: Network }) => (
    <div className="text-center px-2 sm:px-0">
        <div className="flex items-center justify-center mb-4 sm:mb-6 gap-2 sm:gap-4">
            {React.createElement(network.icon, { size: 24, className: "w-6 h-6 sm:w-8 sm:h-8" })}
            <h2 className="text-lg sm:text-xl font-bold text-white">{network.name} Configuration</h2>
        </div>
        <div className="space-y-2 sm:space-y-3 text-left text-xs sm:text-sm">
            {[
                { label: 'Network Name', value: network.config.name },
                { label: 'Chain ID', value: network.config.chainId },
                { label: 'RPC URL', value: network.config.rpcUrl },
                { label: 'Currency Symbol', value: network.config.symbol },
                { label: 'Block Explorer', value: network.config.explorerUrl },
            ].map(({label, value}) => (
                <div key={label} className="bg-[#131313] p-2 sm:p-3 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">{label}</p>
                    <p className="font-mono text-white break-words text-xs sm:text-sm">{value.toString()}</p>
                </div>
            ))}
        </div>
        <div className="mt-6 sm:mt-8 flex justify-center px-4">
          <button
            onClick={handleCloseModal}
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 sm:py-3 px-8 sm:px-16 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 text-sm sm:text-base w-full max-w-xs"
          >
            Done
          </button>
        </div>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div className={`
        fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
      `}>
        <div className="bg-[#1C1C1C] rounded-t-2xl border-t border-gray-700 max-h-[80vh] overflow-hidden">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-gray-600 rounded-full"></div>
          </div>
          
          {/* Header */}
          <div className="px-4 pb-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Select Network</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close network selection"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Network Grid */}
          <div className="p-4 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-2 gap-3">
              {networks.map((network) => (
                <button
                  key={network.id}
                  onClick={() => handleNetworkClick(network)}
                  className={`
                    relative bg-[#131313] rounded-lg p-3 flex flex-col items-center justify-center 
                    border-2 transition-all duration-200 ease-in-out
                    transform hover:-translate-y-1 hover:shadow-lg
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#131313] focus:ring-amber-500
                    group min-h-[80px]
                    ${selectedNetwork.id === network.id 
                      ? 'border-amber-500 shadow-amber-500/20' 
                      : 'border-transparent hover:border-amber-400'
                    }
                  `}
                  aria-pressed={selectedNetwork.id === network.id}
                  aria-label={`Select ${network.name} network`}
                >
                  <div
                    onClick={(e) => handleOpenConfig(network, e)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-gray-800/60 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 z-10 cursor-pointer"
                    aria-label={`View ${network.name} configuration`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleOpenConfig(network, e as any);
                      }
                    }}
                  >
                    <SettingsIcon className="w-3 h-3" />
                  </div>
                  <div className="h-8 w-8 flex items-center justify-center mb-2">
                    {React.createElement(network.icon, { size: 32, className: "w-6 h-6" })}
                  </div>
                  <span className="font-semibold text-white text-center text-xs leading-tight px-1 break-words">
                    {network.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Modal */}
      <Modal isOpen={!!networkForConfigModal} onClose={handleCloseModal}>
        {networkForConfigModal && <NetworkConfigDisplay network={networkForConfigModal} />}
      </Modal>
    </>
  );
};

export default NetworkDrawer; 