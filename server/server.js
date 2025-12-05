const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db/database');
const urlRoutes = require('./routes/url');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/url', urlRoutes);

// Redirect route
app.get('/:code', (req, res) => {
  try {
    const url = db.getUrl(req.params.code);
    if (url) {
      // Increment clicks (async, don't wait)
      db.incrementClicks(req.params.code);
      return res.redirect(url.originalUrl);
    }
    return res.status(404).json('No URL found');
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
