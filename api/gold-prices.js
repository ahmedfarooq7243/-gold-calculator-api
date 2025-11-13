// ============================================
// RAILWAY BACKEND - FIXED & OPTIMIZED
// Timer: 60 seconds | SEO: Enabled | FAQs: Removed
// ============================================

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

// ============================================
// GOLD API CONFIGURATION
// ============================================
const GOLD_API_KEY = 'a19593b0402252df32cc48ea2b1d489b';
const METALS_API_URL = `https://api.metals.dev/v1/latest?api_key=${GOLD_API_KEY}&currency=USD&unit=toz`;

// ============================================
// LIVE GOLD PRICE FETCHER
// ============================================
async function fetchGoldPrice() {
  try {
    console.log('📊 Fetching gold price from Metals.dev API...');
    
    const response = await axios.get(METALS_API_URL, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'GoldCalculator/1.0'
      }
    });

    if (response.data && response.data.metals && response.data.metals.gold) {
      const ozPrice = parseFloat(response.data.metals.gold);
      const gramPrice = ozPrice / 31.1035;

      console.log(`✅ Gold price fetched: $${ozPrice}/oz`);

      return {
        spotPrice: Math.round(ozPrice * 100) / 100,
        pricePerGram: Math.round(gramPrice * 100) / 100,
        lastUpdated: new Date().toISOString(),
        market: "Live Market",
        source: "metals.dev"
      };
    } else {
      throw new Error('Invalid API response structure');
    }
  } catch (error) {
    console.error('❌ Gold API Error:', error.message);
    
    // Fallback price
    return {
      spotPrice: 2650.00,
      pricePerGram: 85.20,
      lastUpdated: new Date().toISOString(),
      market: "Estimated (Fallback)",
      source: "fallback"
    };
  }
}

// ============================================
// SEO SNAPSHOT ENDPOINT (NO FAQ - WordPress handles it)
// ============================================
app.get('/seo-snapshot', async (req, res) => {
  try {
    const goldData = await fetchGoldPrice();

    res.set({
      'Content-Type': 'text/html; charset=UTF-8',
      'Cache-Control': 'public, max-age=300',
      'X-Robots-Tag': 'index, follow'
    });

    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gold Calculator - Live Gold Price Calculator 2025</title>
  <meta name="description" content="Free gold calculator with live rates updated every minute. Calculate gold value in grams, ounces, tola, pennyweight. Current: $${goldData.spotPrice}/oz">
  <meta name="keywords" content="gold calculator, gold price, 22k gold, 24k gold, tola, troy ounce">
</head>
<body>
  <main>
    <h1>Live Gold Price Calculator - Real-Time Gold Value</h1>

    <div class="price-info">
      <p><strong>Current Gold Price:</strong> $${goldData.spotPrice} per troy ounce</p>
      <p><strong>Price per Gram:</strong> $${goldData.pricePerGram}</p>
      <p><strong>Last Updated:</strong> ${new Date(goldData.lastUpdated).toLocaleString()}</p>
    </div>

    <h2>How to Use the Gold Calculator</h2>
    <ol>
      <li><strong>Enter Weight:</strong> Input gold weight</li>
      <li><strong>Select Unit:</strong> Grams, ounces, tola, pennyweight, kg</li>
      <li><strong>Choose Purity:</strong> 8K to 24K karat</li>
      <li><strong>Calculate:</strong> Get instant market value</li>
    </ol>

    <h2>Supported Units</h2>
    <ul>
      <li><strong>Grams (g)</strong> - Metric unit</li>
      <li><strong>Troy Ounce (oz)</strong> - 31.1035 grams</li>
      <li><strong>Tola</strong> - 11.66 grams (South Asian)</li>
      <li><strong>Pennyweight (dwt)</strong> - 1.555 grams</li>
      <li><strong>Kilogram (kg)</strong> - 1000 grams</li>
    </ul>

    <h2>Gold Purity Levels</h2>
    <ul>
      <li><strong>24K</strong> – 99.9% pure (investment)</li>
      <li><strong>22K</strong> – 91.6% pure (jewelry)</li>
      <li><strong>18K</strong> – 75% pure</li>
      <li><strong>14K</strong> – 58.3% pure</li>
      <li><strong>10K</strong> – 41.7% pure</li>
      <li><strong>8K</strong> – 33.3% pure</li>
    </ul>

    <p><strong>Start calculating your gold value now!</strong></p>
  </main>
</body>
</html>
    `);
  } catch (error) {
    console.error('SEO Snapshot Error:', error);
    res.status(500).send('<h1>Error loading calculator</h1>');
  }
});

// ============================================
// API ENDPOINTS - 60 SECOND UPDATE
// ============================================

// Main gold price endpoint
app.get('/api/gold-prices', async (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const goldPrice = await fetchGoldPrice();
    res.status(200).json(goldPrice);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch gold price' });
  }
});

// Config endpoint - 60 SECONDS UPDATE INTERVAL
app.get('/api/config', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  res.json({
    refreshIntervalMs: 60000,        // ✅ 60 seconds (changed from 600000)
    refreshIntervalSeconds: 60,       // ✅ 60 seconds
    refreshIntervalMinutes: 1,        // ✅ 1 minute
    apiPlan: "railway",
    updateFrequency: "Every 60 seconds"
  });
});

// Backward compatibility
app.get('/api/goldprices', async (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const goldPrice = await fetchGoldPrice();
    res.status(200).json(goldPrice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gold price' });
  }
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    apiKey: GOLD_API_KEY ? 'Configured' : 'Missing',
    updateInterval: '60 seconds'
  });
});

// ============================================
// SITEMAP & ROBOTS
// ============================================
app.get('/sitemap.xml', (req, res) => {
  res.set('Content-Type', 'application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://gold-calculator-api-production.up.railway.app/</loc>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://gold-calculator-api-production.up.railway.app/seo-snapshot</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`);
});

