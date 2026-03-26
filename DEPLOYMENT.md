# Stragra Deployment Guide

This guide walks you through deploying the Stragra monorepo to Vercel with Supabase backend.

## Prerequisites

- Vercel account (vercel.com)
- Supabase account (supabase.com)
- Domain: www.stragra.com (configured in your domain registrar)
- Git repository pushed to GitHub/GitLab/Bitbucket

---

## Step 1: Set Up Supabase Project

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Enter project details:
   - **Name:** stragra-production
   - **Database Password:** Generate a strong password (save it securely)
   - **Region:** US West (N. California) - closest to Vercel's sfo1 region
4. Click "Create new project"
5. Wait for project initialization (2-3 minutes)

### 1.2 Get Supabase Credentials

1. In your Supabase project dashboard, go to **Project Settings** (gear icon)
2. Click **API** in the left sidebar
3. Copy these values:
   - **Project URL** (e.g., `https://xxxxxx.supabase.co`)
   - **anon public** key (starts with `eyJhbG...`)
   - **service_role secret** key (⚠️ Keep this secure - never expose to client)

Save these for Step 2.

### 1.3 Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Copy the contents of `packages/supabase/migrations/001_init.sql`
4. Paste into the SQL Editor
5. Click **Run** (or Ctrl+Enter)
6. Verify tables were created:
   - Go to **Table Editor** (left sidebar)
   - You should see: `agencies`, `agents`, `agent_metrics`, `tasks`, `escalations`, `todos`, `quick_links`

### 1.4 Configure Authentication

1. Go to **Authentication** → **Providers** (left sidebar)
2. Enable **Email** provider (enabled by default)
   - Configure email templates if desired
3. (Optional) Enable **Google** OAuth:
   - Toggle Google provider ON
   - Add your Google OAuth credentials (Client ID, Client Secret)
   - Set Authorized Redirect URI: `https://www.stragra.com/auth/callback`
4. Go to **URL Configuration**:
   - Site URL: `https://www.stragra.com`
   - Redirect URLs: Add `https://www.stragra.com/*`

---

## Step 2: Deploy to Vercel

### 2.1 Import Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New...** → **Project**
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Select the `stragra` repository

### 2.2 Configure Project Settings

1. **Framework Preset:** Next.js (should auto-detect)
2. **Root Directory:** `./` (monorepo root)
3. **Build Command:** `pnpm turbo build --filter=web`
4. **Output Directory:** `apps/web/.next`

### 2.3 Add Environment Variables

Click **Environment Variables** and add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

> ⚠️ **Security Note:** 
> - `NEXT_PUBLIC_` prefix exposes variables to browser (safe for anon key)
> - `SUPABASE_SERVICE_ROLE_KEY` has admin privileges - never expose to client

Click **Deploy** and wait for build to complete (2-5 minutes).

---

## Step 3: Configure Custom Domain (www.stragra.com)

### 3.1 Add Domain in Vercel

1. In Vercel dashboard, select your project
2. Go to **Settings** → **Domains**
3. Enter: `www.stragra.com`
4. Click **Add**

### 3.2 Configure DNS Records

Vercel will display DNS configuration options. Choose one:

#### Option A: A Record (Recommended)

In your domain registrar's DNS settings, add:

```
Type: A
Name: www
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

#### Option B: CNAME Record

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

### 3.3 Verify Domain

1. Wait for DNS propagation (5-60 minutes)
2. In Vercel dashboard, the domain status should show **Valid Configuration** with green checkmark
3. Visit `https://www.stragra.com` to verify

---

## Step 4: Verify HTTPS

### 4.1 Automatic HTTPS

Vercel automatically provisions SSL certificates via Let's Encrypt:

1. No manual action required
2. Certificate is auto-renewed
3. Force HTTPS is enabled by default (redirects HTTP to HTTPS)

### 4.2 Verify SSL

1. Visit `https://www.stragra.com`
2. Check browser address bar:
   - Should show 🔒 lock icon
   - Certificate should be valid
   - Click lock → "Connection is secure"

### 4.3 Test HTTP Redirect

Visit `http://www.stragra.com` - it should automatically redirect to `https://www.stragra.com`

---

## Step 5: Post-Deployment Verification

### 5.1 Test Authentication

1. Go to `https://www.stragra.com`
2. Try signing up with email/password
3. Check Supabase **Authentication** → **Users** to verify user was created

### 5.2 Test Dashboard

1. After login, navigate to `/dashboard`
2. Verify:
   - Pie chart displays correctly
   - Agent sidebar loads
   - Widgets (Calendar, Todo, Quick Links) appear
   - Can add/edit todos
   - Can add quick links

### 5.3 Test File Explorer

1. Navigate to `/files`
2. Test file operations:
   - Create folder
   - Upload file (drag-drop or click)
   - Preview file
   - Download file
   - Share file (generate link)

### 5.4 Verify Environment Variables

In Vercel dashboard:
1. Go to **Settings** → **Environment Variables**
2. Confirm all 3 Supabase variables are set
3. Redeploy if you made any changes: **Deployments** → **Redeploy**

---

## Troubleshooting

### Build Failures

**Error:** `Module not found: @stragra/dashboard-ui`

**Solution:** 
```bash
# Local fix
pnpm install
pnpm turbo build

# In Vercel:
# Ensure Build Command is: pnpm turbo build --filter=web
```

### Database Connection Issues

**Error:** `Invalid Supabase URL` or `network error`

**Solution:**
1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct (includes https://)
2. Check Supabase project is active (not paused)
3. Ensure RLS policies allow your operations

### Domain Not Working

**Error:** `DNS_PROBE_FINISHED_NXDOMAIN` or `This site can't be reached`

**Solution:**
1. Wait longer for DNS propagation (up to 24 hours)
2. Verify DNS records in your registrar match Vercel's instructions
3. Use `dig www.stragra.com` or online DNS checker to verify propagation

### CORS Errors

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:**
1. In Supabase dashboard, go to **API** → **URL Configuration**
2. Add your production URL to **Allowed Origins**: `https://www.stragra.com`

---

## Maintenance

### Updating Environment Variables

1. Vercel dashboard → **Settings** → **Environment Variables**
2. Edit or add variables
3. **Redeploy** for changes to take effect

### Database Migrations (Future Updates)

For schema changes after initial deployment:

1. Create new migration file: `packages/supabase/migrations/002_xxx.sql`
2. Apply via Supabase SQL Editor (same as Step 1.3)
3. Or use Supabase CLI for automated migrations:
   ```bash
   npx supabase db push
   ```

### Monitoring

- **Vercel Analytics:** Built-in Web Vitals monitoring
- **Supabase Dashboard:** Database metrics, API usage, Auth logs
- **Custom:** Add Sentry or LogRocket for error tracking

---

## Quick Reference

| Resource | URL |
|----------|-----|
| Production Site | https://www.stragra.com |
| Vercel Dashboard | https://vercel.com/dashboard |
| Supabase Dashboard | https://supabase.com/dashboard |
| DNS Check | https://dnschecker.org |

---

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
