import Moralis from 'moralis'

// Initialize Moralis with API key
export const initializeMoralis = async (apiKey: string) => {
  try {
    if (!Moralis.Core.isStarted) {
      await Moralis.start({
        apiKey: apiKey
      });
      console.log('Moralis initialized successfully');
    }
  } catch (error) {
    console.error('Failed to initialize Moralis:', error);
    throw error;
  }
};

// Interface for token balance response based on Moralis API
export interface TokenBalance {
  token_address: string;
  name: string;
  symbol: string;
  logo?: string;
  thumbnail?: string;
  decimals: number;
  balance: string;
  usd_price?: number;
  usd_value?: number;
  possible_spam?: boolean;
  verified_contract?: boolean;
}

// Interface for the API response
export interface WalletTokenResponse {
  address: string;
  token_balances: TokenBalance[];
  total_usd_value?: number;
}

// Get wallet token balances for a specific chain
export const getWalletTokenBalances = async (
  address: string,
  chain: string,
  tokenAddresses?: string[]
): Promise<WalletTokenResponse> => {
  try {
    // Validate inputs
    if (!address || !chain) {
      throw new Error('Address and chain are required');
    }

    // Ensure Moralis is initialized
    if (!Moralis.Core.isStarted) {
      throw new Error('Moralis is not initialized');
    }

    const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
      chain: chain,
      tokenAddresses: tokenAddresses,
      address: address
    });

    // Get the actual response data and cast to any to handle type mismatches
    const responseData = response.raw() as any;
    
    // Map the Moralis response to our custom interface
    const mappedResponse: WalletTokenResponse = {
      address: responseData.address || address, // Fallback to input address if not in response
      token_balances: (responseData.token_balances || []).map((token: any) => ({
        token_address: token.token_address,
        name: token.name,
        symbol: token.symbol,
        logo: token.logo,
        thumbnail: token.thumbnail,
        decimals: token.decimals,
        balance: token.balance,
        usd_price: token.usd_price,
        usd_value: token.usd_value,
        possible_spam: token.possible_spam,
        verified_contract: token.verified_contract
      })),
      total_usd_value: responseData.total_usd_value
    };

    return mappedResponse;
  } catch (error) {
    console.error('Error fetching wallet token balances:', error);
    
    // Handle specific Moralis errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid Moralis API key');
      } else if (error.message.includes('rate limit')) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.message.includes('network')) {
        throw new Error('Network error. Please check your connection.');
      }
    }
    
    throw error;
  }
};

// Get TIME token balance specifically
export const getTimeTokenBalance = async (
  address: string,
  chain: string,
  timeTokenAddress: string
): Promise<TokenBalance | null> => {
  try {
    // Validate inputs
    if (!address || !chain || !timeTokenAddress) {
      throw new Error('Address, chain, and token address are required');
    }

    const response = await getWalletTokenBalances(address, chain, [timeTokenAddress]);
    
    // Find the TIME token in the response
    const timeToken = response.token_balances.find(
      token => token.token_address.toLowerCase() === timeTokenAddress.toLowerCase()
    );

    return timeToken || null;
  } catch (error) {
    console.error('Error fetching TIME token balance:', error);
    throw error;
  }
};

// Get all token balances for a wallet (useful for debugging)
export const getAllTokenBalances = async (
  address: string,
  chain: string
): Promise<WalletTokenResponse> => {
  try {
    return await getWalletTokenBalances(address, chain);
  } catch (error) {
    console.error('Error fetching all token balances:', error);
    throw error;
  }
};

// Format balance with proper decimals
export const formatTokenBalance = (balance: string, decimals: number): string => {
  try {
    const balanceNumber = parseFloat(balance) / Math.pow(10, decimals);
    
    // Handle NaN values
    if (isNaN(balanceNumber)) {
      return '0.000000';
    }
    
    // Handle very small numbers
    if (balanceNumber < 0.000001 && balanceNumber > 0) {
      return '< 0.000001';
    }
    
    return balanceNumber.toFixed(6);
  } catch (error) {
    console.error('Error formatting token balance:', error);
    return '0.000000';
  }
};

// Format USD value
export const formatUSDValue = (value?: number): string => {
  if (!value || isNaN(value)) return '$0.00000';
  
  try {
    if (value < 0.00001 && value > 0) {
      return '< $0.00001';
    }
    return `$${value.toFixed(5)}`;
  } catch (error) {
    console.error('Error formatting USD value:', error);
    return '$0.00000';
  }
};

// Check if Moralis is properly initialized
export const isMoralisInitialized = (): boolean => {
  return Moralis.Core.isStarted;
};

// Get supported chains for Moralis
export const getSupportedChains = (): string[] => {
  return [
    '1', '137', '56', '43114', '42161', '8453', '369'
  ];
};

// Validate chain parameter
export const isValidChain = (chain: string): boolean => {
  return getSupportedChains().includes(chain);
};

