const express = require('express');
const { createAOrder, getOrderByEmail, createPaymentUrl, handlePaymentReturn } = require('./order.controller');

const router = express.Router();

// Create order
router.post('/', createAOrder);

// Get orders by user email
router.get('/email/:email', getOrderByEmail);

// Create VNPay payment URL
router.post('/payment/create-url', createPaymentUrl);

// Handle VNPay return
router.get('/payment/vnpay_return', handlePaymentReturn);

module.exports = router;
