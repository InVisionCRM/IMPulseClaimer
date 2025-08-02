import { useState, useEffect, useCallback } from 'react'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { getDividendData, getDividendDisplayData, claimDividends as claimDividendsContract, sweepDividends as sweepDividendsContract, type DividendData } from '@/lib/timeContract'
import { isTimeContractDeployed } from '@/contracts/addresses'

interface UseDividendsReturn {
  dividendData: DividendData | null
  displayData: ReturnType<typeof getDividendDisplayData>
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useDividends = (networkId: string): UseDividendsReturn => {
  const { address, isConnected } = useAccount()
  const [dividendData, setDividendData] = useState<DividendData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDividendData = useCallback(async () => {
    if (!isConnected || !address || !networkId) {
      setDividendData(null)
      setError(null)
      return
    }

    // Check if TIME contract is deployed on this network
    if (!isTimeContractDeployed(networkId)) {
      setDividendData(null)
      setError(`TIME contract not deployed on ${networkId}`)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await getDividendData(networkId, address)
      setDividendData(data)
    } catch (err) {
      console.error('Error fetching dividend data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch dividend data')
      setDividendData(null)
    } finally {
      setIsLoading(false)
    }
  }, [isConnected, address, networkId])

  // Fetch data when dependencies change
  useEffect(() => {
    fetchDividendData()
  }, [fetchDividendData])

  // Get display data
  const displayData = getDividendDisplayData(dividendData)

  return {
    dividendData,
    displayData,
    isLoading,
    error,
    refetch: fetchDividendData
  }
}

// Hook for dividend transactions
export const useDividendTransactions = (networkId: string) => {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const [isClaiming, setIsClaiming] = useState(false)
  const [isSweeping, setIsSweeping] = useState(false)
  const [transactionError, setTransactionError] = useState<string | null>(null)
  const [lastTransactionHash, setLastTransactionHash] = useState<string | null>(null)

  const claimDividends = useCallback(async () => {
    if (!isConnected || !address || !walletClient || !publicClient) {
      setTransactionError('Wallet not connected')
      return
    }

    if (!isTimeContractDeployed(networkId)) {
      setTransactionError(`TIME contract not deployed on ${networkId}`)
      return
    }

    setIsClaiming(true)
    setTransactionError(null)

    try {
      const result = await claimDividendsContract({
        networkId,
        userAddress: address,
        walletClient,
        publicClient
      })

      if (!result.success) {
        setTransactionError(result.error || 'Failed to claim dividends')
      } else {
        setLastTransactionHash(result.hash || null)
      }
    } catch (err) {
      console.error('Error claiming dividends:', err)
      setTransactionError(err instanceof Error ? err.message : 'Failed to claim dividends')
    } finally {
      setIsClaiming(false)
    }
  }, [isConnected, address, walletClient, publicClient, networkId])

  const sweepDividends = useCallback(async () => {
    if (!isConnected || !address || !walletClient || !publicClient) {
      setTransactionError('Wallet not connected')
      return
    }

    if (!isTimeContractDeployed(networkId)) {
      setTransactionError(`TIME contract not deployed on ${networkId}`)
      return
    }

    setIsSweeping(true)
    setTransactionError(null)

    try {
      const result = await sweepDividendsContract({
        networkId,
        userAddress: address,
        walletClient,
        publicClient
      })

      if (!result.success) {
        setTransactionError(result.error || 'Failed to sweep dividends')
      } else {
        setLastTransactionHash(result.hash || null)
      }
    } catch (err) {
      console.error('Error sweeping dividends:', err)
      setTransactionError(err instanceof Error ? err.message : 'Failed to sweep dividends')
    } finally {
      setIsSweeping(false)
    }
  }, [isConnected, address, walletClient, publicClient, networkId])

  return {
    claimDividends,
    sweepDividends,
    isClaiming,
    isSweeping,
    transactionError,
    lastTransactionHash,
    clearError: () => setTransactionError(null)
  }
} 