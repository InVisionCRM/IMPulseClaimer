import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.MORALIS_API_KEY': JSON.stringify(env.MORALIS_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          external: ['assert', 'stream'],
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              web3modal: ['@web3modal/ethers'],
              moralis: ['moralis'],
              ethers: ['ethers']
            }
          }
        },
        target: 'es2020',
        minify: 'esbuild'
      },
      optimizeDeps: {
        include: ['react', 'react-dom', '@web3modal/ethers']
      }
    };
}); 