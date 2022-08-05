const crypto = require('crypto')

passwordHelpers = {}

passwordHelpers.hashPassword = (password) => {
    const salt = crypto.randomBytes(32).toString('hex')
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
    return {
        salt,
        hash
    }
}

passwordHelpers.verifyPassword = (password, salt, hash) => {
    const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
    return hash === verifyHash
}

passwordHelpers.getResetPasswordToken = (user) => {
    let resetToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')
    user.resetPasswordTokenExpire = new Date() + (1000 * 60 * 10)
    return resetToken
}

module.exports = passwordHelpers