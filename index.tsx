
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// Import web3modal configuration - the modal is automatically rendered
import './lib/web3modal';

console.log('Starting TIME Dividends Claim application...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Could not find root element to mount to");
  throw new Error("Could not find root element to mount to");
}

console.log('Root element found:', rootElement);

const root = ReactDOM.createRoot(rootElement);
console.log('React root created');

// Test with a simple component first
const TestComponent = () => {
  console.log('TestComponent rendering');
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#131313', 
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px'
    }}>
      <h1>React is working!</h1>
      <p>If you can see this, React is loading properly.</p>
      <button 
        onClick={() => console.log('Button clicked!')}
        style={{
          backgroundColor: '#F59E0B',
          color: 'black',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Test Button
      </button>
    </div>
  );
};

root.render(
  <React.StrictMode>
    <TestComponent />
  </React.StrictMode>
);

console.log('Test component rendered');
