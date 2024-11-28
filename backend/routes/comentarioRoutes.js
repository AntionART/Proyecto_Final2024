const express = require('express');
const Comentario = require('../models/comentario');
const router = express.Router();

router.get('/', async (req, res) => {
    const comentarios = await Comentario.find();
    res.json(comentarios);
});

router.post('/', async (req, res) => {
    const nuevoComentario = new Comentario(req.body);
    await nuevoComentario.save();
    res.status(201).json(nuevoComentario);
});

module.exports = router;
