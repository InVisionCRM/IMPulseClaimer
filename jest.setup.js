// Mock environment variables for testing
global.process = global.process || {};
global.process.env = global.process.env || {};
global.process.env.MORALIS_API_KEY = 'test-api-key';
global.process.env.GEMINI_API_KEY = 'test-gemini-key';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to suppress console.log during tests
  // log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    host: 'localhost:5173',
    href: 'http://localhost:5173',
  },
  writable: true,
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
})); 