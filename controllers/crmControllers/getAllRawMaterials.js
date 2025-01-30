const RawMaterials = require("../../models/rawMaterial");

const getAllRawMaterials = async (req, res) => {
  try {
    const rawMaterials = await RawMaterials.find({});

    res.status(200).send(rawMaterials);
  } catch (error) {
    console.log("something went wrong", error.message); res.status(500).send(`internal server error - ${error.message}`)
  }
};
module.exports = getAllRawMaterials;
