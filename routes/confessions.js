const express = require('express')
const router = express.Router()

const confessions = require('../controllers/confessions')

router.get('/create', confessions.create)

router
    .route('/')
    .post(confessions.store)
    .get(confessions.index)

router
    .route('/:id')
    .get(confessions.show)
    .put(confessions.update)
    .delete(confessions.destroy)

router.get('/:id/edit', confessions.edit)

module.exports = router