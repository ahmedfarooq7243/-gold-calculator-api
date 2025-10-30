// ============================================
// RAILWAY BACKEND - SEO Optimized Implementation
// ============================================
// Yeh code aapke Railway backend mein add karna hai

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(compression()); // Gzip compression for faster response
app.use(express.json());

// ============================================
// LIVE GOLD PRICE FETCHER
// ============================================
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
    // Fallback data agar API fail ho jaye
    return {
      spotPrice: 3760.69,
      pricePerGram: 120.91,
      lastUpdated: new Date().toISOString(),
      market: "Fallback Data"
    };
  }
}

// ============================================
// SEO SNAPSHOT ENDPOINT - Google ke liye
// ============================================
app.get('/seo-snapshot', (req, res) => {
  res.set('Content-Type', 'text/html; charset=UTF-8');
  res.set('Cache-Control', 'public, max-age=3600'); // 1 hour cache
  
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gold Calculator - Live Gold Price Calculator 2025</title>
  <meta name="description" content="Free gold calculator with live rates updated every 10 minutes. Calculate gold value in grams, ounces, tola, pennyweight, kilograms. Supports 8K-24K gold purity.">
</head>
<body>
  <main>
    <h1>Live Gold Price Calculator - Real-Time Gold Value Calculator</h1>
    
    <p>Calculate the exact value of your gold in grams, ounces, tola, pennyweight, and kilograms using real-time market prices updated every 10 minutes. Our free gold calculator provides instant, accurate valuations based on current spot prices.</p>

    <h2>How the Gold Calculator Works</h2>
    <ol>
      <li><strong>Enter Weight:</strong> Input the weight of your gold and choose your preferred unit (grams, ounces, tola, pennyweight, or kilograms)</li>
      <li><strong>Select Metal Purity:</strong> Choose the karat of your gold (8K, 10K, 14K, 18K, 22K, or 24K)</li>
      <li><strong>Get Instant Value:</strong> See real-time market value and estimated payout amounts instantly</li>
    </ol>

    <h2>Supported Gold Purity Levels (Karats)</h2>
    <ul>
      <li><strong>24K Gold</strong> – 99.9% pure gold (999 fineness) - Investment grade</li>
      <li><strong>22K Gold</strong> – 91.6% pure gold (916 fineness) - Popular in jewelry</li>
      <li><strong>18K Gold</strong> – 75% pure gold (750 fineness) - High-quality jewelry</li>
      <li><strong>14K Gold</strong> – 58.3% pure gold (585 fineness) - Durable jewelry</li>
      <li><strong>10K Gold</strong> – 41.7% pure gold (417 fineness) - Affordable option</li>
      <li><strong>8K Gold</strong> – 33.3% pure gold (333 fineness) - Budget jewelry</li>
    </ul>

    <h2>Weight Units Supported</h2>
    <ul>
      <li><strong>Grams (g)</strong> - Most common metric unit</li>
      <li><strong>Troy Ounces (oz)</strong> - Standard for precious metals (31.1035 grams)</li>
      <li><strong>Tola</strong> - Traditional South Asian unit (11.66 grams)</li>
      <li><strong>Pennyweight (dwt)</strong> - Jeweler's unit (1.555 grams)</li>
      <li><strong>Kilograms (kg)</strong> - For large quantities (1000 grams)</li>
    </ul>

    <h2>Frequently Asked Questions (FAQ)</h2>
    
    <h3>How accurate is this gold calculator?</h3>
    <p>Our gold calculator uses live spot prices updated every 10 minutes from major gold markets. The calculation multiplies your weight × purity percentage × current spot price per troy ounce, automatically converting to your selected unit for maximum accuracy.</p>

    <h3>What's the difference between 22K and 24K gold?</h3>
    <p>24K gold is 99.9% pure (best for investment), while 22K gold is 91.6% pure and commonly used in jewelry because it's more durable. 22K gold has a slightly lower value per gram due to the lower gold content.</p>

    <h3>How is gold purity measured?</h3>
    <p>Gold purity is measured in karats (K) or fineness. 24K = 100% pure, 22K = 91.6% (916 fineness), 18K = 75% (750 fineness), and so on. Higher karat means more pure gold content and higher value.</p>

    <h3>Can I use this calculator for selling gold?</h3>
    <p>Yes! Our calculator shows both the market value (spot price) and estimated payout amounts. Buyers typically pay 70-95% of spot value depending on quantity and purity. Use this as a reference when negotiating.</p>

    <h3>How often are gold prices updated?</h3>
    <p>Gold prices in our calculator are updated every 10 minutes based on international spot prices from major trading markets including London, New York, and Zurich.</p>

    <h3>What is troy ounce vs regular ounce?</h3>
    <p>A troy ounce (used for precious metals) weighs 31.1035 grams, while a regular (avoirdupois) ounce weighs 28.35 grams. Always use troy ounces for gold calculations for accuracy.</p>

    <h2>Why Use Our Gold Calculator?</h2>
    <ul>
      <li>✅ Real-time prices updated every 10 minutes</li>
      <li>✅ Multiple weight units (grams, ounces, tola, pennyweight, kg)</li>
      <li>✅ All gold purities from 8K to 24K supported</li>
      <li>✅ Instant calculations with no registration required</li>
      <li>✅ Mobile-friendly and easy to use</li>
      <li>✅ Free forever - no hidden charges</li>
    </ul>

    <h2>Understanding Gold Market Prices</h2>
    <p>Gold prices fluctuate based on global economic conditions, currency values, inflation rates, and market demand. Use our calculator to track the current value of your gold holdings and make informed decisions about buying or selling.</p>

    <p><strong>Start calculating now</strong> - Enter your gold weight and purity above to get instant market value!</p>
  </main>
</body>
</html>
  `);
});

// ============================================
// LIVE API ENDPOINTS - No cache for real-time data
// ============================================

// Main gold price endpoint (LIVE DATA)
app.get('/api/gold-prices', async (req, res) => {
  // Fresh data headers - no caching
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  try {
    const goldPrice = await fetchGoldPrice();
    res.status(200).json(goldPrice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gold price' });
  }
});

// Configuration endpoint
app.get('/api/config', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.status(200).json({
    refreshIntervalMs: 600000,
    apiPlan: "railway",
    refreshIntervalSeconds: 600,
    refreshIntervalMinutes: 10
  });
});

// Backward compatibility endpoint (same as /api/gold-prices)
app.get('/api/goldprices', async (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  try {
    const goldPrice = await fetchGoldPrice();
    res.status(200).json(goldPrice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gold price' });
  }
});

// ============================================
// HEALTH CHECK - Railway ke liye
// ============================================
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// STATIC FILES - Cache headers ke sath
// ============================================
app.use(express.static('public', {
  maxAge: '1d', // 1 day cache for static assets
  etag: true
}));

// ============================================
// MAIN APP ROUTE
// ============================================
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gold Calculator Backend - Ready</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; line-height: 1.6; }
    h1 { color: #d4af37; }
    .status { background: #d4f4dd; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .endpoint { background: #f4f4f4; padding: 10px; border-left: 4px solid #d4af37; margin: 10px 0; }
    code { background: #333; color: #fff; padding: 2px 6px; border-radius: 3px; }
  </style>
</head>
<body>
  <h1>🏆 Gold Calculator Backend - SEO Optimized</h1>
  
  <div class="status">
    <strong>✅ Server Running Successfully!</strong><br>
    Railway backend ready for deployment
  </div>

  <h2>Available Endpoints:</h2>
  
  <div class="endpoint">
    <strong>SEO Snapshot:</strong><br>
    <code>GET /seo-snapshot</code><br>
    → Google-optimized HTML with full content
  </div>

  <div class="endpoint">
    <strong>Live Gold Prices:</strong><br>
    <code>GET /api/gold-prices</code><br>
    → Real-time gold prices from goldprice.org (no cache)
  </div>

  <div class="endpoint">
    <strong>API Config:</strong><br>
    <code>GET /api/config</code><br>
    → Refresh interval settings
  </div>

  <div class="endpoint">
    <strong>Health Check:</strong><br>
    <code>GET /health</code><br>
    → Server status
  </div>

  <h2>Next Steps:</h2>
  <ol>
    <li>Deploy yeh code apne Railway app mein</li>
    <li>Cloudflare Worker setup karo (cloudflare-worker.js file dekho)</li>
    <li>Testing karo IMPLEMENTATION-GUIDE.md file ke hisaab se</li>
  </ol>

  <p><a href="/seo-snapshot">→ SEO Snapshot Preview</a> | <a href="/api/gold-prices">→ Live Gold Prices</a> | <a href="/api/config">→ Config</a></p>
</body>
</html>
  `);
});

// Server start
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Gold Calculator Backend running on port ${PORT}`);
  console.log(`📊 SEO Snapshot: http://localhost:${PORT}/seo-snapshot`);
  console.log(`💰 Live Gold Prices: http://localhost:${PORT}/api/gold-prices`);
  console.log(`⚙️  Config: http://localhost:${PORT}/api/config`);
});

