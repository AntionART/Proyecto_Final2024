const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');  // Requiere el módulo 'path' para gestionar rutas

// Rutas de la API
const foroRoutes = require('./routes/foroRoutes');
const gastoRoutes = require('./routes/gastoRoutes');
const comentarioRoutes = require('./routes/comentarioRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/comentariosDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conexión exitosa a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB', err));

// Rutas de la API
app.use('/api/foros', foroRoutes);
app.use('/api/gastos', gastoRoutes);
app.use('/api/comentarios', comentarioRoutes);

// Servir archivos estáticos desde la carpeta 'frontend' para la aplicación del cliente
app.use(express.static(path.join(__dirname, 'frontend'))); // Cambia 'frontend' si tu carpeta se llama de otra manera

// Ruta para servir el archivo 'index.html' en la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html')); // Asegúrate de que la ruta y el nombre del archivo sean correctos
});

// Iniciar el servidor
app.listen(5000, () => {
    console.log('Servidor corriendo en http://localhost:5000');
});
