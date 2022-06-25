const express = require('express');
const router = express.Router();

const blacklistWord = require('../controllers/blacklistWord');
const { authenticate, sanitizeHtml, validateBlacklistWord } = require('../middleware');
const catchAsync = require('../utils/catchAsync');

router
    .route('/')
    .get(
        authenticate,
        catchAsync(blacklistWord.index)
    )
    .post(
        authenticate,
        validateBlacklistWord,
        sanitizeHtml,
        catchAsync(blacklistWord.store)
    )

router
    .route('/:id')
    .delete(
        authenticate,
        catchAsync(blacklistWord.destroy),
    );

module.exports = router;