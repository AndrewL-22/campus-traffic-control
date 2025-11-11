# Contributors
[@weepingeye](https://github.com/weepingeye)
[@AndrewL-22](https://github.com/AndrewL-22)

# Campus Traffic Control System
Were you ever late to campus because of stupid traffic. We have created a solution for that. We have implemented a real-time traffic monitoring and routing system for university campuses, leveraging TomTom APIs and Mapbox GL JS to find the fast route from where you are to your specified 


## Features
- Real-time traffic flow visualization
- Optimal route calculation with traffic consideration
- Address geocoding and reverse geocoding
- Interactive map interface with zoom/rotation controls
- Traffic-aware campus navigation
- Secure API key management
- Rate limiting and input validation

## Technologies
**Backend:**
- Python Flask (REST API)
- Node.js (TomTom API proxy)

**Frontend:**
- Mapbox GL JS
- HTML5/CSS3
- JavaScript (ES6+)

**Services:**
- TomTom Traffic Flow API
- TomTom Routing API
- Mapbox Vector Tiles

## Installation

### Prerequisites
- Python 3.9+
- Node.js 16+
- npm 8+
- Git


### Data Movement Visualization
Frontend → Flask → Node.js → TomTom API
Frontend ← Flask ← Node.js ← TomTom API
