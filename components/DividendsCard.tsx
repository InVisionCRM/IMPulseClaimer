
import React from 'react'
import Tooltip from './Tooltip'
import { HelpIcon } from './icons/NavIcons'
import { Network } from '@/data/networks'
import { IconProps } from './icons/CurrencyIcons'
import { type DividendData } from '@/lib/timeContract'

interface DividendsCardProps {
  onClaim: () => void;
  onSweep: () => void;
  network: Network;
  isLoading?: boolean;
  dividendData?: DividendData | null;
  displayData?: {
    claimableAmount: string;
    totalClaimed: string;
    timeBalance: string;
    hasDividends: boolean;
    hasTokens: boolean;
  };
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

const DividendsCard: React.FC<DividendsCardProps> = ({ 
  onClaim, 
  onSweep, 
  network, 
  isLoading = false,
  dividendData,
  displayData
}) => {
  const sweepTooltip = "By sweeping, all dividends that have accrued are brought into the TIME smart contract and made available to claim. This is an optional transaction, as when one person sweeps, dividends are distributed for everyone.";
  const claimTooltip = "By claiming, you are transferring all earned dividends to your account holding TIME.";

  return (
    <div className="bg-[#1C1C1C] rounded-2xl p-6">
      <div className="divide-y divide-gray-700">
        <DividendRow 
          label="Total Dividends Claimed" 
          amount={displayData?.totalClaimed || '0'} 
          value="" 
          symbol={network.config.symbol} 
          icon={network.icon}
          isLoading={isLoading}
        />
        <DividendRow 
          label="Claimable Dividends" 
          amount={displayData?.claimableAmount || '0'} 
          value={displayData?.claimableAmount ? `$${parseFloat(displayData.claimableAmount).toFixed(2)}` : '$0.00'} 
          symbol={network.config.symbol} 
          icon={network.icon}
          isLoading={isLoading}
        />
        <DividendRow 
          label="TIME Balance" 
          amount={displayData?.timeBalance || '0'} 
          value={displayData?.timeBalance ? `$${parseFloat(displayData.timeBalance).toFixed(2)}` : '$0.00'} 
          symbol="TIME" 
          icon={network.icon}
          isLoading={isLoading}
        />
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative flex items-center justify-center">
          <button
            onClick={onSweep}
            disabled={isLoading || !displayData?.hasTokens}
            className={`w-full font-bold py-4 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 ${
              isLoading || !displayData?.hasTokens
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-amber-500 hover:bg-amber-600 text-black'
            }`}
          >
            {isLoading ? 'Loading...' : !displayData?.hasTokens ? 'No TIME Tokens' : 'Sweep Dividends'}
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
            disabled={isLoading || !displayData?.hasDividends}
            className={`w-full font-bold py-4 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75 ${
              isLoading || !displayData?.hasDividends
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-amber-500 hover:bg-amber-600 text-black'
            }`}
          >
            {isLoading ? 'Loading...' : !displayData?.hasDividends ? 'No Dividends' : 'Claim Dividends'}
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

export default DividendsCard
