const express = require('express')
const router = express.Router()
const Service = require("../models/service")
const authToken = require("../middleware/authToken");

router.get('/',authToken, async (req, res)=>{
    try{
        const services = await Service.find();
        res.send(services);
    }catch(error){
        res.status(500).send({msg: error.message})
    }
});
// error duplicate key ??????
router.post('/', authToken, async (req, res) => {
    try{
        const service = new Service({
            service: req.body.service,
            createdBy: req.authUser.sub
        });
        const newService = await service.save();
        res.send(service);
    } catch(error){
        res.status(500).send({msg: error.message});
    }
})

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

router.patch('/:id', authToken, async (req, res) => {
    try{
        const service = await Service.findOneAndUpdate(
            {_id: req.params.id, createdBy: req.authUser.sub},
            {service: req.body.service},
            {new: true}   
        )
        if(!service){
            return res.status(404).send({msg: "No such service"})
        }
        res.send({msg: "Updated service", service})
    }catch(error){
        res.status(500).send({ msg: error.message })
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