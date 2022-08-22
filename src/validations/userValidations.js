const validator = require('validator')
const isEmpty = require('./isEmpty')
const userValidations = {}

userValidations.validateRegister = (req, res, next) => {
    let errors = {}
    const validateObj = req.body
    const validateFields = Object.keys(validateObj)
    for(let i = 0; i < validateFields.length; i++) {
        let validateField = validateFields[i]
        let value = validateObj[validateField]
        switch(validateField) {
            case 'email':
                if(isEmpty(value)) {
                    errors[validateField] = 'You must provide an email!'
                } else if(!validator.isEmail(value)) {
                    errors[validateField] = 'Invalid email address!'
                }
                break
            case 'password':
                if(isEmpty(value)) {
                    errors[validateField] = 'You must provide a password!'
                } else if(!validator.isLength(value, { min: 6 })) {
                    errors[validateField] = 'Password must be atleast 6 characters long!'
                }
                break
            default:
                break
        }
    }
    if(!isEmpty(errors)) {
        return res.status(400).json({ errors })
    }
    next()
}

module.exports = userValidations