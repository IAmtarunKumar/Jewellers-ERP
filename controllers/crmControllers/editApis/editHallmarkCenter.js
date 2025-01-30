const { HallMarkCenter } = require("../../../models/hallmarkCenter");

const editHallmarkCenter = async (req, res) => {
  console.log("logging what came in body", req.body);
  const {
    centerName,
    contact,
    address,
    email,
    authorizedBy,
    hallmarkCenterId,
  } = req.body;
  try {
    const foundHallmarkCenter = await HallMarkCenter.find({ hallmarkCenterId });
    if (!foundHallmarkCenter)
      return res
        .status(400)
        .send(
          "Hallmark Center with the desired ID is not found! Please get it checked!"
        );
    //for the image- we are saving the image actual name in the database so that we can take it and search for it in the google firebase bucket
    const updatedHallmarkCenter = await HallMarkCenter.findOneAndUpdate(
      { hallmarkCenterId },
      {
        $set: {
          centerName,
          contact,
          address,
          email,
          authorizedBy,
        },
      },
      { new: true }
    );
    console.log("updated HallmarkCenter", updatedHallmarkCenter);

    res.status(200).send("the HallmarkCenter has been updated successfully!");
  } catch (error) {
    console.log("something went wrong", error.message);
    res.status(500).send(`internal server error - ${error.message}`);
  }
};
module.exports = editHallmarkCenter;
