import React from 'react';
import { Network } from '../data/networks';

interface HeaderProps {
  network: Network;
}

const Header: React.FC<HeaderProps> = ({ network }) => {
  const NetworkIcon = network.icon;
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <NetworkIcon size={32} />
          <div>
            <h1 className="text-2xl font-bold text-white">{network.name}</h1>
            <p className="text-gray-400 text-sm">{network.config.name}</p>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-400">Chain ID: {network.config.chainId}</p>
        <p className="text-sm text-gray-400">{network.config.symbol}</p>
      </div>
    </div>
  );
};

export default Header; 