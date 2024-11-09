const express = require('express');
const { createAOrder, getOrderByEmai } = require('./order.controller');

const router =  express.Router();

// create order endpoint
router.post("/ ", createAOrder);

// get orders by user email 
router.get("/email/:emails", getOrderByEmail);

module.exports = router;