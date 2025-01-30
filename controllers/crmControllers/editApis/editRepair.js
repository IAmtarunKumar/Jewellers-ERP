const { Repair } = require("../../../models/repairs");

const editRepair = async (req, res) => {
    console.log("logging what came in body", req.body);
    const {
        repairCost, expectedReturnDate, repairDate, issueDescription, repairId,
    } = req.body;
    try {
        const foundRepair = await Repair.find({ repairId });
        if (!foundRepair)
            return res
                .status(400)
                .send(
                    "Repair with the desired ID is not found! Please get it checked!"
                );
        //for the image- we are saving the image actual name in the database so that we can take it and search for it in the google firebase bucket
        const updatedRepair = await Repair.findOneAndUpdate(
            { repairId },
            {
                $set: {
                    repairCost, expectedReturnDate, repairDate, issueDescription,
                },
            },
            { new: true }
        );
        console.log("updated Repair", updatedRepair)

        res.status(200).send("the Repair has been updated successfully!");
    } catch (error) {
        console.log("something went wrong", error.message); res.status(500).send(`internal server error - ${error.message}`)
    }
};
module.exports = editRepair;
