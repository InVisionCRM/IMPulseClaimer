import { createPublicClient, http, parseAbi, type Address, type PublicClient } from 'viem'
import { mainnet, polygon, bsc, arbitrum, avalanche, base } from '@reown/appkit/networks'
import TIME_ABI from '@/contracts/abis/TIME.json'
import { getTimeContractAddress, isTimeContractDeployed } from '@/contracts/addresses'

// Create public clients for each network
const createNetworkClient = (rpcUrl: string): PublicClient => {
  return createPublicClient({
    chain: {
      id: 1,
      name: 'Custom',
      network: 'custom',
      nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
      rpcUrls: { default: { http: [rpcUrl] } }
    },
    transport: http()
  })
}

// Network configurations
const NETWORK_CONFIGS = {
  pulsechain: {
    rpcUrl: 'https://rpc.pulsechain.com',
    chainId: 369
  },
  ethereum: {
    rpcUrl: 'https://cloudflare-eth.com',
    chainId: 1
  },
  bnb: {
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    chainId: 56
  },
  polygon: {
    rpcUrl: 'https://polygon-rpc.com/',
    chainId: 137
  },
  arbitrum: {
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    chainId: 42161
  },
  avalanche: {
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    chainId: 43114
  },
  base: {
    rpcUrl: 'https://mainnet.base.org',
    chainId: 8453
  }
}

// Interface for dividend data
export interface DividendData {
  claimableDividend: bigint;
  totalDividendsClaimed: bigint;
  timeBalance: bigint;
  decimals: number;
}

// Interface for transaction result
export interface TransactionResult {
  success: boolean;
  hash?: string;
  error?: string;
}

// Interface for transaction parameters
export interface TransactionParams {
  networkId: string;
  userAddress: string;
  walletClient: any;
  publicClient: any;
}

/**
 * Get TIME contract instance for a specific network
 */
export const getTimeContract = (networkId: string) => {
  const config = NETWORK_CONFIGS[networkId as keyof typeof NETWORK_CONFIGS]
  if (!config) {
    throw new Error(`Unsupported network: ${networkId}`)
  }

  const client = createNetworkClient(config.rpcUrl)
  const contractAddress = getTimeContractAddress(networkId) as Address

  return {
    client,
    address: contractAddress,
    abi: TIME_ABI
  }
}

/**
 * Get dividend data for a user address
 */
export const getDividendData = async (
  networkId: string,
  userAddress: string
): Promise<DividendData | null> => {
  try {
    // Check if TIME contract is deployed on this network
    if (!isTimeContractDeployed(networkId)) {
      console.warn(`TIME contract not deployed on ${networkId}`)
      return null
    }

    const { client, address, abi } = getTimeContract(networkId)
    const userAddr = userAddress as Address

    // Fetch all data in parallel
    const [claimableDividend, totalDividendsClaimed, timeBalance, decimals] = await Promise.all([
      client.readContract({
        address,
        abi,
        functionName: 'claimableDividendOf',
        args: [userAddr]
      }),
      client.readContract({
        address,
        abi,
        functionName: 'cumulativeDividendClaimed',
        args: [userAddr]
      }),
      client.readContract({
        address,
        abi,
        functionName: 'balanceOf',
        args: [userAddr]
      }),
      client.readContract({
        address,
        abi,
        functionName: 'decimals',
        args: []
      })
    ])

    return {
      claimableDividend: claimableDividend as bigint,
      totalDividendsClaimed: totalDividendsClaimed as bigint,
      timeBalance: timeBalance as bigint,
      decimals: decimals as number
    }
  } catch (error) {
    console.error('Error fetching dividend data:', error)
    return null
  }
}

/**
 * Format dividend amount with proper decimals
 */
export const formatDividendAmount = (amount: bigint, decimals: number): string => {
  try {
    const divisor = BigInt(10 ** decimals)
    const quotient = amount / divisor
    const remainder = amount % divisor
    
    // Convert remainder to string and pad with zeros
    const remainderStr = remainder.toString().padStart(decimals, '0')
    
    // Remove trailing zeros from remainder
    const trimmedRemainder = remainderStr.replace(/0+$/, '')
    
    if (quotient === 0n) {
      return trimmedRemainder ? `0.${trimmedRemainder}` : '0'
    }
    
    return trimmedRemainder ? `${quotient}.${trimmedRemainder}` : quotient.toString()
  } catch (error) {
    console.error('Error formatting dividend amount:', error)
    return '0'
  }
}

