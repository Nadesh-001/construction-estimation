# Vercel Deployment Troubleshooting

## Common Issues and Solutions

### 1. "api is not defined" Error ✅ FIXED

**Problem**: When logging in or using any feature, you get "api is not defined" error.

**Cause**: The API configuration was hardcoded to `localhost:5000`.

**Solution**: Updated `public/js/config.js` to automatically detect the environment:
- **Local development**: Uses `http://localhost:5000`
- **Production (Vercel)**: Uses same origin (e.g., `https://your-app.vercel.app`)

**Action Required**: 
```bash
git add public/js/config.js
git commit -m "Fix API configuration for Vercel"
git push origin main
```

Vercel will automatically redeploy with the fix!

---

### 2. Database Connection Errors

**Symptoms**:
- 500 errors when trying to register/login
- "Database connection failed" messages

**Solutions**:

#### Check Environment Variables
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify all these are set:
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `DB_PORT`
   - `SECRET_KEY`
   - `JWT_SECRET_KEY`
   - `FLASK_ENV`

#### Verify PlanetScale Database
1. Go to PlanetScale dashboard
2. Check database is active (not sleeping)
3. Verify connection credentials match Vercel environment variables
4. Ensure SSL is enabled

#### Initialize Database
```bash
# Set environment variables locally
set DB_HOST=xxx.connect.psdb.cloud
set DB_USER=xxx
set DB_PASSWORD=xxx
set DB_NAME=construction-estimation
set DB_PORT=3306

# Run initialization
python init_db.py
```

---

### 3. CORS Errors

**Symptoms**:
- "Access-Control-Allow-Origin" errors in browser console
- API requests blocked by CORS policy

**Solution**: The app is already configured to allow all origins in `server/app.py`:
```python
CORS(app, resources={r"/api/*": {"origins": "*"}})
```

If you need to restrict origins for security:
```python
CORS(app, resources={r"/api/*": {"origins": "https://your-app.vercel.app"}})
```

---

### 4. 404 Errors on API Routes

**Symptoms**:
- `/api/auth/login` returns 404
- `/api/health` returns 404

**Causes**:
1. `vercel.json` routing configuration incorrect
2. Flask app not starting properly

**Solutions**:

#### Verify vercel.json
Check that `vercel.json` has correct routes:
```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/app.py"
    }
  ]
}
```

#### Check Deployment Logs
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on latest deployment
3. Check "Build Logs" and "Function Logs" for errors

---

### 5. Login/Signup Not Working

**Symptoms**:
- Login button does nothing
- No error messages shown

**Solutions**:

#### Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for JavaScript errors

#### Verify API Health
Visit: `https://your-app.vercel.app/api/health`

Should return:
```json
{
  "status": "healthy",
  "message": "Construction Cost Estimation API is running"
}
```

#### Check Network Tab
1. Open DevTools → Network tab
2. Try to login
3. Look for failed requests
4. Check request/response details

---

### 6. "Module not found" Errors

**Symptoms**:
- Build fails with "No module named 'flask'"
- Import errors in deployment logs

**Solution**: Ensure `requirements.txt` is in the root directory with all dependencies:
```
Flask==3.0.0
flask-cors==4.0.0
flask-jwt-extended==4.6.0
mysql-connector-python==8.2.0
python-dotenv==1.0.0
Werkzeug==3.0.1
gunicorn==21.2.0
```

---

### 7. Static Files Not Loading

**Symptoms**:
- CSS not applying
- JavaScript files not loading
- Images not showing

**Solutions**:

#### Check vercel.json Routes
Ensure static files route is configured:
```json
{
  "src": "/(css|js|images|fonts)/(.*)",
  "dest": "/public/$1/$2"
}
```

#### Verify File Paths
- All static files should be in `public/` directory
- Use relative paths in HTML: `css/styles.css` not `/css/styles.css`

---

### 8. Slow API Responses

**Symptoms**:
- API calls take 5-10 seconds
- First request after idle is very slow

**Cause**: Vercel serverless functions "cold start"

**Solutions**:
1. **Upgrade Vercel Plan**: Pro plan has faster cold starts
2. **Keep Functions Warm**: Use a service like UptimeRobot to ping your API every 5 minutes
3. **Optimize Database**: Use connection pooling (already implemented)

---

## Quick Debugging Checklist

When something goes wrong, check these in order:

- [ ] Check browser console for JavaScript errors
- [ ] Verify API health endpoint: `/api/health`
- [ ] Check Vercel deployment logs
- [ ] Verify all environment variables are set
- [ ] Check PlanetScale database is active
- [ ] Verify database is initialized (has tables)
- [ ] Check network tab for failed requests
- [ ] Clear browser cache and try again

---

## Getting Help

### Vercel Support
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### PlanetScale Support
- [PlanetScale Docs](https://planetscale.com/docs)
- [PlanetScale Community](https://github.com/planetscale/discussion/discussions)

### Flask Support
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Flask Discord](https://discord.gg/pallets)

---

## Still Having Issues?

1. **Check deployment logs** in Vercel dashboard
2. **Test locally** first to isolate the issue
3. **Verify environment variables** match between local and production
4. **Check browser console** for detailed error messages
5. **Review recent changes** - what changed before it broke?

---

**Most Common Fix**: Push the updated `config.js` file to GitHub and let Vercel redeploy!
