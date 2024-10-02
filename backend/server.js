const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const plaidRoutes = require('./routes/plaidRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/plaid', plaidRoutes);
app.use('/api/transactions', transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});