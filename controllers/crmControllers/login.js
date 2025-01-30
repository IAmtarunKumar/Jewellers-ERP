// const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../../models/user");
async function Login(req, res) {
    const { email, password } = req.body;
    //   const secret = crypto.randomBytes(64).toString("hex");
    //   console.log(secret);

    const allUser = await User.find() 
    console.log("all user" , allUser)


    const foundUser = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!foundUser) {
        // no user with the given email was found
        return res.status(400).json({ error: "Invalid login username" });
    }
    // compare the given password with the hash stored in the database
    const isPasswordMatch = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordMatch) {
        // the given password is incorrect
        return res.status(400).json({ error: "Invalid login password" });
    }

    let overdueTasks = [];

    if (
        foundUser.ability === "CEO_ABILITY" ||
        foundUser.ability === "TL_ABILITY"
    ) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);


        const allUsers = await User.find({});

        allUsers.forEach((employee) => {
            const employeeOverdueTasks = employee.assignedToYou.filter((task) => {
                const taskDate = new Date(task.deadline);
                return (
                    taskDate < today &&
                    task.status !== "Completed" &&
                    task.status !== "completed"
                );
            });

            if (employeeOverdueTasks.length) {
                overdueTasks.push({
                    employeeName: employee.name,
                    tasks: employeeOverdueTasks,
                });
            }
        });
    }

    // create and sign a new token
    const token = jwt.sign(
        { foundUser }, // the payload, usually including the user's ID
        `${process.env.JWTPRIVATEKEY}`, // the secret used to sign the token
        { expiresIn: "3600000" } // token expiration time
    );

    // send the token back to the client
    //res.status(200).send(token);
    res.status(200).json({ token: token, overdueTasks: overdueTasks });
    //   res.json({ token });
}
module.exports = Login;
