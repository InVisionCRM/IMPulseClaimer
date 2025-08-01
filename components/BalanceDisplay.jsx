
import React from 'react';
import Tooltip from './Tooltip';
import { IconProps } from './icons/CurrencyIcons';


const BalanceDisplay = ({ 
  title, 
  amount, 
  value, 
  icon, 
  tooltipText,
  isLoading = false 
}) => {
  return (
    <div className="bg-[#1C1C1C] rounded-2xl p-6 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>
      )}
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center gap-3">
          {icon}
          <Tooltip text={tooltipText} position="top">
            <span className="text-gray-300 text-sm cursor-help">{title}</span>
          </Tooltip>
        </div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-white mb-2">
          {isLoading ? '...' : amount === 'No Data' ? 'No Data' : amount}
        </div>
        <div className="text-lg text-gray-400">
          {isLoading ? '...' : value === 'No Data' ? 'No Data' : value}
        </div>
      </div>
    </div>
  );
};

export default BalanceDisplay;
