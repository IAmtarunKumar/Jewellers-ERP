const axios = require("axios");
const dotenv = require("dotenv");
const twilio = require("twilio");
const { Supplier } = require("../../models/supplier");
const Product = require("../../models/product");

dotenv.config();
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const addingProduct = async (req, res, sessionId, userMessage) => {
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
          var_name: "productName",
          type: "string",
          description: "Product Name",
        },
        {
          var_name: "material",
          type: "string",
          description: "Material",
        },
        {
          var_name: "price",
          type: "string",
          description: "Price",
        },
        {
          var_name: "purity",
          type: "string",
          description: "Purity",
        },
        {
          var_name: "weight",
          type: "string",
          description: "Weight",
        },
        {
          var_name: "gemstones",
          type: "string",
          description: "Gemstones",
        },
        {
          var_name: "sku",
          type: "string",
          description: "SKU",
        },
        {
          var_name: "description",
          type: "string",
          description: "Description",
        },
        {
          var_name: "design",
          type: "string",
          description: "Design",
        },
        {
          var_name: "size",
          type: "string",
          description: "Size",
        },
        {
          var_name: "initialStock",
          type: "string",
          description: "Initial Stock",
        },
      ],
    },
  };
  let productName, material, price, purity, weight, gemstones, type, sku, description, design, size, initialStock;

  try {
    console.log("before1");
    const response = await axios.request(options);
    console.log(response.data);
    productName = response.data.results.productName;
    material = response.data.results.material;
    price = response.data.results.price;
    purity = response.data.results.purity;
    weight = response.data.results.weight;
    gemstones = response.data.results.gemstones;
    type = response.data.results.type;
    sku = response.data.results.sku;
    description = response.data.results.description;
    design = response.data.results.design;
    size = response.data.results.size;
    initialStock = response.data.results.initialStock;

    if (
      !productName || !material || !purity || !price || !weight || !gemstones || !type || !sku || !description || !design || !size || !initialStock
    ) {
      return "please fill all the details correctly";
    }
    const productId = Math.floor(100000 + Math.random() * 900000);
    const newProduct = new Product({ productName, material, price, purity, weight, gemstones, type, sku, description, design, size, initialStock, currentStock: initialStock, productId });
    await newProduct.save();
    return "Product added Successfully"

  } catch (error) {
    console.log("error while adding supplier", error.message);
    return "we cannot add the Product please try again later"
  }
};

module.exports = addingProduct;
