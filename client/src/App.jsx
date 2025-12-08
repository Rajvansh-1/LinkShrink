import { useState, useEffect } from 'react';
import axios from 'axios';
import ShortenerForm from './components/ShortenerForm';
import UrlResult from './components/UrlResult';
import History from './components/History';

import Footer from './components/Footer';

function App() {
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Generate/Get User ID
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem('userId', userId);
    }
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const userId = localStorage.getItem('userId');
      // In production (Vercel), we use relative path to proxy correctly
      // In dev, we use localhost:5000
      const apiUrl = import.meta.env.DEV ? 'http://localhost:5000' : '';
      const res = await axios.get(`${apiUrl}/api/url/history`, {
        headers: { 'x-user-id': userId }
      });
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  const handleUrlShortened = (result) => {
    setCurrentResult(result);
    fetchHistory();
  };

  const handleClearHistory = async () => {
    if (!confirm('Are you sure you want to clear your history? This cannot be undone.')) return;

    try {
      const userId = localStorage.getItem('userId');
      const apiUrl = import.meta.env.DEV ? 'http://localhost:5000' : '';
      await axios.delete(`${apiUrl}/api/url/history`, {
        headers: { 'x-user-id': userId }
      });
      setHistory([]);
    } catch (err) {
      console.error('Failed to clear history', err);
      alert('Failed to clear history');
    }
  };

  return (
    <div className="container" style={{ minHeight: '100vh', paddingBottom: '0' }}>
      <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h1>LinkShrink</h1>
          <p className="subtitle">Premium URL Shortener for modern needs.</p>
        </div>

        <div style={{ width: '100%' }}>
          <ShortenerForm onUrlShortened={handleUrlShortened} />
          <UrlResult result={currentResult} />
        </div>

        <History history={history} onClearHistory={handleClearHistory} />
      </div>

      <Footer />
    </div>
  );
}

export default App;
