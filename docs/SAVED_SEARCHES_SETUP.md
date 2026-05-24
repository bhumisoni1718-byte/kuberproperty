# Saved Searches & Email Alerts Setup

## Overview

The Saved Searches feature allows users to save their property search criteria and receive email notifications when new matching properties are added to the website.

## Features

- **Save Search Criteria**: Users can save their search filters (city, property type, price range, bedrooms, etc.)
- **Email Notifications**: Automated emails sent when new properties match saved search criteria
- **Manage Alerts**: Users can view, pause, resume, or delete their saved searches
- **Admin Access**: Protected route at `/account/saved-searches`

## Database Schema

```prisma
model SavedSearch {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  userId         String   @db.ObjectId
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name           String
  filters        Json
  email          String
  active         Boolean  @default(true)
  lastNotifiedAt DateTime?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

## API Endpoints

### GET /api/saved-searches
Get all saved searches for authenticated user

### POST /api/saved-searches
Create a new saved search
```json
{
  "name": "3BHK in Alkapuri under 50L",
  "email": "user@example.com",
  "filters": {
    "city": "Vadodara",
    "type": "Apartment",
    "bedrooms": "3",
    "maxPrice": "5000000"
  }
}
```

### PATCH /api/saved-searches/[id]
Update saved search (e.g., toggle active status)

### DELETE /api/saved-searches/[id]
Delete a saved search

### POST /api/check-saved-searches
**Protected endpoint** - Checks all active saved searches and sends email notifications for new matching properties.

**Authentication**: Requires `CRON_SECRET` in Authorization header

## Cron Job Setup

To enable automatic email notifications, set up a cron job to call the check endpoint:

### Vercel Cron Jobs

Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/check-saved-searches",
    "schedule": "0 */6 * * *"
  }]
}
```

This runs every 6 hours.

### Environment Variables Required

Add to your `.env`:
```
CRON_SECRET=your-secret-key-here
```

Use this in your cron job Authorization header:
```
Authorization: Bearer your-secret-key-here
```

### Alternative: External Cron Service

If not using Vercel Cron, use services like:
- **Cron-job.org** (free)
- **EasyCron** (free tier)
- **GitHub Actions** (workflow cron)

Example curl command:
```bash
curl -X POST https://your-domain.com/api/check-saved-searches \
  -H "Authorization: Bearer your-secret-key-here"
```

## Email Template

The email notification includes:
- Alert name
- Number of new matching properties
- Property cards with title, location, price
- Direct links to property pages
- Link to manage saved searches

## User Flow

1. User searches for properties on `/properties`
2. User clicks "Save Search" button
3. Dialog appears to enter alert name and email
4. Search is saved to database
5. Cron job runs periodically
6. New matching properties trigger email notification
7. User can manage alerts at `/account/saved-searches`

## Testing

### Manual Test
```bash
curl -X POST http://localhost:3000/api/check-saved-searches \
  -H "Authorization: Bearer your-secret-key-here"
```

### Create Test Saved Search
```bash
curl -X POST http://localhost:3000/api/saved-searches \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Alert",
    "email": "test@example.com",
    "filters": {
      "city": "Vadodara"
    }
  }'
```

## Notes

- Emails are sent via Resend service
- Only properties published after `lastNotifiedAt` are considered
- Maximum 10 properties per email notification
- Users can pause/resume alerts without deleting them
