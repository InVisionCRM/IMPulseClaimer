'use client'

import React, { ReactNode, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, cookieToInitialState, type Config } from 'wagmi'
import { config } from '@/config'
import { initializeAppKit } from '@/lib/appkit'

const queryClient = new QueryClient()

export default function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode
  cookies: string | null // Cookies from server for hydration
}) {
  // Initialize AppKit on client side
  useEffect(() => {
    const success = initializeAppKit()
    if (success) {
      // Give AppKit a moment to fully initialize
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('appkit-ready'))
      }, 100)
    }
  }, [])

  // Calculate initial state for Wagmi SSR hydration
  const initialState = cookieToInitialState(config as Config, cookies)

  return (
    // Cast config as Config for WagmiProvider
    <WagmiProvider config={config as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
} 