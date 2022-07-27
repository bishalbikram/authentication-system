const User = require('../models/user')
const passwordHelpers = require('../helpers/passwordHelpers')
const authMiddlewares = require('../middlewares/authMiddlewares')
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
        const newUser = new User({
            email,
            salt: hashPassword.salt, 
            hash: hashPassword.hash
        })
        const saveUser = await newUser.save()
        return res.status(201).json({ success: true, user: saveUser })
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
        const issuedToken = authMiddlewares.issueToken(user)
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

module.exports = userControllers