export const MATCH_WEIGHTS = {
  priceFit: 0.35,
  qualityFit: 0.25,
  distanceFit: 0.2,
  availabilityFit: 0.2,
} as const;

export type MatchFactors = {
  priceFit: number | null;
  qualityFit: number | null;
  distanceFit: number | null;
  availabilityFit: number | null;
};

export type MatchResult =
  | { valid: false; errors: string[] }
  | { valid: true; score: number; contributions: Record<keyof MatchFactors, number> };

export function calculateMatchScore(factors: MatchFactors): MatchResult {
  const errors: string[] = [];
  (Object.keys(MATCH_WEIGHTS) as (keyof MatchFactors)[]).forEach((key) => {
    const value = factors[key];
    if (value === null || !Number.isFinite(value)) errors.push(`${key} is required.`);
    else if (value < 0 || value > 1) errors.push(`${key} must be between 0 and 1.`);
  });
  if (errors.length) return { valid: false, errors };

  const contributions = {} as Record<keyof MatchFactors, number>;
  (Object.keys(MATCH_WEIGHTS) as (keyof MatchFactors)[]).forEach((key) => {
    contributions[key] = factors[key]! * MATCH_WEIGHTS[key];
  });
  const score = Object.values(contributions).reduce((total, value) => total + value, 0);
  return { valid: true, score, contributions };
}

export type ProfitInputs = {
  expectedSellingPrice: number | null;
  sellableQuantity: number | null;
  productionCost: number | null;
  harvestCost: number | null;
  packagingCost: number | null;
  transportAndSellingCost: number | null;
  otherCost: number | null;
  targetProfit: number | null;
};

export type ProfitResult =
  | { valid: false; errors: string[] }
  | {
      valid: true;
      grossRevenue: number;
      totalCosts: number;
      netProfit: number;
      profitMargin: number | null;
      breakEvenUnitPrice: number;
      targetProfitUnitPrice: number | null;
    };

export function calculateNetProfit(input: ProfitInputs): ProfitResult {
  const required: (keyof ProfitInputs)[] = [
    'expectedSellingPrice', 'sellableQuantity', 'productionCost', 'harvestCost',
    'packagingCost', 'transportAndSellingCost', 'otherCost',
  ];
  const errors: string[] = [];
  required.forEach((key) => {
    const value = input[key];
    if (value === null || !Number.isFinite(value)) errors.push(`${key} is required.`);
    else if (value < 0) errors.push(`${key} cannot be negative.`);
  });
  if (input.targetProfit !== null && (!Number.isFinite(input.targetProfit) || input.targetProfit < 0)) {
    errors.push('targetProfit must be a non-negative number.');
  }
  if (input.sellableQuantity !== null && input.sellableQuantity <= 0) {
    errors.push('sellableQuantity must be greater than zero.');
  }
  if (errors.length) return { valid: false, errors };

  const price = input.expectedSellingPrice!;
  const quantity = input.sellableQuantity!;
  const grossRevenue = price * quantity;
  const totalCosts = input.productionCost! + input.harvestCost! + input.packagingCost!
    + input.transportAndSellingCost! + input.otherCost!;
  const netProfit = grossRevenue - totalCosts;
  return {
    valid: true,
    grossRevenue,
    totalCosts,
    netProfit,
    profitMargin: grossRevenue === 0 ? null : (netProfit / grossRevenue) * 100,
    breakEvenUnitPrice: totalCosts / quantity,
    targetProfitUnitPrice: input.targetProfit === null ? null : (totalCosts + input.targetProfit) / quantity,
  };
}
