import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import api from '../services/api';

const styles = {
  dashboard: {
    padding: '20px',
  },
  title: {
    color: '#2c3e50',
    marginBottom: '20px',
  },
  transactionList: {
    listStyle: 'none',
    padding: 0,
  },
  transactionItem: {
    backgroundColor: '#ecf0f1',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  date: {
    color: '#7f8c8d',
    fontSize: '14px',
  },
  name: {
    fontWeight: 'bold',
  },
  amount: {
    color: '#e74c3c',
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  chartContainer: {
    width: '300px',
    margin: '20px auto',
  },
  alert: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px',
  },
  balance: {
    color: '#27ae60',
    fontSize: '1.5em',
    marginBottom: '20px',
  },
};

const Dashboard = ({ onError, onLogout }) => {
  const [transactions, setTransactions] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [categoryData, setCategoryData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
    }],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [noTransactionsAlert, setNoTransactionsAlert] = useState('');
  const [accountBalance, setAccountBalance] = useState(null);

  useEffect(() => {
    fetchTransactions();
    fetchAccountBalance();
  }, [currentDate]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    setNoTransactionsAlert('');
    try {
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0];
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
      const response = await api.getTransactions(startDate, endDate);
      setTransactions(response);
      if (response.length === 0) {
        setNoTransactionsAlert(`No transactions available for ${currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}`);
      } else {
        processCategoryData(response);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccountBalance = async () => {
    try {
      const balance = await api.getAccountBalance();
      setAccountBalance(balance);
    } catch (error) {
      console.error('Error fetching account balance:', error);
      onError(error);
    }
  };

  const processCategoryData = (transactions) => {
    const categorySum = transactions.reduce((acc, transaction) => {
      const category = transaction.category[0] || 'Uncategorized';
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {});

    const labels = Object.keys(categorySum);
    const data = Object.values(categorySum);
    const backgroundColor = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
    ];

    setCategoryData({
      labels,
      datasets: [{
        data,
        backgroundColor: backgroundColor.slice(0, labels.length),
      }],
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + direction);
      return newDate;
    });
  };

  const handleLogout = () => {
    console.log("Logout clicked in Dashboard"); // Add this line
    onLogout();
  };

  return (
    <div style={styles.dashboard}>
      <h2 style={styles.title}>Transactions for {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
      {accountBalance !== null && (
        <h3 style={styles.balance}>Account Balance: ${accountBalance.toFixed(2)}</h3>
      )}
      <div style={styles.navigation}>
        <button style={styles.button} onClick={() => navigateMonth(-1)}>Previous Month</button>
        <button style={styles.button} onClick={() => navigateMonth(1)}>Next Month</button>
        <button style={{...styles.button, backgroundColor: '#e74c3c'}} onClick={handleLogout}>Logout</button>
      </div>
      {noTransactionsAlert && <div style={styles.alert}>{noTransactionsAlert}</div>}
      {isLoading ? (
        <div>Loading transactions...</div>
      ) : (
        <>
          {transactions.length > 0 && (
            <>
              <div style={styles.chartContainer}>
                <Pie data={categoryData} />
              </div>
              <ul style={styles.transactionList}>
                {transactions.map((transaction, index) => (
                  <li key={index} style={styles.transactionItem}>
                    <span style={styles.date}>{transaction.date}</span>
                    <span style={styles.name}>{transaction.name}</span>
                    <span style={styles.amount}>${transaction.amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;