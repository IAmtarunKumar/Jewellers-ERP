const { Vendor } = require("../../../models/vendor");

const editVendor = async (req, res) => {
    console.log("logging what came in body", req.body);
    const {
        contact, address, vendorId, pincode
    } = req.body;
    try {
        const foundVendor = await Vendor.find({ vendorId });
        if (!foundVendor)
            return res
                .status(400)
                .send(
                    "Vendor with the desired ID is not found! Please get it checked!"
                );
        //for the image- we are saving the image actual name in the database so that we can take it and search for it in the google firebase bucket
        const updatedVendor = await Vendor.findOneAndUpdate(
            { vendorId },
            {
                $set: {
                    contact, address, pincode
                },
            },
            { new: true }
        );
        console.log("updated Vendor", updatedVendor)

        res.status(200).send("the Vendor has been updated successfully!");
    } catch (error) {
        console.log("something went wrong", error.message); res.status(500).send(`internal server error - ${error.message}`)
    }
};
module.exports = editVendor;
