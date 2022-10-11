const express = require('express')
const router = express.Router()
const Order = require("../models/order")
const authToken = require("../middleware/authToken");

router.get('/',authToken, async (req, res)=>{
    try{
        const orders = await Order.find();
        res.send(orders);
    }catch(error){
        res.status(500).send({msg: error.message})
    }
});
//kolla service finns, kolla cabin finns, kolla att det inte finns en identisk bokning
router.post('/', authToken, async (req, res) => {
    /*try{
        const cabin = await Cabin.findOne({cabin: req.body.cabin})
        if(!cabin){
            return res.send({msg:'No such cabin'})
        }
        const booking = await Booking.findOne({cabin: req.body.cabin,
             startDate: req.body.startDate})
        if(cabin){
            return res.send({msg:'Cabin already booked'})
        }
        const booking1 = await Booking.findOne({cabin: req.body.cabin,
            endDate: req.body.endDate})
       if(cabin){
           return res.send({msg:'Cabin already booked'})
       }

    }catch(error){
        res.status(500).send({msg: error.message});
    }*/

    try{
        const order = new Order({
            cabin: req.body.cabin,
            seviceType: req.body.seviceType,
            serviceTime: req.body.serviceTime,
            createdBy: req.authUser.sub
        });
        const newOrder = await order.save();
        res.send(order);
    } catch(error){
        res.status(500).send({msg: error.message});
    }
})

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

router.patch('/:id', authToken, async (req, res) => {
    try{
        const order = await Order.findOneAndUpdate(
            {_id: req.params.id, createdBy: req.authUser.sub},
            {   cabin: req.body.cabin,
                seviceType: req.body.seviceType,
                serviceTime: req.body.serviceTime},
            {new: true}   
        )
        if(!order){
            return res.status(404).send({msg: "No such order"})
        }
        res.send({msg: "Updated order", order})
    }catch(error){
        res.status(500).send({ msg: error.message })
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