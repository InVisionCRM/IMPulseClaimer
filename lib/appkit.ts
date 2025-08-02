import { createAppKit } from '@reown/appkit/react'
import { wagmiAdapter, networks } from '@/config'
import { mainnet } from '@reown/appkit/networks'

// Minimal metadata
const metadata = {
  name: 'TIME Dividends Claim',
  description: 'Claim your TIME token dividends',
  url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  icons: ['https://gitlab.com/internetmoneyio/branding/-/raw/148b3b3ff4ccf754c4edd1fa2b21be0b13b57539/IM_200.png'],
}

// Initialize AppKit
export const initializeAppKit = () => {
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID
  
  if (!projectId) {
    console.error("AppKit Initialization Error: Project ID is missing.")
    return false
  }
  
  try {
    createAppKit({
      adapters: [wagmiAdapter],
      projectId,
      networks,
      defaultNetwork: mainnet,
      metadata,
    })
    console.log('✅ AppKit initialized successfully')
    return true
  } catch (error) {
    console.error('❌ Failed to initialize AppKit:', error)
    return false
  }
} 