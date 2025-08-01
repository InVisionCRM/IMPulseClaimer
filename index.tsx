
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// Import web3modal configuration - the modal is automatically rendered
import './lib/web3modal';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
