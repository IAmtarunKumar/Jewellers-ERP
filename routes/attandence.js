const express = require("express");
const { Employee } = require("../models/employee");
const { addAttendanceTime, getAttendanceForMonth } = require("../utils/markAttendence");
const router = express.Router();

//clock
router.post("/webClock", async (req, res) => {
    const email = req.body.email;
    const phoneNo = req.body.phoneNo;
    const type = req.body.type;
    // const time = new Date();
    let indiaTimeString = new Date().toLocaleString("en-Us", {
        timeZone: "Asia/Kolkata",
    });
    let time = new Date(indiaTimeString);
    const { message, status } = await addAttendanceTime(
        email,
        phoneNo,
        type,
        time
    );
    res.status(status).json({ message: message });
});

router.post("/getAttendenceData", async (req, res) => {
    const year = req.body.year;
    const email = req.body.email;
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const monthNumber = parseInt(req.body.month, 10);
    const month = monthNames[monthNumber - 1];
    console.log(year, month, email);
    const { message, status, data } = await getAttendanceForMonth(
        email,
        month,
        year
    );
    console.log(status, message, data);
    res.status(status).json({ message: message, data: data });
});
router.post("/getClockStatus", async (req, res) => {
    const email = req.body.email;
    const employee = await Employee.findOne({ email });

    console.log("emp" , employee)

    if(employee){

    res.status(200).json({ status: employee.signedIn });
    }else{
        res.status(200).json({ status: null }); 
    }
    ///fsdsfs
});

router.post('/employeeHours', async (req, res) => {
    const { month, year } = req.body;
    const queryYear = Number(year);
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const monthNumber = parseInt(month, 10);
    const queryMonth = monthNames[monthNumber - 1];

    console.log(queryMonth, queryYear);

    try {
        const employees = await Employee.find({});

        const result = [];

        for (let employee of employees) {
            let totalHours = 0;

            const yearlyData = employee.attendance.yearlyData.find(y => y.year === queryYear);
            if (yearlyData) {
                const monthData = yearlyData.months.find(m => m.month === queryMonth);
                if (monthData) {
                    for (const timePair of monthData.time) {
                        if (timePair.signIn && timePair.signOut) {
                            totalHours += (new Date(timePair.signOut) - new Date(timePair.signIn)) / (1000 * 60 * 60);
                        }
                    }
                }
            }

            result.push({
                name: employee.email, // Using email for identification, adjust as needed
                totalHours: totalHours.toFixed(2)
            });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error(error);  // Log the error for debugging purposes
        res.status(500).send(error.message);
    }
});

module.exports = router;