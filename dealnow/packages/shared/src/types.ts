import type {
  Role, StoreStatus, OrderStatus, PaymentStatus, PaymentMethod,
  ShipmentStatus, SubscriptionStatus, SlipStatus,
} from './enums';

/** Timestamps are Firestore Timestamps at runtime; typed as unknown-compatible Date-like here. */
export type TS = { seconds: number; nanoseconds: number } | Date;
export interface Base { createdAt: TS; updatedAt: TS }
/** Every store-scoped document MUST extend this. */
export interface StoreScoped extends Base { storeId: string }

export interface User extends Base {
  uid: string; email: string; displayName: string; phone?: string;
  role: Role; storeId?: string; disabled?: boolean;
}
export interface Seller extends Base {
  uid: string; storeId: string; businessName: string; taxId?: string;
  lineUserId?: string; payoutAccount?: { bank: string; accountNo: string; accountName: string; promptPayId?: string };
}
export interface Store extends Base {
  id: string; slug: string; ownerUid: string; name: string; description?: string;
  logoUrl?: string; bannerUrl?: string;
  theme: { primary: string; layout: 'grid' | 'list' | 'magazine' };
  contact: { phone?: string; email?: string; line?: string; address?: string };
  status: StoreStatus; planId: string; customDomain?: string | null;
  settings: {
    paymentMethods: PaymentMethod[]; shippingMethods: string[]; shippingFlatFee: number;
    freeShippingOver?: number; lowStockThreshold: number;
  };
  stats: { orderCount: number; revenue: number; productCount: number };
}
export interface Category extends StoreScoped { id: string; name: string; slug: string; sort: number }
export interface ProductVariant {
  id: string; sku: string; label: string; options: Record<string, string>; // {สี:'แดง', ขนาด:'M'}
  price?: number; // overrides product price
}
export interface Product extends StoreScoped {
  id: string; name: string; slug: string; description: string; images: string[];
  categoryId?: string; sku: string; price: number; salePrice?: number | null;
  optionGroups: { name: string; values: string[] }[]; variants: ProductVariant[];
  active: boolean; searchTokens: string[]; soldCount: number;
}
/** Stock is separate from product so writes in checkout never touch the product doc. */
export interface Inventory extends StoreScoped {
  id: string; productId: string; variantId: string; onHand: number; reserved: number;
}
export interface Customer extends StoreScoped {
  id: string; uid?: string; name: string; phone: string; email?: string;
  orderCount: number; totalSpent: number; lastOrderAt?: TS;
}
export interface Address { name: string; phone: string; line1: string; subdistrict: string; district: string; province: string; postcode: string }
export interface Order extends StoreScoped {
  id: string; // DN-YYMMDD-XXXXXX
  buyerUid: string | null; customerId: string; status: OrderStatus;
  address: Address; subtotal: number; shippingFee: number; discount: number; total: number;
  paymentId?: string; paymentStatus: PaymentStatus; shipmentId?: string;
  stockDeducted: boolean; // guard so stock is cut exactly once
  statusHistory: { status: OrderStatus; at: TS; by: string }[];
}
export interface OrderItem extends StoreScoped {
  id: string; orderId: string; productId: string; variantId: string;
  name: string; label: string; sku: string; image?: string; unitPrice: number; qty: number;
}
export interface Payment extends StoreScoped {
  id: string; orderId: string; method: PaymentMethod; provider: string;
  amount: number; currency: 'THB'; status: PaymentStatus;
  providerRef?: string; transactionId?: string; qrPayload?: string; expiresAt?: TS; paidAt?: TS;
}
/** Doc ID = `${provider}_${eventId}` => duplicate webhooks collide and are ignored. */
export interface PaymentEvent extends Base {
  id: string; storeId?: string; orderId?: string; provider: string; eventId: string;
  signatureValid: boolean; payload: unknown; result: 'APPLIED' | 'IGNORED_DUPLICATE' | 'REJECTED_AMOUNT' | 'REJECTED_ORDER' | 'REJECTED_SIGNATURE';
}
export interface Slip extends StoreScoped {
  id: string; orderId: string; paymentId: string; imageUrl: string;
  imageHash: string; transRef?: string; amount?: number; status: SlipStatus;
  reviewedBy?: string; verifyLog: unknown[];
}
export interface Shipment extends StoreScoped {
  id: string; orderId: string; carrier: string; trackingNumber: string;
  status: ShipmentStatus; lastUpdate: TS; lastLocation?: string;
}
export interface TrackingEvent extends StoreScoped {
  id: string; shipmentId: string; orderId: string; status: ShipmentStatus;
  description: string; location?: string; occurredAt: TS; rawHash: string; // dedupe key
}
export interface Settlement extends StoreScoped {
  id: string; periodStart: TS; periodEnd: TS; gross: number; platformFee: number; net: number;
  status: 'PENDING' | 'PAID'; paidAt?: TS;
}
export interface Subscription extends Base {
  id: string; storeId: string; planId: string; status: SubscriptionStatus;
  cycle: 'MONTHLY' | 'YEARLY'; currentPeriodEnd: TS; usage: { orders: number; period: string };
}
export interface Notification extends Base {
  id: string; storeId?: string; recipientUid: string; channel: 'IN_APP' | 'LINE';
  type: 'NEW_ORDER' | 'PAYMENT_SUCCESS' | 'ORDER_SHIPPED' | 'SYSTEM'; title: string; body: string;
  orderId?: string; read: boolean; delivery?: 'SENT' | 'FAILED' | 'MOCKED';
}
export interface AdminLog { id: string; actorUid: string; actorRole: Role; action: string; storeId?: string; target?: string; meta?: unknown; at: TS }
