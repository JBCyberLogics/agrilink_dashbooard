import { describe, expect, it } from 'vitest';
import { calculateMatchScore, calculateNetProfit } from './algorithms';

describe('calculateMatchScore', () => {
  it('applies the proposed weights to user-supplied normalized factors', () => {
    const result = calculateMatchScore({ priceFit: 1, qualityFit: 0.8, distanceFit: 0.5, availabilityFit: 1 });
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.score).toBeCloseTo(0.85);
  });

  it('rejects missing and out-of-range inputs', () => {
    const result = calculateMatchScore({ priceFit: null, qualityFit: 0.8, distanceFit: 0.5, availabilityFit: 1.1 });
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.errors).toHaveLength(2);
  });
});

describe('calculateNetProfit', () => {
  const input = {
    expectedSellingPrice: 50,
    sellableQuantity: 100,
    productionCost: 1200,
    harvestCost: 250,
    packagingCost: 150,
    transportAndSellingCost: 200,
    otherCost: 100,
    targetProfit: 1000,
  };

  it('calculates deterministic estimates from all supplied inputs', () => {
    const result = calculateNetProfit(input);
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.grossRevenue).toBe(5000);
      expect(result.totalCosts).toBe(1900);
      expect(result.netProfit).toBe(3100);
      expect(result.profitMargin).toBeCloseTo(62);
      expect(result.breakEvenUnitPrice).toBe(19);
      expect(result.targetProfitUnitPrice).toBe(29);
    }
  });

  it('does not interpret missing costs as zero and rejects zero quantity', () => {
    expect(calculateNetProfit({ ...input, otherCost: null }).valid).toBe(false);
    expect(calculateNetProfit({ ...input, sellableQuantity: 0 }).valid).toBe(false);
  });

  it('marks margin unavailable when gross revenue is zero', () => {
    const result = calculateNetProfit({ ...input, expectedSellingPrice: 0 });
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.profitMargin).toBeNull();
  });
});
