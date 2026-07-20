import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ShortenerForm from './components/ShortenerForm';
import UrlResult from './components/UrlResult';
import History from './components/History';
import Footer from './components/Footer';

// Always use same-origin — Vite proxy handles /api/* in dev, Vercel in production
const API_BASE = '';

function App() {
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);

  // Ensure userId exists in localStorage on first load
  useEffect(() => {
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', crypto.randomUUID());
    }
    fetchHistory();
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const userId = localStorage.getItem('userId');
      const res = await axios.get('/api/url/history', {
        headers: { 'x-user-id': userId }
      });
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to fetch history:', err.message);
    }
  }, []);

  const handleUrlShortened = (result) => {
    setCurrentResult(result);
    fetchHistory();
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Clear all your recent links? This cannot be undone.')) return;
    try {
      const userId = localStorage.getItem('userId');
      await axios.delete('/api/url/history', {
        headers: { 'x-user-id': userId }
      });
      setHistory([]);
      setCurrentResult(null);
    } catch (err) {
      console.error('Failed to clear history:', err.message);
    }
  };

  return (
    <>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        gap: '2rem',
        paddingTop: '4rem',
        paddingBottom: '2rem'
      }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '280px',
            height: '280px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)',
            filter: 'blur(50px)',
            zIndex: -1
          }} />
          <h1>LinkShrink</h1>
          <p className="subtitle">Make your links infinite.</p>
        </div>

        {/* Shortener + Result */}
        <div style={{ width: '100%', maxWidth: '640px' }}>
          <ShortenerForm onUrlShortened={handleUrlShortened} />
          <UrlResult result={currentResult} />
        </div>

        {/* History */}
        <div style={{ width: '100%', maxWidth: '640px' }}>
          <History history={history} onClearHistory={handleClearHistory} />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;