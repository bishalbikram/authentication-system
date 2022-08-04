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
            emailVerificationCode
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