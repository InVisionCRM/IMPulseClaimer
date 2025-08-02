import React, { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import TimeTokenDisplay from './TimeTokenDisplay'
import { Network } from '@/data/networks'
import { 
  getTimeTokenBalance, 
  formatTokenBalance, 
  formatUSDValue, 
  TokenBalance,
  isMoralisInitialized,
  isValidChain
} from '@/lib/moralis'

interface AssetsProps {
  currentNetwork: Network;
}

interface AssetItem {
  symbol: string;
  name: string;
  balance: string;
  value: string;
  icon: React.ReactNode;
  isLoading?: boolean;
}

const Assets: React.FC<AssetsProps> = ({ currentNetwork }) => {
  const { address, isConnected } = useAccount()
  const [assets, setAssets] = useState<AssetItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch user assets
  useEffect(() => {
    const fetchAssets = async () => {
      if (!isConnected || !address) {
        setAssets([])
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const userAssets: AssetItem[] = []

        // Fetch TIME token balance if on supported network
        if (currentNetwork.config.timeTokenAddress && 
            currentNetwork.config.timeTokenAddress !== '0x0000000000000000000000000000000000000000') {
          
          console.log('🔍 Fetching TIME balance for network:', currentNetwork.id)
          console.log('📍 Address:', address)
          console.log('🔗 Chain ID:', currentNetwork.config.chainId.toString())
          console.log('📄 Contract:', currentNetwork.config.timeTokenAddress)
          
          // Validate chain parameter
          if (!isValidChain(currentNetwork.config.chainId.toString())) {
            console.error('❌ Invalid chain parameter for Moralis:', currentNetwork.config.chainId.toString())
            return
          }

          try {
            const timeBalance = await getTimeTokenBalance(
              address,
              currentNetwork.config.chainId.toString(),
              currentNetwork.config.timeTokenAddress
            )

            console.log('✅ TIME balance fetched:', timeBalance)

            if (timeBalance) {
              userAssets.push({
                symbol: 'TIME',
                name: 'TIME Token',
                balance: formatTokenBalance(timeBalance.balance, timeBalance.decimals),
                value: formatUSDValue(timeBalance.usdValue),
                icon: <TimeTokenDisplay size={32} />,
                isLoading: false
              })
            } else {
              console.log('⚠️ No TIME balance returned')
              userAssets.push({
                symbol: 'TIME',
                name: 'TIME Token',
                balance: '0',
                value: '$0.00',
                icon: <TimeTokenDisplay size={32} />,
                isLoading: false
              })
            }
          } catch (error) {
            console.error('❌ Error fetching TIME balance:', error)
            // Still add TIME to the list but mark as unavailable
            userAssets.push({
              symbol: 'TIME',
              name: 'TIME Token',
              balance: '0',
              value: '$0.00',
              icon: <TimeTokenDisplay size={32} />,
              isLoading: false
            })
          }
        } else {
          console.log('⚠️ No TIME token address for network:', currentNetwork.id)
        }

        // Always add TIME token to the list (even if balance fetch failed)
        if (!userAssets.some(asset => asset.symbol === 'TIME')) {
          console.log('➕ Adding TIME token to assets list')
          userAssets.push({
            symbol: 'TIME',
            name: 'TIME Token',
            balance: '0',
            value: '$0.00',
            icon: <TimeTokenDisplay size={32} />,
            isLoading: false
          })
        }

        // Add native token (ETH, PLS, etc.)
        userAssets.push({
          symbol: currentNetwork.config.symbol,
          name: `${currentNetwork.name} Native Token`,
          balance: 'Coming Soon',
          value: 'Coming Soon',
          icon: React.createElement(currentNetwork.icon, { size: 32 }),
          isLoading: false
        })

        console.log('📊 Final assets list:', userAssets)

        setAssets(userAssets)
      } catch (error) {
        console.error('Error fetching assets:', error)
        setError('Failed to fetch assets. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssets()
  }, [address, isConnected, currentNetwork])

  if (!isConnected) {
    return (
      <div className="w-full max-w-4xl">
        <div className="bg-[#1C1C1C] rounded-2xl p-4 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Your Assets</h2>
          <p className="text-gray-400 mb-6">Connect your wallet to view your assets</p>
          <div className="text-amber-400">
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <p>Please connect your wallet to continue</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="bg-[#1C1C1C] rounded-2xl p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Your Assets</h2>
          <p className="text-gray-400 text-sm sm:text-base">View your tokens and balances on {currentNetwork.name}</p>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm sm:text-base">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-amber-500"></div>
            <span className="ml-3 text-gray-400 text-sm sm:text-base">Loading assets...</span>
          </div>
        ) : assets.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <p className="text-gray-400 text-sm sm:text-base">No assets found on this network</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {assets.map((asset, index) => (
              <div 
                key={index}
                className="bg-[#131313] rounded-lg p-3 sm:p-4 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0">
                      {React.cloneElement(asset.icon as React.ReactElement, { 
                        size: 24,
                        className: "w-6 h-6 sm:w-8 sm:h-8" 
                      })}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-semibold text-sm sm:text-base truncate">{asset.name}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">{asset.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right ml-2">
                    <div className="text-white font-semibold text-sm sm:text-base">
                      {asset.isLoading ? (
                        <div className="animate-pulse bg-gray-600 h-3 sm:h-4 w-16 sm:w-20 rounded"></div>
                      ) : (
                        <span className="break-words">{asset.balance}</span>
                      )}
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm">
                      {asset.isLoading ? (
                        <div className="animate-pulse bg-gray-600 h-2 sm:h-3 w-12 sm:w-16 rounded mt-1"></div>
                      ) : (
                        <span className="break-words">{asset.value}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <div className="flex items-start space-x-2 sm:space-x-3">
            <div className="text-amber-400 mt-0.5 flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-amber-400 font-semibold mb-1 text-sm sm:text-base">Asset Information</h4>
              <p className="text-gray-400 text-xs sm:text-sm">
                This page shows your token balances on the current network. TIME tokens earn dividends 
                based on trading volume. Connect to different networks to see assets across all supported chains.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Assets 