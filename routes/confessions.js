const express = require('express')
const router = express.Router({ mergeParams: true })

const confessions = require('../controllers/confessions')
const { validateConfession } = require('../middleware')
const catchAsync = require('../utils/catchAsync')

router.get('/create', catchAsync(confessions.create))

router
    .route('/')
    .post(
        validateConfession,
        catchAsync(confessions.store)
    )
    .get(catchAsync(confessions.index))

router
    .route('/:id')
    .get(catchAsync(confessions.show))
    .put(
        validateConfession,
        catchAsync(confessions.update)
    )
    .delete(catchAsync(confessions.destroy))

router.get('/:id/edit', catchAsync(confessions.edit))

module.exports = router