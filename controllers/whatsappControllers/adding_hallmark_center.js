const axios = require("axios");
const dotenv = require("dotenv");
const twilio = require("twilio");
const { Supplier } = require("../../models/supplier");
const { HallMarkCenter } = require("../../models/hallmarkCenter");

dotenv.config();
const client = new twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const addingHallMarkCenter = async (req, res, sessionId, userMessage) => {
    console.log("we are in adding vendor function");
    const options = {
        method: "POST",
        url: "https://ai-textraction.p.rapidapi.com/textraction",
        headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": process.env.RAPIDAPI_KEY_1,
            "X-RapidAPI-Host": "ai-textraction.p.rapidapi.com",
        },
        data: {
            text: userMessage,
            entities: [
                {
                    var_name: "centerName",
                    type: "string",
                    description: "Center Name",
                },
                {
                    var_name: "address",
                    type: "string",
                    description: "Address",
                },
                {
                    var_name: "contact",
                    type: "string",
                    description: "Contact",
                },
                {
                    var_name: "email",
                    type: "string",
                    description: "Email",
                },
                {
                    var_name: "authorizedBy",
                    type: "string",
                    description: "Authorized By",
                },
            ],
        },
    };
    let centerName, contact, address, email, authorizedBy;

    try {
        console.log("before1");
        const response = await axios.request(options);
        console.log(response.data);
        centerName = response.data.results.centerName;
        contact = response.data.results.contact;
        address = response.data.results.address;
        email = response.data.results.email;
        authorizedBy = response.data.results.authorizedBy;

        if (
            !centerName && !address && !contact && !email && !authorizedBy
        ) {
            return "please fill all the details correctly";
        }
        const foundHallMarkCenter = await HallMarkCenter.findOne({ contact })
        if (foundHallMarkCenter) return "HallMarkCenter with same contact number already exist. try again later!"
        const hallmarkCenterId = Math.floor(100000 + Math.random() * 900000);
        const newHallMarkCenter = new HallMarkCenter({ centerName, contact, address, email, authorizedBy, hallmarkCenterId });
        await newHallMarkCenter.save();
        return "Hallmark Center added Successfully"

    } catch (error) {
        console.log("error while adding hall mark center", error.message);
        return "we cannot add the hall mark center please try again later"
    }
};

module.exports = addingHallMarkCenter;
