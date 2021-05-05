const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('book/menuBook');
});

router.get('/foodCart', (req, res) => {
	res.render('book/foodCart');
});

router.get('/receipt', (req, res) => {
	res.render('book/receipt');
});

router.get('/payment', (req, res) => {
	res.render('book/payment');
});

module.exports = router;