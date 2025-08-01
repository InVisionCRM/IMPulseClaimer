# TIME Dividends Claim - Next.js

A Next.js application for claiming TIME token dividends across multiple blockchain networks.

## Features

- **Multi-Network Support**: Ethereum, PulseChain, BNB Chain, Polygon, Arbitrum, Avalanche, and Base
- **Web3 Wallet Integration**: Connect with MetaMask, WalletConnect, and other popular wallets
- **Real-time Balance Tracking**: View TIME token balances and USD values
- **Dividend Management**: Claim and sweep dividend functionality (coming soon)
- **Responsive Design**: Modern UI optimized for desktop and mobile
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Reown AppKit with Wagmi and Viem
- **Blockchain Data**: Moralis API
- **Code Quality**: Biome for formatting and linting
- **Testing**: Jest with React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Moralis API key
- WalletConnect Project ID (for AppKit)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd time-dividends-claim
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Moralis API Key - Get from https://admin.moralis.io/
   NEXT_PUBLIC_MORALIS_API_KEY=your_moralis_api_key_here
   
   # WalletConnect Project ID - Get from https://cloud.walletconnect.com/
   NEXT_PUBLIC_PROJECT_ID=your_project_id_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## Project Structure

```
time-dividends-claim/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx      # Web3 providers
├── components/            # React components
│   ├── icons/            # SVG icons
│   ├── AccountCard.tsx   # Wallet connection display
│   ├── BalanceDisplay.tsx # Token balance display
│   ├── DividendsCard.tsx # Dividend management
│   ├── Header.tsx        # Network header
│   ├── Modal.tsx         # Modal component
│   ├── Networks.tsx      # Network selection
│   ├── Sidebar.tsx       # Navigation sidebar
│   └── Tooltip.tsx       # Tooltip component
├── data/                 # Static data
│   └── networks.ts       # Network configurations
├── config/               # AppKit configuration
│   └── index.tsx         # Wagmi adapter setup
├── context/              # AppKit context
│   └── index.tsx         # Context provider
├── lib/                  # Utility libraries
│   └── moralis.ts        # Moralis API integration
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## Configuration

### Networks

Supported networks are configured in `data/networks.ts`. Each network includes:
- Chain ID and RPC URL
- Token symbol and explorer URL
- TIME token contract address (where applicable)

### AppKit

AppKit configuration is in `config/index.tsx`. Update the project ID and supported networks as needed.

### Moralis

Moralis integration is in `lib/moralis.ts`. The API key is loaded from environment variables.

## Development Guidelines

### Code Style

- Use Biome for formatting and linting
- Follow TypeScript strict mode
- Use functional components with hooks
- Implement proper error handling
- Add accessibility attributes

### Component Structure

- Keep components small and focused
- Use TypeScript interfaces for props
- Implement proper loading states
- Handle error states gracefully

### Testing

- Write unit tests for utility functions
- Test component rendering and interactions
- Mock external dependencies
- Maintain good test coverage

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_MORALIS_API_KEY` | Moralis API key for blockchain data | Yes |
| `NEXT_PUBLIC_PROJECT_ID` | WalletConnect project ID for AppKit | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code examples

## Migration from Vite

This project was migrated from Vite to Next.js. Key changes:

- **File Structure**: Moved from `src/` to `app/` directory
- **Routing**: Switched to Next.js App Router
- **Build System**: Changed from Vite to Next.js
- **Environment Variables**: Updated to use `NEXT_PUBLIC_` prefix
- **TypeScript Config**: Updated for Next.js compatibility
- **Testing**: Updated Jest configuration for Next.js

The core functionality remains the same, but the application now benefits from Next.js features like:
- Server-side rendering
- Automatic code splitting
- Built-in optimization
- Better SEO support
- Improved development experience

## Migration from Web3Modal to AppKit

This project was also migrated from Web3Modal to Reown AppKit. Key changes:

- **Web3 Library**: Switched from Web3Modal v5 to AppKit with Wagmi
- **Wallet Connection**: Now uses AppKit's `<appkit-button>` component
- **Network Switching**: Uses Wagmi's `useSwitchNetwork` hook
- **State Management**: Uses Wagmi's `useAccount` and `useNetwork` hooks
- **Configuration**: AppKit configuration in `config/index.tsx`
- **Context**: AppKit context provider in `context/index.tsx`

Benefits of AppKit:
- Better TypeScript support
- More flexible network configuration
- Improved SSR support
- Better developer experience
- More wallet options
