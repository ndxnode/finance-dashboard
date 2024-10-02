const plaidService = require('../services/plaidService');

exports.createLinkToken = async (req, res) => {
  try {
    const linkToken = await plaidService.createLinkToken();
    res.json({ link_token: linkToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
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