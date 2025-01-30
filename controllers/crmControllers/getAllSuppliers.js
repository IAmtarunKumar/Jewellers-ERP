const Suppliers = require("../../models/supplier");

const getAllSuppliers = async (req, res) => {
  try {
    const supplier = await Suppliers.find({});

    res.status(200).send(supplier);
  } catch (error) {
    console.log("something went wrong", error.message); res.status(500).send(`internal server error - ${error.message}`)
  }
};
module.exports = getAllSuppliers;
