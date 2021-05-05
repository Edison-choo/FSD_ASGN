const express = require('express');
const router = express.Router();

//Restaurants Page
router.get('/', (req, res) => {
    res.render('restaurant/restaurants')
});


module.exports = router;