const nodemailer = require('nodemailer')

const emailHelper = {}

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

emailHelper.sendMail = async function(to, subject, text, html) {
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

module.exports = emailHelper