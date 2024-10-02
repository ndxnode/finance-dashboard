const express = require('express');
const router = express.Router();
const plaidService = require('../services/plaidService');

// Get transactions for a specific date range
router.get('/', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    if (!start_date || !end_date) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }
    const transactions = await plaidService.getTransactions(start_date, end_date);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get monthly breakdown of transactions
router.get('/monthly-breakdown', async (req, res) => {
  try {
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).json({ error: 'Year and month are required' });
    }
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    const transactions = await plaidService.getTransactions(startDate, endDate);
    
    const breakdown = transactions.reduce((acc, transaction) => {
      const category = transaction.category[0] || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += transaction.amount;
      return acc;
    }, {});

    res.json(breakdown);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;