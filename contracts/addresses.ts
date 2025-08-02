export interface ContractAddresses {
  [networkId: string]: {
    timeToken: string;
    name: string;
  };
}

export const TIME_CONTRACT_ADDRESSES: ContractAddresses = {
  // PulseChain Mainnet
  'pulsechain': {
    timeToken: '0xCA35638A3fdDD02fEC597D8c1681198C06b23F58',
    name: 'PulseChain TIME Token'
  },
  // Ethereum Mainnet (placeholder - replace with actual address when available)
  'ethereum': {
    timeToken: '0x0000000000000000000000000000000000000000', // Placeholder
    name: 'Ethereum TIME Token'
  },
  // BNB Chain (placeholder - replace with actual address when available)
  'bnb': {
    timeToken: '0x0000000000000000000000000000000000000000', // Placeholder
    name: 'BNB Chain TIME Token'
  },
  // Polygon (placeholder - replace with actual address when available)
  'polygon': {
    timeToken: '0x0000000000000000000000000000000000000000', // Placeholder
    name: 'Polygon TIME Token'
  },
  // Arbitrum (placeholder - replace with actual address when available)
  'arbitrum': {
    timeToken: '0x0000000000000000000000000000000000000000', // Placeholder
    name: 'Arbitrum TIME Token'
  },
  // Avalanche (placeholder - replace with actual address when available)
  'avalanche': {
    timeToken: '0x0000000000000000000000000000000000000000', // Placeholder
    name: 'Avalanche TIME Token'
  },
  // Base (placeholder - replace with actual address when available)
  'base': {
    timeToken: '0x0000000000000000000000000000000000000000', // Placeholder
    name: 'Base TIME Token'
  }
};

export const getTimeContractAddress = (networkId: string): string => {
  const addresses = TIME_CONTRACT_ADDRESSES[networkId];
  if (!addresses) {
    throw new Error(`No TIME contract address found for network: ${networkId}`);
  }
  return addresses.timeToken;
};

export const isTimeContractDeployed = (networkId: string): boolean => {
  const address = getTimeContractAddress(networkId);
  return address !== '0x0000000000000000000000000000000000000000';
}; 