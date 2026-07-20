// Load environment variables FIRST, before any other requires.
// When Vercel calls this from the project root, we resolve the .env
// in the server subdirectory explicitly.
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../server/.env') });

const app = require('../server/server');

module.exports = app;
