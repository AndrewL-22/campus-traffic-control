mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcmV3bG91aXMyMiIsImEiOiJjbThrY3ZwMW0wa3ZwMnJwdG4xeGcwNDhhIn0.DYNAbwZQRcK2EwX-7ibRXg';
// Add this near the top of your map.js file
const apiKey = 'NXtUFQk24lm0ta5OP0xlwbsJvJu7GyqG';
// Initialize the map
const map = new mapboxgl.Map({
    container: 'map', // ID of the map div
    style: 'mapbox://styles/mapbox/streets-v12', // Map style
    center: [-74.2700, 40.6964], // Example coordinates (Union, NJ)
    zoom: 14
});

// Add zoom and rotation controls
map.addControl(new mapboxgl.NavigationControl());

// Add a marker for your campus (replace with actual coordinates)
new mapboxgl.Marker()
    .setLngLat([-74.2331, 40.6802]) // Kean Coordinates
    .setPopup(new mapboxgl.Popup().setText("Kean University!"))
    .addTo(map);

// Wait for the map to load before adding sources and layers
map.on('load', function() {
    // Add the traffic source
    map.addSource('traffic', {
        type: 'vector',
        tiles: [`http://localhost:3000/traffic/{z}/{x}/{y}`],
        minzoom: 0,
        maxzoom: 22
    });
    
    // Add the traffic layer
    map.addLayer({
        'id': 'traffic-flow',
        'type': 'line',
        'source': 'traffic',
        'source-layer': 'Traffic flow', // This should match the layer name in the PBF
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': [
                'match',
                ['get', 'traffic_level'], // Changed from 'relative_speed' to 'traffic_level'
                0, 'red',
                1, 'yellow',
                 'green'
            ],
            'line-width': 2
        }
    });
    const keanCoordinates = [-74.2331, 40.6802];
document.getElementById('calculate-route').addEventListener('click', async () => {
    const startLocation = document.getElementById('start-location').value;
    
    if (!startLocation) {
        alert('Please enter a starting location');
        return;
    }
    
    // First, geocode the starting address to get coordinates
    try {
        const geocodeResponse = await fetch(`https://api.tomtom.com/search/2/geocode/${encodeURIComponent(startLocation)}.json?key=${apiKey}`);
        const geocodeData = await geocodeResponse.json();
        
        if (geocodeData.results && geocodeData.results.length > 0) {
            const startCoordinates = geocodeData.results[0].position;
            
            // Now calculate the route
            const routeResponse = await fetch(`http://localhost:3000/route?start=${startCoordinates.lat},${startCoordinates.lon}&end=${keanCoordinates[1]},${keanCoordinates[0]}`);
            const routeData = await routeResponse.json();
            
            // Display the route on the map
            if (routeData.routes && routeData.routes.length > 0) {
                const routeGeometry = routeData.routes[0].legs[0].points.map(point => [point.longitude, point.latitude]);
                
                // Remove existing route if any
                if (map.getSource('route')) {
                    map.removeLayer('route-layer');
                    map.removeSource('route');
                }
                
                // Add the route to the map
                map.addSource('route', {
                    'type': 'geojson',
                    'data': {
                        'type': 'Feature',
                        'properties': {},
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': routeGeometry
                        }
                    }
                });
                
                map.addLayer({
                    'id': 'route-layer',
                    'type': 'line',
                    'source': 'route',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': '#4882c5',
                        'line-width': 6,
                        'line-opacity': 0.8
                    }
                });
                
                // Fit the map to the route
                const bounds = new mapboxgl.LngLatBounds();
                routeGeometry.forEach(coord => bounds.extend(coord));
                map.fitBounds(bounds, { padding: 50 });
                
                // Display route information
                const summary = routeData.routes[0].summary;
                const travelTimeMinutes = Math.round(summary.travelTimeInSeconds / 60);
                const distanceMiles = (summary.lengthInMeters / 1609.34).toFixed(1);
                
                alert(`Route to Kean University:\nDistance: ${distanceMiles} miles\nEstimated travel time: ${travelTimeMinutes} minutes`);
            }
        } else {
            alert('Could not find the starting location. Please try a different address.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while calculating the route.');
    }
});
});