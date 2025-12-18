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
    if (!confirm('Are you sure you want to clear your history?')) return;
    try {
      const userId = localStorage.getItem('userId');
      const apiUrl = import.meta.env.DEV ? 'http://localhost:5000' : '';
      await axios.delete(`${apiUrl}/api/url/history`, {
        headers: { 'x-user-id': userId }
      });
      setHistory([]);
    } catch (err) {
      console.error('Failed to clear history', err);
    }
  };

  return (
    <>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '3rem', paddingTop: '4rem' }}>
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: '200px', 
            height: '200px', 
            background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)', 
            filter: 'blur(40px)', 
            zIndex: -1 
          }}></div>
          <h1>LinkShrink</h1>
          <p className="subtitle">Make your links infinite.</p>
        </div>

        <div style={{ width: '100%', maxWidth: '600px' }}>
          <ShortenerForm onUrlShortened={handleUrlShortened} />
          <UrlResult result={currentResult} />
        </div>

        <div style={{ width: '100%', maxWidth: '600px' }}>
          <History history={history} onClearHistory={handleClearHistory} />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;