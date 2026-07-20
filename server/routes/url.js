const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');
const { nanoid } = require('nanoid');
const db = require('../db/database');

// @route   POST /api/url/shorten
// @desc    Create short URL
router.post('/shorten', async (req, res) => {
  let { longUrl } = req.body;

  // 1. Smart Protocol Fixer
  // If user forgot 'http://' or 'https://', add 'https://' by default
  if (longUrl && !/^https?:\/\//i.test(longUrl)) {
    longUrl = 'https://' + longUrl;
  }

  // 2. Validate URL Integrity
  if (!validUrl.isUri(longUrl)) {
    return res.status(400).json({ message: 'Invalid URL format. Please check your link.' });
  }

  // 3. Determine Base URL
  // Use env var (Production) OR construct from request (Dev/Preview)
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

  if (!validUrl.isUri(baseUrl)) {
    return res.status(500).json({ message: 'Server Configuration Error: Invalid Base URL' });
  }

  // 4. Generate Unique Code
  // Using 6 characters for a better collision resistance while remaining short
  const urlCode = nanoid(6);

  try {
    const userId = req.headers['x-user-id']; // Track who created it
    
    // Save to DB
    await db.createUrl(urlCode, longUrl, userId);

    // Construct the final "simple" short URL
    // Removes trailing slash from baseUrl if present to avoid double slashes
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    const shortUrl = `${cleanBaseUrl}/${urlCode}`;

    res.json({
      urlCode,
      originalUrl: longUrl,
      shortUrl,
      clicks: 0,
      createdAt: new Date()
    });
  } catch (err) {
    console.error('Shorten Error:', err);
    res.status(500).json({ message: 'Failed to shorten link', details: err.message });
  }
});

// @route   GET /api/url/history
// @desc    Get recent URLs for specific user
router.get('/history', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const urls = await db.getAllUrls(userId);
    
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');

    const formattedUrls = urls.map(url => ({
      ...url,
      shortUrl: `${cleanBaseUrl}/${url.urlCode}`
    }));

    res.json(formattedUrls);
  } catch (err) {
    console.error('History Error:', err);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
});

// @route   DELETE /api/url/history
// @desc    Clear user history
router.delete('/history', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(400).json({ message: 'User ID required' });
    }
    await db.deleteUserUrls(userId);
    res.json({ message: 'History cleared successfully' });
  } catch (err) {
    console.error('Clear History Error:', err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
});

module.exports = router;