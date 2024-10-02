const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const fs = require('fs');

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
let accessToken = null;

// Function to save access token to a file
const saveAccessToken = (token) => {
  fs.writeFileSync('access_token.txt', token);
};

// Function to load access token from a file
const loadAccessToken = () => {
  try {
    return fs.readFileSync('access_token.txt', 'utf8');
  } catch (error) {
    return null;
  }
};

// Load access token on startup
accessToken = loadAccessToken();

exports.createLinkToken = async () => {
  const response = await plaidClient.linkTokenCreate({
    user: { client_user_id: 'local-user' },
    client_name: 'Finance Dashboard',
    products: ['transactions'],
    country_codes: ['US'],
    language: 'en',
  });
  return response.data.link_token;
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