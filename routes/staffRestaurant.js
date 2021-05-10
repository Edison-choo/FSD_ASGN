const express = require('express');
const router = express.Router();


//Page if restaurant page not created
router.get('/', (req, res) => {
    res.render('staffRestaurant/start')
});

//Create Restaurant Page
router.get('/createRestaurant', (req, res) => {
    res.render('staffRestaurant/createRestaurant')
});

module.exports = router