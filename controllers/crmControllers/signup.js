const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendMessageToUser = require("../../utils/sendMessageTwilio.js");
const { User } = require("../../models/user.js");
const { Utility } = require("../../models/utilityCollection.js");

const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
        user: "verify@sarvvid-ai.com",
        pass: "OcplSarvvid555@",
    },
});
async function Signup(req, res) {
    const { MongoClient } = require("mongodb");
    const bcrypt = require("bcryptjs");
    const secret = crypto.randomBytes(64).toString("hex");

    // console.log("Request body: ", req.body);
    const email = req.body.email.toLowerCase();
    const name = req.body.name;
    const mobile = req.body.mobile;
    const organisationName = req.body.organisationName
    const gstNumber = req.body.gstNumber //ask gstNumber as blank string if user doesnt enters
    const designation = req.body.designation;
    const pincode = req.body.pincode;
    // const calendarId = req.body.calendarId;
    // const gituserName = req.body.githubUsername;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // const ability = req.body.ability;

    const sessionId = `whatsapp:+91${req.body.mobile}`;
    //
    //
    const randomString128 = [...Array(128)].map(() => (~~(Math.random() * 36)).toString(36)).join('');
    console.log("randomString", randomString128);
    //
    try {
        const usr = await User.findOne({ mobile: mobile }).exec();
        const usr1 = await User.findOne({ email: email }).exec();
        // console.log(usr,"new User");
        if (usr) {
            return res.status(400).json({ error: "Mobile Number Already Exists" });
        }
        if (usr1) {
            return res.status(400).json({ error: "Email Id Already Exists" });
        }

        const newUser = new User({
            sessionId,
            name,
            email,
            mobile,
            designation,
            gstNumber, organisationName,
            // calendarId,
            // gituserName,
            password: hashedPassword,
            // admin: true,
            privileges: [true, true, true, true, true, true, true],
            profilePic: "",
            securityString: randomString128,
            // ability,
            pincode
        });

        // res.status(200).json(newUser);
        try {
            const success = await newUser.save();
            // await sendMessageToUser("Welcome to Aestra", mobile);
            await sendMessageToUser(
                "Thank you for registering! By registering with AESTRA, you'll get personalized assistance, faster response times, and access to exclusive features and you have agreed to our terms and conditions for Fair Use of this Product/Service. Please Wait for sometime we are setting up your personal AI.",
                mobile
            );
            await sendMessageToUser(
                "🚧 AESTRA is currently in testing phase. If you encounter any errors, please send a screenshot to AESTRA and name it as 'error-(featurename)'. Thank you! 🙏",
                mobile
            );
            ////////////////////////
            //string send in mail
            const mailOptions = {
                from: "verify@sarvvid-ai.com",
                to: email,
                subject: "Security String Notification",
                text: `Hello ${name},\n\n
                    String : ${randomString128} \n
                    This message contains your security string.  Please keep it safe for future authentication purposes.
                    
                    Best regards,
                    OCPL Tech Support Team`,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Error sending email:", error.message);
                    return res.status(500).send(`Internal Server Error. Please try again later.: ${error}`);
                } else {
                    console.log("Email sent:", info.response);
                }
            });
            const foundUtil = await Utility.findOne({ type: "securityString" })
            if (foundUtil) {
                const updateUtil = await Utility.findOneAndUpdate({ type: "securityString" }, {
                    $set: {
                        number: randomString128,
                    },
                },
                    { new: true })
                console.log("updatedutil", updateUtil)
            } else {
                const util = new Utility({
                    type: "securityString",
                    number: randomString128
                })
                await util.save()
            }
            //////////////////////
            return res.status(200).json(User);
            // return res.json({message:"sign up successful"});
        } catch (err) {
            console.log(err);
            return res.status(400).json({ error: err });
        }
    } catch (err) {
        console.error(err);
    }
}

module.exports = Signup;
