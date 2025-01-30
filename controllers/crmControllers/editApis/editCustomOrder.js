const { CustomOrders } = require("../../../models/customOrder");

const editCustomOrder = async (req, res) => {
    console.log("logging what came in body", req.body);
    const {
        productId, orderDate, completionDate
    } = req.body;
    try {
        const foundCustomOrder = await CustomOrders.find({ productId });
        if (!foundCustomOrder)
            return res
                .status(400)
                .send(
                    "Custom Order with the Product ID is not found! Please get it checked!"
                );
        //for the image- we are saving the image actual name in the database so that we can take it and search for it in the google firebase bucket
        const updatedCustomOrder = await CustomOrders.findOneAndUpdate(
            { productId },
            {
                $set: {
                    orderDate, completionDate
                },
            },
            { new: true }
        );
        console.log("updated CustomOrder", updatedCustomOrder)

        res.status(200).send("the CustomOrder has been updated successfully!");
    } catch (error) {
        console.log("something went wrong", error.message); res.status(500).send(`internal server error - ${error.message}`)
    }
};
module.exports = editCustomOrder;
