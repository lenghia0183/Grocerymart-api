const express = require('express');
const { paymentController } = require('../../controllers');

const payment = express.Router();

payment.post('/callback/zalo', paymentController.callBackZalo);

module.exports = payment;
