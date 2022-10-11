const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
        cabin:{
            type: String,
            required: true
        },
        seviceType:{
            type: String,
            required: true
        },
        serviceTime:{
            type: Date,
            require: true
        }


}, {timestamps: true})

module.exports = mongoose.model("Order", orderSchema)