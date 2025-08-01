import Moralis from 'moralis';

// Initialize Moralis with API key
export const initializeMoralis = async (apiKey) => {
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

// Token balance response based on Moralis API
export const TokenBalance = {
  token_address: '',
  name: '',
  symbol: '',
  logo: '',
  thumbnail: '',
  decimals: 0,
  balance: '',
  usd_price: 0,
  usd_value: 0,
  possible_spam: false,
  verified_contract: false
};

// API response
export const WalletTokenResponse = {
  address: '',
  token_balances: [],
  total_usd_value: 0
};

// Get wallet token balances for a specific chain
export const getWalletTokenBalances = async (
  address,
  chain,
  tokenAddresses
) => {
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
      address: address,
      include: 'percent_change' // Include price change data
    });

    return response.raw;
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
  address,
  chain,
  timeTokenAddress
) => {
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
  address,
  chain
) => {
  try {
    return await getWalletTokenBalances(address, chain);
  } catch (error) {
    console.error('Error fetching all token balances:', error);
    throw error;
  }
};

// Format balance with proper decimals
export const formatTokenBalance = (balance, decimals) => {
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
export const formatUSDValue = (value) => {
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
export const isMoralisInitialized = () => {
  return Moralis.Core.isStarted;
};

// Get supported chains for Moralis
export const getSupportedChains = () => {
  return [
    'eth', 'polygon', 'bsc', 'avalanche', 'arbitrum', 'base', 'pulse'
  ];
};

// Validate chain parameter
export const isValidChain = (chain) => {
  return getSupportedChains().includes(chain);
}; 