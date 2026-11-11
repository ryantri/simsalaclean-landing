# Simsalaclean — Vercel Deployment Setup

## Project Configuration

This is a **static HTML/CSS/JavaScript project** with no build process.

### Build Settings

| Setting | Value |
|---------|-------|
| **Framework** | Static Site |
| **Build Command** | (Empty) |
| **Install Command** | (Empty) |
| **Output Directory** | `.` (root) |
| **Root Directory** | `./` |
| **Node.js Required** | No |
| **Dependencies** | None |

---

## Environment Variables Required

### `REACT_APP_GOOGLE_APPS_SCRIPT_URL`

- **What it is:** URL of the Google Apps Script Web App deployment
- **Where it's used:** `script.js` sends form data to this URL
- **Format:** `https://script.google.com/macros/s/[SCRIPT_ID]/exec`
- **Status:** ⏳ **User must configure in Vercel**

### How to Get the Value

1. Open Google Apps Script project
2. Click **Deploy** → **Manage deployments**
3. Find Web App deployment (should have `/exec` in URL)
4. Copy the full URL
5. Add to Vercel Project Settings → Environment Variables

Example (do not use — get your own):
```
https://script.google.com/macros/s/AKfycbym9Wcoo8KHjoxO9n0Ep7w8cChljp3m0E-2nK3DJg3DRVVMaQTIDnXqo1SrREzDhcKM/exec
```

---

## Step-by-Step Deployment

### 1. Create Vercel Account & Sign In

- Go to https://vercel.com
- Click "Sign Up" or "Sign In"
- Choose "Continue with GitHub"
- Authorize Vercel to access your GitHub account

### 2. Import Project from GitHub

1. After logging in, click "Add New" → "Project"
2. Click "Import Git Repository"
3. Search for `ryantri/simsalaclean-landing`
4. Click "Import"

### 3. Configure Project

Vercel should auto-detect settings. Verify:

**Settings to Check:**
- Framework: Static (or None/Other)
- Build Command: Leave empty
- Install Command: Leave empty
- Output Directory: Leave empty
- Root Directory: `./`

### 4. Add Environment Variable

1. Go to **Settings** → **Environment Variables**
2. Click "Add New"
3. Fill in:
   - **Name:** `REACT_APP_GOOGLE_APPS_SCRIPT_URL`
   - **Value:** Your Google Apps Script URL (from "How to Get the Value" section above)
   - **Environments:** ☑ Production ☑ Preview ☑ Development

4. Click "Save"

### 5. Deploy

1. Click "Deploy" button
2. Wait for deployment to complete (should be instant)
3. You'll see "Success! Your site is live"
4. Click the production URL to visit your landing page

### 6. Test the Form

1. Load the landing page at your Vercel URL
2. Scroll to the form
3. Fill in:
   - Full Name: Test name
   - Instagram Username: testuser123
4. Click "Daftar Early Access"
5. You should see:
   - Loading spinner on button
   - Thank You modal after submission
6. Check your Google Sheets to verify data was saved

---

## Vercel Project URLs

After successful deployment:

| URL Type | Value |
|----------|-------|
| **Production URL** | `https://simsalaclean-landing.vercel.app` |
| **Project Dashboard** | `https://vercel.com/dashboard` |
| **Settings** | `https://vercel.com/[project-name]/settings` |

You can also add a custom domain in Vercel Settings.

---

## Auto-Deployment from GitHub

Once deployed, Vercel will:

- ✅ Watch your `main` branch on GitHub
- ✅ Auto-deploy on every push to `main`
- ✅ Create preview URLs for Pull Requests
- ✅ Automatically rollback if something goes wrong

### How It Works

```
You: git push origin main
    ↓
GitHub: Receives push to main branch
    ↓
Vercel Webhook: Triggered
    ↓
Vercel: Starts build & deployment
    ↓
Vercel: Site goes live
    ↓
You: Visit https://simsalaclean-landing.vercel.app
```

---

## Troubleshooting

### Form Submission Not Working

**Symptoms:** Form button doesn't respond, or shows "Failed to fetch"

**Solutions:**
1. Check browser console (F12 → Console tab)
2. Verify environment variable is set in Vercel Settings
3. Confirm Google Apps Script Web App is still deployed
4. Test the URL in browser to ensure it's accessible

### Page Shows 404

**Symptoms:** Vercel shows "404 Page Not Found"

**Solutions:**
1. Check Vercel build logs
2. Verify `index.html` exists in repository root
3. Confirm framework is set to "Static"
4. Try clearing browser cache

### Styles Not Loading

**Symptoms:** Page loads but styling is missing

**Solutions:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Verify `styles.css` is in repository root
3. Check Network tab in DevTools for failed CSS requests
4. Try incognito/private mode

### Build Failed

**Symptoms:** Deployment shows "Build Failed"

**Solutions:**
1. Check build logs in Vercel dashboard
2. For static sites, builds should be instant with no commands
3. Verify all files are in repository root
4. Ensure no `package.json` conflicts

---

## Security Checklist

✅ **Already Implemented:**
- Environment variable stored in Vercel (not in code)
- `.env.local` not committed to repository
- No secrets in source code
- Static site (no backend vulnerabilities)

⚠️ **Monitor:**
- Google Apps Script URL remains valid
- Check Vercel logs for suspicious activity
- Verify Google Sheets access permissions

---

## Custom Domain (Optional)

To use a custom domain (e.g., `simsalaclean.com`):

1. Go to Vercel Project Settings → Domains
2. Enter your custom domain
3. Follow DNS configuration instructions
4. DNS changes may take 24-48 hours to propagate

---

## Analytics & Monitoring

After deployment, you can monitor:

1. **Vercel Dashboard:**
   - Build status
   - Deployment history
   - Performance metrics
   - Error logs

2. **Form Submissions:**
   - Check Google Sheets directly
   - Verify timestamps match user actions

3. **Browser Errors:**
   - Monitor console for JavaScript errors
   - Check Network tab for failed requests

---

## Rollback to Previous Version

If something breaks:

1. Go to Vercel Project Dashboard
2. Click "Deployments"
3. Find previous working version
4. Click "Promote to Production"

---

## Important Links

- **Repository:** https://github.com/ryantri/simsalaclean-landing
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Project Settings:** https://vercel.com/[project-name]
- **Google Apps Script:** https://script.google.com

---

## Summary

✅ **Ready for Deployment!**

1. ✅ Framework: Static site (no build needed)
2. ✅ Repository: Connected to GitHub
3. ✅ Environment: Pre-configured
4. ⏳ **Next:** Set environment variable in Vercel & deploy

**Estimated time to live:** < 5 minutes

---

Last Updated: November 11, 2026
