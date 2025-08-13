# Vercel Deployment Guide

This project is now configured for deployment on Vercel. Follow these steps to deploy:

## Prerequisites

1. **Vercel Account**: Create an account at [vercel.com](https://vercel.com)
2. **Vercel CLI** (optional): Install with `npm i -g vercel`

## Deployment Steps

### Option 1: Deploy via Git (Recommended)

1. **Push your code to a Git repository** (GitHub, GitLab, or Bitbucket)

2. **Connect to Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository
   - Vercel will automatically detect it's a Vite project

3. **Configure Environment Variables**:
   - In your Vercel project dashboard, go to Settings → Environment Variables
   - Add the following variables based on your needs:
     ```
     NODE_ENV=production
     JWT_SECRET=your-super-secret-jwt-key
     DATABASE_TYPE=file
     OPENAI_API_KEY=your-openai-key (optional)
     ```

4. **Deploy**: Vercel will automatically build and deploy your project

### Option 2: Deploy via CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Follow the prompts** to configure your deployment

## Configuration Files

The following files have been created/configured for Vercel:

- `vercel.json` - Main Vercel configuration
- `api/index.js` - Serverless function entry point for API routes
- `.vercelignore` - Files to exclude from deployment
- `.env.example` - Example environment variables

## How It Works

1. **Frontend**: Built with Vite and served as static files
2. **Backend**: Express server runs as Vercel serverless functions
3. **API Routes**: All `/api/*` requests are routed to the serverless function
4. **SPA Routing**: All other routes serve the React app for client-side routing

## Environment Variables

Set these in your Vercel dashboard under Settings → Environment Variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Set to "production" | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `DATABASE_TYPE` | Database type (file/mongodb/etc) | No |
| `OPENAI_API_KEY` | OpenAI API key for AI features | No |
| `EMAIL_SERVICE_API_KEY` | For email notifications | No |
| `WHATSAPP_API_KEY` | For WhatsApp notifications | No |
| `TELEGRAM_BOT_TOKEN` | For Telegram notifications | No |
| `SMS_API_KEY` | For SMS notifications | No |

## Build Process

The build process on Vercel:

1. Runs `npm install` to install dependencies
2. Runs `npm run build:vercel` which:
   - Builds the frontend with `npm run build:client`
   - Prepares the serverless function setup
3. Deploys the built frontend and API functions

## Troubleshooting

### Build Errors
- Check that all dependencies are in `package.json`
- Verify environment variables are set correctly
- Check Vercel build logs for specific errors

### API Not Working
- Verify `api/index.js` is present
- Check that server routes are properly imported
- Ensure environment variables are set in Vercel dashboard

### 404 Errors
- Check that routes are configured correctly in `vercel.json`
- Verify the SPA fallback is working for client-side routes

## Local Development

For local development, continue using:
```bash
npm run dev
```

The Vercel configuration only affects deployment, not local development.

## Support

If you encounter issues:
1. Check Vercel's deployment logs
2. Verify all required files are present
3. Ensure environment variables are correctly set
4. Test the build locally with `npm run build:vercel`
