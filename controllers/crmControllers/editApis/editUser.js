const { User } = require("../../../models/user");


const editOneUser = async (req, res) => {
    console.log("logging what came in body", req.body);
    const {
        sessionId, name, email, mobile, designation, admin, profilePic
    } = req.body;
    try {
        const foundEmployee = await User.find({ sessionId });
        if (!foundEmployee)
            return res
                .status(400)
                .send(
                    "Employee with the desired ID is not found! Please get it checked!"
                );
        //for the image- we are saving the image actual name in the database so that we can take it and search for it in the google firebase bucket
        const updatedEmployee = await User.findOneAndUpdate(
            { sessionId },
            {
                $set: {
                    name, email, mobile, designation, admin, profilePic
                },
            },
            { new: true }
        );
        console.log("updated Employee", updatedEmployee)

        res.status(200).send("the Employee has been updated successfully!");
    } catch (error) {
        console.log("something went wrong", error.message); res.status(500).send(`internal server error - ${error.message}`)
    }
};
module.exports = editOneUser;
