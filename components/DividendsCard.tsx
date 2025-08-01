
import React from 'react';
import Tooltip from './Tooltip';
import { HelpIcon } from './icons/NavIcons';
import { Network } from '../data/networks';
import { IconProps } from './icons/CurrencyIcons';

interface DividendsCardProps {
  onClaim: () => void;
  onSweep: () => void;
  network: Network;
  isLoading?: boolean;
}

const DividendRow: React.FC<{
  label: string;
  amount: string;
  value: string;
  symbol: string;
  icon: React.FC<IconProps>;
  isLoading?: boolean;
}> = ({ label, amount, value, symbol, icon: Icon, isLoading = false }) => (
  <div className="flex justify-between items-center py-4">
    <span className="text-gray-300">{label}</span>
    <div className="text-right">
      <div className="flex items-center justify-end gap-2">
        <span className="font-medium text-white">
          {isLoading ? 'Loading...' : amount} {!isLoading && symbol}
        </span>
        {!isLoading && <Icon size={24} />}
      </div>
      <span className="text-sm text-gray-500">
        {isLoading ? 'Loading...' : value}
      </span>
    </div>
  </div>
);

const DividendsCard: React.FC<DividendsCardProps> = ({ onClaim, onSweep, network, isLoading = false }) => {
  const sweepTooltip = "By sweeping, all dividends that have accrued are brought into the TIME smart contract and made available to claim. This is an optional transaction, as when one person sweeps, dividends are distributed for everyone.";
  const claimTooltip = "By claiming, you are transferring all earned dividends to your account holding TIME.";

  return (
    <div className="bg-[#1C1C1C] rounded-2xl p-6">
      <div className="divide-y divide-gray-700">
        <DividendRow 
          label="Total Dividends Claimed" 
          amount="Coming Soon" 
          value="Coming Soon" 
          symbol={network.config.symbol} 
          icon={network.icon}
          isLoading={isLoading}
        />
        <DividendRow 
          label="Claimable Dividends" 
          amount="Coming Soon" 
          value="Coming Soon" 
          symbol={network.config.symbol} 
          icon={network.icon}
          isLoading={isLoading}
        />
        <DividendRow 
          label="Sweepable Dividends" 
          amount="Coming Soon" 
          value="Coming Soon" 
          symbol={network.config.symbol} 
          icon={network.icon}
          isLoading={isLoading}
        />
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative flex items-center justify-center">
          <button
            onClick={onSweep}
            disabled={isLoading}
            className={`w-full font-bold py-4 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 ${
              isLoading 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-amber-500 hover:bg-amber-600 text-black'
            }`}
          >
            {isLoading ? 'Loading...' : 'Sweep Dividends'}
          </button>
          <div className="absolute -right-2 sm:-right-4">
            <Tooltip text={sweepTooltip} position="top">
              <HelpIcon className="w-5 h-5 text-gray-400" />
            </Tooltip>
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          <button
            onClick={onClaim}
            disabled={isLoading}
            className={`w-full font-bold py-4 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 ${
              isLoading 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-amber-500 hover:bg-amber-600 text-black'
            }`}
          >
            {isLoading ? 'Loading...' : 'Claim Dividends'}
          </button>
          <div className="absolute -right-2 sm:-right-4">
            <Tooltip text={claimTooltip} position="top">
              <HelpIcon className="w-5 h-5 text-gray-400" />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DividendsCard;
