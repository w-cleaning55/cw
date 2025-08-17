# Deployment Guide for Cleaning World Pro

## Quick Deploy to Vercel

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import this repository
   - Vercel will auto-detect it as a Next.js project

2. **Environment Variables:**
   Set these in Vercel dashboard under Settings → Environment Variables:
   ```
   NEXT_PUBLIC_BUILDER_KEY=your_builder_key_here
   JWT_SECRET=your_secure_jwt_secret_here
   PING_MESSAGE="ping pong"
   ```

3. **Deploy:**
   - Vercel will automatically build and deploy
   - Domain will be provided automatically
   - Each push to main branch triggers auto-deployment

## Environment Variables Explained

- `NEXT_PUBLIC_BUILDER_KEY`: Builder.io API key (public, exposed to browser)
- `JWT_SECRET`: Secret for JWT token signing (server-side only)
- `PING_MESSAGE`: Simple API response message

## Build Configuration

- Framework: Next.js 15.4.6
- Node.js: >=18.17.0
- Build command: `npm run build`
- Output: Optimized for Vercel's platform

## Features Ready for Production

✅ Optimized bundle size
✅ Tree-shaking enabled  
✅ Image optimization
✅ Security headers
✅ Performance monitoring
✅ Error boundaries
✅ SEO optimization
✅ Mobile responsive
✅ Arabic RTL support
✅ Dark/light theme

## Manual Deployment Steps

If not using auto-deployment:

1. `npm install`
2. `npm run build`
3. `npm run start`

## Troubleshooting

- **Build timeout**: Vercel builds can take 5-10 minutes for large projects
- **Environment variables**: Ensure they're set in Vercel dashboard
- **Domain issues**: Check Vercel domain settings
- **API routes**: All API routes are automatically deployed

## Performance

- First load: Optimized with dynamic imports
- Bundle size: Optimized with tree-shaking
- Images: Auto-optimized WebP/AVIF
- Caching: Automatic via Vercel's CDN
