const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../helpers/auth');

router.get('/add', (req, res) => {
    res.render('reviews/reviews');
});

module.exports = router;