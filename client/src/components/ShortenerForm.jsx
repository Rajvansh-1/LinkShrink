import { useState } from 'react';
import axios from 'axios';
import { FaLink, FaMagic } from 'react-icons/fa';

const ShortenerForm = ({ onUrlShortened }) => {
  const [longUrl, setLongUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!longUrl) return;

    setLoading(true);
    setError('');

    try {
      // In production (Vercel), we use relative path to proxy correctly
      // In dev, we use localhost:5000
      const apiUrl = import.meta.env.DEV ? 'http://localhost:5000' : '';
      const userId = localStorage.getItem('userId');
      const res = await axios.post(`${apiUrl}/api/url/shorten`, { longUrl }, {
        headers: { 'x-user-id': userId }
      });
      onUrlShortened(res.data);
      setLongUrl('');
    } catch (err) {
      console.error(err);
      let errorMessage = 'Failed to shorten URL. Please try again.';

      if (err.response) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
          if (err.response.data?.details) {
            errorMessage += `: ${err.response.data.details}`;
          }
        } else if (err.response.data?.error) {
          errorMessage = err.response.data.error;
        } else {
          // Fallback for unknown object structure
          errorMessage = JSON.stringify(err.response.data);
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="input-group">
        <div style={{ position: 'relative', flex: 1 }}>
          <FaLink style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="url"
            placeholder="Paste your long URL here..."
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            style={{ paddingLeft: '3rem' }}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Shortening...' : <><FaMagic /> Shorten</>}
        </button>
      </form>
      {error && <p style={{ color: '#ef4444', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
    </div>
  );
};

export default ShortenerForm;
