const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const { nanoid } = require('nanoid');
const db = require('../db/database');

// @route   POST /api/url/shorten
// @desc    Create short URL
router.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;

  // Dynamic Base URL: Use configured env var, or derive from request (Vercel friendly)
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

  // Check base url
  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json('Invalid base url');
  }

  // Create url code
  const urlCode = nanoid(5);

  // Check long url
  if (validUrl.isUri(longUrl)) {
    try {
      // Check if URL already exists? (Optional, skipping for simplicity/performance to allow duplicates or just create new)
      // For this implementation, we'll just create a new one every time or we could check.
      // Let's just create new to allow multiple short links for same URL (common feature)

      // Let's just create new to allow multiple short links for same URL (common feature)

      const userId = req.headers['x-user-id'];
      await db.createUrl(urlCode, longUrl, userId);
      const shortUrl = `${baseUrl}/${urlCode}`;

      res.json({
        urlCode,
        originalUrl: longUrl,
        shortUrl,
        clicks: 0
      });
    } catch (err) {
      console.error('Shorten Error:', err);
      if (err.cause) console.error('Error Cause:', err.cause);
      res.status(500).json({ message: 'Server error', details: err.message });
    }
  } else {
    res.status(401).json('Invalid long url');
  }
});

// @route   GET /api/url/history
// @desc    Get recent URLs
router.get('/history', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const urls = await db.getAllUrls(userId);
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const formattedUrls = urls.map(url => ({
      ...url,
      shortUrl: `${baseUrl}/${url.urlCode}`
    }));
    res.json(formattedUrls);
  } catch (err) {
    console.error('History Error:', err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
});

module.exports = router;
