import { 
  formatTokenBalance, 
  formatUSDValue,
  isValidChain,
  getSupportedChains
} from './moralis';

describe('Moralis Integration Tests', () => {
  describe('formatTokenBalance', () => {
    it('should format balance correctly', () => {
      expect(formatTokenBalance('1000000000000000000', 18)).toBe('1.000000');
      expect(formatTokenBalance('500000000000000000', 18)).toBe('0.500000');
      expect(formatTokenBalance('1000000', 6)).toBe('1.000000');
    });

    it('should handle very small numbers', () => {
      expect(formatTokenBalance('1000000000000000', 18)).toBe('0.001000');
    });

    it('should handle zero balance', () => {
      expect(formatTokenBalance('0', 18)).toBe('0.000000');
    });

    it('should handle invalid input gracefully', () => {
      expect(formatTokenBalance('invalid', 18)).toBe('0.000000');
    });
  });

  describe('formatUSDValue', () => {
    it('should format USD values correctly', () => {
      expect(formatUSDValue(1.50)).toBe('$1.50');
      expect(formatUSDValue(0.99)).toBe('$0.99');
      expect(formatUSDValue(1000.00)).toBe('$1000.00');
    });

    it('should handle very small values', () => {
      expect(formatUSDValue(0.005)).toBe('< $0.01');
    });

    it('should handle undefined and null values', () => {
      expect(formatUSDValue(undefined)).toBe('$0.00');
      expect(formatUSDValue(null as any)).toBe('$0.00');
    });

    it('should handle NaN values', () => {
      expect(formatUSDValue(NaN)).toBe('$0.00');
    });
  });

  describe('isValidChain', () => {
    it('should validate supported chains', () => {
      expect(isValidChain('pulse')).toBe(true);
      expect(isValidChain('eth')).toBe(true);
      expect(isValidChain('polygon')).toBe(true);
    });

    it('should reject unsupported chains', () => {
      expect(isValidChain('unsupported')).toBe(false);
      expect(isValidChain('')).toBe(false);
    });
  });

  describe('getSupportedChains', () => {
    it('should return list of supported chains', () => {
      const chains = getSupportedChains();
      expect(chains).toContain('pulse');
      expect(chains).toContain('eth');
      expect(chains).toContain('polygon');
      expect(chains).toContain('bsc');
      expect(chains).toContain('avalanche');
      expect(chains).toContain('arbitrum');
      expect(chains).toContain('base');
    });
  });
}); 