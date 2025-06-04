// server.js
const express = require('express');
const fetch = require('node-fetch');
const NodeCache = require('node-cache');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

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
        const response = await fetch('YOUR_ETHERSCAN_API_ENDPOINT');
        const data = await response.json();
        
        // Store in cache
        cache.set('svgData', data);
        
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/api/etherscan', async (req, res) => {
  const now = Date.now();
  const cachedData = cache.get('etherscanData');
  if (cachedData && (now - cachedData.time < 3600000)) {
    return res.json(cachedData.data);
  }
  // Build your Etherscan URL here
  const API_KEY = ETHERSCAN_API_KEY;
  const CONTRACT = "0xd16809c0a7d82c9e7552a01fd608fff90efb564f";
  const methodID = "0xc87b56dd";
  const tokenId = 0;
  const hexTokenId = tokenId.toString(16).padStart(64, '0');
  const data = methodID + hexTokenId;

  const url = new URL('https://api.etherscan.io/api');
  url.searchParams.set('module', 'proxy');
  url.searchParams.set('action', 'eth_call');
  url.searchParams.set('to', CONTRACT);
  url.searchParams.set('data', data);
  url.searchParams.set('tag', 'latest');
  url.searchParams.set('apikey', API_KEY);

  try {
    const response = await fetch(url.toString());
    const json = await response.json();
    cache.set('etherscanData', { data: json, time: now });
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch from Etherscan' });
  }
});

app.use('/RCSF', express.static('RCSF'));
app.get('/test', (req, res) => {
    res.send('Test route works!');
  });
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));