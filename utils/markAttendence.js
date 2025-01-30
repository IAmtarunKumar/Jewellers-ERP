const { Employee } = require("../models/employee");

const addAttendanceTime = async (email, phoneNo, type, time) => {
    if (!['signIn', 'signOut'].includes(type)) {
        //throw new Error("Invalid type. Only 'signIn' or 'signOut' allowed.");
        return { status: 404, message: "server error" }
    }
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = monthNames[time.getMonth()];
    const year = time.getFullYear();

    let employee = await Employee.findOne({ email, phoneNo });
    if (!employee) {
        employee = new Employee({
            email,
            phoneNo,
            signedIn: false,
            attendance: { yearlyData: [] }
        });
    }

    if (employee.signedIn == true && type == 'signIn') {
        console.log("you are already signed In please sign Out first to again sign In");
        return { status: 404, message: "you are already SignedIn" };
    }
    if (employee.signedIn == false && type == 'signOut') {
        console.log("you are already signed Out please sign In first to again sign Out");
        return { status: 404, message: "you are already SignedOut" };
    }
    let yearlyIndex = employee.attendance.yearlyData.findIndex(y => y.year === year);
    if (yearlyIndex === -1) {
        yearlyIndex = employee.attendance.yearlyData.push({
            year,
            months: []
        }) - 1; // push returns the new length of the array, subtracting 1 gives the index of the added element
    }

    let monthIndex = employee.attendance.yearlyData[yearlyIndex].months.findIndex(m => m.month === month);
    if (monthIndex === -1) {
        monthIndex = employee.attendance.yearlyData[yearlyIndex].months.push({
            month,
            time: []
        }) - 1;
    }

    if (type === 'signIn') {
        console.log('month data before update is', employee.attendance.yearlyData[yearlyIndex].months[monthIndex]);
        employee.attendance.yearlyData[yearlyIndex].months[monthIndex].time.push({ signIn: time, signOut: null });
        employee.signedIn = true;
        console.log('month data after update is', employee.attendance.yearlyData[yearlyIndex].months[monthIndex]);
    } else {
        const lastPair = employee.attendance.yearlyData[yearlyIndex].months[monthIndex].time.slice(-1)[0];
        if (lastPair && !lastPair.signOut) {
            lastPair.signOut = time;
        } else {
            employee.attendance.yearlyData[yearlyIndex].months[monthIndex].time.push({ signIn: null, signOut: time });
        }
        employee.signedIn = false;
    }
    const savedEmployee = await employee.save();
    console.log('Saved Employee Data:', savedEmployee);
    return {
        status: 200,
        message: type === "signIn"
            ? "I have marked your clock-in time. Let's make today a productive one. To check monthly-logs please login to your dashboard."
            : "Sure! I have marked your clock-out time. I hope you had a productive day. To check monthly-logs please login to your dashboard."
    };
    //    return {status: 200, message:{`${type ==== "signIn" ? "I have marked your clock-in time. Let's make today to Productive One" : "Sure! I have marked your clock-out time. I hope you had a productive day."} To check logs please login to your dashboard.`}};
};


const convertDateToFormat = (dateString) => {
    const date = new Date(dateString);

    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        time: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
    };
};

const getAttendanceForMonth = async (email, month, year) => {
    const employee = await Employee.findOne({ email });
    if (!employee) {
        return { status: 404, message: "Employee not found.", data: {} };
    }

    const yearlyData = employee.attendance.yearlyData.find(y => y.year == year);
    if (!yearlyData) {
        return { status: 404, message: `No data found for year ${year}.`, data: {} };
    }

    const monthData = yearlyData.months.find(m => m.month == month);
    if (!monthData) {
        return { status: 404, message: `No data found for month ${month}.`, data: {} };
    }

    let totalHours = 0;
    const formattedTimePairs = monthData.time.map(pair => {
        let intervalHours = 0; // Default value for intervalHours
        if (pair.signIn && pair.signOut) {
            intervalHours = (new Date(pair.signOut) - new Date(pair.signIn)) / (1000 * 60 * 60); // Calculate hours for the interval
            totalHours += intervalHours;
        }

        return {
            signIn: pair.signIn ? convertDateToFormat(pair.signIn) : null,
            signOut: pair.signOut ? convertDateToFormat(pair.signOut) : null,
            hours: intervalHours.toFixed(2) // Rounding to 2 decimal places
        };
    });

    const data = {
        signInOutTimes: formattedTimePairs,
        totalHours: totalHours.toFixed(2)
    };
    return {
        status: 200,
        message: "Fetching data successfully",
        data: data
    };
};


module.exports = { addAttendanceTime, getAttendanceForMonth };