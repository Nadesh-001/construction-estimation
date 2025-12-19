"""
Database Initialization Script for Vercel Deployment

Run this script locally to initialize your PlanetScale database
before deploying to Vercel.

Usage:
1. Set your environment variables (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT)
2. Run: python init_db.py
"""

import os
import sys

# Add server directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'server'))

from database import Database

def main():
    print("=" * 60)
    print("Construction Cost Estimation - Database Initialization")
    print("=" * 60)
    print()
    
    # Check environment variables
    required_vars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print("❌ ERROR: Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print()
        print("Please set these variables before running this script.")
        print()
        print("Example (Windows):")
        print("  set DB_HOST=xxx.connect.psdb.cloud")
        print("  set DB_USER=xxx")
        print("  set DB_PASSWORD=xxx")
        print("  set DB_NAME=construction-estimation")
        print("  set DB_PORT=3306")
        return 1
    
    print("✓ Environment variables found")
    print(f"  Host: {os.getenv('DB_HOST')}")
    print(f"  User: {os.getenv('DB_USER')}")
    print(f"  Database: {os.getenv('DB_NAME')}")
    print()
    
    try:
        print("Initializing database...")
        db = Database()
        db.init_db()
        print()
        print("=" * 60)
        print("✅ Database initialized successfully!")
        print("=" * 60)
        print()
        print("Your database is ready for Vercel deployment.")
        print("You can now deploy your application to Vercel.")
        return 0
        
    except Exception as e:
        print()
        print("=" * 60)
        print("❌ ERROR: Database initialization failed!")
        print("=" * 60)
        print()
        print(f"Error details: {str(e)}")
        print()
        print("Troubleshooting:")
        print("1. Verify your database credentials are correct")
        print("2. Check that your PlanetScale database is active")
        print("3. Ensure your IP is whitelisted (if required)")
        print("4. Verify network connectivity to the database")
        return 1

if __name__ == '__main__':
    exit(main())
