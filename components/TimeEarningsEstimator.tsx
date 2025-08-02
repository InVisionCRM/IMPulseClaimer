import React, { useState, useEffect, useMemo } from 'react'
import { Network, networks } from '@/data/networks'
import TimeTokenDisplay from './TimeTokenDisplay'
import { getTimeTokenPrice } from '@/lib/moralis'
import { formatTokenBalance, formatUSDValue } from '@/lib/moralis'
import NetworkDrawer from './NetworkDrawer'

interface TimeEarningsEstimatorProps {
  currentAddress?: string;
}

interface FeeCalculation {
  network: string;
  symbol: string;
  dailyFee: number;
  weeklyFee: number;
  monthlyFee: number;
  yearlyFee: number;
  usdValue: number;
}

// Fee rates per network (example rates - adjust based on actual TIME tokenomics)
const FEE_RATES = {
  pulsechain: 0.0001, // 0.01% fee rate
  ethereum: 0.00008,  // 0.008% fee rate
  bnb: 0.00009,      // 0.009% fee rate
  polygon: 0.00007,  // 0.007% fee rate
  arbitrum: 0.00006, // 0.006% fee rate
  avalanche: 0.00008, // 0.008% fee rate
  base: 0.00005      // 0.005% fee rate
}

// Volume options
const VOLUME_OPTIONS = [
  { label: 'Daily', value: 'daily', multiplier: 1 },
  { label: 'Weekly', value: 'weekly', multiplier: 7 },
  { label: 'Monthly', value: 'monthly', multiplier: 30 },
  { label: 'Yearly', value: 'yearly', multiplier: 365 }
]

// Currency options for display
const CURRENCY_OPTIONS = [
  { symbol: 'USD', name: 'US Dollar', rate: 1 },
  { symbol: 'EUR', name: 'Euro', rate: 0.85 },
  { symbol: 'GBP', name: 'British Pound', rate: 0.73 },
  { symbol: 'JPY', name: 'Japanese Yen', rate: 110 },
  { symbol: 'CAD', name: 'Canadian Dollar', rate: 1.25 },
  { symbol: 'AUD', name: 'Australian Dollar', rate: 1.35 },
  { symbol: 'CHF', name: 'Swiss Franc', rate: 0.92 }
]

