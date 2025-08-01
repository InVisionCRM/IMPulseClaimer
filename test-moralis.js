// Simple test script to verify Moralis integration
// Run with: node test-moralis.js

import Moralis from 'moralis';

const testMoralisIntegration = async () => {
  console.log('🧪 Testing Moralis Integration...\n');

  // Test 1: Check if Moralis can be imported
  console.log('✅ Moralis import successful');

  // Test 2: Check Moralis version
  console.log(`📦 Moralis version: ${Moralis.version || 'Unknown'}`);

  // Test 3: Check if Core is available
  if (Moralis.Core) {
    console.log('✅ Moralis.Core is available');
  } else {
    console.log('❌ Moralis.Core is not available');
  }

  // Test 4: Check if EvmApi is available
  if (Moralis.EvmApi) {
    console.log('✅ Moralis.EvmApi is available');
  } else {
    console.log('❌ Moralis.EvmApi is not available');
  }

  // Test 5: Check if wallets API is available
  if (Moralis.EvmApi?.wallets) {
    console.log('✅ Moralis.EvmApi.wallets is available');
  } else {
    console.log('❌ Moralis.EvmApi.wallets is not available');
  }

  // Test 6: Check if getWalletTokenBalancesPrice method exists
  if (Moralis.EvmApi?.wallets?.getWalletTokenBalancesPrice) {
    console.log('✅ getWalletTokenBalancesPrice method is available');
  } else {
    console.log('❌ getWalletTokenBalancesPrice method is not available');
  }

  console.log('\n🎉 Moralis integration test completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Set your MORALIS_API_KEY in .env.local');
  console.log('2. Run: npm run dev');
  console.log('3. Connect to PulseChain and test TIME token balance fetching');
};

// Run the test
testMoralisIntegration().catch(console.error); 