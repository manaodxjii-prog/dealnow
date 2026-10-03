# Database Schema (Phase 1)
Types are in `packages/shared/src/types.ts`. Summary:

| Collection | Doc ID | Key fields | Written by |
|---|---|---|---|
| users | uid | role, storeId | function (role), user (profile) |
| stores | auto | slug, ownerUid, status, planId, settings | seller (limited), admin |
| slugs | slug | storeId | function only |
| sellers | uid | storeId, payoutAccount | seller |
| products | auto | storeId, price, variants, active | seller |
| categories | auto | storeId | seller |
| inventory | `{storeId}_{productId}_{variantId}` | onHand, reserved | function (seller adjust via callable) |
| customers | auto | storeId, totals | function |
| orders | `DN-YYMMDD-XXXXXX` | storeId, buyerUid, status, total | function only |
| orderItems | auto | storeId, orderId | function only |
| payments | auto | storeId, orderId, status, transactionId | function only |
| paymentEvents | `{provider}_{eventId}` | result, signatureValid | function only |
| slips | auto | imageHash, transRef, status | buyer create, function/seller update |
| shipments | auto | carrier, trackingNumber, status | seller via callable, function |
| trackingEvents | auto | shipmentId, rawHash | function only |
| settlements | auto | gross, platformFee, net | function/admin |
| subscriptions | storeId | planId, usage | function/admin |
| notifications | auto | recipientUid, channel | function |
| adminLogs | auto | actorUid, action | function only (append-only) |

## Isolation invariant
For any doc with `storeId`: read/write allowed only if `claims.storeId == doc.storeId` (seller), or `claims.role == SUPER_ADMIN`,
or (buyer) `doc.buyerUid == auth.uid`. Public storefront reads: `stores`(ACTIVE), `products`(active), `categories`.

## Uniqueness guarantees
- Order ID: random base32 + existence check inside transaction.
- Webhook replay: deterministic `paymentEvents` ID + `create()`.
- Transaction ID reuse: `payments.transactionId` queried inside the PAID transaction; also reserved in `paymentEvents`.
- Slip reuse: `imageHash` and `transRef` queried before accept.
- Tracking duplicates: `trackingEvents.rawHash`.
