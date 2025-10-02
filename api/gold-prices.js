const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

async function fetchGoldPrice() {
  try {
    const response = await axios.get('https://data-asg.goldprice.org/dbXRates/USD');
    const ozPrice = parseFloat(response.data.items[0].xauPrice);
    const gramPrice = ozPrice / 31.1035;
    
    return {
      spotPrice: Math.round(ozPrice * 100) / 100,
      pricePerGram: Math.round(gramPrice * 100) / 100,
      lastUpdated: new Date().toISOString(),
      market: "Live Market"
    };
  } catch (error) {
    console.error('Gold price fetch error:', error.message);
    return {
      spotPrice: 3760.69,
      pricePerGram: 120.91,
      lastUpdated: new Date().toISOString(),
      market: "Fallback Data"
    };
  }
}

app.get('/api/gold-prices', async (req, res) => {
  try {
    const goldPrice = await fetchGoldPrice();
    res.status(200).json(goldPrice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gold price' });
  }
});

app.get('/api/config', (req, res) => {
  res.status(200).json({
    refreshIntervalMs: 600000,
    apiPlan: "railway",
    refreshIntervalSeconds: 600,
    refreshIntervalMinutes: 10
  });
});

app.get('/', (req, res) => {
  res.status(200).json({ 
    message: "Gold Calculator API is running!",
    endpoints: [
      "/api/gold-prices",
      "/api/config"
    ]
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
