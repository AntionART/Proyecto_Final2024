const mongoose = require('mongoose');

const foroSchema = new mongoose.Schema({
    nombre: String,
    correo: String,
    tematica: String,
    mensaje: String,
    imagenURL: String,
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Foro', foroSchema);
