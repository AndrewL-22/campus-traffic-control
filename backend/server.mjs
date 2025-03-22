import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = 3000;
const apiKey = 'NXtUFQk24lm0ta5OP0xlwbsJvJu7GyqG';

app.use(cors());
app.use(express.json()); // Add JSON parsing middleware
app.get('/route', async (req, res) => {
    const { start, end } = req.query;
    console.log(`Calculating route from ${start} to ${end}`);
    
    const url = `https://api.tomtom.com/routing/1/calculateRoute/${start}:${end}/json?key=${apiKey}&traffic=true`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch route: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error calculating route:', error);
        res.status(500).json({ message: 'Error calculating route', error: error.message });
    }
});
// Endpoint to fetch traffic data from TomTom
app.get('/traffic/:z/:x/:y', async (req, res) => {
    const { z, x, y } = req.params;
    console.log(`Received request for tile: ${z}/${x}/${y}`);
    const url = `https://api.tomtom.com/traffic/map/4/tile/flow/relative/${z}/${x}/${y}.pbf?key=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        // Get the binary data
        const buffer = await response.arrayBuffer();
        
        // Set the correct content type
        res.set('Content-Type', 'application/x-protobuf');
        
        // Send the binary data directly
        res.send(Buffer.from(buffer));
    } catch (error) {
        console.error('Error fetching traffic data:', error);
        res.status(500).json({ message: 'Error fetching traffic data', error: error.message });
    }
});

// This goes at the end of your file
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}).on('error', (e) => {
    console.error('Server error:', e);
});