const { User } = require("../../models/user");


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200).send(users);
  } catch (error) {
    console.log("something went wrong", error.message);
    res.status(500).send(`internal server error - ${error.message}`);
  }
};
module.exports = getAllUsers;
