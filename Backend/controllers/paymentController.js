import axios from 'axios';
import db from '../database/db.js';  
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();


export const getSnapToken = async (req, res) => {
    const { grossAmount } = req.body; 

    const orderId = uuidv4(); 

   
    const parameter = {
        "payment_type": "credit_card", 
        "transaction_details": {
            "order_id": orderId,   
            "gross_amount": grossAmount 
        }
    };

  
    const queryInsert = 'INSERT INTO transactions (order_id, gross_amount, status) VALUES (?, ?, ?)';
    db.query(queryInsert, [orderId, grossAmount, 'pending'], (err, results) => {
        if (err) {
            console.error('Error inserting transaction into database:', err);
            return res.status(500).json({ error: 'Failed to create transaction in database' });
        }

       
        axios.post('https://app.sandbox.midtrans.com/snap/v1/transactions', parameter, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(process.env.MIDTRANS_SERVER_KEY).toString('base64')}`
            }
        })
        .then(response => {
           
            res.json({ token: response.data.token, order_id: orderId });
        })
        .catch(error => {
            console.error('Error creating Snap token:', error.response?.data || error.message);
            res.status(500).json({ error: 'Failed to create Snap token' });
        });
    });
};


export const handleMidtransWebhook = (req, res) => {
    console.log('Received webhook data:', req.body);

    const { order_id, transaction_status } = req.body;

    let status;


    if (transaction_status === 'capture' || transaction_status === 'settlement') {
        status = 'success'; 
    } else if (transaction_status === 'cancel') {
        status = 'failed';
    } else {
        return res.status(400).json({ error: 'Unhandled transaction status' });
    }

   
    const queryUpdate = 'UPDATE transactions SET status = ? WHERE order_id = ?';
    db.query(queryUpdate, [status, order_id], (err, results) => {
        if (err) {
            console.error('Error updating transaction status in database:', err);
            return res.status(500).json({ error: 'Failed to update transaction status' });
        }

        if (results.affectedRows === 0) {
            console.log(`No transaction found for order_id: ${order_id}`);
            return res.status(404).json({ error: 'Transaction not found in database' });
        }

        console.log(`Transaction ${order_id} updated to ${status}`);
        res.status(200).json({ message: 'Transaction updated successfully' });
    });
};


export const getAllTransactions = (req, res) => {
    const query = 'SELECT * FROM transactions';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching transactions:', err);
            return res.status(500).json({ error: 'Failed to fetch transactions' });
        }

        res.json({ transactions: results });
    });
};


export const updateTransactionStatus = (req, res) => {
    const { order_id } = req.params;
    
    const queryUpdate = 'UPDATE transactions SET status = ? WHERE order_id = ?';
    db.query(queryUpdate, ['success', order_id], (err, results) => {
        if (err) {
            console.error('Error updating transaction status:', err);
            return res.status(500).json({ error: 'Failed to update transaction status' });
        }

        if (results.affectedRows === 0) {
            console.log(`No transaction found for order_id: ${order_id}`);
            return res.status(404).json({ error: 'Transaction not found in database' });
        }

        res.status(200).json({ message: 'Transaction status updated successfully' });
    });
};
