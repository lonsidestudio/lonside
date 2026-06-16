export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  longDesc: string;
  icon: string;
  features: string[];
  deliverables: string[];
  timeline: string;
  priceFrom: number;
}

export interface ComparisonRow {
  feature: string;
  standard: string;
  lonside: string;
  impact: string;
}
