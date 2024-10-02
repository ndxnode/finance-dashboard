import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [monthlyBreakdown, setMonthlyBreakdown] = useState({});

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0];
    
    try {
      const response = await api.getTransactions(startDate, endDate);
      setTransactions(response);
      processTransactions(response);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const processTransactions = (transactions) => {
    const breakdown = {};
    transactions.forEach(transaction => {
      const month = new Date(transaction.date).toLocaleString('default', { month: 'long' });
      const category = transaction.category[0];
      
      if (!breakdown[month]) {
        breakdown[month] = {};
      }
      
      if (!breakdown[month][category]) {
        breakdown[month][category] = 0;
      }
      
      breakdown[month][category] += transaction.amount;
    });
    
    setMonthlyBreakdown(breakdown);
  };

  return (
    <div>
      <h2>Financial Dashboard</h2>
      {Object.entries(monthlyBreakdown).map(([month, categories]) => (
        <div key={month}>
          <h3>{month}</h3>
          <ul>
            {Object.entries(categories).map(([category, amount]) => (
              <li key={category}>
                {category}: ${amount.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;