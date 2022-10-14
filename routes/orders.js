const express = require('express')
const router = express.Router()
const Order = require("../models/order")
const Service = require("../models/service")
const authToken = require("../middleware/authToken")
const https = require("https")

router.get('/',authToken, async (req, res)=>{
    try{
        const orders = await Order.find()
        res.send(orders)
    }catch(error){
        res.status(500).send({msg: error.message})
    }
})

//kolla service finns,
router.post('/:id', authToken, async (req, res) => {

    try{
        const service = await Service.findOne({serviceType: req.body.serviceType})
        console.log(req.body.serviceType)
        if(!service){
            return res.send({msg:'No such service'})
        }


    }catch(error){
        res.status(500).send({msg: error.message})
    }
    const path = '/cabins/' + req.params.id
    const jwt = req.headers['authorization']
    let url = "schoolproject2.azurewebsites.net"
    var options = {
        hostname: url,
        port: 443,
        path: `${path}`,
        method: 'GET',
        headers:{
            Authorization: `${jwt}`
   }
}
https.get(options,(rese) => {
    let body = ""

    rese.on("data", (chunk) => {
        body += chunk
    })

    rese.on("end", () => {
        try {
             let json = JSON.parse(body)
        } catch (error) {
            console.error(error.message)
        }
    })

}).on("error", (error) => {
    console.error(error.message)
})

    try{
        const order = new Order({
            cabinId: req.params.id,
            serviceType: req.body.serviceType,
            serviceTime: req.body.serviceTime,
            createdBy: req.authUser.sub
        })
        const newOrder = await order.save()
        res.send(order)
    } catch(error){
        res.status(500).send({msg: error.message})
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
            {   cabinId: req.body.cabinId,
                serviceType: req.body.serviceType,
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
            return res.status(404).send({msg: "order not found"})
        }
        return res.send(order)
        }
        catch(error){
            res.status(500).send({msg: error.message})
        }
})

module.exports = router 