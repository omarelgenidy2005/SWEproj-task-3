import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={styles.navbar}>
      <Link to="/" style={styles.logoLink}>
        <div style={styles.logo}>
          <span style={styles.logoText}>mate</span>
          <span style={styles.logoNumber}>7</span>
          <span style={styles.logoText}>gez</span>
        </div>
      </Link>

      <div style={styles.rightSection}>
        {user ? (
          <>
            <button 
              onClick={() => navigate('/profile')} 
              style={styles.profileButton}
              aria-label="Go to profile"
            >
              <FaUser style={styles.userIcon} />
              <span style={styles.buttonText}>Profile</span>
            </button>

            <button 
              onClick={() => {
                logout();
                toast.success('You have been logged out!');
                navigate('/');
              }} 
              style={styles.logoutButton}
            >
              Log Out
            </button>
          </>
        ) : (
          <button 
            onClick={() => navigate('/login')} 
            style={styles.loginButton}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '60px',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  },
  logoLink: {
    textDecoration: 'none',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.8rem',
    fontWeight: '600',
    letterSpacing: '-0.02em',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  logoText: {
    color: '#4A4A4A',
    textTransform: 'lowercase',
    fontWeight: '600',
  },
  logoNumber: {
    color: '#1FCBB5',
    margin: '0 1px',
    fontWeight: '600',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
  },
  profileButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#1FCBB5',
    color: '#ffffff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '25px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  loginButton: {
    background: '#1FCBB5',
    color: '#ffffff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '25px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  logoutButton: {
    background: '#EF4444',
    color: '#ffffff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '25px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    marginLeft: '10px',
    transition: 'all 0.3s ease',
  },
  userIcon: {
    fontSize: '1.1rem',
  },
  buttonText: {
    marginLeft: '4px',
  },
};

export default NavBar;
