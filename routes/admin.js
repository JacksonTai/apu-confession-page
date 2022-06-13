const express = require('express');
const router = express.Router();

const admin = require('../controllers/admin');
const { validateSignin } = require('../middleware');

router.route('/')
    .get(admin.renderSignin)
    .post(
        validateSignin,
        admin.signin
    );

module.exports = router;