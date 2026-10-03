export const COL = {
  users: 'users', stores: 'stores', sellers: 'sellers', products: 'products',
  categories: 'categories', inventory: 'inventory', customers: 'customers',
  orders: 'orders', orderItems: 'orderItems', payments: 'payments',
  paymentEvents: 'paymentEvents', slips: 'slips', shipments: 'shipments',
  trackingEvents: 'trackingEvents', settlements: 'settlements',
  subscriptions: 'subscriptions', notifications: 'notifications', adminLogs: 'adminLogs',
} as const;

/** Custom claims set ONLY by Cloud Functions (never by client). */
export interface AuthClaims { role: 'SUPER_ADMIN' | 'SELLER' | 'BUYER'; storeId?: string }

/** Order ID: DN-YYMMDD-XXXXXX (base32, random, collision-checked in a transaction). */
export const ORDER_ID_PATTERN = /^DN-\d{6}-[A-Z2-7]{6}$/;
/** Idempotency keys */
export const paymentEventId = (provider: string, eventId: string) => `${provider}_${eventId}`;
export const inventoryId = (storeId: string, productId: string, variantId: string) =>
  `${storeId}_${productId}_${variantId}`;
