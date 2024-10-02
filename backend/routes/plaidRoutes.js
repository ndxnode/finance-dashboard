const express = require('express');
const router = express.Router();
const plaidController = require('../controllers/plaidController');

router.post('/create_link_token', plaidController.createLinkToken);
router.post('/exchange_public_token', plaidController.exchangePublicToken);
router.get('/accounts', plaidController.getAccounts);
router.get('/transactions', plaidController.getTransactions);

module.exports = router;