// src/components/Payment.jsx
import React, { useState } from 'react';
import axios from 'axios';

const products = [
    { id: 1, name: 'Produk A', price: 10000 },
    { id: 2, name: 'Produk B', price: 20000 },
    { id: 3, name: 'Produk C', price: 30000 },
];

const Payment = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [orderId] = useState(`order-${Date.now()}`);

    const handleProductChange = (event) => {
        const productId = parseInt(event.target.value);
        const product = products.find(p => p.id === productId);
        setSelectedProduct(product);
    };

    const handlePayment = async () => {
        if (!selectedProduct) {
            alert('Silakan pilih produk terlebih dahulu.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/get-snap-token', {
                orderId,
                grossAmount: selectedProduct.price,
            });
            const token = response.data.token;

            // Panggil Midtrans Snap
            window.snap.pay(token, {
                onSuccess: function (result) {
                    console.log('Payment Success:', result);
                },
                onPending: function (result) {
                    console.log('Payment Pending:', result);
                },
                onError: function (result) {
                    console.log('Payment Failed:', result);
                },
                onClose: function () {
                    console.log('Customer closed the popup without finishing the payment');
                },
            });
        } catch (error) {
            console.error('Error fetching Snap token:', error);
        }
    };

    return (
        <div>
            <h1>Payment Page</h1>
            <div>
                <label>Pilih Produk:</label>
                <select onChange={handleProductChange} value={selectedProduct ? selectedProduct.id : ''}>
                    <option value="" disabled>Pilih produk</option>
                    {products.map(product => (
                        <option key={product.id} value={product.id}>
                            {product.name} - Rp {product.price.toLocaleString()}
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={handlePayment}>Pay with Midtrans</button>
        </div>
    );
};

export default Payment;
