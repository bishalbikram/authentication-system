const express = require('express')
const router = express.Router()
const userControllers = require('../../controllers/userControllers')
const authMiddlewares = require('../../middlewares/authMiddlewares')

router.post('/register', userControllers.Register)

router.post('/verifyemail', userControllers.VerifyEmail)

router.post('/resendemailverify', userControllers.ResendEmailVerificationCode)

router.post('/login', userControllers.Login)

router.post('/logout', authMiddlewares.authenticate, userControllers.Logout)

module.exports = router