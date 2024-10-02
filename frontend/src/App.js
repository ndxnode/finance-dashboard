import React, { useState, useEffect } from 'react';
import PlaidLink from './components/PlaidLink';
import Dashboard from './components/Dashboard';
import api from './services/api'; // Import the api service

const styles = {
  app: {
    fontFamily: 'Arial, sans-serif',
    margin: '0',
    padding: '0',
    backgroundColor: '#f0f0f0',
    minHeight: '100vh',
    boxSizing: 'border-box',
  },
  header: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: '0',
  },
  content: {
    padding: '20px',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      const storedConnectionStatus = localStorage.getItem('isConnected');
      if (storedConnectionStatus === 'true') {
        try {
          await api.checkConnection(); // Verify the connection with the backend
          setIsConnected(true);
        } catch (error) {
          console.error("Failed to verify connection:", error);
          handleLogout(); // Logout if verification fails
        }
      }
    };
    checkConnection();
  }, []);

  const handleOnSuccess = () => {
    setIsConnected(true);
    localStorage.setItem('isConnected', 'true');
  };

  const handleError = (error) => {
    console.error("Error in App:", error);
    setError(error.message);
  };

  const handleLogout = async () => {
    console.log("Logout clicked");
    try {
      await api.logout(); // Call the logout endpoint on the backend
    } catch (error) {
      console.error("Error during logout:", error);
    }
    setIsConnected(false);
    localStorage.removeItem('isConnected');
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.title}>Finance Dashboard</h1>
        {isConnected && (
          <button style={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        )}
      </header>
      <main style={styles.content}>
        {error && <p style={{color: 'red'}}>{error}</p>}
        {!isConnected ? (
          <PlaidLink onSuccess={handleOnSuccess} onError={handleError} />
        ) : (
          <Dashboard onError={handleError} onLogout={handleLogout} />
        )}
      </main>
    </div>
  );
}

export default App;