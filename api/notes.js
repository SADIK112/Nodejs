const express = require("express");
const Joi = require('joi');

const db = require('../db/connection');
const notes = db.get('notes');
const router = express.Router();

const schema = Joi.object().keys({
    title: Joi.string().max(30),
    message: Joi.string().max(500),
})

router.get('/', (req, res) => {
    notes.find({
        user_id: req._id
    }).then(notes => {
        res.json(notes)
    })
})

router.post('/', (req, res, next) => {
    const result = Joi.validate(req.body, schema);
    if (result.error === null) {
        const note = {
            ...req.body,
            user_id: req.user._id
        }
        notes.insert(req.body).then(note => {
            res.json(note)
        })
    } else {
        const error = new Error(result.error)
        res.status(422);
        next(error)
    }
})

module.exports = router