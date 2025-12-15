from flask import Blueprint, request, jsonify
from database import db

calculators_bp = Blueprint('calculators', __name__)

@calculators_bp.route('/construction-cost', methods=['POST'])
def calculate_construction_cost():
    """Calculate construction cost based on plot dimensions and quality"""
    try:
        data = request.get_json()
        
        length = float(data.get('length', 0))
        breadth = float(data.get('breadth', 0))
        num_floors = int(data.get('num_floors', 1))
        quality = data.get('quality', 'standard')
        
        if length <= 0 or breadth <= 0 or num_floors <= 0:
            return jsonify({'error': 'Invalid input values'}), 400
        
        # Calculate total area
        plot_area = length * breadth
        total_area = plot_area * num_floors
        
        # Get materials and consumption ratios
        materials = db.execute_query(
            "SELECT * FROM material_prices WHERE quality = %s",
            (quality,),
            fetch=True
        )
        
        consumption_ratios = db.execute_query(
            "SELECT * FROM consumption_ratios",
            fetch=True
        )
        
        labor_rates = db.execute_query(
            "SELECT * FROM labor_rates",
            fetch=True
        )
        
        # Calculate material costs
        material_breakdown = []
        total_material_cost = 0
        
        for ratio in consumption_ratios:
            material_name = ratio['material_name']
            ratio_per_sqft = float(ratio['ratio_per_sqft'])
            
            # Find matching material price
            material_price = next(
                (m for m in materials if m['material_name'] == material_name),
                None
            )
            
            if material_price:
                quantity = ratio_per_sqft * total_area
                cost = quantity * float(material_price['price'])
                
                material_breakdown.append({
                    'material': material_name,
                    'quantity': round(quantity, 2),
                    'unit': ratio['unit'],
                    'rate': float(material_price['price']),
                    'cost': round(cost, 2)
                })
                
                total_material_cost += cost
        
        # Calculate labor costs (estimate 30% of material cost)
        labor_breakdown = []
        total_labor_cost = 0
        
        for labor in labor_rates:
            # Estimate days based on area (rough estimate: 1 worker per 100 sqft)
            days = max(1, int(total_area / 100))
            cost = days * float(labor['rate'])
            
            labor_breakdown.append({
                'labor_type': labor['labor_type'],
                'days': days,
                'rate': float(labor['rate']),
                'cost': round(cost, 2)
            })
            
            total_labor_cost += cost
        
        # Calculate totals
        total_cost = total_material_cost + total_labor_cost
        cost_per_sqft = total_cost / total_area if total_area > 0 else 0
        
        return jsonify({
            'plot_area': round(plot_area, 2),
            'total_area': round(total_area, 2),
            'num_floors': num_floors,
            'quality': quality,
            'material_breakdown': material_breakdown,
            'labor_breakdown': labor_breakdown,
            'total_material_cost': round(total_material_cost, 2),
            'total_labor_cost': round(total_labor_cost, 2),
            'total_cost': round(total_cost, 2),
            'cost_per_sqft': round(cost_per_sqft, 2)
        }), 200
        
    except Exception as e:
        print(f"Construction cost calculation error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@calculators_bp.route('/concrete-slab', methods=['POST'])
def calculate_concrete_slab():
    """Calculate concrete required for slab"""
    try:
        data = request.get_json()
        
        length = float(data.get('length', 0))
        breadth = float(data.get('breadth', 0))
        thickness = float(data.get('thickness', 0.15))  # in meters
        
        if length <= 0 or breadth <= 0 or thickness <= 0:
            return jsonify({'error': 'Invalid input values'}), 400
        
        # Calculate volume in cubic meters
        volume = length * breadth * thickness
        
        # Standard concrete mix ratio (1:2:4)
        cement_bags = volume * 6.5  # bags per cubic meter
        sand_ton = volume * 0.5  # tons per cubic meter
        aggregate_ton = volume * 1.0  # tons per cubic meter
        
        # Get prices
        cement = db.execute_query(
            "SELECT price FROM material_prices WHERE material_name = 'Cement' AND quality = 'standard'",
            fetch_one=True
        )
        sand = db.execute_query(
            "SELECT price FROM material_prices WHERE material_name = 'Sand'",
            fetch_one=True
        )
        aggregate = db.execute_query(
            "SELECT price FROM material_prices WHERE material_name = 'Aggregate'",
            fetch_one=True
        )
        
        cement_cost = cement_bags * float(cement['price']) if cement else 0
        sand_cost = sand_ton * float(sand['price']) if sand else 0
        aggregate_cost = aggregate_ton * float(aggregate['price']) if aggregate else 0
        
        total_cost = cement_cost + sand_cost + aggregate_cost
        
        return jsonify({
            'volume': round(volume, 2),
            'cement_bags': round(cement_bags, 2),
            'sand_ton': round(sand_ton, 2),
            'aggregate_ton': round(aggregate_ton, 2),
            'cement_cost': round(cement_cost, 2),
            'sand_cost': round(sand_cost, 2),
            'aggregate_cost': round(aggregate_cost, 2),
            'total_cost': round(total_cost, 2)
        }), 200
        
    except Exception as e:
        print(f"Concrete slab calculation error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@calculators_bp.route('/paint', methods=['POST'])
def calculate_paint():
    """Calculate paint required"""
    try:
        data = request.get_json()
        
        area = float(data.get('area', 0))
        coats = int(data.get('coats', 2))
        paint_type = data.get('paint_type', 'Interior')
        
        if area <= 0 or coats <= 0:
            return jsonify({'error': 'Invalid input values'}), 400
        
        # Paint coverage: 1 liter covers ~10 sqft per coat
        liters_needed = (area * coats) / 10
        
        # Get paint price
        paint = db.execute_query(
            f"SELECT price FROM material_prices WHERE material_name = 'Paint ({paint_type})'",
            fetch_one=True
        )
        
        total_cost = liters_needed * float(paint['price']) if paint else 0
        
        return jsonify({
            'area': round(area, 2),
            'coats': coats,
            'paint_type': paint_type,
            'liters_needed': round(liters_needed, 2),
            'total_cost': round(total_cost, 2)
        }), 200
        
    except Exception as e:
        print(f"Paint calculation error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@calculators_bp.route('/bricks', methods=['POST'])
def calculate_bricks():
    """Calculate bricks required"""
    try:
        data = request.get_json()
        
        wall_length = float(data.get('wall_length', 0))
        wall_height = float(data.get('wall_height', 0))
        wall_thickness = float(data.get('wall_thickness', 0.23))  # in meters
        quality = data.get('quality', 'standard')
        
        if wall_length <= 0 or wall_height <= 0:
            return jsonify({'error': 'Invalid input values'}), 400
        
        # Calculate wall area
        wall_area = wall_length * wall_height
        
        # Bricks per sqft (for 9" wall)
        bricks_per_sqft = 8 if wall_thickness >= 0.23 else 4
        total_bricks = wall_area * bricks_per_sqft
        
        # Add 10% wastage
        total_bricks_with_wastage = total_bricks * 1.1
        
        # Get brick price
        brick = db.execute_query(
            "SELECT price FROM material_prices WHERE material_name = 'Bricks' AND quality = %s",
            (quality,),
            fetch_one=True
        )
        
        total_cost = total_bricks_with_wastage * float(brick['price']) if brick else 0
        
        return jsonify({
            'wall_area': round(wall_area, 2),
            'bricks_needed': round(total_bricks, 0),
            'bricks_with_wastage': round(total_bricks_with_wastage, 0),
            'total_cost': round(total_cost, 2)
        }), 200
        
    except Exception as e:
        print(f"Bricks calculation error: {e}")
        return jsonify({'error': 'Internal server error'}), 500
