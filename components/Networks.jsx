import React, { useState } from 'react';
import { SettingsIcon } from './icons/NavIcons';
import Modal from './Modal';
import { networks } from '../data/networks.js';


const Networks = ({ currentNetworkId, onConfirm }) => {
  const [selectedForConfirmation, setSelectedForConfirmation] = useState(currentNetworkId);
  const [networkForConfigModal, setNetworkForConfigModal] = useState(null);

  const handleOpenConfig = (network, e) => {
    e.stopPropagation();
    setNetworkForConfigModal(network);
  };

  const handleCloseModal = () => {
    setNetworkForConfigModal(null);
  };

  const NetworkConfigDisplay = ({ network }) => (
    <div className="text-center">
        <div className="flex items-center justify-center mb-6 gap-4">
            {React.createElement(network.icon, { size: 32 })}
            <h2 className="text-xl font-bold text-white">{network.name} Configuration</h2>
        </div>
        <div className="space-y-3 text-left text-sm">
            {[
                { label: 'Network Name', value: network.config.name },
                { label: 'Chain ID', value: network.config.chainId },
                { label: 'RPC URL', value: network.config.rpcUrl },
                { label: 'Currency Symbol', value: network.config.symbol },
                { label: 'Block Explorer', value: network.config.explorerUrl },
            ].map(({label, value}) => (
                <div key={label} className="bg-[#131313] p-3 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">{label}</p>
                    <p className="font-mono text-white break-words">{value.toString()}</p>
                </div>
            ))}
        </div>
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleCloseModal}
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-16 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75"
          >
            Done
          </button>
        </div>
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto font-sans flex flex-col justify-start h-full pt-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">Select Network</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {networks.map((network) => (
          <button
            key={network.id}
            onClick={() => setSelectedForConfirmation(network.id)}
            className={`
              relative bg-[#1C1C1C] rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center 
              border-2 transition-all duration-200 ease-in-out
              transform hover:-translate-y-1 hover:shadow-xl
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#131313] focus:ring-amber-500
              group
              ${selectedForConfirmation === network.id 
                ? 'border-amber-500 shadow-amber-500/20' 
                : 'border-transparent hover:border-amber-400'
              }
            `}
            aria-pressed={selectedForConfirmation === network.id}
            aria-label={`Select ${network.name} network`}
          >
            <button
                onClick={(e) => handleOpenConfig(network, e)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-800/60 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
                aria-label={`View ${network.name} configuration`}
            >
                <SettingsIcon className="w-4 h-4" />
            </button>
            <div className="h-12 w-12 flex items-center justify-center mb-3">
              {React.createElement(network.icon, { size: 48 })}
            </div>
            <span className="font-semibold text-white text-center text-sm sm:text-base">
              {network.name}
            </span>
          </button>
        ))}
      </div>
      
      <div className="mt-10 flex justify-center">
        <button
          onClick={() => onConfirm(selectedForConfirmation)}
          className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-16 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 text-lg"
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

export default Networks;