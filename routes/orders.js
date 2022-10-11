const express = require('express')
const router = express.Router()
const Order = require("../models/order")
const Cabin = require("../models/cabin")
const authToken = require("../middleware/authToken");
const { find, findOne } = require('../models/cabin');

router.get('/',authToken, async (req, res)=>{
    try{
        const orders = await Order.find();
        res.send(orders);
    }catch(error){
        res.status(500).send({msg: error.message})
    }
});

router.get('/:id',authToken, async (req,res) =>{
    try {
        const order = await Order.findOne({_id: req.params.id})
        if(!order) {
            return res.status(404).send({msg: "order not found"})
        }
        res.send(order)
        }
        catch(error){
            res.status(500).send({msg: error.message})
        }
})


router.post('/',authToken, async (req, res) => {
    try{
        const cabin = await Cabin.findOne({cabin: req.body.cabin})
        if(!cabin){
            return res.send({msg:'No such cabin'})
        }
        const order = await Order.findOne({cabin: req.body.cabin,
             startDate: req.body.startDate})
        if(cabin){
            return res.send({msg:'Cabin already booked'})
        }
        const order1 = await Order.findOne({cabin: req.body.cabin,
            endDate: req.body.endDate})
       if(cabin){
           return res.send({msg:'Cabin already booked'})
       }

    }catch(error){
        res.status(500).send({msg: error.message});
    }
    try{
        const order = new Order({
            cabin: req.body.cabin,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            createdBy: req.authUser.sub
        });
        const newOrder= await order.save();
        res.send(order);
    } catch(error){
        res.status(500).send({msg: error.message});
    }


})

router.patch('/:id',authToken, async (req, res)=>{
    try{
        const updatedOrder = await Order.findOneAndUpdate(
            {_id: req.params.id, createdBy: req.authUser.sub},
            {cabin: req.body.cabin,
            startDate: req.body.startDate,
            endDate: req.body.endDate},
            {new: true}
        )
        res.send({msg:'Order updated', updatedOrder: updatedOrder})
    } catch (error){
        return res.status(500).send({msg: error.message})
    }
})

router.delete('/:id', authToken, async (req, res) => {
    try {
        const order = await Order.deleteOne({
            _id: req.params.id,
            createdBy: req.authUser.sub})
        if(!order){
            return res.status(404).send({msg: "order not found"});
        }
        return res.send(order)
        }
        catch(error){
            res.status(500).send({msg: error.message})
        }
})

module.exports = router