import mysql.connector
from mysql.connector import Error, pooling
import os
from dotenv import load_dotenv

load_dotenv()

class Database:
    def __init__(self):
        self.config = {
            'host': os.getenv('DB_HOST', 'localhost'),
            'user': os.getenv('DB_USER', 'root'),
            'password': os.getenv('DB_PASSWORD', ''),
            'database': os.getenv('DB_NAME', 'construction_estimation'),
            'port': int(os.getenv('DB_PORT', 3306))
        }
        
        # Create connection pool
        try:
            self.pool = pooling.MySQLConnectionPool(
                pool_name="construction_pool",
                pool_size=5,
                **self.config
            )
        except Error as e:
            print(f"Error creating connection pool: {e}")
            self.pool = None
    
    def get_connection(self):
        """Get a connection from the pool"""
        try:
            return self.pool.get_connection()
        except Error as e:
            print(f"Error getting connection from pool: {e}")
            return None
    
    def execute_query(self, query, params=None, fetch=False, fetch_one=False):
        """Execute a query and optionally fetch results"""
        connection = self.get_connection()
        if not connection:
            return None
        
        try:
            cursor = connection.cursor(dictionary=True)
            cursor.execute(query, params or ())
            
            if fetch_one:
                result = cursor.fetchone()
            elif fetch:
                result = cursor.fetchall()
            else:
                connection.commit()
                result = cursor.lastrowid
            
            cursor.close()
            return result
        except Error as e:
            print(f"Error executing query: {e}")
            connection.rollback()
            return None
        finally:
            connection.close()
    
    def init_db(self):
        """Initialize database tables"""
        # Create database if not exists
        try:
            temp_config = self.config.copy()
            temp_config.pop('database')
            connection = mysql.connector.connect(**temp_config)
            cursor = connection.cursor()
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {self.config['database']}")
            cursor.close()
            connection.close()
        except Error as e:
            print(f"Error creating database: {e}")
        
        # Create tables
        tables = [
            # Users table
            """
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
            """,
            
            # Material prices table
            """
            CREATE TABLE IF NOT EXISTS material_prices (
                id INT AUTO_INCREMENT PRIMARY KEY,
                material_name VARCHAR(100) NOT NULL,
                unit VARCHAR(20) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                quality VARCHAR(50) DEFAULT 'standard',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
            """,
            
            # Labor rates table
            """
            CREATE TABLE IF NOT EXISTS labor_rates (
                id INT AUTO_INCREMENT PRIMARY KEY,
                labor_type VARCHAR(100) NOT NULL,
                rate DECIMAL(10, 2) NOT NULL,
                unit VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
            """,
            
            # Estimates table
            """
            CREATE TABLE IF NOT EXISTS estimates (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                project_name VARCHAR(200),
                plot_length DECIMAL(10, 2),
                plot_breadth DECIMAL(10, 2),
                total_area DECIMAL(10, 2),
                num_floors INT,
                material_quality VARCHAR(50),
                total_cost DECIMAL(15, 2),
                cost_per_sqft DECIMAL(10, 2),
                estimate_data JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
            """,
            
            # Consumption ratios table
            """
            CREATE TABLE IF NOT EXISTS consumption_ratios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                material_name VARCHAR(100) NOT NULL,
                ratio_per_sqft DECIMAL(10, 4) NOT NULL,
                unit VARCHAR(20) NOT NULL,
                category VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
            """
        ]
        
        for table_query in tables:
            self.execute_query(table_query)
        
        # Insert default data
        self.insert_default_data()
        
        print("Database initialized successfully!")
    
    def insert_default_data(self):
        """Insert default pricing and consumption data"""
        # Check if data already exists
        existing_materials = self.execute_query(
            "SELECT COUNT(*) as count FROM material_prices",
            fetch_one=True
        )
        
        if existing_materials and existing_materials['count'] > 0:
            return
        
        # Default material prices
        materials = [
            ('Cement', 'bag', 350.00, 'standard'),
            ('Cement', 'bag', 420.00, 'premium'),
            ('Sand', 'ton', 1200.00, 'standard'),
            ('Aggregate', 'ton', 1500.00, 'standard'),
            ('Steel (TMT)', 'kg', 65.00, 'standard'),
            ('Steel (TMT)', 'kg', 75.00, 'premium'),
            ('Bricks', 'piece', 8.00, 'standard'),
            ('Bricks', 'piece', 12.00, 'premium'),
            ('Paint (Interior)', 'liter', 350.00, 'standard'),
            ('Paint (Exterior)', 'liter', 450.00, 'standard'),
            ('Tiles (Floor)', 'sqft', 45.00, 'standard'),
            ('Tiles (Floor)', 'sqft', 85.00, 'premium'),
        ]
        
        for material in materials:
            self.execute_query(
                "INSERT INTO material_prices (material_name, unit, price, quality) VALUES (%s, %s, %s, %s)",
                material
            )
        
        # Default labor rates
        labor = [
            ('Mason', 800.00, 'day'),
            ('Helper', 500.00, 'day'),
            ('Carpenter', 850.00, 'day'),
            ('Electrician', 900.00, 'day'),
            ('Plumber', 850.00, 'day'),
            ('Painter', 700.00, 'day'),
        ]
        
        for labor_item in labor:
            self.execute_query(
                "INSERT INTO labor_rates (labor_type, rate, unit) VALUES (%s, %s, %s)",
                labor_item
            )
        
        # Default consumption ratios
        ratios = [
            ('Cement', 0.4, 'bag', 'construction'),
            ('Sand', 0.045, 'ton', 'construction'),
            ('Aggregate', 0.09, 'ton', 'construction'),
            ('Steel (TMT)', 4.5, 'kg', 'construction'),
            ('Bricks', 8.0, 'piece', 'masonry'),
            ('Paint (Interior)', 0.15, 'liter', 'finishing'),
            ('Tiles (Floor)', 1.1, 'sqft', 'finishing'),
        ]
        
        for ratio in ratios:
            self.execute_query(
                "INSERT INTO consumption_ratios (material_name, ratio_per_sqft, unit, category) VALUES (%s, %s, %s, %s)",
                ratio
            )
        
        print("Default data inserted successfully!")

# Create a global database instance
db = Database()
