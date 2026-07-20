import { useState } from 'react';
import { FaHistory, FaExternalLinkAlt, FaTrash, FaCopy, FaCheck } from 'react-icons/fa';

// Individual history item with its own copy state
const HistoryItem = ({ item, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(item.shortUrl);
    } catch {
      const el = document.createElement('textarea');
      el.value = item.shortUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format click count nicely
  const clickLabel = item.clicks === 1 ? '1 Click' : `${item.clicks} Clicks`;

  return (
    <li
      className="history-item"
      style={{ animation: `popIn 0.3s ease-out ${index * 0.04}s backwards` }}
    >
      {/* Link Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', overflow: 'hidden', flex: 1 }}>
        <a
          href={item.shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#a5b4fc',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '1rem',
            transition: 'color 0.2s',
            letterSpacing: '0.01em'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = '#c7d2fe'}
          onMouseOut={(e) => e.currentTarget.style.color = '#a5b4fc'}
        >
          {item.shortUrl}
        </a>
        <span
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.8rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '95%'
          }}
          title={item.originalUrl}
        >
          {item.originalUrl}
        </span>
      </div>

      {/* Stats + Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
        {/* Click count */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#a5b4fc', lineHeight: 1 }}>
            {item.clicks ?? 0}
          </span>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
            {item.clicks === 1 ? 'Click' : 'Clicks'}
          </span>
        </div>

        {/* Copy Button */}
        <button
          className={`icon-btn${copied ? ' copied' : ''}`}
          onClick={handleCopy}
          title={copied ? 'Copied!' : 'Copy short URL'}
          aria-label="Copy short URL"
        >
          {copied ? <FaCheck /> : <FaCopy />}
        </button>

        {/* Open Link */}
        <a
          href={item.shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="icon-btn"
          title="Open in new tab"
          aria-label="Open short URL"
        >
          <FaExternalLinkAlt />
        </a>
      </div>
    </li>
  );
};

const History = ({ history, onClearHistory }) => {
  if (!history || history.length === 0) return null;

  return (
    <div style={{ width: '100%', marginTop: '3rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        padding: '0 0.25rem'
      }}>
        <h3 style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          margin: 0,
          fontSize: '1.3rem',
          fontWeight: 700
        }}>
          <FaHistory style={{ color: '#a855f7' }} />
          Recent Links
          <span style={{
            background: 'rgba(168,85,247,0.15)',
            color: '#a855f7',
            borderRadius: '20px',
            padding: '0.1rem 0.6rem',
            fontSize: '0.8rem',
            fontWeight: 600
          }}>
            {history.length}
          </span>
        </h3>

        <button
          onClick={onClearHistory}
          style={{
            background: 'transparent',
            color: '#f87171',
            border: '1px solid rgba(248, 113, 113, 0.25)',
            fontSize: '0.82rem',
            padding: '0.45rem 0.9rem',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontFamily: 'inherit'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(248, 113, 113, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(248, 113, 113, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(248, 113, 113, 0.25)';
          }}
          aria-label="Clear all history"
        >
          <FaTrash style={{ fontSize: '0.75rem' }} />
          Clear All
        </button>
      </div>

      <ul className="history-list">
        {history.map((item, index) => (
          <HistoryItem key={item.urlCode} item={item} index={index} />
        ))}
      </ul>
    </div>
  );
};

export default History;