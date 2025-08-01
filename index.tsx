
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

console.log('Starting TIME Dividends Claim application...');

// Initialize the app
const initializeApp = async () => {
  // Import web3modal configuration - the modal is automatically rendered
  try {
    await import('./lib/web3modal');
    console.log('Web3Modal imported successfully');
  } catch (error) {
    console.error('Error importing Web3Modal:', error);
  }

  // Import App component with error handling
  let App;
  try {
    const AppModule = await import('./App');
    App = AppModule.default;
    console.log('App component imported successfully');
  } catch (error) {
    console.error('Error importing App component:', error);
    // Fallback to a simple component if App fails to load
    App = () => (
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#131313', 
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px'
      }}>
        <h1>App Component Failed to Load</h1>
        <p>Error: {error.message}</p>
        <p>Check the console for more details.</p>
      </div>
    );
  }

  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Could not find root element to mount to");
    throw new Error("Could not find root element to mount to");
  }

  console.log('Root element found:', rootElement);

  const root = ReactDOM.createRoot(rootElement);
  console.log('React root created');

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  console.log('App component rendered');
};

// Start the app
initializeApp().catch(error => {
  console.error('Failed to initialize app:', error);
});