// Get TIME token price
export const getTimeTokenPrice = async (networkId: string): Promise<number> => {
  try {
    console.log('🔍 getTimeTokenPrice called with networkId:', networkId)
    
    // Validate inputs
    if (!networkId) {
      throw new Error('Network ID is required');
    }

    // Ensure Moralis is initialized
    if (!Moralis.Core.isStarted) {
      console.error('❌ Moralis is not initialized')
      throw new Error('Moralis is not initialized');
    }
    
    console.log('✅ Moralis is initialized')

    // Map network ID to Moralis chain parameter (using chain IDs)
    const chainMap: { [key: string]: string } = {
      'pulsechain': '369',   // PulseChain chain ID (decimal)
      'ethereum': '1',       // Ethereum chain ID (decimal)
      'bnb': '56',           // BNB Chain ID (decimal)
      'polygon': '137',      // Polygon chain ID (decimal)
      'arbitrum': '42161',   // Arbitrum chain ID (decimal)
      'avalanche': '43114',  // Avalanche chain ID (decimal)
      'base': '8453'         // Base chain ID (decimal)
    };

    const chain = chainMap[networkId];
    console.log('🔗 Mapped networkId to chain:', networkId, '->', chain)
    if (!chain) {
      throw new Error(`Unsupported network: ${networkId}`);
    }

    // TIME token contract addresses per network
    const timeTokenAddresses: { [key: string]: string } = {
      'pulsechain': '0xCA35638A3fdDD02fEC597D8c1681198C06b23F58',
      'ethereum': '0xd08481058399490B83a72676901d4e9dB70E75aC',
      'bnb': '0x8734022D0fdBF1faeCE14cE077Edfcb936543E25',
      'polygon': '0x9F42bcA1A579fCf9Efc165a0244B12937e18C6A5',
      'arbitrum': '0x9F71a4F65fb49e298bf64B89bf1CDC8f84ada7C5',
      'avalanche': '0x9F71a4F65fb49e298bf64B89bf1CDC8f84ada7C5',
      'base': '0x9F71a4F65fb49e298bf64B89bf1CDC8f84ada7C5'
    };

    const tokenAddress = timeTokenAddresses[networkId];
    if (!tokenAddress || tokenAddress === '0x0000000000000000000000000000000000000000') {
      throw new Error(`TIME token not available on ${networkId}`);
    }

    // Get token price from Moralis using the correct API format
    console.log('📡 Making API call with:', { chain, tokenAddress })
    const response = await Moralis.EvmApi.token.getTokenPrice({
      chain: chain,
      include: "percent_change",
      address: tokenAddress
    });
    console.log('📊 API response received:', response.raw)

    const price = response.raw.usdPrice;
    
    if (!price || price <= 0) {
      throw new Error('Invalid price data received');
    }

    return price;
  } catch (error) {
    console.error('Error fetching TIME token price:', error);
    
    // Handle specific Moralis errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid Moralis API key');
      } else if (error.message.includes('rate limit')) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.message.includes('network')) {
        throw new Error('Network error. Please check your connection.');
      }
    }
    
    throw error;
  }
};

// Get TIME token metadata
export const getTimeTokenMetadata = async (networkId: string): Promise<any> => {
  try {
    // Validate inputs
    if (!networkId) {
      throw new Error('Network ID is required');
    }

    // Ensure Moralis is initialized
    if (!Moralis.Core.isStarted) {
      throw new Error('Moralis is not initialized');
    }

    // Map network ID to Moralis chain parameter (using chain IDs)
    const chainMap: { [key: string]: string } = {
      'pulsechain': '369',   // PulseChain chain ID (decimal)
      'ethereum': '1',       // Ethereum chain ID (decimal)
      'bnb': '56',           // BNB Chain ID (decimal)
      'polygon': '137',      // Polygon chain ID (decimal)
      'arbitrum': '42161',   // Arbitrum chain ID (decimal)
      'avalanche': '43114',  // Avalanche chain ID (decimal)
      'base': '8453'         // Base chain ID (decimal)
    };

    const chain = chainMap[networkId];
    console.log('🔗 Mapped networkId to chain:', networkId, '->', chain)
    if (!chain) {
      throw new Error(`Unsupported network: ${networkId}`);
    }

    // TIME token contract addresses per network
    const timeTokenAddresses: { [key: string]: string } = {
      'pulsechain': '0xCA35638A3fdDD02fEC597D8c1681198C06b23F58',
      'ethereum': '0xd08481058399490B83a72676901d4e9dB70E75aC',
      'bnb': '0x8734022D0fdBF1faeCE14cE077Edfcb936543E25',
      'polygon': '0x9F42bcA1A579fCf9Efc165a0244B12937e18C6A5',
      'arbitrum': '0x9F71a4F65fb49e298bf64B89bf1CDC8f84ada7C5',
      'avalanche': '0x9F71a4F65fb49e298bf64B89bf1CDC8f84ada7C5',
      'base': '0x9F71a4F65fb49e298bf64B89bf1CDC8f84ada7C5'
    };

    const tokenAddress = timeTokenAddresses[networkId];
    if (!tokenAddress || tokenAddress === '0x0000000000000000000000000000000000000000') {
      throw new Error(`TIME token not available on ${networkId}`);
    }

    // Get token metadata from Moralis
    const response = await Moralis.EvmApi.token.getTokenMetadata({
      chain: chain,
      addresses: [tokenAddress]
    });

    return response.raw;
  } catch (error) {
    console.error('Error fetching TIME token metadata:', error);
    
    // Handle specific Moralis errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid Moralis API key');
      } else if (error.message.includes('rate limit')) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.message.includes('network')) {
        throw new Error('Network error. Please check your connection.');
      }
    }
    
    throw error;
  }
}; 

// Get TIME token price and metadata together
export const getTimeTokenData = async (networkId: string): Promise<{
  price: number;
  metadata: any;
}> => {
  try {
    // Validate inputs
    if (!networkId) {
      throw new Error('Network ID is required');
    }

    // Ensure Moralis is initialized
    if (!Moralis.Core.isStarted) {
      throw new Error('Moralis is not initialized');
    }

    // Get both price and metadata in parallel
    const [price, metadata] = await Promise.all([
      getTimeTokenPrice(networkId),
      getTimeTokenMetadata(networkId)
    ]);

    return { price, metadata };
  } catch (error) {
    console.error('Error fetching TIME token data:', error);
    throw error;
  }
}; 