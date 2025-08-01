
import React from 'react';
import { ChevronRightIcon } from './icons/NavIcons';

interface AccountCardProps {
  address: string | null;
}

const AccountCard: React.FC<AccountCardProps> = ({ address }) => {
  if (!address) {
    return (
      <div className="bg-[#1C1C1C] p-4 rounded-xl flex justify-center items-center">
        <p className="text-gray-400">Please connect your wallet to view your account.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C1C] p-4 rounded-xl flex justify-between items-center cursor-pointer hover:bg-[#252525] transition-colors">
      <div>
        <p className="text-sm text-gray-400">Connected Account</p>
        <p className="text-lg font-medium text-white font-mono">{address}</p>
      </div>
      <ChevronRightIcon />
    </div>
  );
};

export default AccountCard;
