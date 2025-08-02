'use client'

import React, { useState, useEffect } from 'react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import AccountCard from '@/components/AccountCard'
import BalanceDisplay from '@/components/BalanceDisplay'
import DividendsCard from '@/components/DividendsCard'
import Modal from '@/components/Modal'
import Networks from '@/components/Networks'
import TimeEarningsEstimator from '@/components/TimeEarningsEstimator'
import Stats from '@/components/Stats'
import ContractAddresses from '@/components/ContractAddresses'
import Assets from '@/components/Assets'
import TimeTokenDisplay from '@/components/TimeTokenDisplay'
import SplashScreen from '@/components/SplashScreen'
import ElevenLabsWidget from '@/components/ElevenLabsWidget'
import TestTransaction from '@/components/TestTransaction'
import { networks, Network } from '@/data/networks'
import { 
  initializeMoralis, 
  getTimeTokenBalance, 
  formatTokenBalance, 
  formatUSDValue, 
  TokenBalance, 
  isMoralisInitialized, 
  isValidChain 
} from '@/lib/moralis'
import { useDividends, useDividendTransactions } from '@/hooks/useDividends'

export default function HomePage(): React.JSX.Element {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false)
  const [modalMessage, setModalMessage] = useState<string>('')
  const [activeView, setActiveView] = useState<string>('network')
  const [showSplash, setShowSplash] = useState<boolean>(true)
  
  // Debug logging
  useEffect(() => {
    console.log('🔍 Debug - showSplash:', showSplash, 'activeView:', activeView)
  }, [showSplash, activeView])
  const [timeBalance, setTimeBalance] = useState<TokenBalance | null>(null)
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false)
  const [isTestTransactionOpen, setIsTestTransactionOpen] = useState<boolean>(false)

  // Wagmi hooks
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const initialNetwork = networks.find(n => n.config.chainId === 1) || networks[0]
  const [currentNetwork, setCurrentNetwork] = useState<Network>(initialNetwork)
  
  // Dividend hooks - moved after currentNetwork is defined
  const { dividendData, displayData, isLoading: isLoadingDividends, error: dividendError, refetch: refetchDividends } = useDividends(currentNetwork.id)
  const { claimDividends, sweepDividends, isClaiming, isSweeping, transactionError, lastTransactionHash, clearError } = useDividendTransactions(currentNetwork.id)
  
  // Initialize Moralis on component mount
  useEffect(() => {
    const initMoralis = async () => {
      const apiKey = process.env.MORALIS_API_KEY
      console.log('🔑 Checking Moralis API key...')
      if (!apiKey) {
        console.warn('❌ Moralis API key not found. Please set MORALIS_API_KEY in your environment variables.')
        return
      }
      console.log('✅ Moralis API key found:', apiKey.substring(0, 20) + '...')
      
      try {
        console.log('🚀 Initializing Moralis...')
        await initializeMoralis(apiKey)
        console.log('✅ Moralis initialized successfully')
      } catch (error) {
        console.error('❌ Failed to initialize Moralis:', error)
        setModalMessage('Failed to initialize blockchain data service. Please check your configuration.')
        setIsErrorModalOpen(true)
      }
    }
    
    initMoralis()
  }, [])

  // Update currentNetwork when chainId changes
  useEffect(() => {
    const newNetwork = networks.find(n => n.config.chainId === chainId)
    if (newNetwork) {
      setCurrentNetwork(newNetwork)
    } else if (isConnected && chainId) {
      // If connected to an unsupported chain, default to Ethereum display
      // and encourage switching via the UI.
      setCurrentNetwork(initialNetwork)
      setModalMessage("You've switched to an unsupported network. Please select a supported network.")
      setIsErrorModalOpen(true)
      setActiveView('network')
    }
  }, [chainId, isConnected, initialNetwork])

  // Fetch TIME token balance when connected and on PulseChain
  useEffect(() => {
    const fetchTimeBalance = async () => {
      // Check if Moralis is initialized
      if (!isMoralisInitialized()) {
        console.warn('Moralis not initialized')
        return
      }

      // Validate inputs
      if (!isConnected || !address || currentNetwork.id !== 'pulsechain' || !currentNetwork.config.timeTokenAddress) {
        setTimeBalance(null)
        return
      }

      // Validate chain parameter
      if (!isValidChain('369')) {
        console.error('Invalid chain parameter for Moralis')
        return
      }

      setIsLoadingBalance(true)
      try {
        const balance = await getTimeTokenBalance(
          address,
          '369',
          currentNetwork.config.timeTokenAddress
        )
        setTimeBalance(balance)
      } catch (error) {
        console.error('Error fetching TIME balance:', error)
        setTimeBalance(null)
        
        // Show user-friendly error message
        if (error instanceof Error) {
          if (error.message.includes('API key')) {
            setModalMessage('Invalid API configuration. Please contact support.')
          } else if (error.message.includes('rate limit')) {
            setModalMessage('Service temporarily unavailable. Please try again in a moment.')
          } else if (error.message.includes('network')) {
            setModalMessage('Network error. Please check your connection and try again.')
          } else {
            setModalMessage('Failed to fetch token balance. Please try again.')
          }
          setIsErrorModalOpen(true)
        }
      } finally {
        setIsLoadingBalance(false)
      }
    }

    fetchTimeBalance()
  }, [isConnected, address, currentNetwork])

  const handleNetworkSelection = async (networkId: string) => {
    const selectedNetwork = networks.find(n => n.id === networkId)
    if (!selectedNetwork) return

    if (!isConnected) {
      // Show AppKit button to connect wallet
      setModalMessage('Please connect your wallet first using the AppKit button.')
      setIsErrorModalOpen(true)
      return
    }
    
    try {
      // Switch network using Wagmi
      if (switchChain) {
        await switchChain({ chainId: selectedNetwork.config.chainId })
        setActiveView('dividends')
      }
    } catch (error) {
      console.error('Failed to switch network:', error)
      setModalMessage('Failed to switch network. Please try again from your wallet.')
      setIsErrorModalOpen(true)
    }
  }

  const handleClaim = async () => {
    if (!isConnected) {
      setModalMessage('Please connect your wallet first.')
      setIsErrorModalOpen(true)
      return
    }
    
    try {
      await claimDividends()
      if (transactionError) {
        setModalMessage(transactionError)
        setIsErrorModalOpen(true)
        clearError()
      } else {
        // Success - show success message with transaction hash and refetch data
        const successMessage = lastTransactionHash 
          ? `Dividends claimed successfully! Transaction: ${lastTransactionHash.slice(0, 10)}...${lastTransactionHash.slice(-8)}`
          : 'Dividends claimed successfully! Your balance has been updated.'
        setModalMessage(successMessage)
        setIsErrorModalOpen(true)
        // Refetch dividend data after successful claim
        await refetchDividends()
      }
    } catch (error) {
      console.error('Error claiming dividends:', error)
      setModalMessage('Failed to claim dividends. Please try again.')
      setIsErrorModalOpen(true)
    }
  }

  const handleSweep = async () => {
    if (!isConnected) {
      setModalMessage('Please connect your wallet first.')
      setIsErrorModalOpen(true)
      return
    }
    
    try {
      await sweepDividends()
      if (transactionError) {
        setModalMessage(transactionError)
        setIsErrorModalOpen(true)
        clearError()
      } else {
        // Success - show success message with transaction hash and refetch data
        const successMessage = lastTransactionHash 
          ? `Dividends swept successfully! Transaction: ${lastTransactionHash.slice(0, 10)}...${lastTransactionHash.slice(-8)}`
          : 'Dividends swept successfully! New dividends are now available to claim.'
        setModalMessage(successMessage)
        setIsErrorModalOpen(true)
        // Refetch dividend data after successful sweep
        await refetchDividends()
      }
    } catch (error) {
      console.error('Error sweeping dividends:', error)
      setModalMessage('Failed to sweep dividends. Please try again.')
      setIsErrorModalOpen(true)
    }
  }

  // Format TIME balance display - only show real data
  const getTimeBalanceDisplay = () => {
    if (isLoadingBalance) {
      return { amount: 'Loading...', value: 'Loading...' }
    }
    
    if (!timeBalance) {
      return { amount: 'No Data', value: 'No Data' }
    }

    const formattedBalance = formatTokenBalance(timeBalance.balance, timeBalance.decimals)
    const formattedValue = formatUSDValue(timeBalance.usd_value)
    
    return { amount: formattedBalance, value: formattedValue }
  }

  // Get dividend display - show real data from contract
  const getDividendDisplay = () => {
    if (isLoadingDividends) {
      return { amount: 'Loading...', value: 'Loading...' }
    }
    
    if (dividendError) {
      return { amount: 'Error', value: 'Error' }
    }
    
    if (!displayData.hasDividends) {
      return { amount: '0', value: '$0.00' }
    }
    
    return { 
      amount: displayData.claimableAmount, 
      value: `$${parseFloat(displayData.claimableAmount).toFixed(2)}` 
    }
  }

  const timeBalanceDisplay = getTimeBalanceDisplay()
  const dividendDisplay = getDividendDisplay()
  const NetworkIcon = currentNetwork.icon
  
  return (
    <div className="flex min-h-screen font-sans bg-[#131313] text-white">
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <main className="flex-1 p-2 sm:p-4 lg:p-6 pb-24 sm:pb-6 flex justify-center items-start relative">
        {/* AppKit Connect Button */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20">
          <appkit-button />
        </div>
        {activeView === 'network' && <Networks onConfirm={handleNetworkSelection} currentNetworkId={currentNetwork.id} />}
        {!showSplash && activeView !== 'network' && activeView !== 'wallet' && activeView !== 'estimator' && activeView !== 'stats' && activeView !== 'contracts' && activeView !== 'test' && activeView !== 'dividends' && (
          <div className="w-full max-w-4xl">
            <div className="bg-[#1C1C1C] rounded-2xl p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Welcome to TIME Dividends</h2>
              <p className="text-gray-400 mb-6">Select a view from the sidebar to get started</p>
              <div className="text-amber-400">
                <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <p>Choose your destination</p>
              </div>
            </div>
          </div>
        )}
        {activeView === 'wallet' && (
          <div className="w-full max-w-4xl">
            <Assets currentNetwork={currentNetwork} />
          </div>
        )}
        {activeView === 'estimator' && (
          <div className="w-full max-w-4xl">
            <TimeEarningsEstimator 
              currentAddress={address} 
            />
          </div>
        )}
        {activeView === 'stats' && (
          <div className="w-full h-full">
            <Stats />
          </div>
        )}
        {activeView === 'contracts' && (
          <div className="w-full max-w-6xl">
            <ContractAddresses />
          </div>
        )}
        {activeView === 'test' && (
          <div className="w-full max-w-4xl">
            <div className="bg-[#1C1C1C] rounded-2xl p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Test Transaction</h2>
                <p className="text-gray-400 mb-6">Verify your wallet connection with a small test transaction</p>
                <button
                  onClick={() => setIsTestTransactionOpen(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-8 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75"
                >
                  Start Test Transaction
                </button>
              </div>
            </div>
          </div>
        )}
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
                icon={<TimeTokenDisplay />}
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
                onClaim={handleClaim}
                onSweep={handleSweep}
                network={currentNetwork}
                isLoading={isLoadingDividends || isClaiming || isSweeping}
                dividendData={dividendData}
                displayData={displayData}
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

      {/* ElevenLabs Convai Widget */}
      <ElevenLabsWidget />

      {/* Test Transaction Modal */}
      <TestTransaction 
        isOpen={isTestTransactionOpen} 
        onClose={() => setIsTestTransactionOpen(false)} 
      />
    </div>
  )
} 