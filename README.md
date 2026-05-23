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

- **Vercel**: See [docs/DEPLOYMENT-VERCEL.md](docs/DEPLOYMENT-VERCEL.md)
- **Render**: See [docs/DEPLOYMENT-RENDER.md](docs/DEPLOYMENT-RENDER.md)

## License

Proprietary — Kuber Property
