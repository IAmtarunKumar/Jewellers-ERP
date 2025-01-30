const Products = require("../../models/product");

const getAllProducts = async (req, res) => {
  try {
    const products = await Products.find({});

    res.status(200).send(products);
  } catch (error) {
    console.log("something went wrong", error.message); res.status(500).send(`internal server error - ${error.message}`)
  }
};

module.exports = getAllProducts;
