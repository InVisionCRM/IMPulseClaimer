export const networks = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    config: {
      chainId: 1,
      rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
      symbol: 'ETH',
      timeTokenAddress: null
    },
    icon: () => '🔵'
  },
  {
    id: 'pulsechain',
    name: 'PulseChain',
    config: {
      chainId: 369,
      rpcUrl: 'https://rpc.pulsechain.com',
      symbol: 'PLS',
      timeTokenAddress: '0xCA35638A3fdDD02fEC597D8c1681198C06b23F58'
    },
    icon: () => '🟣'
  }
];

export const Network = {
  id: '',
  name: '',
  config: {
    chainId: 0,
    rpcUrl: '',
    symbol: '',
    timeTokenAddress: null
  },
  icon: () => ''
}; 