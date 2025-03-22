from flask import Blueprint, jsonify, request
from services.tomtom_traffic import TrafficService
from services.tomtom_routing import RoutingService

traffic_bp = Blueprint('traffic', __name__)

@traffic_bp.route('/incidents', methods=['GET'])
def get_incidents():
    bbox = request.args.get('bbox')
    if not bbox:
        return jsonify({"error": "Missing bbox parameter"}), 400
    
    try:
        incidents = TrafficService.get_incidents(bbox)
        return jsonify(incidents)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@traffic_bp.route('/flow', methods=['GET'])
def get_flow():
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)
    
    if not lat or not lon:
        return jsonify({"error": "Missing lat/lon parameters"}), 400
    
    try:
        flow_data = TrafficService.get_flow_segment_data(lat, lon)
        return jsonify(flow_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@traffic_bp.route('/route', methods=['GET'])
def calculate_route():
    origin_lat = request.args.get('origin_lat', type=float)
    origin_lon = request.args.get('origin_lon', type=float)
    dest_lat = request.args.get('dest_lat', type=float)
    dest_lon = request.args.get('dest_lon', type=float)
    
    try:
        route = RoutingService.calculate_route(
            (origin_lat, origin_lon),
            (dest_lat, dest_lon)
        )
        return jsonify(route)
    except Exception as e:
        return jsonify({"error": str(e)}), 500