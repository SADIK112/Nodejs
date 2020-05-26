const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const router = express.Router();

const db = require('../db/connection');
const users = db.get('users');
users.createIndex('firstname', { unique: true });

const schema = Joi.object().keys({
    firstname: Joi.string().alphanum().min(2).max(30),
    lastname: Joi.string().alphanum().min(2).max(30),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().trim().min(8).required(),
})

router.get('/', (req, res) => {
    res.json({
        message: "welcome to Auth Page 💁"
    })
})

function createTokenSendResponse(user, res, next) {
    const payload = {
        _id: user._id,
        email: user.email,
    }
    jwt.sign(payload, process.env.SECRET_TOKEN, {
        expiresIn: '1d'
    }, (err, token) => {
        if (err) {
            errorFor422(res, next)
        } else {
            res.json({ token })
        }
    })
}

router.post('/signup', (req, res, next) => {
    const result = Joi.validate(req.body, schema)
    if (result.error === null) {
        users.findOne({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
        }).then(user => {
            if (user) {
                const error = new Error("firstname and lastname already exists..!!");
                next(error);
            } else {
                bcrypt.hash(req.body.password.trim(), 12).then(hasedPassword => {
                    const new_user = {
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        password: hasedPassword
                    }
                    users.insert(new_user).then(newuser => {
                        createTokenSendResponse(newuser, res, next);
                    })
                }).catch(error => next(error))
            }
        })
    } else {
        res.status(422)
        next(result.error)
    }
})

function errorFor422(res, next) {
    res.status(422)
    const error = new Error('account does not exists..!!');
    next(error)
}

router.post('/login', (req, res, next) => {
    const result = Joi.validate(req.body, schema)
    if (result.error === null) {
        users.findOne({
            email: req.body.email
        }).then(user => {
            if (user) {
                bcrypt.compare(req.body.password, user.password).then(result => {
                    if (result) {
                        createTokenSendResponse(user, res, next);
                    } else {
                        errorFor422(res, next)
                    }
                })

            } else {
                errorFor422(res, next)
            }
        })
    } else {
        errorFor422(res, next)
    }
})



module.exports = router;