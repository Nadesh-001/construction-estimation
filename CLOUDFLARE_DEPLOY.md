# Cloudflare Deployment Guide

## Overview
This guide covers deploying your Construction Cost Estimation app to Cloudflare. We'll use a **hybrid approach**:
- **Frontend**: Cloudflare Pages (static files)
- **Backend**: Cloudflare Workers (Python) OR External service (Render/Railway)

## Option 1: Cloudflare Pages (Frontend Only) + External Backend

This is the **easiest and recommended** approach for your Flask + MySQL app.

### Prerequisites
- Git installed
- GitHub account
- Cloudflare account (free tier works)
- Backend deployed elsewhere (Render, Railway, etc.)

### Step 1: Prepare Frontend for Static Deployment

Create a `public` directory with your client files:

```bash
# Create public directory
mkdir public
xcopy client public /E /I /Y
```

### Step 2: Update API Endpoints

Update your frontend JavaScript to point to your backend URL:

1. Create `public/js/config.js`:
```javascript
const API_BASE_URL = 'https://your-backend.onrender.com'; // Change this
```

2. Update all fetch calls to use `API_BASE_URL`

### Step 3: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit for Cloudflare deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/construction-estimation.git
git push -u origin main
```

### Step 4: Deploy to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **Workers & Pages** → **Create application** → **Pages**
3. Connect to Git → Select your repository
4. Configure build settings:
   - **Build command**: Leave empty (static files)
   - **Build output directory**: `public`
   - **Root directory**: `/`
5. Click **Save and Deploy**

### Step 5: Configure Environment Variables (Optional)

In Cloudflare Pages settings → Environment variables:
```
API_BASE_URL=https://your-backend.onrender.com
```

---

## Option 2: Full Cloudflare Deployment (Pages + Workers)

This deploys both frontend and backend to Cloudflare.

### Prerequisites
- Cloudflare account with Workers paid plan ($5/month for Python Workers)
- Cloudflare D1 database OR external MySQL database

### Step 1: Convert Flask to Cloudflare Worker

Cloudflare Workers support Python, but you'll need to adapt your Flask app.

Create `worker.py`:

```python
from js import Response, fetch
import json

async def on_fetch(request):
    url = request.url
    
    # Health check
    if url.endswith('/api/health'):
        return Response.json({
            'status': 'healthy',
            'message': 'Construction Cost Estimation API is running'
        })
    
    # Add your routes here
    return Response.json({'error': 'Not found'}, status=404)
```

### Step 2: Create wrangler.toml

```toml
name = "construction-estimation-api"
main = "worker.py"
compatibility_date = "2024-01-01"

[vars]
ENVIRONMENT = "production"

# D1 Database binding (if using Cloudflare D1)
[[d1_databases]]
binding = "DB"
database_name = "construction_db"
database_id = "your-database-id"
```

### Step 3: Deploy Worker

```bash
npm install -g wrangler
wrangler login
wrangler deploy
```

### Step 4: Deploy Frontend to Pages

Same as Option 1, but point API_BASE_URL to your Worker URL.

---

## Option 3: Cloudflare Pages with Functions

Use Cloudflare Pages Functions for serverless API endpoints.

### Step 1: Create Functions Directory

```
construction-cost-estimation/
├── public/              # Frontend files
│   ├── index.html
│   ├── css/
│   └── js/
└── functions/           # Serverless functions
    └── api/
        ├── health.js
        ├── auth/
        │   └── login.js
        └── calculators/
            └── estimate.js
```

### Step 2: Create API Functions

Example: `functions/api/health.js`

```javascript
export async function onRequest(context) {
  return new Response(JSON.stringify({
    status: 'healthy',
    message: 'API is running'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### Step 3: Database Connection

For MySQL, use Cloudflare's TCP Socket support or migrate to:
- **Cloudflare D1** (SQLite-compatible)
- **PlanetScale** (MySQL-compatible, serverless)
- **Neon** (PostgreSQL, serverless)

---

## Recommended Approach for Your App

Given your current Flask + MySQL setup, I recommend:

### 🎯 **Hybrid Deployment**

1. **Frontend**: Cloudflare Pages
   - Fast global CDN
   - Free SSL
   - Automatic deployments from Git

2. **Backend**: Keep on Render/Railway
   - Your Flask app works as-is
   - MySQL database included
   - Easy to manage

3. **Benefits**:
   - ✅ No code changes needed
   - ✅ Frontend served from Cloudflare's edge
   - ✅ Backend handles complex logic
   - ✅ Cost-effective

### Quick Setup Commands

```bash
# 1. Create public directory
mkdir public
xcopy client public /E /I /Y

# 2. Create config file
echo const API_BASE_URL = 'https://your-backend.onrender.com'; > public/js/config.js

# 3. Update fetch calls in your JS files to use API_BASE_URL

# 4. Push to GitHub
git init
git add .
git commit -m "Cloudflare Pages deployment"
git remote add origin https://github.com/YOUR_USERNAME/construction-estimation.git
git push -u origin main

# 5. Deploy to Cloudflare Pages via dashboard
```

---

## Environment Variables

### Cloudflare Pages
```
API_BASE_URL=https://your-backend.onrender.com
```

### Backend (Render/Railway)
```
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=construction_estimation
DB_PORT=3306
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
FLASK_ENV=production
```

---

## Custom Domain (Optional)

1. In Cloudflare Pages → Custom domains
2. Add your domain: `construction.yourdomain.com`
3. Cloudflare will automatically configure DNS

---

## Troubleshooting

### CORS Issues
Update your Flask backend CORS settings:
```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://your-cloudflare-pages.pages.dev", "https://yourdomain.com"]
    }
})
```

### API Not Reachable
- Check if backend is running
- Verify API_BASE_URL is correct
- Check browser console for errors

### Build Failures
- Ensure `public` directory exists
- Check build output directory is set to `public`

---

## Next Steps

1. Choose your deployment approach
2. Set up GitHub repository
3. Deploy backend (if not already done)
4. Deploy frontend to Cloudflare Pages
5. Test the live application

**Need help with any step? Let me know!** 🚀
