const sendMessageToUser = require("./sendMessageTwilio");

async function splitFunction(req, res, generatedText, user) {
    const dotenv = require("dotenv");
    dotenv.config();
    console.log("we are in split function block");
    const MessagingResponse = require("twilio").twiml.MessagingResponse;
    const twilio = require("twilio");
    //   const { MongoClient } = require("mongodb");
    //   const uri = process.env.MONGODB_URI;

    //   const client = new MongoClient(uri, {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    //   });
    const client = new twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );
    console.log("req.body.from", req.body.From);
    console.log("generatedText", generatedText);
    function isPointerFormat(response) {
        // Split the response into lines
        let lines = response.split("\n");

        // Check each line
        for (let i = 0; i < lines.length; i++) {
            // If the line starts with a number followed by a period or a bracket and then a space, it's a pointer
            if (/^[0-9]+[.)] /.test(lines[i])) {
                return true;
            }
        }

        // If none of the lines matched the pointer pattern, return false
        return false;
    }
    const responsePointer = isPointerFormat(generatedText);
    console.log("responsepointer", responsePointer);
    const lastFullStopIndex = generatedText.lastIndexOf(". "); //i just added space in it after the . so that it wont catch .com/ .org / .net dots
    console.log("lastfullstopindex", lastFullStopIndex);
    if (responsePointer) {
        if (generatedText.length >= 1000) {
            console.log("we are here in the pointer block >1000 block");
            function splitAroundMiddle(s) {
                let middle = s.length / 2; // find the middle index
                let left = s.lastIndexOf(" ", middle); // find last space before middle
                let right = s.indexOf(" ", middle); // find first space after middle

                if (left == -1 && right == -1) {
                    // No spaces found, just split at the middle
                    return [s.substring(0, middle), s.substring(middle)];
                }

                if (left == -1) {
                    left = middle;
                }

                if (right == -1) {
                    right = middle;
                }

                // Find the closest space to the middle
                let splitAt =
                    Math.abs(middle - left) < Math.abs(middle - right) ? left : right;

                // Split the string at the space and return the two parts
                return [s.substring(0, splitAt), s.substring(splitAt)];
            }

            let parts = splitAroundMiddle(generatedText);
            const generatedText1 = parts[0];
            const generatedText2 = parts[1];
            for (let i = 0; i < 1; i++) {
                await client.messages.create({
                    body: `AESTRA: ${generatedText1}`,
                    from: `${req.body.To}`,
                    to: `${req.body.From}`,
                });
                console.log("we are below twiml.message split block");
            }
            for (let j = 1; j < 2; j++) {
                await client.messages.create({
                    body: `${generatedText2}`,
                    from: `${req.body.To}`,
                    to: `${req.body.From}`,
                });
                console.log("we are below twiml.message split block");
            }
        } else {
            console.log(
                "generated text length in response pointer block",
                generatedText.length
            );
            console.log("usermobile", user.mobile);
            sendMessageToUser(`AESTRA: ${generatedText}`, user.mobile);
        }
    } else if (lastFullStopIndex !== -1) {
        const finalGeneratedText = generatedText.slice(0, lastFullStopIndex + 1);

        // console.log("final generated text", finalGeneratedText);
        console.log("final generated text length", finalGeneratedText.length);
        const characterLimit = 200;
        const sendCount = Math.round(finalGeneratedText.length / characterLimit);
        console.log("send count", sendCount);
        if (finalGeneratedText.length <= characterLimit) {
            const twiml = new MessagingResponse();
            await twiml.message(`AESTRA: ${finalGeneratedText}`, {
                to: `${req.body.From}`,
                from: `${req.body.To}`,
            });
            console.log("we are below twiml.message");
            res.writeHead(200, { "Content-Type": "text/xml" });
            res.end(twiml.toString());
            console.log("we are below the res.end");
            return;
        } else {
            let lastPeriodPos = {};
            let finalGeneratedTextObject = {};
            for (let i = 0; i < sendCount; i++) {
                console.log("we are in the for loop block");
                lastPeriodPos[`lastPeriodPos${i + 1}`] = finalGeneratedText.lastIndexOf(
                    ". ",
                    characterLimit * (i + 1)
                );

                for (let j = 0; j < 1; j++) {
                    console.log("we are in the for loop if block");

                    finalGeneratedTextObject[`finalGeneratedText${i + 1}`] =
                        finalGeneratedText.substring(
                            0,
                            lastPeriodPos[`lastPeriodPos${i + 1}`] + 1
                        );
                }
                for (let k = 1; k < sendCount; k++) {
                    console.log("we are in the for loop else block");

                    finalGeneratedTextObject[`finalGeneratedText${i + 1}`] =
                        finalGeneratedText.substring(
                            lastPeriodPos[`lastPeriodPos${i}`] + 1,
                            lastPeriodPos[`lastPeriodPos${i + 1}`] + 1
                        );
                }
            }
            console.log("lastPeriodPos", lastPeriodPos);
            console.log("finalGeneratedTextObject", finalGeneratedTextObject);
            // const twiml = new MessagingResponse();
            const accountSid = "AC5d9f317e7593afd84d5d1ee669bdee40"; // Replace with your Twilio Account SID
            const authToken = "7eddff3e6abb6e266612ca67102429e8"; // Replace with your Twilio Auth Token
            const client = twilio(accountSid, authToken);

            for (let i = 0; i < 1; i++) {
                //handling error by adding if else block because there could be the times when message body comes out to be empty.
                if (finalGeneratedTextObject[`finalGeneratedText${i + 1}`]) {
                    await client.messages.create({
                        body: `AESTRA: ${finalGeneratedTextObject[`finalGeneratedText${i + 1}`]
                            }`,
                        from: `${req.body.To}`,
                        to: `${req.body.From}`,
                    });
                    console.log("we are below twiml.message split block");
                } else {
                    console.log("message is empty thats why couldnt send");
                }
            }
            for (let j = 1; j < sendCount; j++) {
                if (finalGeneratedTextObject[`finalGeneratedText${j + 1}`]) {
                    await client.messages.create({
                        body: `${finalGeneratedTextObject[`finalGeneratedText${j + 1}`]}`,
                        from: `${req.body.To}`,
                        to: `${req.body.From}`,
                    });
                    console.log("we are below twiml.message split block");
                } else {
                    console.log("message is empty thats why couldnt send");
                }
            }
        }
    } else {
        console.log(
            "generated text length in last else block",
            generatedText.length
        );
        if (generatedText.length >= 1000) {
            console.log("we are here in last block >1000 block");
            function splitAroundMiddle(s) {
                let middle = s.length / 2; // find the middle index
                let left = s.lastIndexOf(" ", middle); // find last space before middle
                let right = s.indexOf(" ", middle); // find first space after middle

                if (left == -1 && right == -1) {
                    // No spaces found, just split at the middle
                    return [s.substring(0, middle), s.substring(middle)];
                }

                if (left == -1) {
                    left = middle;
                }

                if (right == -1) {
                    right = middle;
                }

                // Find the closest space to the middle
                let splitAt =
                    Math.abs(middle - left) < Math.abs(middle - right) ? left : right;

                // Split the string at the space and return the two parts
                return [s.substring(0, splitAt), s.substring(splitAt)];
            }
            let parts = splitAroundMiddle(generatedText);
            const generatedText1 = parts[0];
            const generatedText2 = parts[1];
            for (let i = 0; i < 1; i++) {
                await client.messages.create({
                    body: `AESTRA: ${generatedText1}`,
                    from: `${req.body.To}`,
                    to: `${req.body.From}`,
                });
                console.log("we are below twiml.message split block");
            }
            for (let j = 1; j < 2; j++) {
                await client.messages.create({
                    body: `${generatedText2}`,
                    from: `${req.body.To}`,
                    to: `${req.body.From}`,
                });
                console.log("we are below twiml.message split block");
            }
        } else {
            await client.messages.create({
                body: `${generatedText}`,
                from: `${req.body.To}`,
                to: `${req.body.From}`,
            });
            console.log("we are below twiml.message");
            // res.writeHead(200, { "Content-Type": "text/xml" });
            // res.end(twiml.toString());
            console.log("we are below the res.end in generated text without dot");
            // return;
        }
    }
}
module.exports = splitFunction;
