import requests
import os

TOMTOM_API_KEY = os.getenv("TOMTOM_API_KEY")
VERSION = 5  # Using latest v5 API

class TrafficService:
    @staticmethod
    def get_incidents(bbox: str, params: dict = None):
        """Get traffic incidents within bounding box"""
        url = f"https://api.tomtom.com/traffic/services/{VERSION}/incidentDetails"
        
        default_params = {
            "key": TOMTOM_API_KEY,
            "bbox": bbox,
            "language": "en-US",
            "projection": "EPSG4326"
        }
        
        response = requests.get(
            url,
            params={**default_params, **(params or {})}
        )
        response.raise_for_status()
        return response.json()

    @staticmethod
    def get_flow_segment_data(lat: float, lon: float, zoom: int = 12):
        """Get flow data for specific coordinate"""
        url = f"https://api.tomtom.com/traffic/services/{VERSION}/flowSegmentData/absolute/{zoom}/json"
        
        params = {
            "key": TOMTOM_API_KEY,
            "point": f"{lat},{lon}",
            "unit": "MPH"
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()

    @staticmethod
    def get_vector_tiles(tile_type: str, z: int, x: int, y: int):
        """Get vector tiles for map visualization"""
        url = f"https://api.tomtom.com/traffic/map/{VERSION}/tile/flow/{tile_type}/{z}/{x}/{y}.pbf"
        
        params = {
            "key": TOMTOM_API_KEY,
            "tileSize": 512
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.content