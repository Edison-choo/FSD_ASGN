const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
	res.render('user/login');
});

router.get('/register', (req, res) => {
	res.render('user/register');
});


 router.get('/forget_password', (req, res) => {
	 res.render('user/forgetpassword');
 })
module.exports = router;