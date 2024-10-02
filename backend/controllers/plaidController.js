const plaidService = require('../services/plaidService');

exports.createLinkToken = async (req, res) => {
  try {
    const linkToken = await plaidService.createLinkToken();
    console.log('Generated link token:', linkToken);
    res.json({ link_token: linkToken });
  } catch (error) {
    console.error('Error in createLinkToken controller:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

exports.exchangePublicToken = async (req, res) => {
  try {
    const { public_token } = req.body;
    const accessToken = await plaidService.exchangePublicToken(public_token);
    res.json({ message: 'Access token saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAccounts = async (req, res) => {
  try {
    const accounts = await plaidService.getAccounts();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const transactions = await plaidService.getTransactions(start_date, end_date);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkConnection = async (req, res) => {
  try {
    await plaidService.getAccounts(); // This will throw an error if there's no valid access token
    res.json({ isConnected: true });
  } catch (error) {
    res.status(401).json({ isConnected: false, error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    plaidService.clearAccessToken();
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAccountBalance = async (req, res) => {
  try {
    const balance = await plaidService.getAccountBalance();
    res.json({ balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};