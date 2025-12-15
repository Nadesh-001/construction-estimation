# Cloudflare Pages - Quick Deployment Guide

## ✅ Files Prepared
- `public/` - Frontend files ready for deployment
- `public/js/config.js` - API configuration (update backend URL)
- `cloudflare.toml` - Cloudflare Pages configuration

## 🚀 Deployment Steps

### Step 1: Update API Configuration
Before deploying, update the backend URL in `public/js/config.js`:
```javascript
const API_BASE_URL = 'https://your-backend.onrender.com';
```

### Step 2: Update API Calls in JavaScript Files
Your JavaScript files need to use the `API_BASE_URL` from config.js. Make sure to:
1. Include `config.js` in your HTML before other scripts
2. Update all fetch calls to use `API_BASE_URL`

### Step 3: Commit and Push to GitHub
```bash
git add .
git commit -m "Prepare for Cloudflare Pages deployment"
git push origin main
```

### Step 4: Deploy to Cloudflare Pages

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com
   - Sign in or create account

2. **Create New Pages Project**
   - Click **Workers & Pages** → **Create application**
   - Select **Pages** tab
   - Click **Connect to Git**

3. **Connect GitHub Repository**
   - Authorize Cloudflare to access GitHub
   - Select repository: `Nadesh-001/construction-estimation`

4. **Configure Build Settings**
   - **Project name**: `construction-estimation`
   - **Production branch**: `main`
   - **Build command**: Leave empty (or `echo "No build needed"`)
   - **Build output directory**: `public`
   - **Root directory**: `/`

5. **Deploy**
   - Click **Save and Deploy**
   - Wait for deployment (usually 1-2 minutes)

### Step 5: Configure Environment Variables (Optional)

In Cloudflare Pages dashboard → Settings → Environment variables:
```
API_BASE_URL=https://your-backend.onrender.com
```

### Step 6: Set Up Custom Domain (Optional)

1. In your Pages project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `construction.yourdomain.com`)
4. Follow DNS configuration instructions

## 🔧 Backend Deployment (Render.com)

If you haven't deployed your backend yet, follow `DEPLOY_INSTRUCTIONS.md` to deploy to Render.com first.

### Quick Backend Deployment:
```bash
# Already have GitHub repo, so just deploy to Render
1. Go to https://render.com
2. Sign up with GitHub
3. New + → Web Service
4. Connect construction-estimation repository
5. Configure:
   - Name: construction-estimation-api
   - Environment: Python 3
   - Build Command: pip install -r server/requirements.txt
   - Start Command: cd server && gunicorn app:app
6. Add environment variables (DB credentials, etc.)
7. Deploy
```

## 📝 Post-Deployment Checklist

- [ ] Backend deployed and running
- [ ] Update `public/js/config.js` with backend URL
- [ ] Update `cloudflare.toml` redirect URL (if using proxy)
- [ ] Include `config.js` in HTML before other scripts
- [ ] Update all API fetch calls to use `API_BASE_URL`
- [ ] Commit and push changes
- [ ] Deploy to Cloudflare Pages
- [ ] Test the live application
- [ ] Configure CORS on backend to allow Cloudflare Pages domain
- [ ] Set up custom domain (optional)

## 🔐 CORS Configuration

Update your Flask backend (`server/app.py`) to allow Cloudflare Pages:
```python
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://construction-estimation.pages.dev",
            "https://your-custom-domain.com"
        ]
    }
})
```

## 🌐 Your Live URLs

After deployment:
- **Frontend**: `https://construction-estimation.pages.dev`
- **Backend**: `https://construction-estimation-api.onrender.com`

## 🐛 Troubleshooting

### API Not Working
- Check browser console for CORS errors
- Verify backend URL in `config.js`
- Ensure backend is running
- Check CORS settings on backend

### Build Failures
- Ensure `public` directory exists
- Check build output directory is set to `public`
- Verify all files are committed to Git

### 404 Errors
- Check that `index.html` is in `public` directory
- Verify static file paths are relative (not absolute)

## 📞 Need Help?
- Cloudflare Pages Docs: https://developers.cloudflare.com/pages
- Render Docs: https://render.com/docs

---

**Ready to deploy!** 🎉

Your GitHub repository is already set up at:
https://github.com/Nadesh-001/construction-estimation.git

Just follow the steps above to deploy to Cloudflare Pages!
