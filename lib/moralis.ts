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
  if (!value || isNaN(value)) return '$0.00';
  
  try {
    if (value < 0.01 && value > 0) {
      return '< $0.01';
    }
    return `$${value.toFixed(2)}`;
  } catch (error) {
    console.error('Error formatting USD value:', error);
    return '$0.00';
  }
};

// Check if Moralis is properly initialized
export const isMoralisInitialized = (): boolean => {
  return Moralis.Core.isStarted;
};

// Get supported chains for Moralis
export const getSupportedChains = (): string[] => {
  return [
    'eth', 'polygon', 'bsc', 'avalanche', 'arbitrum', 'base', 'pulse'
  ];
};

// Validate chain parameter
export const isValidChain = (chain: string): boolean => {
  return getSupportedChains().includes(chain);
}; 