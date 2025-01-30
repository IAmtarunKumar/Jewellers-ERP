const axios = require("axios");
const dotenv = require("dotenv");
const twilio = require("twilio");
const { Supplier } = require("../../models/supplier");
const { Sales } = require("../../models/sales");

dotenv.config();
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const addingSale = async (req, res, sessionId, userMessage) => {
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
          var_name: "customerId",
          type: "string",
          description: "CustomerId",
        },
        {
          var_name: "productId",
          type: "string",
          description: "ProductId",
        },
        {
          var_name: "saleDate",
          type: "string",
          description: "SaleDate",
        },
        {
          var_name: "quantity",
          type: "string",
          description: "Quantity",
        },
      ],
    },
  };
  let customerId, productId, saleDate, quantity;

  try {
    console.log("before1");
    const response = await axios.request(options);
    console.log(response.data);
    customerId = response.data.results.customerId;
    productId = response.data.results.productId;
    saleDate = response.data.results.saleDate;
    quantity = response.data.results.quantity;

    if (
      !customerId && !productId && !saleDate && !quantity
    ) {
      return "please fill all the details correctly";
    }
    const newSales = new Sales({ customerId, productId, saleDate, quantity });
    await newSales.save();
    return "Sales added Successfully"

  } catch (error) {
    console.log("error while adding Customer", error.message);
    return "we cannot add the supplier please try again later"
  }
};

module.exports = addingSale;
