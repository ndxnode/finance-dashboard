import React, { useCallback, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import api from '../services/api';

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
  },
  button: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#2980b9',
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
    cursor: 'not-allowed',
  },
  errorMessage: {
    color: 'red',
    marginTop: '10px',
  },
};

const PlaidLink = ({ onSuccess, onError }) => {
  const [linkToken, setLinkToken] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        const response = await api.createLinkToken();
        console.log('Link token response:', response);
        setLinkToken(response.link_token);
      } catch (error) {
        console.error('Error fetching link token:', error);
        setError(`Failed to fetch link token: ${error.message}`);
        onError(error);
      }
    };
    fetchLinkToken();
  }, [onError]);

  useEffect(() => {
    const checkExistingConnection = async () => {
      try {
        // Try to fetch accounts to check if we're already connected
        await api.getAccounts();
        onSuccess(); // If successful, we're already connected
      } catch (error) {
        // If there's an error, we're not connected, so we'll show the Plaid Link button
        console.log('No existing connection found');
      }
    };

    checkExistingConnection();
  }, [onSuccess]);

  const handleOnSuccess = useCallback(async (publicToken, metadata) => {
    try {
      await api.exchangePublicToken(publicToken);
      onSuccess();
    } catch (error) {
      console.error('Error exchanging public token:', error);
      setError('Failed to exchange public token. Please try again.');
    }
  }, [onSuccess]);

  const handleOnExit = useCallback((err) => {
    if (err) {
      console.error('Plaid Link error:', err);
      setError(`Plaid Link Error: ${err.message}`);
      onError(err);
    }
  }, [onError]);

  const config = {
    token: linkToken,
    onSuccess: handleOnSuccess,
    onExit: handleOnExit,
  };

  const { open, ready, error: plaidLinkError } = usePlaidLink(config);

  useEffect(() => {
    if (plaidLinkError) {
      setError(`Plaid Link Error: ${plaidLinkError.message}`);
      onError(plaidLinkError);
    }
  }, [plaidLinkError, onError]);

  return (
    <div style={styles.container}>
      <h2>Connect Your Bank Account</h2>
      <p>Click the button below to securely connect your bank account using Plaid.</p>
      <button
        onClick={() => open()}
        disabled={!ready}
        style={{
          ...styles.button,
          ...(isHovered && !ready ? styles.buttonDisabled : isHovered ? styles.buttonHover : {}),
          ...(ready ? {} : styles.buttonDisabled),
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        Connect a bank account
      </button>
      {error && <p style={styles.errorMessage}>{error}</p>}
      <p>Link Token: {linkToken ? 'Received' : 'Not received'}</p>
      <p>Ready: {ready ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default PlaidLink;