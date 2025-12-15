from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db

pricing_bp = Blueprint('pricing', __name__)

@pricing_bp.route('/materials', methods=['GET'])
def get_materials():
    """Get all material prices"""
    try:
        quality = request.args.get('quality', None)
        
        if quality:
            materials = db.execute_query(
                "SELECT * FROM material_prices WHERE quality = %s ORDER BY material_name",
                (quality,),
                fetch=True
            )
        else:
            materials = db.execute_query(
                "SELECT * FROM material_prices ORDER BY material_name",
                fetch=True
            )
        
        return jsonify({'materials': materials or []}), 200
        
    except Exception as e:
        print(f"Get materials error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@pricing_bp.route('/materials/<int:material_id>', methods=['GET'])
def get_material(material_id):
    """Get a specific material"""
    try:
        material = db.execute_query(
            "SELECT * FROM material_prices WHERE id = %s",
            (material_id,),
            fetch_one=True
        )
        
        if not material:
            return jsonify({'error': 'Material not found'}), 404
        
        return jsonify({'material': material}), 200
        
    except Exception as e:
        print(f"Get material error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@pricing_bp.route('/labor', methods=['GET'])
def get_labor_rates():
    """Get all labor rates"""
    try:
        labor_rates = db.execute_query(
            "SELECT * FROM labor_rates ORDER BY labor_type",
            fetch=True
        )
        
        return jsonify({'labor_rates': labor_rates or []}), 200
        
    except Exception as e:
        print(f"Get labor rates error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@pricing_bp.route('/consumption-ratios', methods=['GET'])
def get_consumption_ratios():
    """Get all consumption ratios"""
    try:
        category = request.args.get('category', None)
        
        if category:
            ratios = db.execute_query(
                "SELECT * FROM consumption_ratios WHERE category = %s ORDER BY material_name",
                (category,),
                fetch=True
            )
        else:
            ratios = db.execute_query(
                "SELECT * FROM consumption_ratios ORDER BY material_name",
                fetch=True
            )
        
        return jsonify({'consumption_ratios': ratios or []}), 200
        
    except Exception as e:
        print(f"Get consumption ratios error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@pricing_bp.route('/materials', methods=['POST'])
@jwt_required()
def add_material():
    """Add a new material price (admin only)"""
    try:
        data = request.get_json()
        
        material_name = data.get('material_name', '').strip()
        unit = data.get('unit', '').strip()
        price = data.get('price')
        quality = data.get('quality', 'standard').strip()
        
        if not material_name or not unit or price is None:
            return jsonify({'error': 'Material name, unit, and price are required'}), 400
        
        material_id = db.execute_query(
            "INSERT INTO material_prices (material_name, unit, price, quality) VALUES (%s, %s, %s, %s)",
            (material_name, unit, price, quality)
        )
        
        if material_id:
            return jsonify({
                'message': 'Material added successfully',
                'material_id': material_id
            }), 201
        else:
            return jsonify({'error': 'Failed to add material'}), 500
            
    except Exception as e:
        print(f"Add material error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@pricing_bp.route('/materials/<int:material_id>', methods=['PUT'])
@jwt_required()
def update_material(material_id):
    """Update material price (admin only)"""
    try:
        data = request.get_json()
        
        # Build update query dynamically
        updates = []
        params = []
        
        if 'material_name' in data:
            updates.append("material_name = %s")
            params.append(data['material_name'])
        
        if 'unit' in data:
            updates.append("unit = %s")
            params.append(data['unit'])
        
        if 'price' in data:
            updates.append("price = %s")
            params.append(data['price'])
        
        if 'quality' in data:
            updates.append("quality = %s")
            params.append(data['quality'])
        
        if not updates:
            return jsonify({'error': 'No fields to update'}), 400
        
        params.append(material_id)
        query = f"UPDATE material_prices SET {', '.join(updates)} WHERE id = %s"
        
        db.execute_query(query, tuple(params))
        
        return jsonify({'message': 'Material updated successfully'}), 200
        
    except Exception as e:
        print(f"Update material error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@pricing_bp.route('/labor', methods=['POST'])
@jwt_required()
def add_labor_rate():
    """Add a new labor rate (admin only)"""
    try:
        data = request.get_json()
        
        labor_type = data.get('labor_type', '').strip()
        rate = data.get('rate')
        unit = data.get('unit', 'day').strip()
        
        if not labor_type or rate is None:
            return jsonify({'error': 'Labor type and rate are required'}), 400
        
        labor_id = db.execute_query(
            "INSERT INTO labor_rates (labor_type, rate, unit) VALUES (%s, %s, %s)",
            (labor_type, rate, unit)
        )
        
        if labor_id:
            return jsonify({
                'message': 'Labor rate added successfully',
                'labor_id': labor_id
            }), 201
        else:
            return jsonify({'error': 'Failed to add labor rate'}), 500
            
    except Exception as e:
        print(f"Add labor rate error: {e}")
        return jsonify({'error': 'Internal server error'}), 500
