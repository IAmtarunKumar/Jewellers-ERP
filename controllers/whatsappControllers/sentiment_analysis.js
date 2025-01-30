const axios = require("axios");

async function getSentimentAnalysis(userMessage) {
    console.log("In sentiment Analysic");
    try {
        const data = { text: userMessage };
        console.log("Data", data);
        const response = await axios.post(
            "http://139.84.168.68:8080/analyze",
            data
        );
        console.log("response", response);
        return generateSentimentResponse(response.data);
    } catch (error) {
        console.error(
            "Error getting sentiment analysis:",
            error.message,
            error.stack
        );
        return null;
    }
}
// Add this function to your code
function generateSentimentResponse(sentimentAnalysis) {
    if (sentimentAnalysis.positive > 0.8) {
        return "Your message is very positive!";
    } else if (sentimentAnalysis.positive > 0.5) {
        return "Your message seems to have a positive sentiment.";
    } else if (sentimentAnalysis.negative > 0.8) {
        return "Your message is very negative!";
    } else if (sentimentAnalysis.negative > 0.5) {
        return "Your message seems to have a negative sentiment.";
    } else {
        return "Your message seems to have a neutral sentiment.";
    }
}

function trimSentimentAnalysis(userMessage) {
    const searchString = " - sentiment analysis";

    if (userMessage.toLowerCase().endsWith(searchString)) {
        return getSentimentAnalysis(
            userMessage.slice(0, -searchString.length).trim()
        );
    }

    return userMessage;
}
function checkSentimentAnalysis(userMessage) {
    const searchString = "sentiment analysis";

    if (userMessage.toLowerCase().includes(searchString)) {
        return "Yes";
    }

    return userMessage;
}

module.exports = { trimSentimentAnalysis, checkSentimentAnalysis };
