import { useState } from 'react';
import { FaCopy, FaCheck, FaExternalLinkAlt } from 'react-icons/fa';
import { MdQrCode2 } from 'react-icons/md';

const UrlResult = ({ result }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!result) return null;

  const { shortUrl, urlCode, originalUrl } = result;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = shortUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Use a free public QR API — no key needed, renders as PNG
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shortUrl)}&color=ffffff&bgcolor=000000&margin=1`;

  return (
    <div className="result-card">
      {/* Success Badge */}
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <span style={{
          background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
          color: '#022c22',
          padding: '0.3rem 0.9rem',
          borderRadius: '20px',
          fontSize: '0.78rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.08em'
        }}>
          ✓ Link Shortened!
        </span>
      </div>

      {/* Short URL Display */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="short-link-display"
          title={shortUrl}
        >
          {shortUrl}
        </a>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.6rem', width: '100%', maxWidth: '360px' }}>
          <button
            className="btn-primary"
            onClick={handleCopy}
            style={{
              flex: 1,
              background: copied
                ? 'linear-gradient(135deg, #10b981, #34d399)'
                : 'rgba(255,255,255,0.1)',
              justifyContent: 'center',
              boxShadow: 'none',
              transition: 'background 0.3s, transform 0.2s'
            }}
            aria-label="Copy short URL"
          >
            {copied ? <><FaCheck /> Copied!</> : <><FaCopy /> Copy</>}
          </button>

          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '1rem 1.25rem',
              boxShadow: 'none'
            }}
            title="Open short URL"
          >
            <FaExternalLinkAlt />
          </a>

          <button
            className="btn-primary"
            onClick={() => setShowQr(v => !v)}
            style={{
              background: showQr ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.1)',
              padding: '1rem 1.25rem',
              boxShadow: 'none'
            }}
            title="Show QR Code"
            aria-label="Toggle QR code"
          >
            <MdQrCode2 style={{ fontSize: '1.1rem' }} />
          </button>
        </div>

        {/* QR Code */}
        {showQr && (
          <div className="qr-container" style={{ animation: 'popIn 0.3s ease' }}>
            <img
              src={qrUrl}
              alt={`QR code for ${shortUrl}`}
              className="qr-image"
              loading="lazy"
            />
            <span className="qr-label">Scan to visit</span>
          </div>
        )}
      </div>

      {/* Original URL */}
      <div style={{
        marginTop: '1.25rem',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }} title={originalUrl}>
        <span style={{ color: 'rgba(255,255,255,0.3)', marginRight: '0.5rem' }}>→</span>
        {originalUrl}
      </div>
    </div>
  );
};

export default UrlResult;