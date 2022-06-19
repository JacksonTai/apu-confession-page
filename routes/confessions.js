const express = require('express');
const router = express.Router({ mergeParams: true });

const confessions = require('../controllers/confessions');
const { authenticate, validateConfession, sanitizeHtml } = require('../middleware');
const catchAsync = require('../utils/catchAsync');

router.get('/create', catchAsync(confessions.create));
router.get('/api', catchAsync(confessions.api));
router.get('/approve', catchAsync(confessions.approve))

router
    .route('/')
    .post(
        validateConfession,
        sanitizeHtml,
        catchAsync(confessions.store),
    )
    .get(
        authenticate,
        catchAsync(confessions.index),
    );

router
    .route('/:id')
    .get(
        authenticate,
        catchAsync(confessions.show),
    )
    .put(
        authenticate,
        validateConfession,
        sanitizeHtml,
        catchAsync(confessions.update),
    )
    .delete(
        authenticate,
        catchAsync(confessions.destroy),
    );

router.get('/:id/edit',
    authenticate,
    catchAsync(confessions.edit),
);

module.exports = router;