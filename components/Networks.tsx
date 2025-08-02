import React, { useState } from 'react'
import { SettingsIcon } from './icons/NavIcons'
import Modal from './Modal'
import { networks, Network } from '@/data/networks'

interface NetworksProps {
  currentNetworkId: string;
  onConfirm: (networkId: string) => void;
}

const Networks: React.FC<NetworksProps> = ({ currentNetworkId, onConfirm }) => {
  const [selectedForConfirmation, setSelectedForConfirmation] = useState<string>(currentNetworkId);
  const [networkForConfigModal, setNetworkForConfigModal] = useState<Network | null>(null);

  const handleOpenConfig = (network: Network, e: React.MouseEvent) => {
    e.stopPropagation();
    setNetworkForConfigModal(network);
  };

  const handleCloseModal = () => {
    setNetworkForConfigModal(null);
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
    <div className="w-full max-w-4xl mx-auto font-sans flex flex-col justify-start h-full pt-4 sm:pt-8 px-2 sm:px-0">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8 text-white">Select Network</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
        {networks.map((network) => (
          <button
            key={network.id}
            onClick={() => setSelectedForConfirmation(network.id)}
            className={`
              relative bg-[#1C1C1C] rounded-lg sm:rounded-xl p-2 sm:p-4 lg:p-6 flex flex-col items-center justify-center 
              border-2 transition-all duration-200 ease-in-out
              transform hover:-translate-y-1 hover:shadow-xl
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#131313] focus:ring-amber-500
              group min-h-[80px] sm:min-h-[100px]
              ${selectedForConfirmation === network.id 
                ? 'border-amber-500 shadow-amber-500/20' 
                : 'border-transparent hover:border-amber-400'
              }
            `}
            aria-pressed={selectedForConfirmation === network.id}
            aria-label={`Select ${network.name} network`}
          >
            <div
                onClick={(e) => handleOpenConfig(network, e)}
                className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1 sm:p-1.5 rounded-full bg-gray-800/60 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 z-10 cursor-pointer"
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
                <SettingsIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
            <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 flex items-center justify-center mb-2 sm:mb-3">
              {React.createElement(network.icon, { size: 32, className: "w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" })}
            </div>
            <span className="font-semibold text-white text-center text-xs sm:text-sm lg:text-base leading-tight px-1 break-words">
              {network.name}
            </span>
          </button>
        ))}
      </div>
      
      <div className="mt-6 sm:mt-10 flex justify-center px-4">
        <button
          onClick={() => onConfirm(selectedForConfirmation)}
          className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 sm:py-3 px-8 sm:px-16 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 text-sm sm:text-lg w-full max-w-xs"
          aria-label={`Confirm selection of ${selectedForConfirmation} network`}
        >
          Confirm Selection
        </button>
      </div>

      <Modal isOpen={!!networkForConfigModal} onClose={handleCloseModal}>
        {networkForConfigModal && <NetworkConfigDisplay network={networkForConfigModal} />}
      </Modal>

    </div>
  );
};

export default Networks 