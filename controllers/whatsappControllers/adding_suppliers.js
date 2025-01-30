const axios = require("axios");
const dotenv = require("dotenv");
const twilio = require("twilio");
const { Supplier } = require("../../models/supplier");

dotenv.config();
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const addingSuppliers = async (req, res, sessionId, userMessage) => {
  console.log("we are in addingcustom order inner function");
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
    const foundSupplier = await Supplier.findOne({ contact })
    if (foundSupplier) return "Supplier with same contact number already exist. try again later!"
    const supplierId = Math.floor(100000 + Math.random() * 900000);
    const newSupplier = new Supplier({ name, address, contact, supplierId });
    await newSupplier.save();
    return "Supplier added successfully"

  } catch (error) {
    console.log("error while adding supplier", error.message);
    return "we cannot add the supplier please try again later"
  }
};

module.exports = addingSuppliers;
