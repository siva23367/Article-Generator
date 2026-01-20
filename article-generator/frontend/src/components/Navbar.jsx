import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <h1 style={styles.title} onClick={() => navigate('/')}>
          Article Generator
        </h1>
        {user && (
          <div style={styles.userMenu}>
            <span style={styles.username}>{user.username}</span>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    background: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    height: '64px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: '0',
    fontSize: '24px',
    color: '#667eea',
    cursor: 'pointer',
    fontWeight: '700',
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  username: {
    color: '#666',
    fontSize: '14px',
  },
  logoutButton: {
    padding: '8px 16px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
};

export default Navbar;
