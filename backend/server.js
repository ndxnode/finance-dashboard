require('dotenv').config();
const express = require('express');
const cors = require('cors');
const plaidRoutes = require('./routes/plaidRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Update CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true,
}));

app.use(express.json());

app.use('/api/plaid', plaidRoutes);

// Add a test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Mock localStorage for Node.js
global.localStorage = {
    getItem: (key) => {
        // Implement your logic to retrieve the item
        return null; // or return a stored value
    },
    setItem: (key, value) => {
        // Implement your logic to store the item
    }
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Plaid environment:', process.env.PLAID_ENV);
  console.log('Plaid Client ID:', process.env.PLAID_CLIENT_ID ? 'Set' : 'Not set');
  console.log('Plaid Secret:', process.env.PLAID_SECRET ? 'Set' : 'Not set');
});