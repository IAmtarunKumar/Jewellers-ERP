const { default: axios } = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const gstChooser = async (req, res) => {
    console.log("we are in gstchooser and lets check whats coming in body", req.body)
    const { customerPincode, organisationPincode } = req.body
    if (!customerPincode || !organisationPincode) return res.status(400).send("Send complete required` Data!")
    const options = {
        method: 'POST',
        url: 'https://pincode.p.rapidapi.com/',
        headers: {
            'content-type': 'application/json',
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY_1,
            'X-RapidAPI-Host': 'pincode.p.rapidapi.com'
        },
        data: {
            searchBy: 'pincode',
            value: parseInt(customerPincode)
        }
    };
    let customerState;
    try {
        const response = await axios.request(options);
        console.log("response from rapidapi", response.data);
        customerState = response.data[0].circle

    } catch (error) {
        console.log(error.message);
    }
    console.log("customer state found", customerState)
    const options1 = {
        method: 'POST',
        url: 'https://pincode.p.rapidapi.com/',
        headers: {
            'content-type': 'application/json',
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY_1,
            'X-RapidAPI-Host': 'pincode.p.rapidapi.com'
        },
        data: {
            searchBy: 'pincode',
            value: parseInt(organisationPincode)
        }
    };
    let organisationState;
    try {
        const response = await axios.request(options1);
        console.log("response from rapidapi", response.data);
        organisationState = response.data[0].circle
    } catch (error) {
        console.log(error.message);
    }
    console.log("organisation state found", organisationState)

    if (customerState === organisationState) {
        console.log("we are in the state same block")
        return res.status(200).send("sgst/cgst")
    }
    return res.status(200).send("igst")
}

module.exports = gstChooser