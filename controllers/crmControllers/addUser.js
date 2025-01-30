const { User } = require("../../models/user");
const bcrypt = require("bcryptjs");

const addOneUser = async (req, res) => {
    console.log("checking whatscoming in body", req.body);
    const { name, email, mobile, designation, admin, password, privileges } =
        req.body;
    let pincode
    //currently we are doing that we are checking for the pincode in mongodb in other users if we found that then we are gonna copy that pincode value and assign the new user to it!because it will help in current user to also possess pincode. then we are saving it in new user. 
    //currently we are using above logic but when multitenancy will occur then we will search for current organisation ceo then we will find pincode in that and assign that pincode to the same user
    const users = await User.find({})
    console.log("allusers", users)

    if (!users || users.length === 0) return res.status(400).send("You cannot create an employee!") //less likely to happen but still we handled it!

    for (const user of users) {
        if (user.pincode) {
            pincode = user.pincode
        }
    }
    console.log("pincode before creating a new user", pincode)
    let readFlag, editFlag, createFlag, deleteFlag, printFlag, adminFlag;
    // now we check if admin flag is true then make every other flag true otherwise false
    if (admin === "yes") {
        adminFlag = true;
        readFlag = true;
        editFlag = true;
        createFlag = true;
        deleteFlag = true;
        printFlag = true;
    } else if (admin === "no") {
        adminFlag = false;
        if (privileges.read === true) {
            readFlag = true;
        } else {
            readFlag = false;
        }
        if (privileges.edit === true) {
            editFlag = true;
        } else {
            editFlag = false;
        }
        if (privileges.create === true) {
            createFlag = true;
        } else {
            createFlag = false;
        }
        if (privileges.delete === true) {
            deleteFlag = true;
        } else {
            deleteFlag = false;
        }
        if (privileges.print === true) {
            printFlag = true;
        } else {
            printFlag = false;
        }
    }

    const sessionId = `whatsapp:+91${mobile}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const sameMobileUser = await User.findOne({ mobile }).exec();
        const sameEmailUser = await User.findOne({ email }).exec();
        // console.log(usr,"new User");
        if (sameMobileUser)
            return res
                .status(400)
                .send("Employee with same mobile number already exists");

        if (sameEmailUser)
            return res.status(400).send("Employee email id already exists");

        const users = await User.find({});
        // console.log("usershere", users)
        const organisationName = users[0].organisationName;
        // console.log("organisationName", organisationName)
        //now we are adding a new array for the user
        const privileges = [adminFlag, readFlag, editFlag, createFlag, deleteFlag, printFlag];
        console.log("privileges before pushing in the new user", privileges)
        const newUser = new User({
            sessionId,
            name,
            email,
            mobile,
            designation,
            organisationName,
            // calendarId,
            // gituserName,
            password: hashedPassword,
            admin,
            profilePic: "",
            // ability,
            privileges, pincode
        });
        const success = await newUser.save();

        return res.status(200).send("new Employee has been created!");
    } catch (error) {
        console.log("something went wrong", error.message);
        return res.status(500).send(`internal server error - ${error.message}`);
    }
};
module.exports = addOneUser;
