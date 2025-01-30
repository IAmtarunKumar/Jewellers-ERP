const { RawMaterial } = require("../../../models/rawMaterial");

const editRawMaterial = async (req, res) => {
    console.log("logging what came in body", req.body);
    const {
        name,
        type, currentWeight, price, description, lastStockDate
    } = req.body;
    try {
        const foundRawMaterial = await RawMaterial.find({ name });
        if (!foundRawMaterial)
            return res
                .status(400)
                .send(
                    "Raw Material with the desired Name is not found! Please get it checked!"
                );
        //for the image- we are saving the image actual name in the database so that we can take it and search for it in the google firebase bucket
        const updatedRawMaterial = await RawMaterial.findOneAndUpdate(
            { name },
            {
                $set: {
                    type, currentWeight, price, description, lastStockDate
                },
            },
            { new: true }
        );
        console.log("updated RawMaterial", updatedRawMaterial)

        res.status(200).send("the raw material has been updated successfully!");
    } catch (error) {
        console.log("something went wrong", error.message); res.status(500).send(`internal server error - ${error.message}`)
    }
};
module.exports = editRawMaterial;
