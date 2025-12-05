import { useState, useEffect } from 'react';
import axios from 'axios';
import ShortenerForm from './components/ShortenerForm';
import UrlResult from './components/UrlResult';
import History from './components/History';

import Footer from './components/Footer';

function App() {
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/url/history');
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleUrlShortened = (result) => {
    setCurrentResult(result);
    fetchHistory();
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

        <History history={history} />
      </div>

      <Footer />
    </div>
  );
}

export default App;
