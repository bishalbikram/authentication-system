const express = require('express')
const app = express()
const routes = require('./routes/index')
require('./db/mongoose')

// Parse application/json
app.use(express.json())

// Parse application/x-www-form-urlencoded 
app.use(express.urlencoded({
    extended: true
}))

// CORS setup
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    req.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    next()
})

// Use routes
app.use('/api', routes)

// Catch 404 error and forward to error handler 
app.use((req, res, next) => {
    const err = new Error('Not found')
    err.status = 404
    next(err)
})

// Error handler
app.use((err, req, res, next) => {
    const status = err.status || 400
    res.status(status).json({ error: err.message })
})

module.exports = app