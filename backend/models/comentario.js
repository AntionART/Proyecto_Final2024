const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
    usuario: String,
    correo: String,
    mensaje: String,
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comentario', comentarioSchema);
