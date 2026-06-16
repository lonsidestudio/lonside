export interface PricingTier {
  id: string;
  name: string;
  price: number;
  period: 'project' | 'month';
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}

export interface PricingAddon {
  id: string;
  name: string;
  price: number;
  unit: string;
}
