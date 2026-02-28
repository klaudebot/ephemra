# Ephemra

**The Ephemeral Social Network** — Where moments live & breathe.

Posts have a lifespan. Engagement keeps them alive. The best become Eternal.

## The Concept

Ephemra reimagines social media with a simple but powerful idea: **every post has a heartbeat**. When you share a moment, it starts with 6 hours of life. Each resonance adds 30 minutes. Each comment adds 15 minutes. If a post reaches 50 resonances, it becomes **Eternal** — permanently preserved.

This creates natural content curation where quality rises and noise fades.

## Features

### Core
- **Living Posts** — Visual life ring shows how much time remains
- **Resonance System** — Not likes, but resonances that extend a post's life
- **Eternal Status** — Posts reaching 50 resonances become permanently preserved
- **Mood-Based Feed** — Tag posts with vibes (energetic, chill, creative, thoughtful, funny, vulnerable)
- **Whisper Mode** — Share anonymously for vulnerable moments

### Social
- **Direct Messages** — Real-time private conversations with polling
- **Follow System** — Follow users and filter feed to following-only
- **User Profiles** — With active/eternal post tabs, follower counts, message button
- **Notifications** — Resonances, comments, follows, eternal achievements with badge counts

### Discovery
- **Explore Page** — Search users and posts, trending moments, mood distribution
- **Trending** — Most-resonated posts in the last 24 hours
- **Suggested Users** — People to follow based on popularity

### Technical
- **S3-Compatible Storage** — Configure AWS S3, MinIO, Cloudflare R2, or DigitalOcean Spaces
- **Self-Hostable** — Full control over your data
- **Responsive Design** — Mobile-first with bottom nav, desktop with sidebar
- **Glassmorphic Dark UI** — Modern design with animations and micro-interactions
- **Post Detail Pages** — Dedicated view with engagement stats
- **Bookmarks** — Save moments to revisit later
- **Media Uploads** — Images and video with 10MB limit

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** with custom design system
- **Prisma** with SQLite (swap to Postgres for production)
- **NextAuth.js** for authentication
- **Framer Motion** for animations
- **AWS SDK** for S3-compatible storage

## Quick Start

```bash
git clone https://github.com/klaudebot/ephemra.git
cd ephemra
npm install
cp .env.example .env
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Sample Login:** `michael@apexrush.com` / `Password123@`

## S3 Storage Configuration

By default, media uploads are stored locally in `/public/uploads/`. To use S3-compatible storage:

```env
S3_ENABLED=true
S3_BUCKET=your-bucket-name
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key

# For non-AWS providers (MinIO, R2, DO Spaces):
S3_ENDPOINT=https://your-endpoint.com
```

Supported providers:
- **AWS S3** — Leave S3_ENDPOINT empty
- **Cloudflare R2** — Set S3_ENDPOINT to your R2 endpoint
- **DigitalOcean Spaces** — Set S3_ENDPOINT to your Spaces endpoint
- **MinIO** — Set S3_ENDPOINT to your MinIO server URL

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Set environment variables (see `.env.example`)
4. For production, switch to Postgres: `DATABASE_URL="postgresql://..."`

### Self-Hosted

```bash
npm run build
npm start
```

## Architecture

```
src/
├── app/
│   ├── (app)/            # Authenticated routes
│   │   ├── feed/         # Main feed with mood filtering
│   │   ├── explore/      # Search and trending
│   │   ├── messages/     # Direct messaging
│   │   ├── notifications/# Notification center
│   │   ├── profile/      # User profiles
│   │   ├── post/         # Post detail view
│   │   ├── bookmarks/    # Saved posts
│   │   └── settings/     # User settings
│   ├── api/              # API routes
│   ├── login/            # Auth pages
│   └── register/
├── components/
│   ├── layout/           # Sidebar, MobileNav, AppShell
│   └── posts/            # PostCard, ComposePost, CommentSection
├── lib/                  # Auth, DB, S3, utilities
└── types/                # TypeScript types
```

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT — Use it, modify it, host it. Built for the community.
