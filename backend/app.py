from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
import requests
import os
from dotenv import load_dotenv
from functools import wraps

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config.update({
        'NODE_SERVER_URL': os.getenv('NODE_SERVER_URL', 'http://localhost:3000'),
        'SECRET_KEY': os.getenv('FLASK_SECRET_KEY'),
        'MAPBOX_TOKEN': os.getenv('MAPBOX_ACCESS_TOKEN'),
        'ENVIRONMENT': os.getenv('ENVIRONMENT', 'development')
    })

    # Security headers middleware
    @app.after_request
    def add_security_headers(response):
        response.headers.update({
            'Content-Security-Policy': "default-src 'self'; script-src 'self' *.mapbox.com; style-src 'self' 'unsafe-inline'",
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY'
        })
        return response

    CORS(app, resources={
        r"/api/*": {
            "origins": os.getenv("ALLOWED_ORIGINS", "http://localhost:5500"),
            "supports_credentials": True
        }
    })

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s'
    )

    # New config endpoint
    @app.route('/api/config')
    def get_config():
        return jsonify({
            'mapboxToken': app.config['MAPBOX_TOKEN'],
            'nodeServerUrl': app.config['NODE_SERVER_URL']
        })

    # Geocode proxy endpoint
    @app.route('/api/geocode')
    def geocode_proxy():
        try:
            address = request.args.get('address')
            if not address:
                return jsonify({"error": "Missing address"}), 400
                
            response = requests.get(
                f"{app.config['NODE_SERVER_URL']}/geocode",
                params={'address': address},
                timeout=5
            )
            response.raise_for_status()
            return jsonify(response.json())
        except Exception as e:
            logging.error(f"Geocode error: {str(e)}")
            return jsonify({"error": "Geocoding failed"}), 500

    # Existing routes...
    # [Keep your /api/health, /api/user-routes, etc.]

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(
        host=os.getenv('FLASK_HOST', '127.0.0.1'),
        port=int(os.getenv('FLASK_PORT', 5000)),
        debug=(os.getenv('ENVIRONMENT') == 'development')
    )