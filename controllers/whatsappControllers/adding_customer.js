const axios = require("axios");
const dotenv = require("dotenv");
const twilio = require("twilio");
const { Supplier } = require("../../models/supplier");
const { Customer } = require("../../models/customer");

dotenv.config();
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const addingCustomer = async (req, res, sessionId, userMessage) => {
  console.log("we are in adding customer function");
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
    const foundCustomer = await Customer.findOne({ contact })
    if (foundCustomer) return "Customer with same contact number already exist. try again later!"
    const customerId = Math.floor(100000 + Math.random() * 900000);
    const newCustomer = new Customer({ name, address, contact, customerId });
    await newCustomer.save();
    return "Customer added Successfully"

  } catch (error) {
    console.log("error while adding Customer", error.message);
    return "we cannot add the supplier please try again later"
  }
};

module.exports = addingCustomer;
