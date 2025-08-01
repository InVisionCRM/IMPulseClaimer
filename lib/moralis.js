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

// Get all token balances for debugging
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

// Format token balance with proper decimals
export const formatTokenBalance = (balance, decimals) => {
  try {
    if (!balance || isNaN(balance)) {
      return '0.000000';
    }

    const balanceNumber = parseFloat(balance);
    if (isNaN(balanceNumber)) {
      return '0.000000';
    }

    // Convert from wei to token units
    const tokenBalance = balanceNumber / Math.pow(10, decimals);
    
    // Handle very small numbers
    if (tokenBalance < 0.000001 && tokenBalance > 0) {
      return '< 0.000001';
    }

    // Format to 6 decimal places
    return tokenBalance.toFixed(6);
  } catch (error) {
    console.error('Error formatting token balance:', error);
    return '0.000000';
  }
};

// Format USD value
export const formatUSDValue = (value) => {
  try {
    if (value === undefined || value === null || isNaN(value)) {
      return '$0.00';
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return '$0.00';
    }

    // Handle very small values
    if (numValue < 0.01 && numValue > 0) {
      return '< $0.01';
    }

    // Format to 2 decimal places
    return `$${numValue.toFixed(2)}`;
  } catch (error) {
    console.error('Error formatting USD value:', error);
    return '$0.00';
  }
};

// Check if Moralis is initialized
export const isMoralisInitialized = () => {
  return Moralis.Core.isStarted;
};

// Get supported chains
export const getSupportedChains = () => {
  return ['eth', 'polygon', 'bsc', 'avalanche', 'arbitrum', 'base', 'pulse'];
};

// Validate chain parameter
export const isValidChain = (chain) => {
  const supportedChains = getSupportedChains();
  return supportedChains.includes(chain);
}; 