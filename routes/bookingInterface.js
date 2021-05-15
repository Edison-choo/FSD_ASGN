const express = require('express');
const router = express.Router();

router.get('/bookForm', (req, res) => {
	res.render('bookingInterface/bookForm');
});

router.get('/', (req, res) => {
	res.render('bookingInterface/updateForm');
});

module.exports = router;