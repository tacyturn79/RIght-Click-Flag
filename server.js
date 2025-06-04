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
const tokenId = 0; // You can modify this as needed

  const API_KEY = "88YEWP8NGP2X5S34NGAFX9ZXDBVNUX3ZCJ";
  const CONTRACT = "0xd16809c0a7d82c9e7552a01fd608fff90efb564f";
        // If not in cache, fetch from Etherscan
        const methodID = "0xc87b56dd";
  const hexTokenId = tokenId.toString(16).padStart(64, '0');
  const data = methodID + hexTokenId;

  const url = new URL('https://api.etherscan.io/api');
  url.searchParams.set('module', 'proxy');
  url.searchParams.set('action', 'eth_call');
  url.searchParams.set('to', CONTRACT);
  url.searchParams.set('data', data);
  url.searchParams.set('tag', 'latest');
  url.searchParams.set('apikey', API_KEY);
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