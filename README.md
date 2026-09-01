# Stitchfolio — Embroidery Design, Repair & Custom Design Platform

A full-stack MERN application for browsing and purchasing embroidery designs, submitting files for
repair, and requesting completely custom designs — with secure Paystack payments and protected,
verified-purchase-only downloads.

## Features

**Customers**
- Registration, login, password reset, protected routes
- Design gallery: search, category/price filters, sort, pagination
- Secure checkout via Paystack, with server-side payment verification
- Protected downloads — files unlock only after a verified payment
- Repair Service: submit a file for repair, track status, download the repaired file
- Custom Design Request: submit requirements, review/accept a quotation, pay, and download the
  finished design
- Purchase history, download history, in-app notifications, profile/password settings

**Admins**
- Dashboard with platform-wide stats
- Design management: create/edit/publish/unpublish/delete, upload preview images and protected
  `.ENB` / `.EMX` / `.PNG` files
- Category management
- Customer management (view profiles, purchase/repair/custom-request history, suspend accounts)
- Order, payment, and download audit views
- Repair request management: review, comment, change status, upload the repaired file
- Custom design request management: review, send quotations, comment, change status, upload
  completed files and a preview image
- Reports: sales, most purchased designs, most requested categories, average repair completion
  time, filterable by date range

## Technology Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router, Axios, Framer Motion, Lucide React
- **Backend:** Node.js, Express.js, JWT auth, bcryptjs, Multer
- **Database:** MongoDB + Mongoose
- **Payments:** Paystack (initialize + server-side verify)

## Project Structure

```
embroidery-platform/
├── frontend/           React app (Vite)
│   ├── public/assets/images/designs/   ← public preview images go here
│   └── src/
│       ├── components/ (common, layout, design, repair, custom-design, admin)
│       ├── pages/      (public, auth, customer, admin)
│       ├── layouts/, routes/, services/, hooks/, context/, constants/, utils/
├── backend/
│   ├── src/
│   │   ├── config/, controllers/, middleware/, models/, routes/, services/, validators/, utils/
│   │   ├── uploads/repairs/                        ← customer repair uploads (protected)
│   │   └── storage/
│   │       ├── design-files/{enb,emx,png}/         ← protected purchased design files
│   │       └── custom-designs/{references,completed}/  ← protected custom-design files
│   └── .env.example
└── README.md
```

## Getting Started

### 1. Install dependencies
```bash
npm run install:all
```

### 2. Configure environment variables
Copy `backend/.env.example` to `backend/.env` and fill in:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/embroidery-platform
JWT_SECRET=replace_this_with_a_long_random_string
JWT_EXPIRES_IN=7d
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLIENT_URL=http://localhost:5173
```

- **MongoDB:** run locally (`mongod`) or use a hosted URI (e.g. MongoDB Atlas).
- **Paystack:** create a free account at [paystack.com](https://paystack.com), grab your **test**
  secret/public keys from the dashboard. Test-mode payments use Paystack's published test cards.

### 3. Seed the database
```bash
npm run seed
```
Creates:
- Admin account: `admin@stitchfolio.com` / `Admin@12345` (**change this password immediately**)
- Sample customer: `customer@stitchfolio.com` / `Customer@12345`
- 13 sample categories
- 4 sample designs (see note on preview images below)

### 4. Run the app
```bash
npm run dev:backend    # http://localhost:5000
npm run dev:frontend   # http://localhost:5173
```

## Adding Design Preview Images

Public preview images live in `frontend/public/assets/images/designs/`. Drop PNG/JPEG/WEBP files
there and reference them from the admin Design form (or directly in the database for seed data).
The seed script creates sample designs that reference filenames like `floral-001.png` — add actual
image files with those names, or re-create the designs through the admin panel with real uploads.

**Never** place purchased/protected embroidery files (`.ENB`/`.EMX`/`.PNG` deliverables) in this
folder — they belong in `backend/src/storage/design-files/`, served only through the authenticated
download endpoint.

## How Protected Downloads Work

This is the platform's core security guarantee:

1. A customer buys a design → an `Order` is created (`status: pending`).
2. Checkout redirects to Paystack; on return, the frontend calls the verify endpoint.
3. The **backend** re-checks the transaction directly against Paystack's API and confirms the
   amount matches — the frontend's claim that payment succeeded is never trusted on its own.
4. Only once verification succeeds does `Order.status` become `paid`.
5. The download endpoint checks, in order: file exists → user has a `paid` order for that specific
   design → file exists on disk — before streaming anything. Every download is logged.

The same pattern is used for custom design request payments and completed-file delivery.

## Admin Setup

After seeding, log in with the admin account and go to `/admin`. From there you can publish
designs, manage categories, and handle repair/custom-design requests. To promote another account to
admin, update its `role` field to `"admin"` directly in MongoDB (no self-service promotion is
exposed via the API, by design).

## API Overview

All routes are mounted under `/api`:

| Prefix | Purpose |
|---|---|
| `/auth` | register, login, logout, me, forgot/reset password |
| `/users` | profile self-service (update profile, change password) |
| `/designs`, `/categories` | public gallery browsing |
| `/orders`, `/payments`, `/downloads` | purchase flow |
| `/repairs` | repair request submission & tracking |
| `/custom-designs` | custom design request workflow |
| `/notifications` | in-app notifications |
| `/admin/*` | all admin-only management endpoints |

See the route files under `backend/src/routes/` for the full list of endpoints.

## Security

- Passwords hashed with bcrypt; JWT auth via httpOnly cookie + bearer token fallback
- Role-based authorization middleware (`protect`, `authorize('admin')`)
- Input validation on every mutating endpoint (express-validator)
- `express-mongo-sanitize` and `xss-clean` against injection/XSS
- Rate limiting (global + tighter limits on auth and payment verification)
- File uploads validated by MIME type / extension, size-limited, stored under randomized filenames
- Public preview images and protected purchased files are stored in physically separate,
  never-overlapping directories
- Centralized error handler — no stack traces are ever returned to the client
- `.env` is gitignored; secrets are never logged or returned in API responses

## Deployment Notes

- Set `NODE_ENV=production` and use real (live-mode) Paystack keys in production.
- Serve `frontend` as a static build (`npm run build` → deploy `frontend/dist`) behind a CDN/host of
  your choice, and point `CLIENT_URL` in the backend `.env` at that production origin.
- Run the backend behind a process manager (PM2, systemd, or a container orchestrator) with HTTPS
  termination in front of it.
- Persist `backend/src/storage/` and `backend/src/uploads/` on durable storage (a mounted volume or
  object storage adapter) in any multi-instance or ephemeral-filesystem deployment.
- Back up MongoDB regularly; the `Order`/`Payment`/`Download` collections are your financial and
  audit record.
