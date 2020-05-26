const express = require('express');
const volleyball = require('volleyball');
const auth = require('./auth/index.js');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(volleyball)
app.use(express.json())

app.get('/', (req, res) => {
    res.json({
        message: "welcome to node App"
    })
})

app.use(cors({
    origin: "http://localhost:4200"
}))

app.use('/auth', auth);

function notFound(req, res, next) {
    res.status(404);
    const error = new Error('Not Found - ' + req.originalUrl)
    next(error)
}

function errorHandler(error, req, res, next) {
    res.status(res.statusCode || 500);
    res.json({
        message: error.message,
        stack: error.stack
    })
}

app.use(notFound);
app.use(errorHandler)

let port = process.env.PORT || 8000
app.listen(port, () => {
    console.log('app is running on port 8000')
});