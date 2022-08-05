const nodemailer = require('nodemailer')
const emailHelpers = {}

emailHelpers.sendMail = async function({to, subject, text, html, next}) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAUTH2',
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN
        }
    })
    try {
        const info = await transporter.sendMail({
            from: process.env.MAIL_USERNAME,
            to,
            subject,
            text,
            html
        })
        console.log(info)
    } catch (err) {
        next(err)
    }
}

emailHelpers.emailVerifyTemplate = function(code) {
    return `<p>Hey,</p>
    <p>Your verification code to verify account is</p>
    <h2>${code}</h2>
    <p>Thank you.</p>`
}

emailHelpers.resetPasswordEmailTemplate = function(resetUrl) {
    return `<p>Hey,</p>
    <p>Your link to reset password is</p>
    <a href=${resetUrl}>${resetUrl}</a>
    <p>Thank you.</p>`
}

module.exports = emailHelpers