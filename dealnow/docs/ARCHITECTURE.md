# DEALNOW Architecture (Phase 1)

## Layers
- **apps/web** (Next.js App Router, TS): `/` landing, `/login`, `/store/[slug]/*` storefront, `/seller/*`, `/admin/*`, `/account/*` (buyer orders + tracking).
- **functions** (Cloud Functions 2nd gen): the ONLY place that writes money/stock/status. Clients never mark an order PAID.
- **Firestore**: top-level collections, every store-scoped doc has `storeId`.
- **packages/shared**: types, enums, plans, collection names used by web + functions.

## Trust rules
1. Client may: read own/store data (per rules), create store/product/draft data in own store.
2. Client may NOT: set `role`, `storeId` claims, order `status`/`paymentStatus`, inventory, payments, trackingEvents.
3. Role/store come from **Auth custom claims** `{role, storeId}` set by `onUserCreate`/`createStore` functions.
4. Checkout = callable `createOrder` (validates prices from DB, reserves stock, creates order + payment in one transaction).

## Core flows (Phase 6-8)
**Payment:** createOrder -> PaymentProvider.createCharge (QR) -> customer pays -> provider POST `/paymentWebhook` ->
verify HMAC signature -> create `paymentEvents/{provider}_{eventId}` with `create()` (fails if duplicate = idempotent) ->
transaction: check order exists, amount == order.total, status PENDING_PAYMENT, transactionId unseen -> set PAID,
deduct inventory once (`stockDeducted` guard), notify seller, write adminLog.

**Slip (fallback):** upload to Storage `slips/{storeId}/{orderId}/...` -> function hashes image + calls SlipVerifier ->
reject if `imageHash` or `transRef` already used -> amount match -> PAID, else UNDER_REVIEW for seller/admin.

**Tracking:** seller sets carrier + number -> `shipments` doc -> scheduled function polls ShippingProvider ->
new events written to `trackingEvents` (dedupe by `rawHash`) -> shipment/order status updated ->
buyer page uses `onSnapshot` on the order, shipment and trackingEvents => live without refresh.

## Provider interfaces (swap mock -> real)
`PaymentProvider`, `SlipVerifier`, `ShippingProvider`, `Notifier(LINE)` in `functions/src/providers/*`.
Selected by env `*_PROVIDER`; default `mock`. Credentials only via Secret Manager.

## Multi-tenancy
Slug -> store lookup (`stores.slug` unique, enforced by function using reserved doc `slugs/{slug}`).
`customDomain` field reserved; Phase 12 middleware maps host -> store.

## Scale notes
- Product search: `searchTokens` array (prefix tokens) now; swap to Algolia/Typesense later behind `searchProducts()`.
- Counters (`stats`, subscription usage) updated by functions with `FieldValue.increment`; hot-spot safe for expected load, shard if >1 write/s/store.
- Money is stored in THB (max 2 decimals). Always compare amounts as integer satang: `Math.round(x * 100)`.
