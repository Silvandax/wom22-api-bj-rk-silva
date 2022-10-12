const express = require('express')
const https = require('https')
const authToken = require('../middleware/authToken')
const router = express.Router()
//const Cabin = 'https://schoolproject2.azurewebsites.net/cabins'

router.get('/', authToken, async (req, res) => {
    const jwt = req.headers['authorization'];
    let url = "schoolproject2.azurewebsites.net";
    var options = {
        hostname: url,
        port: 443,
        path: '/cabins/owned',
        method: 'GET',
        headers:{
            Authorization: `${jwt}`
   }
};
https.get(options,(rese) => {
    let body = ""

    rese.on("data", (chunk) => {
        body += chunk
    });

    rese.on("end", () => {
        try {
             let json = JSON.parse(body)
            res.send(json)
            console.log(json)
        } catch (error) {
            console.error(error.message)
        };
    });

}).on("error", (error) => {
    console.error(error.message);
});

})

module.exports = router;
