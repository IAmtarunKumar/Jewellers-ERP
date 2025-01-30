const axios = require("axios");
const dotenv = require("dotenv");
const twilio = require("twilio");

const Product = require("../../models/product");
const { Customer } = require("../../models/customer");
const { handleDateInput } = require("../../utils/handleDateInput");
const { CustomOrders } = require("../../models/customOrder");

dotenv.config();
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const addingCustomOrder = async (req, res, sessionId, userMessage) => {
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
          var_name: "customerId",
          type: "string",
          description: "customer ID",
        },
        {
          var_name: "productName",
          type: "string",
          description: "product name",
        },
        {
          var_name: "productDescription",
          type: "string",
          description: "product description",
        },
        {
          var_name: "orderDate",
          type: "string",
          description: "order date",
        },
        {
          var_name: "completionDate",
          type: "string",
          description: "expected completion date",
        },
        {
          var_name: "customerName",
          type: "string",
          description: "customer name",
        },
        {
          var_name: "customerAddress",
          type: "string",
          description: "customer address",
        },
        {
          var_name: "customerContact",
          type: "string",
          description: "customer contact",
        },
      ],
    },
  };
  let customerId,
    productDescription,
    productName,
    orderDate,
    completionDate,
    customerAddress,
    customerContact,
    customerName;

  try {
    console.log("before1");
    const response = await axios.request(options);
    console.log(response.data);
    customerId = response.data.results.customerId;
    productName = response.data.results.productName;
    productDescription = response.data.results.productDescription;
    orderDate = response.data.results.orderDate;
    completionDate = response.data.results.completionDate;
    customerAddress = response.data.results.customerAddress;
    customerContact = response.data.results.customerContact;
    customerName = response.data.results.customerName;

    //before all we are checking the date format that are coming correctly and if not provide the errors
    if (response.data.results.orderDate) {
      orderDate = await handleDateInput(
        response.data.results.orderDate,
        req
      );
      if (!orderDate) {
        return "you should write the order date with proper spaces";
      }
    }

    if (response.data.results.completionDate) {
      completionDate = await handleDateInput(
        response.data.results.completionDate,
        req
      );
      if (!completionDate) {
        return "you should write the completion date with proper spaces";
      }
    }
    console.log("logging the final appraisal date", orderDate);
    if (
      !customerId && !customerName ||
      !customerAddress ||
      !customerContact
    ) {
      return "If you are trying to add a new customer then fields like customer name, customer address and customer contact are mandatory!";
    }
    if (customerId) {
      //here we are checking all the customers with the given id and if not present then we tell the user that it doesnt exist so add a new customer
      const foundCustomer = await Customer.findOne({ customerId });
      if (!foundCustomer)
        return "No customer is present with the given customer ID. kindly try again with new customer required details";
      console.log("logging for testing before", orderDate, completionDate, productName, productDescription)
      if (!orderDate || !completionDate || !productName || !productDescription)
        return "Please fill all the details";
      const productId = Math.floor(100000 + Math.random() * 900000);
      const newProduct = new Product({
        productName,
        description: productDescription,
        productId,
        material: "Define In CRM",
        price: 0,
        purity: "Define In CRM",
        weight: 0,
        gemstones: [],
        type: "Define In CRM",
        hallmarkCertified: false,
        sku: "Define In CRM",
        imageURL: "Define In CRM",
        design: "Define In CRM",
        size: "Define In CRM",
        barcode: "Define In CRM",
        initialStock: "Define In CRM",
        currentStock: "Define In CRM",
      });
      await newProduct.save();
      console.log("new product is saved first");
      const newCustomOrder = CustomOrders({
        customerId,
        productId,
        orderDate,
        completionDate,
        productDescription,
        productName,
      });
      await newCustomOrder.save();
      return "the desired custom order has been saved successfully!"
    }


    else if (!customerId) {
      console.log("logging for testing before", orderDate, completionDate, productName, productDescription)

      if (!orderDate || !completionDate || !productName || !productDescription)
        return "Please fill all the datails";
      const customerId = Math.floor(100000 + Math.random() * 900000);

      const newCustomer = new Customer({
        name: customerName,
        address: customerAddress,
        contact: customerContact,
        customerId,
      });
      await newCustomer.save();
      console.log("customer has been saved at first")
      const productId = Math.floor(100000 + Math.random() * 900000);
      const newProduct = new Product({
        productName,
        description: productDescription,
        productId,
        material: "Define In CRM",
        price: 0,
        purity: "Define In CRM",
        weight: 0,
        gemstones: [],
        type: "Define In CRM",
        hallmarkCertified: false,
        sku: "Define In CRM",
        imageURL: "Define In CRM",
        design: "Define In CRM",
        size: "Define In CRM",
        barcode: "Define In CRM",
        initialStock: "Define In CRM",
        currentStock: "Define In CRM",
      });
      await newProduct.save();
      console.log("new product is saved now");
      const newCustomOrder = CustomOrders({
        customerId,
        productId,
        orderDate,
        completionDate,
        productDescription,
        productName,
      });
      await newCustomOrder.save();
      return "the desired custom order has been saved successfully!"
    }
  } catch (error) {
    console.log("error while adding to repair list", error.message);
    return "We cannot proceed with the operation. please try again later!"
  }
};

module.exports = addingCustomOrder;
