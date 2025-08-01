
import React from 'react';
import { Network } from '../data/networks';
import { TimeIcon } from './icons/CurrencyIcons';

interface HeaderProps {
    network: Network;
}

const Header: React.FC<HeaderProps> = ({ network }) => {
    return (
        <header className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <TimeIcon size={32} />
                 <div className="flex items-baseline gap-2">
                    <h1 className="text-2xl font-bold text-white">TIME Dividends</h1>
                    <span className="bg-[#2a2a2a] text-amber-400 text-xs font-semibold px-2 py-0.5 rounded-full">{network.name}</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <w3m-button />
            </div>
        </header>
    );
};

export default Header;
