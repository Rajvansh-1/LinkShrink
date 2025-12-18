import { useState } from 'react';
import { FaCopy, FaCheck, FaExternalLinkAlt, FaShareAlt } from 'react-icons/fa';

const UrlResult = ({ result }) => {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="result-card">
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <span style={{ 
          background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)', 
          color: '#022c22', 
          padding: '0.25rem 0.75rem', 
          borderRadius: '20px', 
          fontSize: '0.8rem', 
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Success
        </span>
      </div>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '1rem' 
      }}>
        <a href={result.shortUrl} target="_blank" rel="noopener noreferrer" className="short-link-display">
          linkshrink.app/<span style={{ color: '#fff' }}>{result.urlCode}</span>
        </a>
        
        <div style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '300px' }}>
          <button 
            className="btn-primary" 
            onClick={handleCopy} 
            style={{ 
              flex: 1, 
              background: copied ? '#10b981' : 'rgba(255,255,255,0.1)',
              justifyContent: 'center',
              boxShadow: 'none'
            }}
          >
            {copied ? <><FaCheck /> Copied!</> : <><FaCopy /> Copy</>}
          </button>
          
          <a 
            href={result.shortUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '1rem',
              boxShadow: 'none'
            }}
          >
            <FaExternalLinkAlt />
          </a>
        </div>
      </div>
      
      <div style={{ 
        marginTop: '1.5rem', 
        paddingTop: '1rem', 
        borderTop: '1px solid rgba(255,255,255,0.1)',
        fontSize: '0.9rem',
        color: 'var(--text-secondary)',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        Original: {result.originalUrl}
      </div>
    </div>
  );
};

export default UrlResult;