const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        trim: true,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    }, 
    fullName: {
        type: String,
        trim: true
    },
    avatar: {
        type: String
    },
    role: {
        type: String,
        default: 'user'
    },
    tokens: [{
        token: {
            type: String
        }
    }],
    emailVerificationCode: {
        type: Number,
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerifyRequestDate: {
        type: Date,
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordTokenExpire: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
})

const User = mongoose.model('User', userSchema)

module.exports = User