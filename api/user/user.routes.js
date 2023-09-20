const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {getUser, getUsers, deleteUser, updateUser} = require('./user.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/user', getUsers)
router.get('/user/:id', getUser)
router.put('/user/:id', requireAuth,  updateUser)

// router.put('/:id',  requireAuth, updateUser)
router.delete('/user/:id',  requireAuth, requireAdmin, deleteUser)

module.exports = router