# Construction Cost Estimation Backend

Flask + MySQL backend for the Construction Cost Estimation application.

## Features

- **Authentication**: User registration, login with JWT tokens
- **Pricing Management**: Material prices, labor rates, consumption ratios
- **Calculators**: Construction cost, concrete slab, paint, bricks
- **Estimates**: Save, retrieve, update, and delete user estimates
- **Database**: MySQL with connection pooling

## Prerequisites

- Python 3.8+
- MySQL 8.0+
- pip (Python package manager)

## Installation

1. **Install Python dependencies**:
   ```bash
   cd server
   pip install -r requirements.txt
   ```

2. **Set up MySQL**:
   - Install MySQL if not already installed
   - Start MySQL service
   - Create a database user (or use root)

3. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Update the values in `.env`:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_mysql_password
     DB_NAME=construction_estimation
     DB_PORT=3306
     SECRET_KEY=your-secret-key
     JWT_SECRET_KEY=your-jwt-secret-key
     ```

4. **Initialize the database**:
   The database and tables will be created automatically when you first run the application.

## Running the Server

```bash
cd server
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires JWT)
- `POST /api/auth/change-password` - Change password (requires JWT)

### Pricing
- `GET /api/pricing/materials` - Get all materials
- `GET /api/pricing/materials/<id>` - Get specific material
- `POST /api/pricing/materials` - Add material (requires JWT)
- `PUT /api/pricing/materials/<id>` - Update material (requires JWT)
- `GET /api/pricing/labor` - Get labor rates
- `POST /api/pricing/labor` - Add labor rate (requires JWT)
- `GET /api/pricing/consumption-ratios` - Get consumption ratios

### Calculators
- `POST /api/calculators/construction-cost` - Calculate construction cost
- `POST /api/calculators/concrete-slab` - Calculate concrete for slab
- `POST /api/calculators/paint` - Calculate paint required
- `POST /api/calculators/bricks` - Calculate bricks required

### Estimates
- `POST /api/estimates` - Save estimate (requires JWT)
- `GET /api/estimates` - Get all user estimates (requires JWT)
- `GET /api/estimates/<id>` - Get specific estimate (requires JWT)
- `PUT /api/estimates/<id>` - Update estimate (requires JWT)
- `DELETE /api/estimates/<id>` - Delete estimate (requires JWT)

### Health Check
- `GET /api/health` - Check API status

## Database Schema

### Tables
- **users**: User accounts
- **material_prices**: Material pricing data
- **labor_rates**: Labor rate data
- **consumption_ratios**: Material consumption ratios
- **estimates**: Saved user estimates

## Default Data

The application comes with default data for:
- Common construction materials (cement, sand, steel, bricks, etc.)
- Labor rates (mason, carpenter, electrician, etc.)
- Consumption ratios for materials

## Development

- The application runs in debug mode when `FLASK_ENV=development`
- CORS is enabled for all origins (configure for production)
- JWT tokens expire after 24 hours

## Security Notes

- Change `SECRET_KEY` and `JWT_SECRET_KEY` in production
- Use strong MySQL passwords
- Configure CORS for specific origins in production
- Implement rate limiting for production
- Add admin role checks for pricing management endpoints
