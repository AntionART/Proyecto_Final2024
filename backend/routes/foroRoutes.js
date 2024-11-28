const express = require('express');
const Foro = require('../models/foro');
const router = express.Router();

router.get('/', async (req, res) => {
    const foros = await Foro.find();
    res.json(foros);
});

router.post('/', async (req, res) => {
    const nuevoForo = new Foro(req.body);
    await nuevoForo.save();
    res.status(201).json(nuevoForo);
});

module.exports = router;
