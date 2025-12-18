const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db/database');
const urlRoutes = require('./routes/url');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust Proxy for Vercel/Heroku (Critical for correct protocol/host detection)
app.enable('trust proxy');

// Middleware
app.use(cors({
  origin: '*', // For production, restrict this to your frontend domain
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-user-id']
}));
app.use(express.json());

// Routes
app.use('/api/url', urlRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'active', 
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString() 
  });
});

// The Redirect Engine
app.get('/:code', async (req, res) => {
  try {
    const code = req.params.code;
    const url = await db.getUrl(code);

    if (url) {
      // Fire and forget click tracking (Non-blocking)
      db.incrementClicks(code).catch(err => console.error('Click tracking failed:', err));
      
      // 301 Permanent Redirect is better for SEO/Link juice, 
      // but 302/307 is better for analytics (forces hit to server).
      // We use 307 Temporary Redirect to ensure analytics work.
      return res.redirect(307, url.originalUrl);
    }
    
    return res.status(404).send(`
      <html>
        <body style="display:flex;justify-content:center;align-items:center;height:100vh;background:#030014;color:white;font-family:sans-serif;">
          <div style="text-align:center;">
            <h1 style="color:#a855f7;">404</h1>
            <p>Link not found or expired.</p>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Redirect Error:', err);
    res.status(500).json('Server Error');
  }
});

// Start Server (Only if not running as a module/serverless)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server launched on port ${PORT}`);
  });
}

module.exports = app;