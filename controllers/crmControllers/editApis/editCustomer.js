const { Customer } = require("../../../models/customer");

const editCustomer = async (req, res) => {
    console.log("logging what came in body", req.body);
    const {
        name, contact, address, customerId, pincode
    } = req.body;
    try {
        const foundCustomer = await Customer.find({ customerId });
        if (!foundCustomer)
            return res
                .status(400)
                .send(
                    "Customer with the desired ID is not found! Please get it checked!"
                );
        //for the image- we are saving the image actual name in the database so that we can take it and search for it in the google firebase bucket
        const updatedCustomer = await Customer.findOneAndUpdate(
            { customerId },
            {
                $set: {
                    name, contact, address, pincode
                },
            },
            { new: true }
        );
        console.log("updated Customer", updatedCustomer)

        res.status(200).send("the Customer has been updated successfully!");
    } catch (error) {
        console.log("something went wrong", error.message); res.status(500).send(`internal server error - ${error.message}`)
    }
};
module.exports = editCustomer;
