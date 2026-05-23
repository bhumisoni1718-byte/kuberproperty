# Kuber Property — Luxury Real Estate Platform

Production-ready luxury real estate platform for **Kuber Property**, Vadodara & Gujarat.

## Tech Stack

- **Frontend**: Next.js 16 App Router, TypeScript, Tailwind CSS 4, ShadCN-style UI, Framer Motion
- **Backend**: Next.js API Routes & Server Actions
- **Database**: MongoDB Atlas + Prisma ORM
- **Auth**: Auth.js (NextAuth v5) with JWT & RBAC (Admin, Editor, Agent)
- **Media**: Cloudinary
- **Email**: Resend + React Email

## Quick Start

```bash
cd kuber-property
cp .env.example .env
# Edit .env with your MongoDB Atlas URL and secrets

npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Admin**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@kuberproperty.com | Admin@123 |
| Editor | editor@kuberproperty.com | Admin@123 |
| Agent | agent@kuberproperty.com | Admin@123 |

## Features

### Public Website
- Home, Properties, Property Details, Blog, About, Contact
- Area-wise landing pages (local SEO)
- Advanced property search & filters
- EMI calculator, WhatsApp/call CTAs
- JSON-LD structured data, sitemap, robots.txt, dynamic OG images

### Admin CMS
- Dashboard analytics
- Property & blog CRUD with draft/publish
- Lead management & CSV export
- Cloudinary image uploads
- SEO metadata per page

### Advanced (Client-side)
- Wishlist (`useWishlist`)
- Recently viewed (`useRecentlyViewed`)
- Search autocomplete API

## Project Structure

```
src/
├── app/              # Pages & API routes
├── actions/          # Server actions
├── components/       # UI & feature components
├── emails/           # React Email templates
├── hooks/            # Client hooks
└── lib/              # Utils, data, SEO, auth
prisma/
├── schema.prisma
└── seed.ts
docs/
├── DEPLOYMENT-VERCEL.md
└── DEPLOYMENT-RENDER.md
```

## Deployment

### Recommended: Vercel (All-in-One Deployment)

**Good news:** Your Next.js application can be deployed as a single unit on Vercel. The frontend and backend (API routes) are part of the same Next.js application, so they don't need separate deployments.

**What gets deployed together:**
- ✅ Frontend (React/Next.js pages)
- ✅ Backend (API routes & server actions)
- ✅ Static assets
- ✅ Edge functions

**Already cloud-hosted (no deployment needed):**
- ✅ MongoDB Atlas (database)
- ✅ Resend (email service)

### Quick Deploy to Vercel

1. **Push your code to GitHub** (already done)
2. **Go to [vercel.com](https://vercel.com)** and sign up/login
3. **Click "Add New Project"**
4. **Import your GitHub repository:** `bhumisoni1718-byte/kuberproperty`
5. **Configure environment variables** (copy from your local `.env`):
   ```
   DATABASE_URL
   AUTH_SECRET
   AUTH_URL
   RESEND_API_KEY
   RESEND_FROM_EMAIL
   RESEND_FALLBACK_FROM
   REPLY_TO_EMAIL
   LEAD_NOTIFICATION_EMAIL
   CLOUDINARY_CLOUD_NAME
   CLOUDINARY_API_KEY
   CLOUDINARY_API_SECRET
   NEXT_PUBLIC_APP_URL
   ```
6. **Click "Deploy"**

Vercel will automatically:
- Build your Next.js application
- Deploy it globally
- Set up SSL/HTTPS
- Provide a `.vercel.app` domain
- Handle continuous deployments on git push

### After Deployment

1. **Update your domain** (optional):
   - Add custom domain in Vercel dashboard
   - Update `NEXT_PUBLIC_APP_URL` and `AUTH_URL` environment variables

2. **Seed production database** (if needed):
   ```bash
   npx prisma db push
   npm run db:seed
   ```

3. **Verify email sending**:
   - Test contact form
   - Check Resend dashboard for delivery

### Alternative Platforms

- **Render**: See [docs/DEPLOYMENT-RENDER.md](docs/DEPLOYMENT-RENDER.md)
- **Railway**: Similar to Vercel, supports Next.js
- **Netlify**: Supports Next.js with some configuration

## License

Proprietary — Kuber Property
