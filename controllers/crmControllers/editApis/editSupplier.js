const { Supplier } = require("../../../models/supplier");

const editSupplier = async (req, res) => {
    console.log("logging what came in body", req.body);
    const {
        name, contact, address, supplierId, pincode
    } = req.body;
    try {
        const foundSupplier = await Supplier.find({ supplierId });
        if (!foundSupplier)
            return res
                .status(400)
                .send(
                    "Supplier with the desired ID is not found! Please get it checked!"
                );
        //for the image- we are saving the image actual name in the database so that we can take it and search for it in the google firebase bucket
        const updatedSupplier = await Supplier.findOneAndUpdate(
            { supplierId },
            {
                $set: {
                    name, contact, address, pincode
                },
            },
            { new: true }
        );
        console.log("updated Supplier", updatedSupplier)

        res.status(200).send("the Supplier has been updated successfully!");
    } catch (error) {
        console.log("something went wrong", error.message); res.status(500).send(`internal server error - ${error.message}`)
    }
};
module.exports = editSupplier;
