import React, { useState, useEffect } from 'react';
import { useWeb3Modal, useWeb3ModalAccount, useSwitchNetwork } from '@web3modal/ethers/react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AccountCard from './components/AccountCard';
import BalanceDisplay from './components/BalanceDisplay';
import DividendsCard from './components/DividendsCard';
import Modal from './components/Modal';
import Networks from './components/Networks';
import { TimeIcon } from './components/icons/CurrencyIcons';
import { networks, Network } from './data/networks';
import { debugWeb3Modal } from './lib/web3modal';
import { initializeMoralis, getTimeTokenBalance, formatTokenBalance, formatUSDValue, TokenBalance, isMoralisInitialized, isValidChain } from './lib/moralis';

const App: React.FC = () => {
  console.log('App component initialized');
  
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [activeView, setActiveView] = useState<string>('network');
  const [timeBalance, setTimeBalance] = useState<TokenBalance | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);
  const [isLoadingDividends, setIsLoadingDividends] = useState<boolean>(false);

  // Web3Modal hooks - with error handling
  let open: any;
  let address: any;
  let chainId: any;
  let isConnected: any;
  let switchNetwork: any;
  
  try {
    const web3ModalResult = useWeb3Modal();
    const web3ModalAccountResult = useWeb3ModalAccount();
    const switchNetworkResult = useSwitchNetwork();
    
    open = web3ModalResult.open;
    address = web3ModalAccountResult.address;
    chainId = web3ModalAccountResult.chainId;
    isConnected = web3ModalAccountResult.isConnected;
    switchNetwork = switchNetworkResult.switchNetwork;
    
    console.log('Web3Modal hooks loaded successfully');
  } catch (error) {
    console.error('Error loading Web3Modal hooks:', error);
  }

  const initialNetwork = networks.find(n => n.config.chainId === 1) || networks[0];
  const [currentNetwork, setCurrentNetwork] = useState<Network>(initialNetwork);
  
  // Initialize services on component mount
  useEffect(() => {
    const initializeServices = async () => {
      // Debug Web3Modal configuration
      debugWeb3Modal();
      
      // Initialize Moralis
      const apiKey = process.env.MORALIS_API_KEY;
      if (!apiKey) {
        console.warn('Moralis API key not found. Please set MORALIS_API_KEY in your environment variables.');
        return;
      }
      
      try {
        await initializeMoralis(apiKey);
      } catch (error) {
        console.error('Failed to initialize Moralis:', error);
        setModalMessage('Failed to initialize blockchain data service. Please check your configuration.');
        setIsErrorModalOpen(true);
      }
    };
    
    initializeServices();
  }, []);

  // Update currentNetwork when chainId changes
  useEffect(() => {
    const newNetwork = networks.find(n => n.config.chainId === chainId);
    if (newNetwork) {
      setCurrentNetwork(newNetwork);
    } else if (isConnected) {
      // If connected to an unsupported chain, default to Ethereum display
      // and encourage switching via the UI.
      setCurrentNetwork(initialNetwork);
      setModalMessage("You've switched to an unsupported network. Please select a supported network.");
      setIsErrorModalOpen(true);
      setActiveView('network');
    }
  }, [chainId, isConnected, initialNetwork]);

  // Fetch TIME token balance when connected and on PulseChain
  useEffect(() => {
    const fetchTimeBalance = async () => {
      // Check if Moralis is initialized
      if (!isMoralisInitialized()) {
        console.warn('Moralis not initialized');
        return;
      }

      // Validate inputs
      if (!isConnected || !address || currentNetwork.id !== 'pulsechain' || !currentNetwork.config.timeTokenAddress) {
        setTimeBalance(null);
        return;
      }

      // Validate chain parameter
      if (!isValidChain('pulse')) {
        console.error('Invalid chain parameter for Moralis');
        return;
      }

      setIsLoadingBalance(true);
      try {
        const balance = await getTimeTokenBalance(
          address,
          'pulse',
          currentNetwork.config.timeTokenAddress
        );
        setTimeBalance(balance);
      } catch (error) {
        console.error('Error fetching TIME balance:', error);
        setTimeBalance(null);
        
        // Show user-friendly error message
        if (error instanceof Error) {
          if (error.message.includes('API key')) {
            setModalMessage('Invalid API configuration. Please contact support.');
          } else if (error.message.includes('rate limit')) {
            setModalMessage('Service temporarily unavailable. Please try again in a moment.');
          } else if (error.message.includes('network')) {
            setModalMessage('Network error. Please check your connection and try again.');
          } else {
            setModalMessage('Failed to fetch token balance. Please try again.');
          }
          setIsErrorModalOpen(true);
        }
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchTimeBalance();
  }, [isConnected, address, currentNetwork]);

  const handleNetworkSelection = async (networkId: string) => {
    const selectedNetwork = networks.find(n => n.id === networkId);
    if (!selectedNetwork) return;

    if (!isConnected) {
      // Prompt connection if not already connected
      try {
        console.log('Opening Web3Modal for wallet connection...');
        await open();
        console.log('Web3Modal opened successfully');
      } catch (error) {
        console.error('Failed to open Web3Modal:', error);
        setModalMessage('Failed to open wallet connection. Please try again.');
        setIsErrorModalOpen(true);
        return;
      }
    }
    
        try {
      // Switch network using Web3Modal
      console.log(`Switching to network: ${selectedNetwork.name} (Chain ID: ${selectedNetwork.config.chainId})`);
      await switchNetwork(selectedNetwork.config.chainId);
      setActiveView('dividends');
    } catch (error) {
      console.error('Failed to switch network:', error);
      setModalMessage(`Failed to switch to ${selectedNetwork.name}. Please try again from your wallet.`);
      setIsErrorModalOpen(true);
    }
  };

  const handleAttempt = (action: 'Claim' | 'Sweep') => {
    if (!isConnected) {
      setModalMessage('Please connect your wallet first.');
      setIsErrorModalOpen(true);
      return;
    }
    
    // Show message that dividend contract integration is needed
    setModalMessage(`${action} functionality requires dividend contract integration. This feature is coming soon.`);
    setIsErrorModalOpen(true);
  };

  // Format TIME balance display - only show real data
  const getTimeBalanceDisplay = () => {
    if (isLoadingBalance) {
      return { amount: 'Loading...', value: 'Loading...' };
    }
    
    if (!timeBalance) {
      return { amount: 'No Data', value: 'No Data' };
    }

    const formattedBalance = formatTokenBalance(timeBalance.balance, timeBalance.decimals);
    const formattedValue = formatUSDValue(timeBalance.usd_value);
    
    return { amount: formattedBalance, value: formattedValue };
  };

  // Get dividend display - only show real data or loading state
  const getDividendDisplay = () => {
    if (isLoadingDividends) {
      return { amount: 'Loading...', value: 'Loading...' };
    }
    
    // No dividend contract integration yet, so show "Coming Soon"
    return { amount: 'Coming Soon', value: 'Coming Soon' };
  };

  const timeBalanceDisplay = getTimeBalanceDisplay();
  const dividendDisplay = getDividendDisplay();
  const NetworkIcon = currentNetwork.icon;
  
  console.log('App component rendering, activeView:', activeView);
  
  return (
    <div className="flex min-h-screen font-sans bg-[#131313] text-white">
      <div className="w-full p-8">
        <h1 className="text-3xl font-bold text-white mb-4">TIME Dividends Claim</h1>
        <p className="text-gray-300 mb-4">App component is loading...</p>
        <div className="bg-[#1C1C1C] p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-2">Debug Info:</h2>
          <p className="text-gray-300">Active View: {activeView}</p>
          <p className="text-gray-300">Current Network: {currentNetwork.name}</p>
          <p className="text-gray-300">Connected: {isConnected ? 'Yes' : 'No'}</p>
          <button 
            onClick={() => setActiveView(activeView === 'network' ? 'dividends' : 'network')}
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 px-4 rounded mt-4"
          >
            Toggle View
          </button>
        </div>
      </div>
      <Modal isOpen={isErrorModalOpen} onClose={() => setIsErrorModalOpen(false)}>
        <p className="text-white text-lg sm:text-xl text-center p-4">
          {modalMessage}
        </p>
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setIsErrorModalOpen(false)}
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-16 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75"
          >
            Ok
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default App;
