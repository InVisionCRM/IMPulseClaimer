'use client'

import React, { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, cookieToInitialState, type Config } from 'wagmi'
import { createAppKit } from '@reown/appkit/react'
import { config, projectId, wagmiAdapter, networks } from '@/config'
import { mainnet } from '@reown/appkit/networks'

const queryClient = new QueryClient()

// Minimal metadata
const metadata = {
  name: 'TIME Dividends Claim',
  description: 'Claim your TIME token dividends',
  url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  icons: ['https://gitlab.com/internetmoneyio/branding/-/raw/148b3b3ff4ccf754c4edd1fa2b21be0b13b57539/IM_200.png'],
}

// Initialize AppKit with minimal configuration
if (!projectId) {
  console.error("AppKit Initialization Error: Project ID is missing.")
} else {
  createAppKit({
    adapters: [wagmiAdapter],
    projectId: projectId!,
    networks: networks, // Use the same networks as WagmiAdapter
    defaultNetwork: mainnet,
    metadata,
    // Removed analytics feature for barebones setup
  })
}

export default function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode
  cookies: string | null // Cookies from server for hydration
}) {
  // Calculate initial state for Wagmi SSR hydration
  const initialState = cookieToInitialState(config as Config, cookies)

  return (
    // Cast config as Config for WagmiProvider
    <WagmiProvider config={config as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
} 