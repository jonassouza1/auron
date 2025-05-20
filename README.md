# 🛒 Auron — E-commerce with Next.js + Checkout Pro + User Points System

Modern e-commerce project built with **Next.js (App Router)** and integrated with **Mercado Pago Checkout Pro**, featuring a user points system, SSR rendering for performance, and full CI/CD with GitHub Actions.

> Hosted on **Vercel** with **GitHub integration** for automatic deployment and preview environments.

---

## 🚀 Tech Stack

### Frontend & Backend

- **Next.js 15 (App Router)**
  - Server-Side Rendering (SSR)
  - `getServerSideProps` for preloading
- **React 19**
- **Tailwind CSS** for styling
- **React Hook Form + Zod** for form handling and validation
- **Lucide-react** for icons

### Authentication & Security

- **JWT + jose** for secure sessions
- Token expiration & validation
- Protected routes for logged-in users

### Database & Migrations

- **PostgreSQL**
- **node-pg-migrate** for migration versioning
- Tables: `users`, `products`, `orders`, `points`, etc.

### Payments

- **Mercado Pago (Checkout Pro)**
  - Webhook integration
  - Support for **automated shipping (ME2)**
  - Secure redirect and checkout form

### DevOps & Quality

- **GitHub Actions** for CI/CD and test automation
- **Vercel Preview Deploys**
- **Husky + Commitlint** enforcing Conventional Commits
- **Docker Compose** for local infrastructure
- **Prettier + ESLint** for code formatting and linting

### Others

- **Nodemailer** for email notifications to the seller
- **Concurrently** for running parallel dev/test processes
- **Async Retry** for reliable service startup
- **UUID** for unique identifiers

---

## 🔐 Authentication Features

- Complete **login/session system using JWT**
- Logged-in users:
  - Access a **points dashboard**
  - Earn points on purchases
  - View personal profile
- Guests:
  - Can purchase without authentication (no points awarded)

---

## 🛒 Shopping Cart

- Global state management
- Persistent state after page reload
- Prevents duplicate item clicks
- Auto-updates product quantities

---

## 💳 Mercado Pago Integration

- Generates **payment preferences**
- Redirects to **Checkout Pro**
- Webhook receives payment confirmation
- Support for **Mercado Envios (ME2)** shipping automation
- Sends email to the **seller** after purchase confirmation

---

## 🧪 Testing

- **Jest** for unit and integration tests
- GitHub Actions runs tests on every push
- Run locally with:

````bash
npm run test
---


## 🛠️ Useful Scripts

These scripts are defined in the `package.json` file and simplify development tasks.

| Script Name                        | Description                                                                 |
|-----------------------------------|-----------------------------------------------------------------------------|
| `dev`                             | Runs the full dev environment: Docker + Next.js + DB migrations             |
| `test`                            | Runs Jest tests and Next.js tests together                                  |
| `test:watch`                      | Watches for file changes and re-runs tests                                  |
| `services:up`                     | Starts Docker services like PostgreSQL via Compose                          |
| `services:down`                   | Stops and removes Docker containers                                         |
| `services:stop`                   | Stops containers without removing them                                      |
| `services:wait:database`         | Waits until the database is ready (used on startup)                         |
| `migrations:up`                   | Applies any pending SQL migrations                                          |
| `lint`                            | Runs ESLint to catch code issues                                            |
| `lint:prettier:check`            | Checks if code is properly formatted with Prettier                          |
| `lint:prettier:fix`              | Auto-formats code using Prettier                                            |
| `commit`                          | Starts commit wizard (Conventional Commits via Commitizen)                 |

> 💡 Combine with `concurrently` to run scripts in parallel.

---

## 🔄 Typical Dev Flow

```bash
npm run services:up              # Start PostgreSQL
npm run migrations:up            # Apply DB migrations
npm run dev                      # Start Next.js with everything


````
