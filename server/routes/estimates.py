from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
import json

estimates_bp = Blueprint('estimates', __name__)

@estimates_bp.route('/', methods=['POST'])
@jwt_required()
def save_estimate():
    """Save a new estimate"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        project_name = data.get('project_name', 'Untitled Project')
        plot_length = data.get('plot_length')
        plot_breadth = data.get('plot_breadth')
        total_area = data.get('total_area')
        num_floors = data.get('num_floors')
        material_quality = data.get('material_quality', 'standard')
        total_cost = data.get('total_cost')
        cost_per_sqft = data.get('cost_per_sqft')
        estimate_data = data.get('estimate_data', {})
        
        if not all([plot_length, plot_breadth, total_area, num_floors, total_cost]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        estimate_id = db.execute_query(
            """INSERT INTO estimates 
            (user_id, project_name, plot_length, plot_breadth, total_area, 
            num_floors, material_quality, total_cost, cost_per_sqft, estimate_data)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (user_id, project_name, plot_length, plot_breadth, total_area,
             num_floors, material_quality, total_cost, cost_per_sqft, 
             json.dumps(estimate_data))
        )
        
        if estimate_id:
            return jsonify({
                'message': 'Estimate saved successfully',
                'estimate_id': estimate_id
            }), 201
        else:
            return jsonify({'error': 'Failed to save estimate'}), 500
            
    except Exception as e:
        print(f"Save estimate error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@estimates_bp.route('/', methods=['GET'])
@jwt_required()
def get_estimates():
    """Get all estimates for the current user"""
    try:
        user_id = get_jwt_identity()
        
        estimates = db.execute_query(
            """SELECT id, project_name, plot_length, plot_breadth, total_area,
            num_floors, material_quality, total_cost, cost_per_sqft, created_at
            FROM estimates WHERE user_id = %s ORDER BY created_at DESC""",
            (user_id,),
            fetch=True
        )
        
        return jsonify({'estimates': estimates or []}), 200
        
    except Exception as e:
        print(f"Get estimates error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@estimates_bp.route('/<int:estimate_id>', methods=['GET'])
@jwt_required()
def get_estimate(estimate_id):
    """Get a specific estimate"""
    try:
        user_id = get_jwt_identity()
        
        estimate = db.execute_query(
            "SELECT * FROM estimates WHERE id = %s AND user_id = %s",
            (estimate_id, user_id),
            fetch_one=True
        )
        
        if not estimate:
            return jsonify({'error': 'Estimate not found'}), 404
        
        # Parse JSON data
        if estimate.get('estimate_data'):
            estimate['estimate_data'] = json.loads(estimate['estimate_data'])
        
        return jsonify({'estimate': estimate}), 200
        
    except Exception as e:
        print(f"Get estimate error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@estimates_bp.route('/<int:estimate_id>', methods=['DELETE'])
@jwt_required()
def delete_estimate(estimate_id):
    """Delete an estimate"""
    try:
        user_id = get_jwt_identity()
        
        # Check if estimate exists and belongs to user
        estimate = db.execute_query(
            "SELECT id FROM estimates WHERE id = %s AND user_id = %s",
            (estimate_id, user_id),
            fetch_one=True
        )
        
        if not estimate:
            return jsonify({'error': 'Estimate not found'}), 404
        
        db.execute_query(
            "DELETE FROM estimates WHERE id = %s",
            (estimate_id,)
        )
        
        return jsonify({'message': 'Estimate deleted successfully'}), 200
        
    except Exception as e:
        print(f"Delete estimate error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@estimates_bp.route('/<int:estimate_id>', methods=['PUT'])
@jwt_required()
def update_estimate(estimate_id):
    """Update an estimate"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Check if estimate exists and belongs to user
        estimate = db.execute_query(
            "SELECT id FROM estimates WHERE id = %s AND user_id = %s",
            (estimate_id, user_id),
            fetch_one=True
        )
        
        if not estimate:
            return jsonify({'error': 'Estimate not found'}), 404
        
        # Build update query
        updates = []
        params = []
        
        if 'project_name' in data:
            updates.append("project_name = %s")
            params.append(data['project_name'])
        
        if 'estimate_data' in data:
            updates.append("estimate_data = %s")
            params.append(json.dumps(data['estimate_data']))
        
        if not updates:
            return jsonify({'error': 'No fields to update'}), 400
        
        params.append(estimate_id)
        query = f"UPDATE estimates SET {', '.join(updates)} WHERE id = %s"
        
        db.execute_query(query, tuple(params))
        
        return jsonify({'message': 'Estimate updated successfully'}), 200
        
    except Exception as e:
        print(f"Update estimate error: {e}")
        return jsonify({'error': 'Internal server error'}), 500
