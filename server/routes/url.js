const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const { nanoid } = require('nanoid');
const db = require('../db/database');

// @route   POST /api/url/shorten
// @desc    Create short URL
router.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

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

      await db.createUrl(urlCode, longUrl);
      const shortUrl = `${baseUrl}/${urlCode}`;

      res.json({
        urlCode,
        originalUrl: longUrl,
        shortUrl,
        clicks: 0
      });
    } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
    }
  } else {
    res.status(401).json('Invalid long url');
  }
});

// @route   GET /api/url/history
// @desc    Get recent URLs
router.get('/history', async (req, res) => {
  try {
    const urls = await db.getAllUrls();
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const formattedUrls = urls.map(url => ({
      ...url,
      shortUrl: `${baseUrl}/${url.urlCode}`
    }));
    res.json(formattedUrls);
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
});

module.exports = router;
