# Render.com Deployment - Quick Start

## Files Created ✅
- `build.sh` - Build script
- `render.yaml` - Render configuration
- `.gitignore` - Git ignore file
- Updated `server/requirements.txt` - Added PostgreSQL & Gunicorn

## Next Steps (Manual)

### 1. Install Git
Download and install Git from: https://git-scm.com/download/win

### 2. Initialize Git Repository
```bash
cd c:\Users\nades\.gemini\antigravity\scratch\construction-cost-estimation
git init
git add .
git commit -m "Initial commit for Render deployment"
```

### 3. Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `construction-estimation`
3. Make it **Public** (required for free Render)
4. Don't initialize with README
5. Click "Create repository"

### 4. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/construction-estimation.git
git branch -M main
git push -u origin main
```

### 5. Deploy on Render
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your `construction-estimation` repository
5. Render will auto-detect `render.yaml`
6. Click "Apply" and wait for deployment

### 6. Configure Database
After deployment, add these environment variables in Render dashboard:

```
DB_HOST=<from-render-postgresql-dashboard>
DB_USER=construction_user
DB_PASSWORD=<from-render-postgresql-dashboard>
DB_NAME=construction_estimation
DB_PORT=5432
```

### 7. Initialize Database
In Render dashboard → Shell:
```bash
cd server
python database.py
```

## Your App Will Be Live! 🎉
URL: `https://construction-estimation.onrender.com`

## Need Help?
- Git not working? Install from link above
- GitHub issues? Make repo public
- Render errors? Check logs in dashboard
