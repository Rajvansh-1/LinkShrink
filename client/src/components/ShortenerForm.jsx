import { useState } from 'react';
import axios from 'axios';
import { FaLink, FaMagic, FaArrowRight } from 'react-icons/fa';

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
      const apiUrl = import.meta.env.DEV ? 'http://localhost:5000' : '';
      const userId = localStorage.getItem('userId');
      constQN
      const res = await axios.post(`${apiUrl}/api/url/shorten`, { longUrl }, {
        headers: { 'x-user-id': userId }
      });
      onUrlShortened(res.data);
      setLongUrl('');
    } catch (err) {
      console.error(err);
      setError('Failed to shorten. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ zIndex: 10 }}>
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <div style={{ padding: '0 1rem', display: 'flex', alignItems: 'center' }}>
            <FaLink style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }} />
          </div>
          <input
            type="url"
            placeholder="Paste your long link here to shrink it..."
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            required
            autoFocus
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <span className="loader"></span>
            ) : (
              <>Shorten <FaArrowRight /></>
            )}
          </button>
        </div>
      </form>
      {error && (
        <div style={{ 
          marginTop: '1rem', 
          color: '#ef4444', 
          background: 'rgba(239, 68, 68, 0.1)', 
          padding: '0.75rem', 
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.9rem'
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export default ShortenerForm;