import requests
import os

TOMTOM_API_KEY = os.getenv("TOMTOM_API_KEY")

class RoutingService:
    @staticmethod
    def calculate_route(origin: tuple, destination: tuple):
        """Calculate route with traffic considerations"""
        url = f"https://api.tomtom.com/routing/1/calculateRoute/{origin[0]},{origin[1]}:{destination[0]},{destination[1]}/json"
        
        params = {
            "key": TOMTOM_API_KEY,
            "traffic": "true",
            "travelMode": "car",
            "sectionType": ["carTrain", "ferry", "tunnel", "motorway"],
            "avoid": "unpavedRoads",
            "routeRepresentation": "polyline",
            "computeTravelTimeFor": "all",
            "routeType": "fastest"
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()