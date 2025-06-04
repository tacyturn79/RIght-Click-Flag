const express = require('express');
const fetch = require('node-fetch');
const NodeCache = require('node-cache');
const path = require('path');
require('dotenv').config();

const app = express();
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

// Serve static files
app.use(express.static('public'));

// Cache middleware for SVG endpoint
app.get('/api/etherscan', async (req, res) => {
    try {
        // Check cache first
        const cachedData = cache.get('svgData');
        if (cachedData) {
            return res.json(cachedData);
        }

        // If not in cache, fetch from Etherscan
        const apiKey = process.env.ETHERSCAN_API_KEY;
        const contractAddress = '0x1234567890123456789012345678901234567890'; // Replace with your contract address
        const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        // Store in cache
        cache.set('svgData', data);
        
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});