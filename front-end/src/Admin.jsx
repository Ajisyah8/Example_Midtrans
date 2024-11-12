import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [transactions, setTransactions] = useState([]);


  useEffect(() => {
    axios.get('http://localhost:3000/api/transactions') 
      .then(response => {
        setTransactions(response.data.transactions);
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
      });
  }, []);

  
  const handleUpdateStatus = (orderId) => {
    axios.post(`http://localhost:3000/api/update-transaction-status/${orderId}`)
      .then(response => {
        alert('Transaction status updated successfully');
        window.location.reload();  
      })
      .catch(error => {
        console.error('Error updating transaction status:', error);
      });
  };

  return (
    <div>
      <h1>Admin Transaction Page</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Gross Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.order_id}>
              <td>{transaction.order_id}</td>
              <td>{transaction.gross_amount}</td>
              <td>{transaction.status}</td>
              <td>
                {transaction.status !== 'success' && (
                  <button onClick={() => handleUpdateStatus(transaction.order_id)}>
                    Mark as Success
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
