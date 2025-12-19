# Vercel Quick Start Guide

## 🚀 Deploy to Vercel in 5 Minutes

### 1. Database Setup (2 minutes)
1. Go to [planetscale.com](https://planetscale.com) → Sign up
2. Create database: `construction-estimation`
3. Get credentials from **Connect** tab
4. Save: Host, Username, Password

### 2. Push to GitHub (1 minute)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/Nadesh-001/construction-cost-estimation.git
git push -u origin main
```

### 3. Deploy to Vercel (2 minutes)
1. Go to [vercel.com](https://vercel.com) → Import Project
2. Select your GitHub repo
3. Add environment variables:
   - `DB_HOST` - from PlanetScale
   - `DB_USER` - from PlanetScale
   - `DB_PASSWORD` - from PlanetScale
   - `DB_NAME` - `construction-estimation`
   - `DB_PORT` - `3306`
   - `SECRET_KEY` - generate with: `python -c "import secrets; print(secrets.token_hex(32))"`
   - `JWT_SECRET_KEY` - generate with: `python -c "import secrets; print(secrets.token_hex(32))"`
   - `FLASK_ENV` - `production`
4. Click **Deploy**

### 4. Initialize Database
```bash
# Set environment variables
set DB_HOST=xxx.connect.psdb.cloud
set DB_USER=xxx
set DB_PASSWORD=xxx
set DB_NAME=construction-estimation
set DB_PORT=3306

# Run initialization
python init_db.py
```

### 5. Done! 🎉
Visit your app at: `https://your-app.vercel.app`

---

**Need detailed instructions?** See [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)
