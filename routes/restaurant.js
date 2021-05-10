const express = require('express');
const router = express.Router();

//Restaurants Page
router.get('/', (req, res) => {
    res.render('restaurant/restaurants')
});
router.get('/restaurant_1', (req, res) =>{
    res.render('restaurant/restaurant_1')
})


module.exports = router;