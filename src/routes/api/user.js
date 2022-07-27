const express = require('express')
const router = express.Router()
const userControllers = require('../../controllers/userControllers')

router.post('/register', userControllers.Register)

router.post('/login', userControllers.Login)

module.exports = router