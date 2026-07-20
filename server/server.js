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
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-user-id']
}));
app.use(express.json());

// API Routes
app.use('/api/url', urlRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'active',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// The Redirect Engine — only matches valid short codes, never API paths
app.get('/:code([a-zA-Z0-9_-]{5,8})', async (req, res) => {
  try {
    const code = req.params.code;
    const url = await db.getUrl(code);

    if (url) {
      // Fire-and-forget click tracking (non-blocking)
      db.incrementClicks(code).catch(err => console.error('Click tracking failed:', err));

      // 307 Temporary Redirect: forces browser to re-hit server on revisit
      // so click analytics work correctly
      return res.redirect(307, url.originalUrl);
    }

    return res.status(404).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Link Not Found — LinkShrink</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background: #030014;
              color: white;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }
            .container { text-align: center; padding: 2rem; }
            .code { font-size: 6rem; font-weight: 800; background: linear-gradient(135deg, #6366f1, #a855f7); -webkit-background-clip: text; background-clip: text; color: transparent; line-height: 1; }
            .title { font-size: 1.5rem; margin-top: 1rem; color: #94a3b8; }
            .home-btn {
              display: inline-block;
              margin-top: 2rem;
              padding: 0.875rem 2rem;
              background: linear-gradient(135deg, #6366f1, #a855f7);
              color: white;
              text-decoration: none;
              border-radius: 12px;
              font-weight: 600;
              transition: opacity 0.2s;
            }
            .home-btn:hover { opacity: 0.85; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="code">404</div>
            <p class="title">This link doesn't exist or has expired.</p>
            <a href="/" class="home-btn">← Go to LinkShrink</a>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Redirect Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Start Server (Only if not running as a Vercel serverless module)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server launched on port ${PORT}`);
  });
}

module.exports = app;