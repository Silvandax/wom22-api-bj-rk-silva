const express = require('express')
const router = express.Router()
const Service = require("../models/service")
const Cabin = require("../models/cabin")
const authToken = require("../middleware/authToken");
const { find, findOne } = require('../models/cabin');

router.get('/',authToken, async (req, res)=>{
    try{
        const services = await Service.find();
        res.send(services);
    }catch(error){
        res.status(500).send({msg: error.message})
    }
});

router.get('/:id',authToken, async (req,res) =>{
    try {
        const service = await Service.findOne({_id: req.params.id})
        if(!service) {
            return res.status(404).send({msg: "service not found"})
        }
        res.send(service)
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
        const service = await Service.findOne({cabin: req.body.cabin,
             startDate: req.body.startDate})
        if(cabin){
            return res.send({msg:'Cabin already booked'})
        }
        const service1 = await Service.findOne({cabin: req.body.cabin,
            endDate: req.body.endDate})
       if(cabin){
           return res.send({msg:'Cabin already booked'})
       }

    }catch(error){
        res.status(500).send({msg: error.message});
    }
    try{
        const service = new Service({
            cabin: req.body.cabin,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            createdBy: req.authUser.sub
        });
        const newService= await service.save();
        res.send(service);
    } catch(error){
        res.status(500).send({msg: error.message});
    }


})

router.patch('/:id',authToken, async (req, res)=>{
    try{
        const updatedService = await Service.findOneAndUpdate(
            {_id: req.params.id, createdBy: req.authUser.sub},
            {cabin: req.body.cabin,
            startDate: req.body.startDate,
            endDate: req.body.endDate},
            {new: true}
        )
        res.send({msg:'Service updated', updatedService: updatedService})
    } catch (error){
        return res.status(500).send({msg: error.message})
    }
})

router.delete('/:id', authToken, async (req, res) => {
    try {
        const service = await Service.deleteOne({
            _id: req.params.id,
            createdBy: req.authUser.sub})
        if(!service){
            return res.status(404).send({msg: "service not found"});
        }
        return res.send(service)
        }
        catch(error){
            res.status(500).send({msg: error.message})
        }
})

module.exports = router