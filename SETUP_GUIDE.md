# Flask + MySQL Backend Setup Guide

## Quick Start

### 1. Install MySQL (if not already installed)

Download and install MySQL from: https://dev.mysql.com/downloads/mysql/

Or use XAMPP/WAMP which includes MySQL.

### 2. Start MySQL Service

**Option A: Using Windows Services**
```powershell
# Check MySQL service status
Get-Service -Name "*mysql*"

# Start MySQL service (run as Administrator)
Start-Service MySQL80  # or your MySQL service name
```

**Option B: Using XAMPP/WAMP**
- Open XAMPP/WAMP Control Panel
- Click "Start" next to MySQL

### 3. Configure Database Connection

Edit `server/.env` file and update your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=construction_estimation
DB_PORT=3306
```

**Important**: Replace `your_mysql_password_here` with your actual MySQL root password.

### 4. Install Python Dependencies

```powershell
cd server
pip install -r requirements.txt
```

### 5. Run the Flask Server

```powershell
cd server
python app.py
```

The server will:
- Automatically create the database if it doesn't exist
- Create all required tables
- Insert default data (materials, labor rates, consumption ratios)
- Start on http://localhost:5000

## Testing the API

### Health Check
```powershell
curl http://localhost:5000/api/health
```

### Register a User
```powershell
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\"}'
```

### Get Materials
```powershell
curl http://localhost:5000/api/pricing/materials
```

### Calculate Construction Cost
```powershell
curl -X POST http://localhost:5000/api/calculators/construction-cost `
  -H "Content-Type: application/json" `
  -d '{\"length\":30,\"breadth\":40,\"num_floors\":2,\"quality\":\"standard\"}'
```

## Troubleshooting

### MySQL Connection Error
**Error**: `Access denied for user 'root'@'localhost'`

**Solution**:
1. Check your MySQL password in `.env` file
2. Make sure MySQL service is running
3. Test MySQL connection:
   ```powershell
   mysql -u root -p
   ```

### Port Already in Use
**Error**: `Address already in use`

**Solution**:
1. Change the PORT in `.env` file to a different port (e.g., 5001)
2. Or stop the process using port 5000

### Module Not Found
**Error**: `ModuleNotFoundError: No module named 'flask'`

**Solution**:
```powershell
pip install -r requirements.txt
```

## Database Schema

The application will automatically create these tables:

- **users**: User accounts with authentication
- **material_prices**: Material pricing data
- **labor_rates**: Labor rate information
- **consumption_ratios**: Material consumption ratios per sqft
- **estimates**: Saved user estimates

## Default Data

The application includes default data for:
- 12+ construction materials (cement, sand, steel, bricks, paint, tiles)
- 6 labor types (mason, helper, carpenter, electrician, plumber, painter)
- 7 consumption ratios for common materials

## Next Steps

1. Start the Flask backend server
2. Test API endpoints using curl or Postman
3. Update frontend to connect to backend APIs
4. Test full-stack integration

## API Documentation

Full API documentation is available in `server/README.md`
