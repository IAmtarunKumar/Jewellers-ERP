const { Vendor } = require("../../models/vendor");


const getAllVendors = async (req, res) => {
  try {
    const vendor = await Vendor.find({});

    res.status(200).send(vendor);
  } catch (error) {
    console.log("something went wrong", error.message); res.status(500).send(`internal server error - ${error.message}`)
  }
};
module.exports = getAllVendors;