app.get('/robots.txt', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(`User-agent: *
Allow: /
Sitemap: https://gold-calculator-api-production.up.railway.app/sitemap.xml`);
});

// ============================================
// HOME ROUTE
// ============================================
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Gold Calculator API - Ready ✅</title>
  <style>
    body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; }
    h1 { color: #d4af37; }
    .status { background: #d4f4dd; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .endpoint { background: #f4f4f4; padding: 10px; margin: 10px 0; border-left: 4px solid #d4af37; }
    code { background: #333; color: #fff; padding: 3px 8px; border-radius: 3px; }
  </style>
</head>
<body>
  <h1>🏆 Gold Calculator API - Ready!</h1>

  <div class="status">
    <strong>✅ Server Running</strong><br>
    Update Interval: <strong>60 seconds</strong><br>
    API Key: <strong>${GOLD_API_KEY ? 'Configured' : 'Missing'}</strong>
  </div>

  <h2>Endpoints:</h2>

  <div class="endpoint">
    <code>GET /api/gold-prices</code><br>
    Live gold prices (60 sec updates)
  </div>

  <div class="endpoint">
    <code>GET /api/config</code><br>
    Configuration settings
  </div>

  <div class="endpoint">
    <code>GET /seo-snapshot</code><br>
    SEO-optimized HTML snapshot
  </div>

  <div class="endpoint">
    <code>GET /health</code><br>
    Health check
  </div>

  <p><a href="/api/gold-prices">→ Test Live Prices</a> | <a href="/api/config">→ View Config</a> | <a href="/health">→ Health</a></p>
</body>
</html>
  `);
});

// ============================================
// SERVER START - Railway compatible
// ============================================
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50));
  console.log('✅ Gold Calculator Backend - READY');
  console.log('='.repeat(50));
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`⏰ Update Interval: 60 seconds`);
  console.log(`🔑 API Key: ${GOLD_API_KEY ? 'Configured' : 'Missing'}`);
  console.log('='.repeat(50));
  console.log('📊 Endpoints:');
  console.log(`   /api/gold-prices - Live prices`);
  console.log(`   /api/config - Configuration`);
  console.log(`   /seo-snapshot - SEO HTML`);
  console.log(`   /health - Health check`);
  console.log('='.repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = app;
