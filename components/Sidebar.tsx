
import React from 'react'
import {
  NetworkIcon,
  WalletIcon,
  DividendsIcon,
  SettingsIcon,
  ExpandIcon,
  CalculatorIcon,
  StatsIcon,
  ContractIcon,
  TestIcon,
} from './icons/NavIcons'

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 sm:p-3 my-1 rounded-lg cursor-pointer transition-all duration-300 w-full relative
        before:absolute before:inset-0 before:rounded-lg before:border-2 before:border-transparent before:transition-all before:duration-300
        hover:before:border-white hover:before:shadow-[0_0_10px_rgba(255,255,255,0.5)] hover:before:shadow-white/50
        ${
          active 
            ? 'bg-amber-500 text-black before:border-amber-500 before:shadow-amber-500/50' 
            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
        }`}
      aria-label={label}
    >
      {React.cloneElement(icon as React.ReactElement, { 
        className: "w-5 h-5 sm:w-6 sm:h-6" 
      })}
      <span className="text-xs mt-1 leading-tight">{label}</span>
    </button>
  );
};

interface SidebarProps {
    activeView: string;
    onNavigate: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden sm:flex w-20 bg-[#1C1C1C] flex-col items-center py-6 border-r border-gray-700">
        {/* Logo */}
        <div className="mb-8">
          <div className="text-amber-500 font-bold text-xl">TIME</div>
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
        <SidebarItem
          icon={<CalculatorIcon className="w-6 h-6" />}
          label="Estimator"
          active={activeView === 'estimator'}
          onClick={() => onNavigate('estimator')}
        />
        <SidebarItem
          icon={<StatsIcon className="w-6 h-6" />}
          label="Stats"
          active={activeView === 'stats'}
          onClick={() => onNavigate('stats')}
        />
        <SidebarItem
          icon={<ContractIcon className="w-6 h-6" />}
          label="Contracts"
          active={activeView === 'contracts'}
          onClick={() => onNavigate('contracts')}
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

      {/* Mobile Bottom Navbar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-[#1C1C1C] border-t border-gray-700 z-50 shadow-lg" style={{ minHeight: '80px' }}>
        {/* Debug indicator - remove this later */}
        <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-1">MOBILE NAV</div>
        <div className="flex justify-around items-center py-3 px-2">
          <SidebarItem
            icon={<NetworkIcon className="w-5 h-5" />}
            label="Network"
            active={activeView === 'network'}
            onClick={() => onNavigate('network')}
          />
          <SidebarItem
            icon={<WalletIcon className="w-5 h-5" />}
            label="Wallet"
            active={activeView === 'wallet'}
            onClick={() => onNavigate('wallet')}
          />
          <SidebarItem
            icon={<DividendsIcon className="w-5 h-5" />}
            label="Dividends"
            active={activeView === 'dividends'}
            onClick={() => onNavigate('dividends')}
          />
          <SidebarItem
            icon={<CalculatorIcon className="w-5 h-5" />}
            label="Estimator"
            active={activeView === 'estimator'}
            onClick={() => onNavigate('estimator')}
          />
          <SidebarItem
            icon={<StatsIcon className="w-5 h-5" />}
            label="Stats"
            active={activeView === 'stats'}
            onClick={() => onNavigate('stats')}
          />
          <SidebarItem
            icon={<TestIcon className="w-5 h-5" />}
            label="Test"
            active={activeView === 'test'}
            onClick={() => onNavigate('test')}
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar