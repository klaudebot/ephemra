# Ephemra

A social network where posts have a lifespan. Every post starts with 6 hours to live. Engagement extends its life. Reach 50 resonances and it becomes Eternal.

## The Concept

Traditional social media keeps everything forever. Ephemra flips this — content is ephemeral by default, and only the most resonant posts survive.

- **Posts decay** — Every post starts with a 6-hour lifespan
- **Engagement extends life** — Each resonance adds 30 minutes, each comment adds 15 minutes
- **Eternal posts** — Hit 50 resonances and a post becomes permanent
- **Whisper mode** — Post anonymously when you want to share without identity
- **Mood tagging** — Tag posts with moods (energetic, chill, thoughtful, creative, funny, vulnerable) and filter your feed by vibe

## Features

- Feed with filters (For You, Following, Eternal, Whispers) and mood-based filtering
- Resonance system (like/engagement mechanic that extends post life)
- Comments that also extend post life
- Direct messages with real-time polling
- User profiles with posts and eternal posts tabs
- Follow system
- Bookmarks
- Notifications with unread badge
- Search and explore with trending posts
- Media uploads (images and video, up to 10MB)
- S3-compatible storage (AWS S3, Cloudflare R2, MinIO, DigitalOcean Spaces)
- Anonymous whisper posts
- Post detail pages with 410 Gone for expired posts

## Tech Stack

- **Framework** — [Next.js 14](https://nextjs.org) with App Router
- **Language** — TypeScript
- **Database** — SQLite via [Prisma](https://prisma.io) (swappable to PostgreSQL)
- **Auth** — [NextAuth.js](https://next-auth.js.org) v4 with JWT + credentials
- **Styling** — [Tailwind CSS](https://tailwindcss.com)
- **Icons** — [Lucide](https://lucide.dev)
- **Storage** — Local filesystem or S3-compatible (configurable)
- **Validation** — [Zod](https://zod.dev)

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
git clone https://github.com/klaudebot/ephemra.git
cd ephemra
npm install
```

### Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Database (SQLite by default, switch to Postgres for production)
DATABASE_URL="file:./dev.db"

# NextAuth (generate a secret: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# S3 Storage (optional — falls back to local /public/uploads/)
S3_ENABLED="false"
S3_BUCKET=""
S3_REGION="us-east-1"
S3_ACCESS_KEY_ID=""
S3_SECRET_ACCESS_KEY=""
S3_ENDPOINT=""  # Leave empty for AWS S3, set for MinIO/R2/DO Spaces
```

### Database Setup

```bash
# Push schema to database
npx prisma db push

# Seed demo user (optional)
npm run db:seed

# View database in browser
npm run db:studio
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If you ran the seed, you can log in with:
- Email: `michael@apexrush.com`
- Password: `Password123@`

## S3 Storage Setup

Ephemra supports any S3-compatible storage provider for media uploads. When `S3_ENABLED` is `false`, files are stored locally in `/public/uploads/`.

### AWS S3

```env
S3_ENABLED="true"
S3_BUCKET="your-bucket-name"
S3_REGION="us-east-1"
S3_ACCESS_KEY_ID="AKIA..."
S3_SECRET_ACCESS_KEY="..."
```

### Cloudflare R2

```env
S3_ENABLED="true"
S3_BUCKET="your-bucket-name"
S3_REGION="auto"
S3_ACCESS_KEY_ID="..."
S3_SECRET_ACCESS_KEY="..."
S3_ENDPOINT="https://<account-id>.r2.cloudflarestorage.com"
```

### MinIO

```env
S3_ENABLED="true"
S3_BUCKET="ephemra"
S3_REGION="us-east-1"
S3_ACCESS_KEY_ID="minioadmin"
S3_SECRET_ACCESS_KEY="minioadmin"
S3_ENDPOINT="http://localhost:9000"
```

### DigitalOcean Spaces

```env
S3_ENABLED="true"
S3_BUCKET="your-space-name"
S3_REGION="nyc3"
S3_ACCESS_KEY_ID="..."
S3_SECRET_ACCESS_KEY="..."
S3_ENDPOINT="https://nyc3.digitaloceanspaces.com"
```

## Switching to PostgreSQL

1. Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ephemra"
```

3. Run migrations:

```bash
npx prisma db push
```

## Project Structure

```
src/
  app/
    (app)/              # Authenticated routes
      feed/             # Main feed with filters
      explore/          # Search and trending
      messages/         # DM conversations
      notifications/    # Notification center
      bookmarks/        # Saved posts
      profile/          # User profiles
      post/             # Post detail pages
      settings/         # User settings
    api/                # API routes
      auth/             # NextAuth + registration
      posts/            # CRUD, resonance, comments, bookmarks
      users/            # Profiles, follows
      messages/         # Direct messages
      notifications/    # Notification management
      search/           # User and post search
      trending/         # Trending content
      upload/           # Media upload
    login/              # Login page
    register/           # Registration page
  components/
    layout/             # AppShell, Sidebar, MobileNav
    posts/              # PostCard, ComposePost, CommentSection
  lib/
    auth.ts             # NextAuth configuration
    db.ts               # Prisma client
    s3.ts               # S3 upload utilities
    utils.ts            # Shared helpers
    constants.ts        # App constants and tuning
  types/
    index.ts            # TypeScript interfaces
prisma/
  schema.prisma         # Database schema
  seed.ts               # Database seeder
```

## Tuning Constants

Edit `src/lib/constants.ts` to adjust the core mechanics:

| Constant | Default | Description |
|---|---|---|
| `DEFAULT_LIFESPAN` | 6 hours | How long a post lives by default |
| `RESONANCE_TIME_BONUS` | 30 min | Time added per resonance |
| `COMMENT_TIME_BONUS` | 15 min | Time added per comment |
| `ETERNAL_THRESHOLD` | 50 | Resonances needed to become eternal |
| `MAX_POST_LENGTH` | 500 | Character limit for posts |
| `MAX_COMMENT_LENGTH` | 280 | Character limit for comments |

## Deploying to Vercel

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Set environment variables:
   - `DATABASE_URL` — `file:./dev.db` (SQLite) or a Postgres connection string
   - `NEXTAUTH_SECRET` — your secret key
   - `NEXTAUTH_URL` — your Vercel domain (e.g. `https://ephemra.vercel.app`)
4. Deploy

For production, use PostgreSQL instead of SQLite. SQLite works on Vercel for demos but data resets on each cold start since the database lives in `/tmp`.

## Demo

A live demo is available at [ephemra.vercel.app](https://ephemra.vercel.app).

Demo login:
- Email: `michael@apexrush.com`
- Password: `Password123@`

## License

[MIT](LICENSE)
