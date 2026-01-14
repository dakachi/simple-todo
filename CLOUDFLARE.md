# Cloudflare Pages Deployment Guide

This project is configured to deploy to Cloudflare Pages.

## Quick Deploy

### Option 1: Deploy via Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** → **Create a project**
3. Connect your Git repository (GitHub, GitLab, or Bitbucket)
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (or leave empty)
5. Click **Save and Deploy**

### Option 2: Deploy via Wrangler CLI

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Deploy to Cloudflare Pages:
   ```bash
   wrangler pages deploy dist
   ```

## Build Configuration

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: Vite + Vue 3

## Important Files

- `public/_redirects` - Handles SPA routing (redirects all routes to index.html)
- `wrangler.toml` - Cloudflare configuration
- `.cloudflare/pages.json` - Pages-specific settings

## Environment Variables

If you need to set environment variables:

1. In Cloudflare Dashboard: Go to your Pages project → Settings → Environment Variables
2. Via Wrangler: Use `wrangler pages secret put <KEY>`

## Custom Domain

1. Go to your Pages project → Custom domains
2. Add your domain and follow DNS configuration instructions

## Notes

- The `_redirects` file ensures all routes work correctly with Vue Router (if you add routing later)
- Build output is optimized for Cloudflare's CDN
- All static assets are automatically cached by Cloudflare
