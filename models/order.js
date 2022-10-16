const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
        cabinId:{
            type: String,
            required: true
        },
        serviceType:{
            type: String,
            required: true
        },
        serviceTime:{
            type: Date,
            require: true
        },
        createdBy: {
            type: String,
            required: true,
            
        }
}, {timestamps: true})

module.exports = mongoose.model("Order", orderSchema)