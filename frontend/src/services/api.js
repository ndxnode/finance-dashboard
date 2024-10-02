import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = {
  createLinkToken: async () => {
    const response = await axios.post(`${API_URL}/plaid/create_link_token`);
    return response.data;
  },

  exchangePublicToken: async (publicToken) => {
    const response = await axios.post(`${API_URL}/plaid/exchange_public_token`, { public_token: publicToken });
    return response.data;
  },

  getAccounts: async () => {
    const response = await axios.get(`${API_URL}/plaid/accounts`);
    return response.data;
  },

  getTransactions: async (startDate, endDate) => {
    const response = await axios.get(`${API_URL}/plaid/transactions`, {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  },
};

export default api;