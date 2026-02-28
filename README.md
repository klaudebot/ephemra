# Ephemra

**The Ephemeral Social Network** — Where moments live & breathe.

Posts have a lifespan. Engagement keeps them alive. The best become Eternal.

## The Concept

Ephemra reimagines social media with a simple but powerful idea: **every post has a heartbeat**. When you share a moment, it starts with 6 hours of life. Each resonance (like) adds 30 minutes. Each comment adds 15 minutes. If a post reaches 50 resonances, it becomes **Eternal** — permanently preserved.

This creates natural content curation where quality rises and noise fades.

### Features

- **Living Posts** — Visual life ring shows how much time remains
- **Resonance System** — Not likes, but resonances that extend a post's life
- **Eternal Status** — Posts that reach 50 resonances become permanent
- **Mood-Based Feed** — Tag posts with vibes (energetic, chill, creative, thoughtful, etc.)
- **Whisper Mode** — Share anonymously for vulnerable moments
- **S3-Compatible Storage** — Configure AWS S3, MinIO, Cloudflare R2, or DigitalOcean Spaces
- **Self-Hostable** — Full control over your data

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
# Clone
git clone https://github.com/your-username/ephemra.git
cd ephemra

# Install
npm install

# Setup database
cp .env.example .env
npx prisma db push
npx tsx prisma/seed.ts

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Sample Login:** `michael@apexrush.com` / `Password123@`

## S3 Storage Configuration

By default, media uploads are stored locally. To use S3-compatible storage:

```env
S3_ENABLED=true
S3_BUCKET=your-bucket-name
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key

# For non-AWS providers (MinIO, R2, DO Spaces):
S3_ENDPOINT=https://your-endpoint.com
```

## Production Deployment

### Vercel

1. Push to GitHub
2. Import in Vercel
3. Set environment variables
4. For production, switch to Postgres:
   ```env
   DATABASE_URL="postgresql://..."
   ```

### Self-Hosted

```bash
npm run build
npm start
```

## License

MIT — Use it, modify it, host it. Built for the community.
