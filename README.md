# Ticketing Website - Microservices (MERN + NATS + Kubernetes)

A production-style ticketing platform built with event-driven microservices.
The system is split into independent services, each with its own database,
and coordinated via NATS Streaming events.

## Tech Stack

- Backend: Node.js, TypeScript, Express
- Frontend: Next.js + React
- Databases: MongoDB (database-per-service)
- Messaging: NATS Streaming (event bus)
- Queue/Delayed jobs: Redis + Bull (expiration service)
- Orchestration: Kubernetes + NGINX Ingress
- Dev workflow: Skaffold + Docker
- Payments: Stripe

## Project Structure

```text
auth/        -> Auth service (signup/signin/signout/current user)
tickets/     -> Ticket creation, listing, updating
orders/      -> Order creation, listing, cancellation, expiration handling
payments/    -> Stripe charge + payment event publishing
expiration/  -> Background worker to expire unpaid orders
client/      -> Next.js frontend
common/      -> Shared package (errors, middlewares, event contracts)
infra/k8s/   -> Kubernetes manifests
skaffold.yaml-> Local Kubernetes development workflow
```

## Services and Responsibilities

1. Auth Service
- Handles user registration/login/logout.
- Uses cookie-based session JWT.

2. Tickets Service
- Manages ticket CRUD for sellers.
- Publishes ticket created/updated events.
- Prevents editing reserved tickets.

3. Orders Service
- Creates and tracks ticket orders.
- Enforces reservation rules.
- Publishes order lifecycle events.

4. Expiration Service
- Listens for order creation.
- Schedules order expiration through a Redis-backed queue.
- Publishes expiration-complete events.

5. Payments Service
- Charges users via Stripe.
- Persists payment records.
- Publishes payment-created events.

6. Client Service
- Next.js UI for auth, ticket browsing, purchasing, and order management.

## Ingress and Routing

The app is exposed through NGINX Ingress with host:

- `ticketing.dev`

Routing rules:

- `/api/users/*` -> `auth-srv`
- `/api/tickets/*` -> `tickets-srv`
- `/api/orders/*` -> `orders-srv`
- `/api/payments/*` -> `payments-srv`
- `/*` -> `client-srv`

## API Endpoints (Implemented)

### Auth (`auth`)

- `POST /api/users/signup`
- `POST /api/users/signin`
- `POST /api/users/signout`
- `GET /api/users/currentuser`

### Tickets (`tickets`)

- `POST /api/tickets` (auth required)
- `GET /api/tickets`
- `GET /api/tickets/:id`
- `PUT /api/tickets/:id` (auth + owner required)

### Orders (`orders`)

- `POST /api/orders` (auth required)
- `GET /api/orders` (auth required)
- `GET /api/orders/:orderId` (auth + owner required)
- `DELETE /api/orders/:orderId` (auth + owner required)

### Payments (`payments`)

- `POST /api/payments` (auth + valid order required)

## Event-Driven Flow (High Level)

1. Ticket is created -> `TicketCreated` event.
2. Order is created for ticket -> `OrderCreated` event.
3. Expiration service receives order event and schedules timeout.
4. If unpaid before timeout -> `ExpirationComplete` event.
5. Orders service marks order cancelled -> `OrderCancelled` event.
6. Ticket service frees reserved ticket.
7. If paid in time -> `PaymentCreated` event and order completes.

## Local Development Setup

### Prerequisites

- Docker Desktop
- Kubernetes enabled (or Minikube)
- Skaffold installed
- Ingress NGINX controller installed in cluster

### 1) Map local host

Add this entry to your hosts file:

```text
127.0.0.1 ticketing.dev
```

### 2) Create Kubernetes secrets

JWT secret:

```bash
kubectl create secret generic jwt-secret --from-literal=JWT_KEY="your_jwt_secret"
```

Stripe secret (required by payments service):

```bash
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY="your_stripe_secret"
```

### 3) Start everything with Skaffold

From repository root:

```bash
skaffold dev
```

Then open:

- `http://ticketing.dev`

## Testing

Each backend service has Jest tests.

Run tests from any service directory:

```bash
npm test
```

CI-friendly command (where available):

```bash
npm run test:ci
```

## Environment Variables

Common backend service variables:

- `JWT_KEY`
- `MONGO_URL`
- `NATS_CLIENT_ID`
- `NATS_URL`
- `NATS_CLUSTER_ID`

Payments service additionally requires:

- `STRIPE_KEY`

## Notes

- Service images in manifests use `patel005/*` naming.
- Redis manifest file is named `expirition-redis-depl.yaml` (spelling in filename).
- The `common` package is versioned and published as `@dj_ticketing/common`.

## License

See `LICENSE` for license details.
