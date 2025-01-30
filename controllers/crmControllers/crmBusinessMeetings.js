const axios = require("axios");
// const twilio = require("twilio");
const stringSimilarity = require("string-similarity");
const { parse, format } = require("date-fns");
const { utcToZonedTime } = require("date-fns-tz");
const moment = require("moment");
const { BusinessHolder } = require("../../models/businessHolder");
const twilioClient = require('../../utils/twilio');
const dotenv = require("dotenv");
const { User } = require("../../models/user");
dotenv.config();
// const client = new twilio(
//     process.env.TWILIO_ACCOUNT_SID,
//     process.env.TWILIO_AUTH_TOKEN
// );


const crmBusinessMeetings = async (req, res) => {
    console.log("logging the key", process.env.RAPIDAPI_KEY_1)
    console.log("we are in crm business meetings and lets see whats comingin body", req.body);
    const { name, time, meetingTopic, date, user } = req.body
    if (!name || !time || !meetingTopic || !date || !user) return res.status(400).send("Send all the require details!")
    const foundUser = await User.findOne({ name: user })
    // console.log("founduser111", foundUser)
    const TIMEOFFSET = "+05:30";
    function convertTo24HourFormat(timeString) {
        // Use moment to parse the time string
        let time = moment(timeString, ["h:mm A", "ha"]);
        console.log("we are in the convert24hour format");
        // Return the time in 24-hour format
        return time.format("HH:mm");
    }
    let date1 = new Date();

    let year = date1.getFullYear();
    let month = date1.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    let day = date1.getDate();
    if (day < 10) {
        day = `0${day}`;
    }
    let hour = date1.getHours();
    if (hour < 10) {
        hour = `0${hour}`;
    }
    let minute = date1.getMinutes();
    if (minute < 10) {
        minute = `0${minute}`;
    }
    // let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000+05:30`;
    let newDateTime = `${year}-${month}-${day}T${hour}:${minute}`;
    console.log("new date time in the starting of the block", newDateTime);
    // const options = {
    //     method: "POST",
    //     url: "https://ai-textraction.p.rapidapi.com/textraction",
    //     headers: {
    //         "content-type": "application/json",
    //         "X-RapidAPI-Key": process.env.RAPIDAPI_KEY_1,
    //         "X-RapidAPI-Host": "ai-textraction.p.rapidapi.com",
    //     },
    //     data: {
    //         text: userMessage,
    //         entities: [
    //             {
    //                 var_name: "names",
    //                 type: "string",
    //                 description: "list of names or particular name provided by the user.",
    //             },
    //             {
    //                 var_name: "date",
    //                 type: "string",
    //                 description: "date of the given event or task.",
    //             },
    //             {
    //                 var_name: "time",
    //                 type: "string",
    //                 description: "time of the event or task for example-10:10",
    //             },
    //             {
    //                 var_name: "topic",
    //                 type: "string",
    //                 description: "topic of the event or task.",
    //             },
    //         ],
    //     },
    // };
    let namesArray;
    try {
        // console.log("before1");
        // const response = await axios.request(options);
        // console.log("response from rapidapi", response.data);
        // if (response.data.results.topic) {
        //     meetingTopic = response.data.results.topic;
        // } else {
        //     return "You should mention meeting topic properly.";
        // }

        console.log("we are in the names designation blocks");

        let namesString = name;
        // namesString = namesString.replace(" and ", ",");
        // const cleanedString = namesString.replace(/\s/g, ""); // Remove all spaces
        // namesArray = cleanedString.split(",");
        console.log("namesarraybefore splitting", namesArray);
        namesArray = namesString.split(",");
        console.log("namesarrayafter splitting", namesArray); //check at this point of time

        // if (givenDate.toLowerCase() === "today") {
        //     null;
        // } else if (givenDate.toLowerCase() === "tomorrow") {
        //     console.log("we are in the tomorrow block");
        //     console.log("newdatetimein tomorrow block", newDateTime);

        //     let dateObj = new Date(newDateTime);

        //     // Increase the day by 1
        //     dateObj.setDate(dateObj.getDate() + 1);

        //     // Get the modified date string
        //     newDateTime = dateObj.toISOString().slice(0, 16);

        //     console.log("modified new date time", newDateTime);
        // } else {
        console.log("we are in the else block of date");
        //the code which is handling input in any format
        // Input date in words
        const dateInWords = date; // or '31 May'
        console.log("dateinwords", dateInWords);
        // Parse the input date
        let parsedDate = parse(dateInWords, "MMMM do", new Date());
        // console.log("parsed date first time", parsedDate);
        if (isNaN(parsedDate.getTime())) {
            parsedDate = parse(dateInWords, "do MMMM", new Date());
        }
        if (isNaN(parsedDate.getTime())) {
            parsedDate = parse(dateInWords, "yyyy-MM-dd", new Date());
        }
        if (isNaN(parsedDate.getTime())) {
            // const userMessageOnError = `Please re-write the statement with correct date format - "31 may", "may 31", "2023-05-31" `;
            // const response1 = await sendMessageToUser(
            //     userMessageOnError,
            //     usr.mobile
            // );

            // console.log(
            //     "response from twilio on incorrect date format enter",
            //     response1
            // );
            return res.status(400).send(`Please provide the date with correct format "YYYY-MM-DD" `);
        }
        console.log("parsed date final", parsedDate);

        // Adjust the parsed date by adding one day
        // parsedDate.setDate(parsedDate.getDate() + 1);

        // Convert to UTC time zone
        const utcDate = utcToZonedTime(parsedDate, "UTC");

        // Format the date to 'yyyy-mm-dd'
        const formattedDate = format(utcDate, "yyyy-MM-dd");

        console.log(formattedDate); // Output: '2023-08-31'
        if (formattedDate) {
            newDateTime = formattedDate;
            console.log(
                "newdatetime after setting the date when date is not null in the date block",
                newDateTime
            );
        } else {
            return res.status(400).send("you should write the date with proper spaces");
        }
        // }

        let formattedTime = await convertTo24HourFormat(
            time
        );
        if (date === null) {
            newDateTime = newDateTime.substring(0, newDateTime.indexOf("T"));
            newDateTime += `T${formattedTime}`;
            console.log(
                "log newdatetime after modifying when date is null",
                newDateTime
            );
        } else {
            if (newDateTime.includes("T")) {
                // newDateTime += `T${formattedTime}:00.000+05:30`;
                let lastIndex = newDateTime.lastIndexOf("T");
                newDateTime = newDateTime.substring(0, lastIndex);

                newDateTime += `T${formattedTime}`;
                console.log(
                    "log newdatetime after modifying when date is not null and it contains T",
                    newDateTime
                );
            } else {
                newDateTime += `T${formattedTime}`;
                console.log(
                    "log newdatetime after modifying when date is not null and it doesnt contains T",
                    newDateTime
                );
            }
        }


    } catch (error) {
        console.log("error while creating the meeting", error);
        return "we cannot create a meeting please try again later!";
    }
    let accessToken;
    let clientId = process.env.ZOOM_CLIENT_ID;
    let clientSecret = process.env.ZOOM_CLIENT_SECRET;
    let accountId = process.env.ZOOM_ACCOUNT_ID;

    async function createMeeting(nameArrayMeetName) {
        try {
            console.log("the array we get in createmeetings", nameArrayMeetName);
            let meetingName = `Meeting with: `;
            console.log("meeting name before adding the name", meetingName);
            for (let i = 0; i < nameArrayMeetName.length; i++) {
                meetingName += `${nameArrayMeetName[i].name}`;
            }
            console.log("meetname after adding everyuser name in it", meetingName);
            const encodedCredentials = btoa(`${clientId}:${clientSecret}`);
            const response1 = await axios.post(
                "https://zoom.us/oauth/token",
                `grant_type=account_credentials&account_id=${accountId}`,
                {
                    headers: {
                        Host: "zoom.us",
                        Authorization: `Basic ${encodedCredentials}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );
            // console.log("response from authentication", response1.data);
            accessToken = response1.data.access_token;
            const response = await axios.post(
                `https://api.zoom.us/v2/users/me/meetings`,
                {
                    topic: meetingName,
                    type: 2,
                    start_time: new Date(),
                    duration: 60,
                    // settings: {
                    //   auto_recording: "cloud", // Enable automatic cloud recording
                    // },
                },
                {
                    headers: {
                        Authorization: "Bearer " + accessToken,
                    },
                }
            );
            console.log("meetinglink", response.data.join_url);
            return response.data.join_url; // This is the meeting link
        } catch (err) {
            console.log("error in creating meeting link", err.message);
            return "an error occured. Please try again later!"
        }
    }

    //
    //
    //we are checking the array list of business holders so that we can arrange meeting with them

    const businessHolders = await BusinessHolder.find({})
    console.log("business holders", businessHolders)
    const finalArrayToSendMeetingLink = []
    for (let i = 0; i < namesArray.length; i++) {
        const similarityThreshold = 0.6; // For example, 0.7 means 70% similarity
        // const similarityScore = stringSimilarity.compareTwoStrings(keyword, word);
        const similarities = businessHolders.map((holder) => ({
            name: holder.name,
            contact: holder.contact,
            similarityScore: stringSimilarity.compareTwoStrings(namesArray[i], holder.name),
        }));

        for (let j = 0; j < similarities.length; j++) {
            if (similarities[j].similarityScore > similarityThreshold) {
                finalArrayToSendMeetingLink.push(similarities[j])
                console.log("yes similarity are matched and pushed in array")
            }
        }
        console.log("similarity score", similarities)
    }
    console.log("finalarraytosendfinal log", finalArrayToSendMeetingLink)
    console.log("loggin everything before everyhting", meetingTopic, newDateTime)
    const meetinglink = await createMeeting(finalArrayToSendMeetingLink)
    console.log("meeting link outside", meetinglink)
    //now we are sending the message to the invitees
    for (let i = 0; i < finalArrayToSendMeetingLink.length; i++) {

        const message = await twilioClient.messages.create({
            body: `Reminder: You have the meeting scheduled with ${foundUser.name}, ${foundUser.organisationName} on the topic - ${meetingTopic} at ${newDateTime} and the meeting link is - ${meetinglink}`,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`, // Replace with your Twilio WhatsApp Sandbox number
            to: `whatsapp:+91${finalArrayToSendMeetingLink[i].contact}`,
        });
        console.log(`Message sent to meeting assignee: ${message.sid}`);
    }
    //we are sending messages to the organiser as well
    let messageToSendToOrganiser = `AESTRA: meeting scheduled for - ${newDateTime}.The meeting link is - ${meetinglink} The meeting invite has been sent to : `
    for (let i = 0; i < finalArrayToSendMeetingLink.length; i++) {
        console.log("we are herezzz11")
        if (i === finalArrayToSendMeetingLink.length - 1) {
            messageToSendToOrganiser += `${finalArrayToSendMeetingLink[i].name}.`

        } else {
            messageToSendToOrganiser += `${finalArrayToSendMeetingLink[i].name},`
        }
    }
    console.log("final message before sending to organiser", messageToSendToOrganiser)
    console.log("roightbefore", process.env.TWILIO_WHATSAPP_NUMBER, "user", foundUser.mobile)
    await twilioClient.messages.create({
        body: messageToSendToOrganiser,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:+91${foundUser.mobile}`,
    });
    console.log("we sent the message to the organiser as well");
    return res.status(200).send("Sent the message to organiser as well as attendee!");
};
// crmBusinessMeetings("hello", "by", "xyz", "schedule a meeting with yogesh,dipesh and gunwan on the topic development 2 update at 7pm 22 september", { name: "manish soni", mobile: "9818525179" }) //just for testing purposes
module.exports = crmBusinessMeetings;
