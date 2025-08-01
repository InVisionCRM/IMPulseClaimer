
import React from 'react';
import {
  NetworkIcon,
  WalletIcon,
  DividendsIcon,
  SettingsIcon,
  ExpandIcon,
} from './icons/NavIcons';


const SidebarItem = ({ icon, label, active = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 my-1 rounded-lg cursor-pointer transition-colors w-full ${
        active ? 'bg-amber-500 text-black' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
      aria-label={label}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};


const Sidebar = ({ activeView, onNavigate }) => {
  return (
    <div className="w-20 bg-[#1C1C1C] flex flex-col items-center py-6 border-r border-gray-700">
      {/* Logo */}
      <div className="mb-8">
        <div className="text-amber-500 font-bold text-xl">TIME</div>
        <div className="text-gray-400 text-xs text-center">Dividends</div>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col items-center space-y-2 flex-1">
        <SidebarItem
          icon={<NetworkIcon className="w-6 h-6" />}
          label="Network"
          active={activeView === 'network'}
          onClick={() => onNavigate('network')}
        />
        <SidebarItem
          icon={<WalletIcon className="w-6 h-6" />}
          label="Wallet"
          active={activeView === 'wallet'}
          onClick={() => onNavigate('wallet')}
        />
        <SidebarItem
          icon={<DividendsIcon className="w-6 h-6" />}
          label="Dividends"
          active={activeView === 'dividends'}
          onClick={() => onNavigate('dividends')}
        />
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center space-y-2">
        <SidebarItem
          icon={<SettingsIcon className="w-6 h-6" />}
          label="Settings"
          onClick={() => onNavigate('settings')}
        />
        <SidebarItem
          icon={<ExpandIcon className="w-6 h-6" />}
          label="Expand"
          onClick={() => onNavigate('expand')}
        />
      </div>
    </div>
  );
};

export default Sidebar;