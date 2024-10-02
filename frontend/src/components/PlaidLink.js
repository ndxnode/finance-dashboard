import React, { useCallback, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import api from '../services/api';

const PlaidLink = () => {
  const [linkToken, setLinkToken] = useState(null);

  useEffect(() => {
    const fetchLinkToken = async () => {
      const response = await api.createLinkToken();
      setLinkToken(response.link_token);
    };
    fetchLinkToken();
  }, []);

  const onSuccess = useCallback(async (publicToken, metadata) => {
    await api.exchangePublicToken(publicToken);
    // Handle successful connection (e.g., update UI, fetch accounts)
  }, []);

  const config = {
    token: linkToken,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <button onClick={() => open()} disabled={!ready}>
      Connect a bank account
    </button>
  );
};

export default PlaidLink;