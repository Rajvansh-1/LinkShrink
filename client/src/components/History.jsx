import { FaHistory, FaExternalLinkAlt } from 'react-icons/fa';

const History = ({ history, onClearHistory }) => {
  if (!history || history.length === 0) return null;

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <FaHistory style={{ color: '#818cf8' }} /> Recent Links
        </h3>
        <button
          onClick={onClearHistory}
          style={{
            background: '#ef4444',
            fontSize: '0.8rem',
            padding: '0.3rem 0.8rem',
            height: 'auto'
          }}
        >
          Clear History
        </button>
      </div>
      <ul className="history-list">
        {history.map((item) => (
          <li key={item.urlCode} className="history-item">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', overflow: 'hidden' }}>
              <a href={item.shortUrl} target="_blank" rel="noopener noreferrer" className="short-url">
                linkshrink.app/{item.urlCode}
              </a>
              <span className="original-link" title={item.originalUrl}>{item.originalUrl}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', background: 'rgba(15, 23, 42, 0.5)', padding: '0.2rem 0.5rem', borderRadius: '0.5rem' }}>
                {item.clicks} clicks
              </span>
              <a href={item.shortUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8' }}>
                <FaExternalLinkAlt />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
