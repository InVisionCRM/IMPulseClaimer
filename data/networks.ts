import React from 'react';
import {
  EthereumIcon,
  PulseChainIcon,
  BNBIcon,
  PolygonIcon,
  ArbitrumIcon,
  AvalancheIcon,
  BaseIcon,
  IconProps
} from '../components/icons/CurrencyIcons';

export interface Network {
  id: string;
  name: string;
  icon: React.FC<IconProps>;
  config: {
    name: string;
    chainId: number;
    rpcUrl: string;
    symbol: string;
    explorerUrl: string;
    timeTokenAddress?: string; // TIME token contract address
  };
}

export const networks: Network[] = [
    { id: 'ethereum', name: 'Ethereum', icon: EthereumIcon, config: { name: 'Ethereum Mainnet', chainId: 1, rpcUrl: 'https://cloudflare-eth.com', symbol: 'ETH', explorerUrl: 'https://etherscan.io' } },
    { id: 'pulsechain', name: 'PulseChain', icon: PulseChainIcon, config: { name: 'PulseChain Mainnet', chainId: 369, rpcUrl: 'https://rpc.pulsechain.com', symbol: 'PLS', explorerUrl: 'https://scan.pulsechain.com', timeTokenAddress: '0xCA35638A3fdDD02fEC597D8c1681198C06b23F58' } },
    { id: 'bnb', name: 'BNB Chain', icon: BNBIcon, config: { name: 'BNB Smart Chain', chainId: 56, rpcUrl: 'https://bsc-dataseed.binance.org/', symbol: 'BNB', explorerUrl: 'https://bscscan.com' } },
    { id: 'polygon', name: 'Polygon', icon: PolygonIcon, config: { name: 'Polygon Mainnet', chainId: 137, rpcUrl: 'https://polygon-rpc.com/', symbol: 'MATIC', explorerUrl: 'https://polygonscan.com' } },
    { id: 'arbitrum', name: 'Arbitrum', icon: ArbitrumIcon, config: { name: 'Arbitrum One', chainId: 42161, rpcUrl: 'https://arb1.arbitrum.io/rpc', symbol: 'ETH', explorerUrl: 'https://arbiscan.io' } },
    { id: 'avalanche', name: 'Avalanche', icon: AvalancheIcon, config: { name: 'Avalanche C-Chain', chainId: 43114, rpcUrl: 'https://api.avax.network/ext/bc/C/rpc', symbol: 'AVAX', explorerUrl: 'https://snowtrace.io' } },
    { id: 'base', name: 'Base', icon: BaseIcon, config: { name: 'Base', chainId: 8453, rpcUrl: 'https://mainnet.base.org', symbol: 'ETH', explorerUrl: 'https://basescan.org' } },
];