import React from 'react'

interface AccountCardProps {
  address?: string;
}

const AccountCard: React.FC<AccountCardProps> = ({ address }) => {
  const formatAddress = (addr: string) => {
    if (!addr) return 'Not Connected';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="bg-[#1C1C1C] rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Connected Wallet</h2>
          <p className="text-gray-400 text-sm mt-1">
            {address ? formatAddress(address) : 'Please connect your wallet'}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          address 
            ? 'bg-green-900 text-green-300' 
            : 'bg-red-900 text-red-300'
        }`}>
          {address ? 'Connected' : 'Disconnected'}
        </div>
      </div>
    </div>
  );
};

export default AccountCard 