/**
 * Check if user has any claimable dividends
 */
export const hasClaimableDividends = (dividendData: DividendData | null): boolean => {
  if (!dividendData) return false
  return dividendData.claimableDividend > 0n
}

/**
 * Check if user has TIME tokens
 */
export const hasTimeTokens = (dividendData: DividendData | null): boolean => {
  if (!dividendData) return false
  return dividendData.timeBalance > 0n
}

/**
 * Get dividend data for display
 */
export const getDividendDisplayData = (dividendData: DividendData | null) => {
  if (!dividendData) {
    return {
      claimableAmount: '0',
      totalClaimed: '0',
      timeBalance: '0',
      hasDividends: false,
      hasTokens: false
    }
  }

  return {
    claimableAmount: formatDividendAmount(dividendData.claimableDividend, dividendData.decimals),
    totalClaimed: formatDividendAmount(dividendData.totalDividendsClaimed, dividendData.decimals),
    timeBalance: formatDividendAmount(dividendData.timeBalance, dividendData.decimals),
    hasDividends: hasClaimableDividends(dividendData),
    hasTokens: hasTimeTokens(dividendData)
  }
}

/**
 * Claim dividends for a user
 */
export const claimDividends = async (params: TransactionParams): Promise<TransactionResult> => {
  const { networkId, userAddress, walletClient, publicClient } = params

  try {
    // Check if TIME contract is deployed on this network
    if (!isTimeContractDeployed(networkId)) {
      return {
        success: false,
        error: `TIME contract not deployed on ${networkId}`
      }
    }

    const { address, abi } = getTimeContract(networkId)
    const userAddr = userAddress as Address

    // Get claimable dividend amount first
    const claimableAmount = await publicClient.readContract({
      address,
      abi,
      functionName: 'claimableDividendOf',
      args: [userAddr]
    }) as bigint

    if (claimableAmount === 0n) {
      return {
        success: false,
        error: 'No dividends available to claim'
      }
    }

    // Prepare transaction
    const { request } = await publicClient.simulateContract({
      address,
      abi,
      functionName: 'claimDividend',
      args: [userAddr, claimableAmount],
      account: userAddr
    })

    // Send transaction
    const hash = await walletClient.writeContract(request)

    // Wait for transaction confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ hash })

    if (receipt.status === 'success') {
      return {
        success: true,
        hash: hash
      }
    } else {
      return {
        success: false,
        error: 'Transaction failed'
      }
    }
  } catch (error) {
    console.error('Error claiming dividends:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to claim dividends'
    }
  }
}

/**
 * Sweep dividends (bring all accrued dividends into the contract)
 */
export const sweepDividends = async (params: TransactionParams): Promise<TransactionResult> => {
  const { networkId, userAddress, walletClient, publicClient } = params

  try {
    // Check if TIME contract is deployed on this network
    if (!isTimeContractDeployed(networkId)) {
      return {
        success: false,
        error: `TIME contract not deployed on ${networkId}`
      }
    }

    const { address, abi } = getTimeContract(networkId)
    const userAddr = userAddress as Address

    // Check if user has TIME tokens (required for sweeping)
    const timeBalance = await publicClient.readContract({
      address,
      abi,
      functionName: 'balanceOf',
      args: [userAddr]
    }) as bigint

    if (timeBalance === 0n) {
      return {
        success: false,
        error: 'No TIME tokens found. You need TIME tokens to sweep dividends.'
      }
    }

    // Get current magnified dividend per share
    const magnifiedDividendPerShare = await publicClient.readContract({
      address,
      abi,
      functionName: 'magnifiedDividendPerShare',
      args: []
    }) as bigint

    // Prepare transaction - we'll send a small amount of native token to trigger dividend distribution
    const { request } = await publicClient.simulateContract({
      address,
      abi,
      functionName: 'transfer',
      args: [address, 0n], // Transfer 0 tokens to self to trigger dividend calculation
      account: userAddr,
      value: 0n // No ETH/PLS needed for this operation
    })

    // Send transaction
    const hash = await walletClient.writeContract(request)

    // Wait for transaction confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ hash })

    if (receipt.status === 'success') {
      return {
        success: true,
        hash: hash
      }
    } else {
      return {
        success: false,
        error: 'Transaction failed'
      }
    }
  } catch (error) {
    console.error('Error sweeping dividends:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sweep dividends'
    }
  }
} 