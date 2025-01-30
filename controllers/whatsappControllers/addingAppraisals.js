const axios = require("axios");
const dotenv = require("dotenv");
const { parse, format } = require("date-fns");
const { utcToZonedTime } = require("date-fns-tz");
const twilio = require("twilio");


const Product = require("../../models/product");
const { Customer } = require("../../models/customer");
const { Repair } = require("../../models/repairs");
const { Appraisal } = require("../../models/appraisals");
const { User } = require("../../models/user");
dotenv.config();
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const sendMessage = async (body, from, to) => {
  try {
    await client.messages.create({ body, from, to });
  } catch (error) {
    console.error("Error sending message via Twilio:", error);
    throw new Error("Failed to send message.");
  }
};
const addingAppraisals = async (req, res, sessionId, userMessage) => {
  console.log("we are in addingappraisals inner function");
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
          var_name: "customer_id",
          type: "string",
          description: "customer ID",
        },
        {
          var_name: "appraised_value",
          type: "string",
          description: "appraised value",
        },
        {
          var_name: "appraisal_date",
          type: "string",
          description: "appraisal date",
        },
        {
          var_name: "product_id",
          type: "string",
          description: "product ID",
        },
        {
          var_name: "product_name",
          type: "string",
          description: "product name",
        },
        {
          var_name: "product_desc",
          type: "string",
          description: "product description",
        },
        {
          var_name: "customer_name",
          type: "string",
          description: "customer name",
        },
        {
          var_name: "customer_address",
          type: "string",
          description: "customer address",
        },
        {
          var_name: "customer_contact",
          type: "string",
          description: "customer contact",
        },
      ],
    },
  };
  let productId,
    customerId,
    appraisedValue,
    appraisalDate,
    productName,
    productDesc,
    customerName,
    customerAddress,
    customerContact;
  try {
    console.log("before1");
    const response = await axios.request(options);
    console.log(response.data);
    productId = response.data.results.product_id;
    customerId = response.data.results.customer_id;
    appraisedValue = response.data.results.appraised_value;
    appraisalDate = response.data.results.appraisal_date;
    productName = response.data.results.product_name;
    productDesc = response.data.results.product_desc;
    customerName = response.data.results.customer_name;
    customerAddress = response.data.results.customer_address;
    customerContact = response.data.results.customer_contact;

    //before all we are checking the date format that are coming correctly and if not provide the errors
    if (response.data.results.appraisal_date) {
      //the code which is handling input in any format
      // Input date in words
      const dateInWords = response.data.results.appraisal_date; // or '31 May'
      // Parse the input date
      let parsedDate = parse(dateInWords, "MMMM do", new Date());
      // console.log("parsed date first time", parsedDate);
      if (isNaN(parsedDate.getTime())) {
        parsedDate = parse(dateInWords, "do MMMM", new Date());
      }
      if (isNaN(parsedDate.getTime())) {
        parsedDate = parse(dateInWords, "yyyy-MM-dd", new Date());
      }
      if (isNaN(parsedDate.getTime())) {
        const userMessageOnError = `Please re-write the statement with correct repair date format - "31 sep", "sep 08", "2023-09-08" `;
        const response1 = await sendMessage(
          userMessageOnError,
          req.body.To,
          req.body.From
        );

        console.log(
          "response from twilio on incorrect date format enter",
          response1
        );
        return;
      }
      console.log("parsed date final", parsedDate);

      // Adjust the parsed date by adding one day
      //parsedDate.setDate(parsedDate.getDate() + 1);

      // Convert to UTC time zone
      const utcDate = utcToZonedTime(parsedDate, "UTC");

      // Format the date to 'yyyy-mm-dd'
      const formattedDate = format(utcDate, "yyyy-MM-dd");

      console.log(formattedDate); // Output: '2023-08-31'
      if (formattedDate) {
        appraisalDate = formattedDate;
      } else {
        return "you should write the repair date with proper spaces";
      }
    }
    console.log("logging the final appraisal date", appraisalDate);
    if ((!productId && !productName) || !productDesc) {
      return "If you are trying to add a new product, then Product name and Product description are mandatory!";
    }
    if (
      (!customerId && !customerName) ||
      !customerAddress ||
      !customerContact
    ) {
      return "If you are trying to add a new customer then fields like customer name, customer address and customer contact are mandatory!";
    }
    if (productId) {
      //here we are checking all the products with the given id and if not present then we tell the user that it doesnt exist so add a new product
      const foundProduct = await Product.findOne({ productId });
      if (!foundProduct)
        return "No product is present with the given product ID. kindly try again with new product name and product description";
    }
    if (customerId) {
      //here we are checking all the customers with the given id and if not present then we tell the user that it doesnt exist so add a new customer
      const foundCustomer = await Customer.findOne({ customerId });
      if (!foundCustomer)
        return "No customer is present with the given customer ID. kindly try again with new customer required details";
    }
    if (customerId && productId) {
      //very common case
      if (!appraisedValue || !appraisalDate)
        return "please fill all the neccessary details as mentioned above to save the appraisal.";

      const appraisalEmployee = await User.findOne({ sessionId });
      if (!appraisalEmployee)
        return "Please Register as an Employee before saving an appraisal";
      const employeeEmail = appraisalEmployee.email;
      const newAppraisal = new Appraisal({
        appraisedValue,
        appraiserEmailId: employeeEmail,
        appraisalDate,
        productId,
        customerId,
      });
      await newAppraisal.save();
      console.log("new appraisal list saved");
      return "desired appraisal has been saved successfully!";
    } //after that two cases are also left and please let it be done
    else if (customerId && !productId) {
      if (!productName || !productDesc || !appraisedValue || !appraisalDate)
        return "please fill all the neccessary details as mentioned above to save the appraisal.";
      const productId = Math.floor(100000 + Math.random() * 900000);
      const newProduct = new Product({
        productName,
        description: productDesc,
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
      }); //change this
      await newProduct.save();
      console.log("new product is saved first");

      const appraisalEmployee = await User.findOne({ sessionId });
      if (!appraisalEmployee)
        return "Please Register as an Employee before saving an appraisal";
      const employeeEmail = appraisalEmployee.email;
      const newAppraisal = new Appraisal({
        appraisedValue,
        appraiserEmailId: employeeEmail,
        appraisalDate,
        productId,
        customerId,
      });
      await newAppraisal.save();
      console.log("new appraisal list saved");
      return "desired appraisal has been saved successfully!";
    } else if (!customerId && productId) {
      if (
        !customerName ||
        !customerAddress ||
        !customerContact ||
        !appraisedValue ||
        !appraisalDate
      )
        return "please fill all the neccessary details as mentioned above to save the appraisal.";
      //first we will make a new customer as per the details
      const customerId = Math.floor(100000 + Math.random() * 900000);
      const newCustomer = new Customer({
        name: customerName,
        address: customerAddress,
        contact: customerContact,
        customerId,
      });
      await newCustomer.save();
      console.log("new customer is saved first");
      const appraisalEmployee = await User.findOne({ sessionId });
      if (!appraisalEmployee)
        return "Please Register as an Employee before saving an appraisal";
      const employeeEmail = appraisalEmployee.email;
      const newAppraisal = new Appraisal({
        appraisedValue,
        appraiserEmailId: employeeEmail,
        appraisalDate,
        productId,
        customerId,
      });
      await newAppraisal.save();
      console.log("new appraisal list saved");
      return "desired appraisal has been saved successfully!";
    } else if (!customerId && !productId) {
      if (
        !customerName ||
        !customerAddress ||
        !customerContact ||
        !appraisedValue ||
        !appraisalDate || !productName || !productDesc
      )
        return "please fill all the neccessary details as mentioned above to save the appraisal.";
      const customerId = Math.floor(100000 + Math.random() * 900000);
      const newCustomer = new Customer({
        name: customerName,
        address: customerAddress,
        contact: customerContact,
        customerId,
      });
      await newCustomer.save();
      console.log("new customer is saved first");
      const productId = Math.floor(100000 + Math.random() * 900000);
      const newProduct = new Product({
        productName,
        description: productDesc,
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
      }); //change this
      await newProduct.save();
      console.log("new product is saved");
      const appraisalEmployee = await User.findOne({ sessionId });
      if (!appraisalEmployee)
        return "Please Register as an Employee before saving an appraisal";
      const employeeEmail = appraisalEmployee.email;
      const newAppraisal = new Appraisal({
        appraisedValue,
        appraiserEmailId: employeeEmail,
        appraisalDate,
        productId,
        customerId,
      });
      await newAppraisal.save();
      console.log("new appraisal list saved");
      return "desired appraisal has been saved successfully!";
    }

  } catch (error) {
    console.log("error while adding to repair list", error.message);
    return "We cannot proceed with the operation. please try again later!";

  }
};

module.exports = addingAppraisals;
