const axios = require("axios");
const dotenv = require("dotenv");
const twilio = require("twilio");
const { Supplier } = require("../../models/supplier");
const { Vendor } = require("../../models/vendor");

dotenv.config();
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const addingVendor = async (req, res, sessionId, userMessage) => {
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
          var_name: "name",
          type: "string",
          description: "Name",
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
      ],
    },
  };
  let name, address, contact;

  try {
    console.log("before1");
    const response = await axios.request(options);
    console.log(response.data);
    name = response.data.results.name;
    address = response.data.results.address;
    contact = response.data.results.contact;

    if (
      !name && !address ||
      !contact
    ) {
      return "please fill all the details correctly";
    }
    const foundVendor = await Vendor.findOne({ contact })
    if (foundVendor) return "Vendor with same contact number already exist. try again later!"
    const foundVendor1 = await Vendor.findOne({ contact })
    if (foundVendor1) return "Vendor with same name already exist. try again later!"
    const vendorId = Math.floor(100000 + Math.random() * 900000);
    const newVendor = new Vendor({ name, address, contact, vendorId });
    await newVendor.save();
    return "Vendor added successfully!"
  } catch (error) {
    console.log("error while adding supplier", error.message);
    return "we cannot add the vendor please try again later"
  }
};

module.exports = addingVendor;
