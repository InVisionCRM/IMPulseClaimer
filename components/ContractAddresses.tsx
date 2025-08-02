import React, { useState } from 'react'
import { CopyIcon } from './icons/ActionIcons'

interface ContractAddress {
  name: string
  address: string
  symbol?: string
}

interface NetworkContracts {
  name: string
  chainId: number
  contracts: ContractAddress[]
}

const contractData: NetworkContracts[] = [
  {
    name: 'Ethereum',
    chainId: 1,
    contracts: [
      { name: 'T.I.M.E. Dividend', address: '0xd08481058399490B83a72676901d4e9dB70E75aC', symbol: 'TIME' },
      { name: 'FUTURE T.I.M.E. Dividend', address: '0xd4aE236a5080A09c0f7BD6E6B84919523573a43B', symbol: 'FUTURE' },
      { name: 'Internet Money', address: '0x0A58153a0CD1cfaea94cE1f7FdC5D7E679eCa936', symbol: 'IM' },
      { name: 'Internet Money Swap Router v3 (DEX Aggregator)', address: '0xF3cb43F19C668e34173D4Bb59E551a2c6E37d778' },
      { name: 'TIME Buy and Burn', address: '0xa11aA626E637df91f3ccd4f795a3d07a3dFaF00e' },
      { name: 'IM Buy and Burn', address: '0x2963ab11d012791ACFA7a4b8d428dA129898a8E4' },
      { name: 'HEX Buy and Burn', address: '0x7E937f7aa4d1Cd02664d4043d439DdB0Cff7dDBE' }
    ]
  },
  {
    name: 'BNB Smart Chain (BSC)',
    chainId: 56,
    contracts: [
      { name: 'T.I.M.E. Dividend', address: '0x8734022D0fdBF1faeCE14cE077Edfcb936543E25', symbol: 'TIME' },
      { name: 'Internet Money', address: '0xac5D23cE5e4a5eB11A5407a5FBeE201a75E8C8aD', symbol: 'IM' },
      { name: 'Internet Money Swap Router v3 (DEX Aggregator)', address: '0xF3cb43F19C668e34173D4Bb59E551a2c6E37d778' },
      { name: 'TIME Buy and Burn', address: '0xa11aA626E637df91f3ccd4f795a3d07a3dFaF00e' },
      { name: 'IM Buy and Burn', address: '0x7E937f7aa4d1Cd02664d4043d439DdB0Cff7dDBE' }
    ]
  },
  {
    name: 'Polygon',
    chainId: 137,
    contracts: [
      { name: 'T.I.M.E. Dividend', address: '0x9F42bcA1A579fCf9Efc165a0244B12937e18C6A5', symbol: 'TIME' },
      { name: 'Internet Money Swap Router v3 (DEX Aggregator)', address: '0x91512b3547C46A1ec9a0385f5731525A036cB032' }
    ]
  },
  {
    name: 'PulseChain',
    chainId: 369,
    contracts: [
      { name: 'T.I.M.E. Dividend', address: '0xCA35638A3fdDD02fEC597D8c1681198C06b23F58', symbol: 'TIME' },
      { name: 'Internet Money', address: '0xBBcF895BFCb57d0f457D050bb806d1499436c0CE', symbol: 'IM' },
      { name: 'Future T.I.M.E. Dividend from Ethereum', address: '0xAE0303f244A3e9c74Ee8D373aF0bd637643dD371', symbol: 'FUTURE' },
      { name: 'Internet Money Swap Router v3 (DEX Aggregator)', address: '0xF3cb43F19C668e34173D4Bb59E551a2c6E37d778' },
      { name: 'TIME Buy and Burn', address: '0x1Cb448526DA525Ff0944337e060Cc285e2893E96' },
      { name: 'IM Buy and Burn', address: '0xf9D7C0e262c59d73B1E8cDdAfaAaef994b0410a3' },
      { name: 'HEX Buy and Burn', address: '0xB164B80cBE3280501F8133060e9fc671cBBF21A3' },
      { name: 'PEPE Buy and Burn', address: '0x5a438cf2d76C2232a0CC8dF53baE189DC3d6eE4E' },
      { name: 'AXIS Buy and Burn', address: '0x3343d9C64B3D1e5321954774e8e8F2E59d616d96' },
      { name: 'TEXAN Buy and Burn', address: '0x9400a853e918f48c5fB40BcC316bBadB2AdA06f0' },
      { name: 'PLSX Buy and Burn', address: '0xd43af9B689DD92654BFfBe4D158836235aa1c41e' },
      { name: 'INC Buy and Burn', address: '0x87B8835e9Aa0B303B1D6391b36819c97A2a6BF33' },
      { name: 'LOAN Buy and Burn', address: '0xa71E7943Cb64054E2572220a8E23258b777D290C' }
    ]
  },
  {
    name: 'Base',
    chainId: 8453,
    contracts: [
      { name: 'T.I.M.E. Dividend', address: '0x9F71a4F65fb49e298bf64B89bf1CDC8f84ada7C5', symbol: 'TIME' },
      { name: 'Internet Money Swap Router v3 (DEX Aggregator)', address: '0xF68A6a0688fde0E194F391dbe734309C9d36293E' }
    ]
  },
  {
    name: 'Arbitrum',
    chainId: 42161,
    contracts: [
      { name: 'T.I.M.E. Dividend', address: '0x9F71a4F65fb49e298bf64B89bf1CDC8f84ada7C5', symbol: 'TIME' },
      { name: 'Internet Money Swap Router v3 (DEX Aggregator)', address: '0xF68A6a0688fde0E194F391dbe734309C9d36293E' }
    ]
  },
  {
    name: 'Avalanche C-Chain',
    chainId: 43114,
    contracts: [
      { name: 'T.I.M.E. Dividend', address: '0x9F71a4F65fb49e298bf64B89bf1CDC8f84ada7C5', symbol: 'TIME' },
      { name: 'Internet Money Swap Router v3 (DEX Aggregator)', address: '0xF68A6a0688fde0E194F391dbe734309C9d36293E' }
    ]
  }
]

const ContractAddresses: React.FC = () => {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  const copyToClipboard = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address)
      setCopiedAddress(address)
      setTimeout(() => setCopiedAddress(null), 2000)
    } catch (error) {
      console.error('Failed to copy address:', error)
    }
  }

  return (
    <div className="bg-[#1C1C1C] rounded-2xl p-6 max-h-[80vh] overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Internet Money Deployed Contracts</h2>
        <p className="text-gray-400">Below is a list of all currently leveraged Smart Contracts in the Internet Money ecosystem.</p>
      </div>

      <div className="space-y-8">
        {contractData.map((network) => (
          <div key={network.chainId} className="bg-[#131313] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              {network.name} (Chain ID {network.chainId})
            </h3>
            
            <div className="space-y-3">
              {network.contracts.map((contract, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#1C1C1C] rounded-lg border border-gray-700">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">
                        {contract.name}
                      </span>
                      {contract.symbol && (
                        <span className="text-amber-400 text-sm font-mono">
                          ({contract.symbol})
                        </span>
                      )}
                    </div>
                    <div className="text-gray-400 font-mono text-sm mt-1">
                      {contract.address}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => copyToClipboard(contract.address)}
                    className={`ml-4 p-2 rounded-lg transition-all duration-200 ${
                      copiedAddress === contract.address
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                    }`}
                    title="Copy address"
                  >
                    <CopyIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContractAddresses 