const crypto = require('crypto')
const User = require('../models/user')
const passwordHelpers = require('../helpers/passwordHelpers')
const authMiddlewares = require('../middlewares/authMiddlewares')
const mailHelpers = require('../helpers/mailHelpers')
const userControllers = {}

userControllers.Register = async (req, res, next) => {
    const { email, password } = req.body
    try {
        if(!email) {
            return res.status(400).json({ message: 'You must provide an email.' })
        }
        if(!password) {
            return res.status(400).json({ message: 'You must provide a password.' })
        }
        const user = await User.findOne({ email })
        if(user) {
            return res.status(400).json({ message: 'User already exist.' })
        }
        const hashPassword = passwordHelpers.hashPassword(password)
        const emailVerificationCode = Math.floor(100000 + Math.random() * 900000)
        const emailVerifyRequestDate = new Date()
        await mailHelpers.sendMail({
            to: email,
            subject: 'Verify your account',
            text: '', 
            html: mailHelpers.emailVerifyTemplate(emailVerificationCode),
            next
        })
        const newUser = new User({
            email,
            salt: hashPassword.salt, 
            hash: hashPassword.hash,
            emailVerificationCode,
            emailVerifyRequestDate
        })
        const saveUser = await newUser.save()
        return res.status(201).json({ success: true, user: saveUser })
    } catch (err) {
        next(err)
    }
}

userControllers.VerifyEmail = async (req, res, next) => {
    try {
        const { email, code } = req.body
        if(!code) {
            return res.status(400).json({ message: 'You must provide an OTP to verify email.' })
        }
        const emailVerified = await User.findOne({ email, emailVerified: true })
        if(emailVerified) {
            return res.status(400).json({ message: 'Email already verified.' })
        }
        const user = await User.findOne({ email, emailVerificationCode: code })
        if(!user) {
            return res.status(400).json({ message: 'Invalid verification code.' })
        }
        user.emailVerified = true
        await user.save()
        return res.status(200).json({
            success: true,
            message: 'Email verified successfully.',
            email,
            emailVerified: user.emailVerified
        })
    } catch (err) {
        next(err)
    }
}

userControllers.ResendEmailVerificationCode = async (req, res, next) =>  {
    try {
        const email = req.body.email
        const emailVerified = await User.findOne({ email, emailVerified: true })
        if(emailVerified) {
            return res.status(400).json({ message: 'Email alreay verified.' })
        }
        const user = await User.findOne({ email })
        const presentDate = new Date()
        const timeDifference = parseInt((presentDate - user.emailVerifyRequestDate) / (1000 * 1)) 
        if(timeDifference < 10) {
            return res.status(400).json({ message: 'Verification code already sent to your email.' })
        }
        const emailVerificationCode = Math.floor(100000 + Math.random() * 100000)
        await mailHelpers.sendMail({
            to: email,
            subject: 'Verify your account',
            text: '',
            html: mailHelpers.emailVerifyTemplate(emailVerificationCode),
            next
        })
        user.emailVerificationCode = emailVerificationCode
        user.emailVerifyRequestDate = presentDate
        await user.save()
        return res.status(200).json({
            message: 'Verification code sent to your email.'
        })
    } catch (err) {
        next(err)
    }
}

userControllers.ForgotPassword = async (req, res, next) => {
    try {
        const email = req.body.email
        const user = await User.findOne({ email })
        if(!user) {
            return res.status(400).json({ message: 'User doesn\'t exist.' })
        }
        const resetToken = passwordHelpers.getResetPasswordToken(user)
        const resetUrl = `http://127.0.0.1:${process.env.PORT}/api/user/resetpassword/${resetToken}`
        await mailHelpers.sendMail({
            to: email,
            subject: 'Password reset',
            text: '',
            html: mailHelpers.resetPasswordEmailTemplate(resetUrl),
            next
        })
        await user.save()
        return res.status(200).json({
            success: true,
            message: 'Please check your mail to reset password.' 
        })
    } catch (err) {
        next(err)
    }
}

userControllers.ResetPassword = async (req, res, next) => {
    try {
        const password = req.body.password
        const resetToken = req.params.resetToken
        const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordTokenExpire: { $gt: Date.now() } 
        })
        if(!user) {
            return res.status(400).json({ message: 'Invalid reset token.' })
        }
        if(!password) {
            return res.status(400).json({ message: 'You must provide a password.' })
        }
        const hashPassword = passwordHelpers.hashPassword(password)
        user.salt = hashPassword.salt
        user.hash = hashPassword.hash
        user.resetPasswordToken = undefined
        user.resetPasswordTokenExpire = undefined
        await user.save()
        return res.status(200).json({ success: true, message: 'Password reset successfully.' })
    } catch (err) {
        next(err)
    }
}

userControllers.Login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if(!email) {
            return res.status(400).json({ message: 'You must provide an email.' })
        }
        if(!password) {
            return res.status(400).json({ message: 'You must provide a passoword.' })
        }
        const user = await User.findOne({ email })
        if(!user) {
            return res.status(400).json({ message: 'Invalid email or password.' })
        }
        if(!user.emailVerified) {
            return res.status(400).json({ message: 'Please verify your email.' })
        }
        const verifyPassword = passwordHelpers.verifyPassword(password, user.salt, user.hash)
        if(!verifyPassword) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }
        const issuedToken = await authMiddlewares.issueToken(user)
        return res.status(200).json({
            success: true,
            message: 'You are successfully logged in.', 
            token: issuedToken.token,
            expiresIn: issuedToken.expiresIn
        })
    } catch (err) {
        next(err)
    }
}

userControllers.Logout = async (req, res, next) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => { token !== req.token })
        await req.user.save()
        return res.status(200).json({ message: 'You are successfully logged out.' })
    } catch (err) {
        next(err)
    }
}

module.exports = userControllers