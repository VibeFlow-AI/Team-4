import { add, subtract, multiply, divide } from '../utils';

describe('Utility Functions', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should add negative numbers', () => {
      expect(add(-1, -2)).toBe(-3);
    });

    it('should add zero', () => {
      expect(add(5, 0)).toBe(5);
    });
  });

  describe('subtract', () => {
    it('should subtract two positive numbers', () => {
      expect(subtract(5, 3)).toBe(2);
    });

    it('should subtract negative numbers', () => {
      expect(subtract(-1, -2)).toBe(1);
    });

    it('should subtract zero', () => {
      expect(subtract(5, 0)).toBe(5);
    });
  });

  describe('multiply', () => {
    it('should multiply two positive numbers', () => {
      expect(multiply(2, 3)).toBe(6);
    });

    it('should multiply by zero', () => {
      expect(multiply(5, 0)).toBe(0);
    });

    it('should multiply negative numbers', () => {
      expect(multiply(-2, 3)).toBe(-6);
    });
  });

  describe('divide', () => {
    it('should divide two positive numbers', () => {
      expect(divide(6, 2)).toBe(3);
    });

    it('should throw error when dividing by zero', () => {
      expect(() => divide(5, 0)).toThrow('Division by zero');
    });

    it('should handle negative numbers', () => {
      expect(divide(-6, 2)).toBe(-3);
    });
  });
}); 