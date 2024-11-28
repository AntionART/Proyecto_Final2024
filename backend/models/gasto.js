    const mongoose = require('mongoose');

    const GastoSchema = new mongoose.Schema({
        nombreGasto: {
            type: String,
            required: true
        },
        fechaGasto: {
            type: Date,
            required: true
        },
        cantidad: {
            type: Number,
            required: true
        },
        totalGastado: {
            type: Number,
            required: true
        }
    }, { timestamps: true });

    module.exports = mongoose.model('Gasto', GastoSchema);
