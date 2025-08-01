
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

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('App component rendered');
