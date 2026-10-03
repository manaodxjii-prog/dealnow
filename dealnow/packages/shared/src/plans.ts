/** Config-driven plans. Add a plan = add an entry. -1 means unlimited. */
export interface PlanConfig {
  id: string; name: string;
  priceMonthly: number; priceYearly: number; // THB
  limits: { products: number; ordersPerMonth: number; staff: number };
  features: { customDomain: boolean; slipVerify: boolean; lineNotify: boolean; analytics: boolean };
}
export const PLANS: Record<string, PlanConfig> = {
  free: { id: 'free', name: 'Free', priceMonthly: 0, priceYearly: 0,
    limits: { products: 20, ordersPerMonth: 50, staff: 1 },
    features: { customDomain: false, slipVerify: false, lineNotify: false, analytics: false } },
  basic: { id: 'basic', name: 'Basic', priceMonthly: 299, priceYearly: 2990,
    limits: { products: 200, ordersPerMonth: 500, staff: 3 },
    features: { customDomain: false, slipVerify: true, lineNotify: true, analytics: true } },
  pro: { id: 'pro', name: 'Pro', priceMonthly: 799, priceYearly: 7990,
    limits: { products: 2000, ordersPerMonth: 5000, staff: 10 },
    features: { customDomain: true, slipVerify: true, lineNotify: true, analytics: true } },
  enterprise: { id: 'enterprise', name: 'Enterprise', priceMonthly: 0, priceYearly: 0, // custom quote
    limits: { products: -1, ordersPerMonth: -1, staff: -1 },
    features: { customDomain: true, slipVerify: true, lineNotify: true, analytics: true } },
};
