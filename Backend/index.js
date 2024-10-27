// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Endpoint untuk mendapatkan token Snap
app.post('/get-snap-token', async (req, res) => {
    const { orderId, grossAmount } = req.body;

    const parameter = {
        "payment_type": "credit_card",
        "transaction_details": {
            "order_id": orderId,
            "gross_amount": grossAmount
        }
    };

    try {
        const response = await axios.post('https://app.sandbox.midtrans.com/snap/v1/transactions', parameter, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(process.env.MIDTRANS_SERVER_KEY).toString('base64')}`
            }
        });

        res.json({ token: response.data.token });
    } catch (error) {
        console.error('Error creating Snap token:', error.response.data);
        res.status(500).json({ error: 'Failed to create Snap token' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
