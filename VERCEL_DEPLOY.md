# Vercel Deployment Guide

This guide will walk you through deploying your Construction Cost Estimation application to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your GitHub repository: https://github.com/Nadesh-001
- A MySQL database (we recommend PlanetScale for free hosting)

---

## Step 1: Set Up MySQL Database (PlanetScale)

### 1.1 Create PlanetScale Account
1. Go to [planetscale.com](https://planetscale.com)
2. Sign up for a free account
3. Click **"Create a new database"**

### 1.2 Configure Database
1. **Database name**: `construction-estimation`
2. **Region**: Choose closest to your users (e.g., `ap-south` for India)
3. Click **"Create database"**

### 1.3 Get Connection Details
1. Click on your database
2. Go to **"Connect"** tab
3. Select **"Connect with: MySQL CLI"** or **"General"**
4. Copy the connection details:
   - **Host**: `xxx.connect.psdb.cloud`
   - **Username**: `xxx`
   - **Password**: Click **"New password"** to generate
   - **Database**: `construction-estimation`
   - **Port**: `3306`

> **Important**: Save these credentials - you'll need them for Vercel environment variables!

---

## Step 2: Push Code to GitHub

### 2.1 Initialize Git Repository (if not already done)
```bash
cd c:\Users\nades\.gemini\antigravity\scratch\construction-cost-estimation
git init
git add .
git commit -m "Initial commit - Construction Cost Estimation App"
```

### 2.2 Create GitHub Repository
1. Go to https://github.com/Nadesh-001
2. Click **"New repository"**
3. Name: `construction-cost-estimation`
4. Visibility: **Public** or **Private**
5. Click **"Create repository"**

### 2.3 Push to GitHub
```bash
git remote add origin https://github.com/Nadesh-001/construction-cost-estimation.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Vercel

### 3.1 Import Project
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your repository: `Nadesh-001/construction-cost-estimation`
5. Click **"Import"**

### 3.2 Configure Project Settings

#### Framework Preset
- Select: **"Other"** (since we're using Flask)

#### Root Directory
- Leave as: **"./"** (root)

#### Build & Development Settings
- **Build Command**: Leave empty (Vercel handles Python automatically)
- **Output Directory**: Leave empty
- **Install Command**: `pip install -r requirements.txt`

### 3.3 Add Environment Variables

Click **"Environment Variables"** and add the following:

| Name | Value | Notes |
|------|-------|-------|
| `DB_HOST` | `xxx.connect.psdb.cloud` | From PlanetScale |
| `DB_USER` | `xxx` | From PlanetScale |
| `DB_PASSWORD` | `xxx` | From PlanetScale |
| `DB_NAME` | `construction-estimation` | Database name |
| `DB_PORT` | `3306` | Default MySQL port |
| `SECRET_KEY` | `your-secret-key-here` | Generate random string |
| `JWT_SECRET_KEY` | `your-jwt-secret-here` | Generate random string |
| `FLASK_ENV` | `production` | Environment mode |

#### Generate Secret Keys
Run these commands to generate secure keys:
```bash
# For SECRET_KEY
python -c "import secrets; print(secrets.token_hex(32))"

# For JWT_SECRET_KEY
python -c "import secrets; print(secrets.token_hex(32))"
```

### 3.4 Deploy
1. Click **"Deploy"**
2. Wait for deployment to complete (2-3 minutes)
3. You'll get a URL like: `https://construction-cost-estimation.vercel.app`

---

## Step 4: Initialize Database

After deployment, you need to initialize the database tables.

### Option A: Using PlanetScale Console
1. Go to your PlanetScale dashboard
2. Click on your database → **"Console"**
3. Run the SQL commands from `server/database.py` (lines 81-147)

### Option B: Using Local Script
1. Create a file `init_db.py` in the `server` folder:
```python
from database import Database

db = Database()
db.init_db()
print("Database initialized!")
```

2. Set environment variables locally:
```bash
set DB_HOST=xxx.connect.psdb.cloud
set DB_USER=xxx
set DB_PASSWORD=xxx
set DB_NAME=construction-estimation
set DB_PORT=3306
```

3. Run the script:
```bash
cd server
python init_db.py
```

---

## Step 5: Verify Deployment

### 5.1 Test API Health
Visit: `https://your-app.vercel.app/api/health`

You should see:
```json
{
  "status": "healthy",
  "message": "Construction Cost Estimation API is running"
}
```

### 5.2 Test Frontend
Visit: `https://your-app.vercel.app`

You should see the construction cost estimation website.

### 5.3 Test Authentication
1. Click **"Sign Up"** or **"Login"**
2. Create a test account
3. Verify you can log in successfully

---

## Step 6: Custom Domain (Optional)

### 6.1 Add Domain
1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Domains"**
3. Enter your domain name
4. Follow DNS configuration instructions

### 6.2 Update DNS
Add the following records to your domain provider:
- **Type**: `A` or `CNAME`
- **Value**: Provided by Vercel

---

## Troubleshooting

### Database Connection Errors
- Verify environment variables are set correctly in Vercel
- Check PlanetScale database is active
- Ensure SSL is enabled in PlanetScale connection settings

### 404 Errors on Routes
- Check `vercel.json` routes configuration
- Ensure `public` folder contains all static files
- Verify API routes start with `/api/`

### Build Failures
- Check `requirements.txt` has all dependencies
- Verify Python version compatibility (Vercel uses Python 3.9+)
- Review build logs in Vercel dashboard

### CORS Errors
- The app is configured to allow all origins in production
- If needed, update `server/app.py` line 30 to restrict origins

---

## Updating Your Deployment

### Push Changes
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Vercel will automatically redeploy when you push to GitHub!

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | MySQL database host | `xxx.connect.psdb.cloud` |
| `DB_USER` | Database username | `xxx` |
| `DB_PASSWORD` | Database password | `pscale_pw_xxx` |
| `DB_NAME` | Database name | `construction-estimation` |
| `DB_PORT` | Database port | `3306` |
| `SECRET_KEY` | Flask secret key | Random 64-char hex |
| `JWT_SECRET_KEY` | JWT signing key | Random 64-char hex |
| `FLASK_ENV` | Environment mode | `production` |

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [PlanetScale Documentation](https://planetscale.com/docs)
- [Flask Deployment Guide](https://flask.palletsprojects.com/en/2.3.x/deploying/)

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review PlanetScale database status
3. Verify all environment variables are set
4. Check browser console for frontend errors

---

**Deployment Complete! 🎉**

Your Construction Cost Estimation application is now live on Vercel!
