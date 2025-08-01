import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { networks } from '../data/networks.js';

// 1. Get projectID at https://cloud.walletconnect.com
// IMPORTANT: This project ID must be registered with your domain
const projectId = 'b37311be7b32236140b8f3b965a17bfa';

// 2. Set chains with proper configuration
const chains = networks.map(network => ({
    chainId: network.config.chainId,
    name: network.config.name,
    currency: network.config.symbol,
    explorerUrl: network.config.explorerUrl,
    rpcUrl: network.config.rpcUrl,
}));

// 3. Create metadata with proper domain handling
const getMetadata = () => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const protocol = isLocalhost ? 'http' : 'https';
  const host = window.location.host;
  
  return {
    name: 'TIME Dividends Claim',
    description: 'A web application for users to view and claim their T.I.M.E. token dividend rewards.',
    url: `${protocol}://${host}`,
    icons: ['https://gitlab.com/internetmoneyio/branding/-/raw/148b3b3ff4ccf754c4edd1fa2b21be0b13b57539/IM_200.png'],
    verifyUrl: `${protocol}://${host}`,
  };
};

// 4. Create ethers config with proper settings
const ethersConfig = defaultConfig({
  metadata: getMetadata(),
  defaultChainId: 1, // Default to Ethereum
  enableEIP6963: true, // Enable EIP-6963 for better wallet detection
  enableInjected: true, // Enable injected wallets (MetaMask, etc.)
  enableCoinbase: true, // Enable Coinbase Wallet
  enableWalletConnect: true, // Enable WalletConnect
  enableEmail: false, // Disable email login for now
  enableSmartAccounts: false, // Disable smart accounts for now
});

// 5. Create Web3Modal with enhanced configuration
export const web3modal = createWeb3Modal({
  ethersConfig,
  chains,
  projectId,
  enableAnalytics: false, // Disable analytics for privacy
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix': '#131313',
    '--w3m-accent': '#F59E0B',
    '--w3m-border-radius-master': '1rem',
    '--w3m-font-family': 'sans-serif',
    '--w3m-z-index': '9999', // Ensure modal appears on top
  },
  // Additional configuration for better wallet connection
  walletConnectVersion: 2,
  enableOnramp: false, // Disable onramp for now
  enableExplorer: true, // Enable wallet explorer
  explorerRecommendedWalletIds: 'ALL', // Show all recommended wallets
  explorerExcludedWalletIds: '', // Don't exclude any wallets
  termsOfServiceUrl: `${getMetadata().url}/terms`,
  privacyPolicyUrl: `${getMetadata().url}/privacy`,
});

// 6. Export helper functions for debugging
export const getWeb3ModalConfig = () => ({
  projectId,
  chains,
  metadata: getMetadata(),
  isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  currentUrl: window.location.href,
  userAgent: navigator.userAgent,
});

// 7. Debug function to check configuration
export const debugWeb3Modal = () => {
  console.log('Web3Modal Configuration:', getWeb3ModalConfig());
  console.log('Available Chains:', chains);
  console.log('Current Environment:', {
    isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    protocol: window.location.protocol,
    host: window.location.host,
    userAgent: navigator.userAgent,
  });
};