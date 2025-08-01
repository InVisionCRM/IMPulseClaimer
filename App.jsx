import React, { useState, useEffect } from 'react';
import { useWeb3Modal, useWeb3ModalAccount, useSwitchNetwork } from '@web3modal/ethers/react';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import AccountCard from './components/AccountCard.jsx';
import BalanceDisplay from './components/BalanceDisplay.jsx';
import DividendsCard from './components/DividendsCard.jsx';
import Modal from './components/Modal.jsx';
import Networks from './components/Networks.jsx';
import { TimeIcon } from './components/icons/CurrencyIcons.jsx';
import { networks, Network } from './data/networks.js';
import { debugWeb3Modal } from './lib/web3modal.js';
import { initializeMoralis, getTimeTokenBalance, formatTokenBalance, formatUSDValue, TokenBalance, isMoralisInitialized, isValidChain } from './lib/moralis.js';

const App = () => {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [activeView, setActiveView] = useState('network');
  const [timeBalance, setTimeBalance] = useState(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isLoadingDividends, setIsLoadingDividends] = useState(false);

  // Web3Modal hooks
  const { open } = useWeb3Modal();
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { switchNetwork } = useSwitchNetwork();

  const initialNetwork = networks.find(n => n.config.chainId === 1) || networks[0];
  const [currentNetwork, setCurrentNetwork] = useState(initialNetwork);
  
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
  
  return (
    <div className="flex min-h-screen font-sans bg-[#131313] text-white">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 flex justify-center items-start">
        {activeView === 'network' && <Networks onConfirm={handleNetworkSelection} currentNetworkId={currentNetwork.id} />}
        {activeView === 'dividends' && (
          <div className="w-full max-w-4xl">
            <Header network={currentNetwork} />
            <div className="mt-6">
              <AccountCard address={address} />
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
              <BalanceDisplay
                title="TIME Balance"
                amount={timeBalanceDisplay.amount}
                value={timeBalanceDisplay.value}
                icon={<TimeIcon />}
                tooltipText="This is your current balance of TIME tokens."
                isLoading={isLoadingBalance}
              />
              <BalanceDisplay
                title="Available to Claim"
                amount={dividendDisplay.amount}
                value={dividendDisplay.value}
                icon={<NetworkIcon size={32} />}
                tooltipText={`This is the total amount of ${currentNetwork.config.symbol} dividends you can claim right now.`}
                isLoading={isLoadingDividends}
              />
            </div>
            <div className="mt-8">
              <DividendsCard
                onClaim={() => handleAttempt('Claim')}
                onSweep={() => handleAttempt('Sweep')}
                network={currentNetwork}
                isLoading={isLoadingDividends}
              />
            </div>
            <div className="text-center mt-8">
              <a href="#" className="text-amber-400 hover:text-amber-500 transition-colors">
                What is TIME? <span className="underline">Learn More Here</span>
              </a>
            </div>
          </div>
        )}
      </main>
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
