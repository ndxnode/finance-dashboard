const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

// In-memory storage for access token
let accessToken = null;

// Function to save access token
const saveAccessToken = (token) => {
  accessToken = token;
};

// Function to load access token
const loadAccessToken = () => {
  return accessToken;
};

exports.createLinkToken = async () => {
  try {
    console.log('Attempting to create link token...');
    console.log('Plaid environment:', process.env.PLAID_ENV);
    console.log('Plaid client ID:', process.env.PLAID_CLIENT_ID);
    console.log('Plaid secret defined:', !!process.env.PLAID_SECRET);

    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'local-user' },
      client_name: 'Finance Dashboard',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
    });
    console.log('Plaid linkTokenCreate response:', response.data);
    return response.data.link_token;
  } catch (error) {
    console.error('Error in createLinkToken:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    throw error;
  }
};

exports.exchangePublicToken = async (publicToken) => {
  const response = await plaidClient.itemPublicTokenExchange({
    public_token: publicToken,
  });
  accessToken = response.data.access_token;
  saveAccessToken(accessToken);
  return accessToken;
};

exports.getAccounts = async () => {
  if (!accessToken) {
    throw new Error('No access token available');
  }
  const response = await plaidClient.accountsGet({
    access_token: accessToken,
  });
  return response.data.accounts;
};

exports.getTransactions = async (startDate, endDate) => {
  if (!accessToken) {
    throw new Error('No access token available');
  }
  const response = await plaidClient.transactionsGet({
    access_token: accessToken,
    start_date: startDate,
    end_date: endDate,
  });
  return response.data.transactions;
};

exports.clearAccessToken = () => {
  accessToken = null;
};

exports.getAccountBalance = async () => {
  if (!accessToken) {
    throw new Error('No access token available');
  }
  const response = await plaidClient.accountsBalanceGet({
    access_token: accessToken,
  });
  
  let totalBalance = 0;
  response.data.accounts.forEach(account => {
    if (account.type === 'depository') {
      totalBalance += account.balances.current;
    }
  });
  
  return totalBalance;
};