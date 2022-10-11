const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    services: {
        type: String,
        required: true,
        unique: true
    }
}, {timestamps: true})

module.exports = mongoose.model(
    'Service',
    serviceSchema
)