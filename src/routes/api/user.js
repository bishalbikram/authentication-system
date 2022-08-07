const express = require('express')
const router = express.Router()
const userControllers = require('../../controllers/userControllers')
const authMiddlewares = require('../../middlewares/authMiddlewares')

router.post('/register', userControllers.Register)

router.post('/verifyemail', userControllers.VerifyEmail)

router.post('/resendemailverify', userControllers.ResendEmailVerificationCode)

router.post('/forgotpassword', userControllers.ForgotPassword)

router.post('/resetpassword/:resetToken', userControllers.ResetPassword)

router.post('/login', userControllers.Login)

router.get('/profile', authMiddlewares.authenticate, userControllers.Profile)

router.post('/changepassword', authMiddlewares.authenticate, userControllers.ChangePassword)

router.post('/logout', authMiddlewares.authenticate, userControllers.Logout)

module.exports = router