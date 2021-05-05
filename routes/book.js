const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('book/menuBook');
});

router.get('/foodCart', (req, res) => {
	res.render('book/foodCart');
});

module.exports = router;