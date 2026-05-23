# Deploy Kuber Property Backend on Vercel

## Prerequisites

- MongoDB Atlas cluster with connection string
- Cloudinary, Resend, and Auth credentials configured

## Steps

1. Push the `kuber-property` repository to GitHub.

2. Import the project in [Vercel](https://vercel.com):
   - Framework Preset: **Next.js**
   - Root Directory: `kuber-property` (if monorepo)

3. Add environment variables (Production & Preview):

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MongoDB Atlas connection string |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_URL` | `https://your-domain.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | Same as AUTH_URL |
| `CLOUDINARY_*` | Cloudinary credentials |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | Verified sender |
| `ADMIN_EMAIL` | Admin notification email |

4. Build settings:
   - Build Command: `npx prisma generate && npm run build`
   - Install Command: `npm install`

5. After first deploy, run seed against production DB (locally):
   ```bash
   DATABASE_URL="your-atlas-url" npx tsx prisma/seed.ts
   ```

6. Enable ISR: pages use `revalidate` — Vercel handles caching automatically.

## API Routes on Vercel

All `/api/*` routes are serverless functions. Rate limiting uses in-memory store (per instance); for production scale, use Upstash Redis.

## Custom Domain

Add domain in Vercel → update `AUTH_URL` and `NEXT_PUBLIC_APP_URL`.
