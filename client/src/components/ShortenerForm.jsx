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
      const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');
      const res = await axios.post(`${apiUrl}/api/url/shorten`, { longUrl });
      onUrlShortened(res.data);
      setLongUrl('');
    } catch (err) {
      setError('Failed to shorten URL. Please try again.');
      console.error(err);
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
