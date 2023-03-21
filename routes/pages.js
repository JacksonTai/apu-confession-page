const express = require('express');
const admin = require('../controllers/admin');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('home');
});

router.get('/disclaimer', (req, res) => {
  res.render('disclaimer');
});

router.get('/guidelines', (req, res) => {
  res.render('guidelines');
});

router.get('/information', (req, res) => {
  res.render('information');
});

router.get('/signout', admin.signout);

module.exports = router;
