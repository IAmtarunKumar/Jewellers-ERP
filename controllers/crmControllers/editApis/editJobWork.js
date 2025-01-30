const { JobWork } = require("../../../models/jobWork");

const editjobWork = async (req, res) => {
    console.log("logging what came in body", req.body);
    const {
        rawMaterialName, rawMaterialType, vendorName, givenDate, givenPurity, givenWeight, returnDate, returnPurity, returnWeight, priceDecided, description, pictureName1, pictureName2 } = req.body;
    // try {
    //     const foundJobWork = await JobWork.find({ rawMaterialName });
    //     if (!foundJobWork)
    //         return res
    //             .status(400)
    //             .send(
    //                 "JobWork with the raw material is not found! Please get it checked!"
    //             );
    //     //for the image- we are saving the image actual name in the database so that we can take it and search for it in the google firebase bucket
    //     const updatedJobWork = await JobWork.findOneAndUpdate(
    //         { rawMaterialName },
    //         {
    //             $set: {
    //                 rawMaterialType, vendorName, givenDate, givenPurity, givenWeight, returnDate, returnPurity, returnWeight, priceDecided, description
    //             },
    //         },
    //         { new: true }
    //     );
    //     console.log("updated JobWork", updatedJobWork)

    //     res.status(200).send("the JobWork has been updated successfully!");
    // } catch (error) {
    //     console.log("something went wrong", error.message); res.status(500).send(`internal server error - ${error.message}`)
    // }
};
module.exports = editjobWork;
