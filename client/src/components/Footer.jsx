import { FaGithub, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={{
      marginTop: 'auto',
      padding: '2rem 0',
      textAlign: 'center',
      color: '#94a3b8',
      fontSize: '0.9rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        Design & Developed by
        <a
          href="https://github.com/Rajvansh-1"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#f8fafc', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.color = '#818cf8'}
          onMouseOut={(e) => e.currentTarget.style.color = '#f8fafc'}
        >
          Rajvansh
        </a>
      </div>
      <a
        href="https://github.com/Rajvansh-1"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: '#94a3b8',
          fontSize: '1.5rem',
          transition: 'color 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
        onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}
      >
        <FaGithub />
      </a>
    </footer>
  );
};

export default Footer;
