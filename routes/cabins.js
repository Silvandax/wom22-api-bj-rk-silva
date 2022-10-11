const express = require('express')
const http = require('http')
const authToken = require('../middleware/authToken')
const cabin = require('../models/cabin')
const router = express.Router()
const Cabin = 'https://schoolproject2.azurewebsites.net/cabins'
const options = {
    hostname: 'http://schoolproject2.azurewebsites.net',
    path: '/cabins',
    method: 'GET'
};

router.get('/', authToken, async (req, res)=>{
    try{
        const request = http.request(options, (res) => {
            let data = ''
        
            res.on('data', (chunk) => {
                data += chunk;
            });
            // Ending the response 
            res.on('end', () => {
                console.log('Body:', JSON.parse(data))
            });
        
        }).on("error", (err) => {
            console.log("Error: ", err)
        }).end()
        return res.send('ok')
    }catch(error){
        res.status(500).send({msg: error.message})
    }
})

module.exports = router;