const TimeEarningsEstimator: React.FC<TimeEarningsEstimatorProps> = ({ 
  currentAddress 
}) => {
  console.log('🏗️ TimeEarningsEstimator component mounted')
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(networks.find(n => n.id === 'pulsechain') || networks[0])
  console.log('🌐 Initial selectedNetwork:', selectedNetwork.id)
  const [timeAmount, setTimeAmount] = useState<string>('1000')
  const [volumeAmount, setVolumeAmount] = useState<string>('1000000')
  const [selectedVolumePeriod, setSelectedVolumePeriod] = useState('daily')
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const [timePrices, setTimePrices] = useState<{ [networkId: string]: number | null }>({})
  const [isLoadingPrices, setIsLoadingPrices] = useState(false)
  const [priceErrors, setPriceErrors] = useState<{ [networkId: string]: string | null }>({})
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Get fee rate for selected network
  const feeRate = FEE_RATES[selectedNetwork.id as keyof typeof FEE_RATES] || 0.0001

  // Calculate fees based on TIME ownership percentage and volume
  const feeCalculations = useMemo(() => {
    const timeAmountNum = parseFloat(timeAmount) || 0
    const volumeAmountNum = parseFloat(volumeAmount) || 0
    
    if (timeAmountNum <= 0 || volumeAmountNum <= 0) {
      return null
    }

    // Get volume period multiplier
    const volumePeriod = VOLUME_OPTIONS.find(opt => opt.value === selectedVolumePeriod)
    const periodMultiplier = volumePeriod?.multiplier || 1

    // Calculate TIME ownership percentage (using actual total supply from metadata)
    const totalSupply = 1993069172.79 // Actual total supply from PulseChain metadata
    const ownershipPercentage = timeAmountNum / totalSupply

    // Calculate fees for the selected period
    const periodVolume = volumeAmountNum * periodMultiplier
    const periodFee = periodVolume * feeRate * ownershipPercentage

    // Calculate fees for different periods
    const dailyFee = (volumeAmountNum * feeRate * ownershipPercentage)
    const weeklyFee = dailyFee * 7
    const monthlyFee = dailyFee * 30
    const yearlyFee = dailyFee * 365

    return {
      network: selectedNetwork.config.symbol,
      symbol: selectedNetwork.config.symbol,
      dailyFee,
      weeklyFee,
      monthlyFee,
      yearlyFee,
      usdValue: timePrices[selectedNetwork.id] ? periodFee * timePrices[selectedNetwork.id]! : 0
    }
  }, [timeAmount, volumeAmount, selectedVolumePeriod, feeRate, selectedNetwork, timePrices])

  // Fetch TIME token prices for all networks on component mount
  useEffect(() => {
    const fetchAllTimePrices = async () => {
      console.log('🔄 Fetching TIME prices for all networks...')
      setIsLoadingPrices(true)
      
      const newPrices: { [networkId: string]: number | null } = {}
      const newErrors: { [networkId: string]: string | null } = {}
      
      // Networks with TIME token contracts
      const networksWithTime = [
        'pulsechain',
        'ethereum', 
        'bnb',
        'polygon',
        'base',
        'arbitrum',
        'avalanche'
      ]
      
      for (const networkId of networksWithTime) {
        try {
          console.log(`📡 Fetching TIME price for ${networkId}...`)
          const price = await getTimeTokenPrice(networkId)
          console.log(`✅ ${networkId} price:`, price)
          newPrices[networkId] = price
          newErrors[networkId] = null
        } catch (error) {
          console.error(`❌ Error fetching ${networkId} price:`, error)
          newPrices[networkId] = null
          newErrors[networkId] = 'Failed to fetch price'
        }
      }
      
      setTimePrices(newPrices)
      setPriceErrors(newErrors)
      setIsLoadingPrices(false)
      console.log('✅ All TIME prices fetched:', newPrices)
    }

    fetchAllTimePrices()
  }, [])

  // Format currency amount
  const formatCurrencyAmount = (amount: number, currency: string) => {
    const currencyOption = CURRENCY_OPTIONS.find(c => c.symbol === currency)
    if (!currencyOption) return '$0.00'

    const convertedAmount = amount * currencyOption.rate
    
    switch (currency) {
      case 'JPY':
        return `¥${convertedAmount.toLocaleString('ja-JP', { maximumFractionDigits: 0 })}`
      case 'EUR':
        return `€${convertedAmount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      case 'GBP':
        return `£${convertedAmount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      case 'CAD':
        return `C$${convertedAmount.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      case 'AUD':
        return `A$${convertedAmount.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      case 'CHF':
        return `CHF ${convertedAmount.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      default:
        return `$${convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
  }

  return (
    <div className="bg-[#1C1C1C] rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <TimeTokenDisplay size={32} />
        <h2 className="text-2xl font-bold text-white">TIME Earnings Estimator</h2>
      </div>

      {/* Network Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Select Network for Estimation
        </label>
        
        {/* Mobile: Simple Network Button */}
        <div className="block sm:hidden">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="w-full bg-[#131313] border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:border-amber-400 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {React.createElement(selectedNetwork.icon, { size: 24, className: "w-6 h-6" })}
              <span className="text-white font-medium">{selectedNetwork.name}</span>
            </div>
                         <div className="text-right">
               <span className="text-xs text-gray-400 block">Price</span>
              {isLoadingPrices ? (
                <span className="text-xs text-gray-500">Loading...</span>
              ) : timePrices[selectedNetwork.id] ? (
                <span className="text-xs text-amber-400">
                  {selectedNetwork.id === 'arbitrum' || selectedNetwork.id === 'avalanche' || selectedNetwork.id === 'base' 
                    ? `$${timePrices[selectedNetwork.id]!.toFixed(10)}`
                    : `$${timePrices[selectedNetwork.id]!.toFixed(5)}`
                  }
                </span>
              ) : (
                <span className="text-xs text-gray-500">No price</span>
              )}
            </div>
          </button>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-4 gap-3">
          {networks.map((network) => (
            <button
              key={network.id}
              onClick={() => setSelectedNetwork(network)}
              className={`
                relative bg-[#131313] rounded-lg p-3 flex flex-col items-center justify-center 
                border-2 transition-all duration-300 ease-in-out
                transform hover:-translate-y-1 hover:shadow-lg
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1C1C1C] focus:ring-amber-500
                before:absolute before:inset-0 before:rounded-lg before:border-2 before:border-transparent before:transition-all before:duration-300
                hover:before:border-white hover:before:shadow-[0_0_10px_rgba(255,255,255,0.5)] hover:before:shadow-white/50
                ${selectedNetwork.id === network.id 
                  ? 'border-amber-500 shadow-amber-500/20 before:border-amber-500 before:shadow-amber-500/50' 
                  : 'border-transparent hover:border-white/30'
                }
              `}
            >
              <div className="h-8 w-8 flex items-center justify-center mb-2">
                {React.createElement(network.icon, { size: 32 })}
              </div>
              <span className="font-medium text-white text-center text-sm">
                {network.name}
              </span>
              <span className="text-xs text-gray-400 mt-1">
                {isLoadingPrices ? (
                  'Loading...'
                ) : timePrices[network.id] ? (
                  // Show 10 digits for Arbitrum, Avalanche, and Base
                  network.id === 'arbitrum' || network.id === 'avalanche' || network.id === 'base' 
                    ? `$${timePrices[network.id]!.toFixed(10)}`
                    : `$${timePrices[network.id]!.toFixed(5)}`
                ) : priceErrors[network.id] ? (
                  'Price unavailable'
                ) : (
                  'No TIME token'
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* TIME Amount Input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            TIME Tokens Owned
          </label>
          <div className="relative">
            <input
              type="number"
              value={timeAmount}
              onChange={(e) => setTimeAmount(e.target.value)}
              placeholder="Enter TIME amount"
              className="w-full bg-[#131313] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <TimeTokenDisplay size={20} />
            </div>
          </div>
          {timePrices[selectedNetwork.id] && (
            <p className="text-sm text-gray-400">
              Value: {formatUSDValue(parseFloat(timeAmount) * timePrices[selectedNetwork.id]!)}
            </p>
          )}
        </div>

        {/* Volume Input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Estimated Volume ({selectedVolumePeriod})
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={volumeAmount}
              onChange={(e) => setVolumeAmount(e.target.value)}
              placeholder="Enter volume"
              className="flex-1 bg-[#131313] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <select
              value={selectedVolumePeriod}
              onChange={(e) => setSelectedVolumePeriod(e.target.value)}
              className="bg-[#131313] border border-gray-700 rounded-lg px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              {VOLUME_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-400">
            {selectedNetwork.config.symbol} volume
          </p>
        </div>
      </div>

      {/* Price Display */}
      {isLoadingPrices && (
        <div className="mb-6 p-4 bg-[#131313] rounded-lg">
          <p className="text-gray-400">Loading TIME prices for all networks...</p>
        </div>
      )}
      
      {timePrices[selectedNetwork.id] && !priceErrors[selectedNetwork.id] && (
        <div className="mb-6 p-4 bg-[#131313] rounded-lg">
          <p className="text-gray-300">
            Current TIME Price: <span className="text-amber-400 font-semibold">{formatUSDValue(timePrices[selectedNetwork.id]!)}</span>
          </p>
        </div>
      )}

      {priceErrors[selectedNetwork.id] && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400">Failed to load TIME price for {selectedNetwork.name}</p>
        </div>
      )}

      {/* Fee Calculations */}
      {feeCalculations && (
        <div className="space-y-6">
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Estimated Earnings</h3>
            
            {/* Fee Periods */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#131313] p-4 rounded-lg">
                <p className="text-sm text-gray-400">Daily</p>
                <p className="text-lg font-bold text-white">
                  {feeCalculations.dailyFee.toFixed(6)} {selectedNetwork.config.symbol}
                </p>
                <p className="text-sm text-gray-500">
                  {formatUSDValue(feeCalculations.dailyFee * (timePrices[selectedNetwork.id] || 0))}
                </p>
              </div>
              
              <div className="bg-[#131313] p-4 rounded-lg">
                <p className="text-sm text-gray-400">Weekly</p>
                <p className="text-lg font-bold text-white">
                  {feeCalculations.weeklyFee.toFixed(6)} {selectedNetwork.config.symbol}
                </p>
                <p className="text-sm text-gray-500">
                  {formatUSDValue(feeCalculations.weeklyFee * (timePrices[selectedNetwork.id] || 0))}
                </p>
              </div>
              
              <div className="bg-[#131313] p-4 rounded-lg">
                <p className="text-sm text-gray-400">Monthly</p>
                <p className="text-lg font-bold text-white">
                  {feeCalculations.monthlyFee.toFixed(6)} {selectedNetwork.config.symbol}
                </p>
                <p className="text-sm text-gray-500">
                  {formatUSDValue(feeCalculations.monthlyFee * (timePrices[selectedNetwork.id] || 0))}
                </p>
              </div>
              
              <div className="bg-[#131313] p-4 rounded-lg">
                <p className="text-sm text-gray-400">Yearly</p>
                <p className="text-lg font-bold text-white">
                  {feeCalculations.yearlyFee.toFixed(6)} {selectedNetwork.config.symbol}
                </p>
                <p className="text-sm text-gray-500">
                  {formatUSDValue(feeCalculations.yearlyFee * (timePrices[selectedNetwork.id] || 0))}
                </p>
              </div>
            </div>

            {/* Multi-Currency Display */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                  Display Currency
                </label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="bg-[#131313] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {CURRENCY_OPTIONS.map(currency => (
                    <option key={currency.symbol} value={currency.symbol}>
                      {currency.symbol} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-[#131313] p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">
                  {selectedVolumePeriod.charAt(0).toUpperCase() + selectedVolumePeriod.slice(1)} Earnings
                </p>
                <p className="text-2xl font-bold text-amber-400">
                  {formatCurrencyAmount(feeCalculations.usdValue, selectedCurrency)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {feeCalculations.usdValue.toFixed(6)} {selectedNetwork.config.symbol}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Network Info */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="flex items-center gap-3">
          {React.createElement(selectedNetwork.icon, { size: 24 })}
          <div>
            <p className="text-sm text-gray-400">Selected Network</p>
            <p className="text-white font-medium">{selectedNetwork.name}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Fee Rate: {(feeRate * 100).toFixed(3)}% | Based on TIME ownership percentage
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Note: This estimation is independent of your wallet's current network
        </p>
      </div>

      {/* Network Drawer for Mobile */}
      <NetworkDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedNetwork={selectedNetwork}
        onNetworkSelect={setSelectedNetwork}
      />
    </div>
  )
}

export default TimeEarningsEstimator 