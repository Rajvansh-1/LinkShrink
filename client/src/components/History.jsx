import { FaHistory, FaExternalLinkAlt, FaTrash } from 'react-icons/fa';

const History = ({ history, onClearHistory }) => {
  if (!history || history.length === 0) return null;

  return (
    <div style={{ width: '100%', marginTop: '3rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1rem',
        padding: '0 0.5rem'
      }}>
        <h3 style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          margin: 0, 
          fontSize: '1.5rem', 
          fontWeight: 700 
        }}>
          <FaHistory style={{ color: '#a855f7' }} /> Recent Links
        </h3>
        <button
          onClick={onClearHistory}
          style={{
            background: 'transparent',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            fontSize: '0.85rem',
            padding: '0.5rem 1rem',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
          onMouseOut={(e) => e.target.style.background = 'transparent'}
        >
          Clear All
        </button>
      </div>
      
      <ul className="history-list">
        {history.map((item, index) => (
          <li key={item.urlCode} className="history-item" style={{ animation: `popIn 0.3s ease-out ${index * 0.05}s backwards` }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', overflow: 'hidden', flex: 1 }}>
              <a href={item.shortUrl} target="_blank" rel="noopener noreferrer" style={{ 
                color: '#fff', 
                fontWeight: 600, 
                textDecoration: 'none', 
                fontSize: '1.1rem' 
              }}>
                /{item.urlCode}
              </a>
              <span style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '0.85rem', 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis',
                maxWidth: '90%'
              }} title={item.originalUrl}>
                {item.originalUrl}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#a5b4fc' }}>{item.clicks}</span>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>Clicks</span>
              </div>
              <a 
                href={item.shortUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  color: 'var(--text-secondary)', 
                  padding: '0.5rem',
                  borderRadius: '50%',
                  transition: '0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'}}
              >
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