# Deploy Kuber Property Frontend on Render

Render can host the full Next.js app for SEO-optimized static/SSR delivery.

## Web Service Setup

1. Create a new **Web Service** on [Render](https://render.com).

2. Connect your Git repository.

3. Configure:
   - **Environment**: Node
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: 20.x

4. Environment variables (same as Vercel — see `DEPLOYMENT-VERCEL.md`).

5. Set `NEXT_PUBLIC_APP_URL` to your Render URL (e.g. `https://kuber-property.onrender.com`).

## SEO Considerations

- Enable **Auto-Deploy** from main branch.
- Use a custom domain with HTTPS for canonical URLs.
- Submit `https://yourdomain.com/sitemap.xml` to Google Search Console.

## Split Architecture (Optional)

| Layer | Platform |
|-------|----------|
| Next.js App (full stack) | Render Web Service |
| MongoDB | Atlas |
| Media CDN | Cloudinary |
| Email | Resend |

For API-heavy workloads, deploy API on Vercel and frontend on Render only if you split services; the default monolith works on either platform.

## Health Check

Render health check path: `/` (homepage returns 200).

## Performance

- Enable Render's CDN for static assets.
- Set `revalidate` on pages for ISR-compatible caching.
