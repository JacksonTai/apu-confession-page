const express = require('express');
const router = express.Router();

const blacklist = require('../controllers/blacklist');
const { authenticate } = require('../middleware');

router.get('/',
    authenticate,
    blacklist.index
);

module.exports = router;