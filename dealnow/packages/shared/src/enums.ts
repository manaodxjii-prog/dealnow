export const ROLES = ['SUPER_ADMIN', 'SELLER', 'BUYER'] as const;
export type Role = (typeof ROLES)[number];

export const STORE_STATUS = ['PENDING', 'ACTIVE', 'SUSPENDED', 'CLOSED'] as const;
export type StoreStatus = (typeof STORE_STATUS)[number];

/** Happy path in order, then exceptions. Transitions live in orderStateMachine.ts (Phase 6). */
export const ORDER_STATUS = [
  'PENDING_PAYMENT', 'PAID', 'PREPARING', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED',
  'CANCELLED', 'PAYMENT_FAILED', 'REFUNDED', 'RETURNED', 'RETURN_TO_SENDER',
  'RECIPIENT_UNREACHABLE', 'DELIVERY_ISSUE',
] as const;
export type OrderStatus = (typeof ORDER_STATUS)[number];

export const ORDER_STATUS_TH: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'รอชำระเงิน', PAID: 'ชำระเงินแล้ว', PREPARING: 'กำลังเตรียมสินค้า',
  SHIPPED: 'จัดส่งแล้ว', IN_TRANSIT: 'กำลังขนส่ง', OUT_FOR_DELIVERY: 'กำลังนำจ่าย',
  DELIVERED: 'จัดส่งสำเร็จ', CANCELLED: 'ยกเลิก', PAYMENT_FAILED: 'ชำระเงินไม่สำเร็จ',
  REFUNDED: 'คืนเงิน', RETURNED: 'คืนสินค้า', RETURN_TO_SENDER: 'พัสดุตีกลับ',
  RECIPIENT_UNREACHABLE: 'ติดต่อผู้รับไม่ได้', DELIVERY_ISSUE: 'การจัดส่งมีปัญหา',
};

export const PAYMENT_STATUS = ['PENDING', 'PAID', 'FAILED', 'EXPIRED', 'REFUNDED', 'UNDER_REVIEW'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUS)[number];
export const PAYMENT_METHOD = ['PROMPTPAY_QR', 'GATEWAY', 'SLIP'] as const;
export type PaymentMethod = (typeof PAYMENT_METHOD)[number];

export const SHIPMENT_STATUS = [
  'CREATED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED',
  'RETURNED', 'UNREACHABLE', 'EXCEPTION',
] as const;
export type ShipmentStatus = (typeof SHIPMENT_STATUS)[number];

export const SUBSCRIPTION_STATUS = ['ACTIVE', 'PAST_DUE', 'CANCELLED', 'TRIAL'] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUS)[number];

export const SLIP_STATUS = ['SUBMITTED', 'VERIFIED', 'REJECTED', 'DUPLICATE'] as const;
export type SlipStatus = (typeof SLIP_STATUS)[number];
