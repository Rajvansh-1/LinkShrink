import { useState } from 'react';
import { FaCopy, FaCheck, FaExternalLinkAlt } from 'react-icons/fa';

const UrlResult = ({ result }) => {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="result-container">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', overflow: 'hidden' }}>
        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Success! Here's your short link:</span>
        <a href={result.shortUrl} target="_blank" rel="noopener noreferrer" className="short-url">
          linkshrink.app/{result.urlCode} <FaExternalLinkAlt style={{ fontSize: '0.8em', marginLeft: '4px' }} />
        </a>
      </div>
      <button className="copy-btn" onClick={handleCopy} title="Copy to clipboard">
        {copied ? <FaCheck style={{ color: '#4ade80' }} /> : <FaCopy />}
      </button>
    </div>
  );
};

export default UrlResult;
