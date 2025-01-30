const { parse, format } = require("date-fns");
const { utcToZonedTime } = require("date-fns-tz");
const sendMessageToUser = require("./sendMessageTwilio");

// Function to handle date parsing and formatting
const handleDateInput = async (inputDate, req) => {
  let parsedDate = parse(inputDate, "MMMM do", new Date());
  if (isNaN(parsedDate.getTime())) {
    parsedDate = parse(inputDate, "do MMMM", new Date());
  }
  if (isNaN(parsedDate.getTime())) {
    parsedDate = parse(inputDate, "yyyy-MM-dd", new Date());
  }
  if (isNaN(parsedDate.getTime())) {
    const userMessageOnError = `Please re-write the statement with correct date format - "31 sep", "sep 08", "2023-09-08" `;
    const response1 = await sendMessageToUser(
      userMessageOnError,
      req.body.From
    );
    console.log(
      "response from twilio on incorrect date format enter",
      response1
    );
    return;
  }
  const utcDate = utcToZonedTime(parsedDate, "UTC");
  const formattedDate = format(utcDate, "yyyy-MM-dd");
  return formattedDate ? formattedDate : null;
};

module.exports = {
  handleDateInput,
};
