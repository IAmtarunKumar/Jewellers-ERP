const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const { parse, format } = require("date-fns");
const { utcToZonedTime } = require("date-fns-tz");
const twilio = require("twilio");

const Product = require("../../models/product");
const { HallMark } = require("../../models/hallmark");
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
const addingHallmark = async (req, res, sessionId, userMessage) => {
  console.log("we are in addinghallmark inner function");
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
          var_name: "hallmarkId",
          type: "string",
          description: "Hallmark ID",
        },
        {
          var_name: "productId",
          type: "string",
          description: "product id",
        },
        {
          var_name: "hallmarkCenterId",
          type: "string",
          description: "hallmark center id",
        },
        {
          var_name: "hallmarkDate",
          type: "string",
          description: "hallmark date",
        },
        {
          var_name: "purity",
          type: "string",
          description: "purity",
        },
        {
          var_name: "weight",
          type: "string",
          description: "weight",
        },
        {
          var_name: "hallmarkLogo",
          type: "string",
          description: "hallmark logo",
        },
      ],
    },
  };
  let productId,
    hallmarkId,
    hallmarkCenterId,
    hallmarkDate,
    purity,
    weight,
    hallmarkLogo;
  try {
    console.log("before1");
    const response = await axios.request(options);
    console.log(response.data);
    productId = response.data.results.productId;
    hallmarkId = response.data.results.hallmarkId;
    hallmarkCenterId = response.data.results.hallmarkCenterId;
    hallmarkDate = response.data.results.hallmarkDate;
    purity = response.data.results.purity;
    weight = response.data.results.weight;
    hallmarkLogo = response.data.results.hallmarkLogo;

    //before all we are checking the date format that are coming correctly and if not provide the errors
    if (response.data.results.hallmarkDate) {
      //the code which is handling input in any format
      // Input date in words
      const dateInWords = response.data.results.hallmarkDate; // or '31 May'
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
        return `Please re-write the statement with correct repair date format - "31 sep", "sep 08", "2023-09-08" `;
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
        hallmarkDate = formattedDate;
      } else {
        return "you should write the repair date with proper spaces";
      }
    }
    console.log("logging the final appraisal date", hallmarkDate);
    if (
      !productId ||
      !hallmarkId ||
      !hallmarkCenterId ||
      !purity ||
      !weight ||
      !hallmarkDate
    ) {
      return "Please fill all the details";
    }
    if (productId) {
      //here we are checking all the products with the given id and if not present then we tell the user that it doesnt exist so add a new product
      const foundProduct = await Product.findOne({ productId });
      if (!foundProduct)
        return "No product is present with the given product ID. kindly try again with correct product id";
    }
    if (hallmarkId) {
      //here we are checking all the customers with the given id and if not present then we tell the user that it doesnt exist so add a new customer
      const foundHallmark = await HallMark.findOne({ hallmarkId });
      if (foundHallmark) return "A hallmark is already present!";

      if (!foundHallmark) {
        const newHallmark = new HallMark({
          hallmarkDate,
          hallmarkCenterId,
          hallmarkId,
          purity,
          weight,
          hallmarkLogo,
        });
        await newHallmark.save();
        console.log("new hallmark is saved");
        return "the desired new hallmark is saved successfully!"
      }
    }
  } catch (error) {
    console.log("error while adding to repair list", error.message);
    return "We cannot proceed with the operation. please try again later!";

  }
};

module.exports = addingHallmark;
