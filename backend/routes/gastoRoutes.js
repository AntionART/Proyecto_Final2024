const express = require('express');
const Gasto = require('../models/gasto');
const router = express.Router();

// Obtener todos los gastos
router.get('/', async (req, res) => {
    try {
        const gastos = await Gasto.find();
        res.json(gastos);
    } catch (error) {
        res.status(500).send('Error al obtener gastos');
    }
});

// Crear nuevo gasto
router.post('/', async (req, res) => {
    try {
        const nuevoGasto = new Gasto(req.body);
        await nuevoGasto.save();
        res.status(201).json(nuevoGasto);
    } catch (error) {
        res.status(400).send('Error al crear gasto');
    }
});

// Eliminar gasto
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const gastoEliminado = await Gasto.findByIdAndDelete(id);
        if (!gastoEliminado) {
            return res.status(404).send('Gasto no encontrado');
        }
        res.json(gastoEliminado);
    } catch (error) {
        res.status(500).send('Error al eliminar el gasto');
    }
});

module.exports = router;
