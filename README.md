# Premium URL Shortener

A simple, clean, and professional URL shortener built with React, Node.js, and SQLite.

## Features
- **Premium UI/UX**: Glassmorphism design, smooth animations, and responsive layout.
- **Robust Backend**: Node.js/Express with SQLite for reliable local data persistence.
- **History**: Keeps track of your recently shortened links.
- **Click Tracking**: Tracks the number of clicks for each link.

## Prerequisites
- Node.js installed.

## Setup & Run

1. **Install Dependencies**
   ```bash
   # Server
   cd server
   npm install

   # Client
   cd ../client
   npm install
   ```

2. **Start the Application**
   You need to run both the server and client.

   **Terminal 1 (Backend):**
   ```bash
   cd server
   node server.js
   ```

   **Terminal 2 (Frontend):**
   ```bash
   cd client
   npm run dev
   ```

3. **Open in Browser**
   Navigate to `http://localhost:5173`.

## Tech Stack
- **Frontend**: React, Vite, Vanilla CSS
- **Backend**: Express, Better-SQLite3, NanoID
