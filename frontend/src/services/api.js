import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = {
  createLinkToken: async () => {
    try {
      const response = await axios.get(`${API_URL}/plaid/create_link_token`);
      return response.data;
    } catch (error) {
      console.error('Error creating link token:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  exchangePublicToken: async (publicToken) => {
    try {
      const response = await axios.post(`${API_URL}/plaid/exchange_public_token`, { public_token: publicToken });
      return response.data;
    } catch (error) {
      console.error('Error exchanging public token:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getAccounts: async () => {
    try {
      const response = await axios.get(`${API_URL}/plaid/accounts`);
      return response.data;
    } catch (error) {
      console.error('Error getting accounts:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getTransactions: async (startDate, endDate) => {
    try {
      const response = await axios.get(`${API_URL}/plaid/transactions`, {
        params: { start_date: startDate, end_date: endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting transactions:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  checkConnection: async () => {
    try {
      const response = await axios.get(`${API_URL}/plaid/check-connection`);
      return response.data;
    } catch (error) {
      console.error('Error checking connection:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await axios.post(`${API_URL}/plaid/logout`);
      return response.data;
    } catch (error) {
      console.error('Error during logout:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getAccountBalance: async () => {
    try {
      const response = await axios.get(`${API_URL}/plaid/balance`);
      return response.data.balance;
    } catch (error) {
      console.error('Error getting account balance:', error.response ? error.response.data : error.message);
      throw error;
    }
  },
};

export default api;