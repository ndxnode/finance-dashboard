const express = require('express');
const router = express.Router();
const plaidController = require('../controllers/plaidController');

router.get('/create_link_token', plaidController.createLinkToken);
router.post('/exchange_public_token', plaidController.exchangePublicToken);
router.get('/accounts', plaidController.getAccounts);
router.get('/transactions', plaidController.getTransactions);
router.get('/check-connection', plaidController.checkConnection);
router.post('/logout', plaidController.logout);
router.get('/balance', plaidController.getAccountBalance);

module.exports = router;