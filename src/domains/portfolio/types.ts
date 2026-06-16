export interface PortfolioProject {
  id: string;
  slug: string;
  client: string;
  industry: string;
  services: string[];
  headline: string;
  challenge: string;
  solution: string;
  metrics: { label: string; value: string; delta: string }[];
  techStack: string[];
  deliveryDays: number;
  testimonial?: { quote: string; author: string; role: string };
  coverColor: string;
  liveUrl?: string;
  clientFeedback?: string;
  process?: { day: string; actor: string; action: string }[];
}
