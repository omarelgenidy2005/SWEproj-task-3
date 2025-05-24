import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add your password reset logic here with both email and newPassword
      navigate('/login');
    } catch (err) {
      setError('Failed to process password reset request. Please try again.');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <div style={styles.patternOverlay}></div>
          <div style={styles.decorativeShape}>
            <div style={styles.logo}>
              <span style={styles.logoText}>mate</span>
              <span style={styles.logoNumber}>7</span>
              <span style={styles.logoText}>gez</span>
            </div>
            <p style={styles.tagline}>Reset your password securely</p>
          </div>
        </div>
        <div style={styles.rightSection}>
          <div style={styles.formContainer}>
            <h2 style={styles.title}>Reset Password</h2>
            <p style={styles.subtitle}>Enter your email and new password</p>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>New Password</label>
                <input
                  type="password"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>
              {error && <p style={styles.error}>{error}</p>}
              <button type="submit" style={styles.button}>Reset Password</button>
              <p style={styles.loginText}>
                Remember your password?{' '}
                <Link to="/login" style={styles.loginLink}>
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  container: {
    display: 'flex',
    width: '100%',
    backgroundColor: '#ffffff',
  },
  leftSection: {
    flex: '0.4',
    backgroundColor: '#1FCBB5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    position: 'relative',
    overflow: 'hidden',
  },
  patternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    background: `
      linear-gradient(45deg, transparent 45%, #fff 45%, #fff 55%, transparent 55%),
      linear-gradient(-45deg, transparent 45%, #fff 45%, #fff 55%, transparent 55%),
      linear-gradient(135deg, transparent 45%, #fff 45%, #fff 55%, transparent 55%),
      linear-gradient(-135deg, transparent 45%, #fff 45%, #fff 55%, transparent 55%)
    `,
    backgroundSize: '40px 40px',
    backgroundPosition: '0 0, 20px 0, 0 20px, 20px 20px',
    transform: 'rotate(15deg) scale(2)',
    pointerEvents: 'none',
  },
  decorativeShape: {
    textAlign: 'center',
    color: '#ffffff',
    position: 'relative',
    zIndex: 1,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '3.5rem',
    fontWeight: '600',
    marginBottom: '20px',
    letterSpacing: '-0.02em',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  logoText: {
    color: '#4A4A4A',
    textTransform: 'lowercase',
    fontWeight: '600',
  },
  logoNumber: {
    color: '#ffffff',
    margin: '0 1px',
    fontWeight: '600',
  },
  tagline: {
    fontSize: '1.4rem',
    opacity: '1',
    color: '#ffffff',
    fontWeight: '500',
    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
    lineHeight: '1.4',
  },
  rightSection: {
    flex: '0.6',
    padding: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  formContainer: {
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '2rem',
    color: '#1e1e1e',
    marginBottom: '10px',
    fontWeight: '600',
  },
  subtitle: {
    color: '#666',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.9rem',
    color: '#1e1e1e',
    fontWeight: '500',
  },
  input: {
    padding: '12px',
    fontSize: '1rem',
    border: '1px solid #e1e1e1',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    color: '#1e1e1e',
    transition: 'border-color 0.3s ease',
    outline: 'none',
    '&::placeholder': {
      color: '#999',
    },
  },
  button: {
    padding: '14px',
    fontSize: '1rem',
    backgroundColor: '#1FCBB5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '10px',
  },
  error: {
    color: '#dc3545',
    fontSize: '0.9rem',
    marginTop: '-10px',
  },
  loginText: {
    textAlign: 'center',
    color: '#666',
    fontSize: '0.9rem',
    marginTop: '20px',
  },
  loginLink: {
    color: '#1FCBB5',
    textDecoration: 'none',
    fontWeight: '500',
  },
};

export default ForgotPassword;
