import { useState } from 'react';
import axios from 'axios';
import { FaLink, FaArrowRight } from 'react-icons/fa';

const ShortenerForm = ({ onUrlShortened }) => {
  const [longUrl, setLongUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = longUrl.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');

    try {
      const userId = localStorage.getItem('userId');
      const res = await axios.post(
        '/api/url/shorten',
        { longUrl: trimmed },
        { headers: { 'x-user-id': userId } }
      );
      onUrlShortened(res.data);
      setLongUrl('');
    } catch (err) {
      // Surface the actual server error message if available
      const msg =
        err?.response?.data?.message ||
        (err.message === 'Network Error'
          ? 'Cannot connect to server. Make sure the backend is running.'
          : 'Failed to shorten URL. Please try again.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ zIndex: 10 }}>
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <div style={{ padding: '0 1rem', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <FaLink style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }} />
          </div>
          <input
            type="text"
            placeholder="Paste your long link here to shrink it..."
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            required
            autoFocus
            autoComplete="off"
            spellCheck="false"
            aria-label="Long URL to shorten"
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !longUrl.trim()}
            aria-label="Shorten URL"
          >
            {loading ? (
              <span className="loader" aria-label="Loading" />
            ) : (
              <>Shorten <FaArrowRight /></>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="error-banner" role="alert">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export default ShortenerForm;