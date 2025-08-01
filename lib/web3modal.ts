import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { networks } from '../data/networks';

// 1. Get projectID at https://cloud.walletconnect.com
const projectId = 'b37311be7b32236140b8f3b965a17bfa';

// 2. Set chains
const chains = networks.map(network => ({
    chainId: network.config.chainId,
    name: network.config.name,
    currency: network.config.symbol,
    explorerUrl: network.config.explorerUrl,
    rpcUrl: network.config.rpcUrl,
}));

// 3. Create modal
const metadata = {
  name: 'TIME Dividends Claim',
  description: 'A web application for users to view and claim their T.I.M.E. token dividend rewards.',
  url: `https://${window.location.host}`, // origin must match your domain & subdomain
  icons: ['https://gitlab.com/internetmoneyio/branding/-/raw/148b3b3ff4ccf754c4edd1fa2b21be0b13b57539/IM_200.png']
};

const ethersConfig = defaultConfig({
  metadata,
  // Optional - Override the default light theme
  // defaultChainId: 1, 
  // Optional - Override the default RPC URLs
  // rpcUrl: 'https://cloudflare-eth.com', 
});


export const web3modal = createWeb3Modal({
  ethersConfig,
  chains,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix': '#131313',
    '--w3m-accent': '#F59E0B',
    '--w3m-border-radius-master': '1rem',
    '--w3m-font-family': 'sans-serif'
  }
});