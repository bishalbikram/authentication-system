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
    createdAt: {
        type: Date,
        default: Date.now()
    },
})

const User = mongoose.model('User', userSchema)

module.exports = User