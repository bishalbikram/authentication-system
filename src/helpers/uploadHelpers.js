const multer = require('multer')
const path = require('path')
const uploadHelpers = {}

uploadHelpers.uploadFiles = (filePath) => {
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            const uploadPath = path.resolve(filePath)
            cb(null, uploadPath)
        },
        filename: function(req, file, cb) {
            const uniqeSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, file.fieldname + uniqeSuffix + path.extname(file.originalname))
        }
    })
    const fileFilter = (req, file, cb) => {
        const fileType = ['jpg', 'png', 'jpeg', 'svg']
        if(!fileType.includes(path.extname(file.originalname).split('.')[1])) {
            cb(new Error('File type not supported.'))
        }
        cb(null, true)
    }
    return upload = multer({
        storage,
        limits: {
            fileSize: 1048576
        },
        fileFilter
    })
}

module.exports = uploadHelpers