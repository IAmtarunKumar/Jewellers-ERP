const { BusinessHolder } = require("../../../models/businessHolder");
const editBusinessHolder = async (req, res) => {
    console.log("logging what came in body", req.body);
    const {
        name, contact, address, businessHolderId
    } = req.body;
    try {
        const foundBusinessHolder = await BusinessHolder.find({ businessHolderId });
        if (!foundBusinessHolder)
            return res
                .status(400)
                .send(
                    "Business Holder with the desired ID is not found! Please get it checked!"
                );
        //for the image- we are saving the image actual name in the database so that we can take it and search for it in the google firebase bucket
        const updatedBusinessHolder = await BusinessHolder.findOneAndUpdate(
            { businessHolderId },
            {
                $set: {
                    name: name.toLowerCase(), contact, address
                },
            },
            { new: true }
        );
        console.log("updated BusinessHolder", updatedBusinessHolder)

        res.status(200).send("the BusinessHolder has been updated successfully!");
    } catch (error) {
        console.log("something went wrong", error.message); res.status(500).send(`internal server error - ${error.message}`)
    }
};
module.exports = editBusinessHolder;
