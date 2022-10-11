const express = require('express')
const https = require('https')
//const fetch = require('node-fetch')
const authToken = require('../middleware/authToken')
const cabin = require('../models/cabin')
const router = express.Router()
const Cabin = 'https://schoolproject2.azurewebsites.net/cabins'

router.get('/', authToken, async (req, res) => {
    // const users = await User.find()

    // console.log(req)
let url = "schoolproject2.azurewebsites.net";
var options = {
    hostname: url,
    port: 443,
    path: '/cabins',
    method: 'GET',
    headers:{
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MzMyYWUwNzkyNWYzODI1NTdlYTAyZTgiLCJlbWFpbCI6ImpvaG4uZG9lQGFyY2FkYS5maSIsImlhdCI6MTY2NTQ5MjY3NiwiZXhwIjoxNjY1NTc5MDc2fQ.Zrl4fSgUTEQ-Jq4n82lQF_fNyu-yyDhpfk9c4tyb-Qs',

   }
};
https.get(options,(res) => {
    let body = ""

    res.on("data", (chunk) => {
        body += chunk
    });

    res.on("end", () => {
        try {
             let json = JSON.parse(body)
            // do something with JSON

            // console.log(json)
        } catch (error) {
            console.error(error.message)
        };
    });

}).on("error", (error) => {
    console.error(error.message);
});
res.send(json);
})

// den gettar från fel server!
/*https.get('https://schoolproject2.azurewebsites.net/cabins',
 authToken, async (req, res)=>{
    try{
        const cabins = await cabin.find();
        res.send(cabins);
    }catch(error){
        res.status(500).send({msg: error.message})
    }
})*/

module.exports = router;
