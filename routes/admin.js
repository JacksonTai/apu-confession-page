const express = require('express');

const router = express.Router();

const admin = require('../controllers/admin');
const { validateSignin, sanitizeHtml } = require('../middleware');

router
  .route('/')
  .get(admin.renderSignin)
  .post(sanitizeHtml, validateSignin, admin.signin);

module.exports = router;
