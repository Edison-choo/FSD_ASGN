const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('menu/menu');
});

router.get('/addMenu', (req, res) => {
	res.render('menu/addMenu');
});

router.get('/updateMenu', (req, res) => {
	res.render('menu/updateMenu');
});

module.exports = router;