const express = require("express");
const router = express.Router();
const axios = require('axios');

router.get('/fetchPrices', async (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://live-metal-prices.p.rapidapi.com/v1/latest/XAU,XAG,PA,PL,GBP,EUR/EUR',
        headers: {
            'X-RapidAPI-Key': '801a1b2b01mshbde5002042e5b4ap1d22f3jsn8af7b9ffc146',
            'X-RapidAPI-Host': 'live-metal-prices.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        console.log(response.data);
        res.status(200).send(response.data);
    } catch (error) {
        console.error(error);
        res.status(401).send(error);
    }
});


module.exports = router;