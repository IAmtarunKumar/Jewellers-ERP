const { default: axios } = require("axios");
const stringSimilarity = require("string-similarity");
const csv = require("csv-parser");
const nodemailer = require("nodemailer");
const pdf = require('pdf-parse');
const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

const dbConnection = process.env.MONGO_URI;
mongoose.connect(dbConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const FormData = require("form-data");
const admin = require("firebase-admin");
let serviceAccount = {
    type: "service_account",
    project_id: "aestra-jewellers-files",
    private_key_id: "829cbddeaa8d55c8e80b6eeb2a6696c9c397debe",
    private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDj48ZMYOs1cjVM\nfbgUB9ypeAc51uYflBUXb3jvmxUbM9ivncVHPhnMRNOZOopd14Sz7PAm825pmRWX\n4EKfqnNymoj1mK44vhq25LaQSCI862CeFKdhymmwPd3V7DZdNraJh+y58/He3EGx\nYsVuSK02oP0PcFDAojkhxz4LTeLbAzbkVhb9cpnxFDmLnLQfb/oYyPOD3ZM5dAuR\n99ri1FzLdyWgOEP0CVnDdA//xrKNJE30QQvgZRX8vJBannh07r/tBDiwDdBVDgbf\nks8erSpL+MnRmNcwDEIV+bSjBmz+ofmQjr5FvUyJqJsuVajUqQERMIdT2FH9hDJc\nqRUnw6LHAgMBAAECggEADkFLwLBZVjUIL3o3vw0E2Rb4gL44E+ab8STYcEiHp/V0\nyvt4AS5Zx8TQZafbSuZ11xltpkoY8IMSbjcpg7pSUWtoQNClqUf+/MzOvLS+a4gf\nuZO6KqxSMyOTklOdzPPktDKr9K/VQ+cMNu/iQLVMHHwyiDoy2vHq1/mSIHvlQmTR\nWAFyR41+lr/6WAZswXvfUmLhdma+AmsaSoLAyrfZeiDEzISqPm+bIbA9lC3xVwDG\nkBEbmMZuvzwp4v5+NVa+WXv/Y8xfjGH1Nueg8FKbL38hjswuFJl6yueUhOKoKwMV\nqNKcZGATsg3tbM1ojtwts+l7VbnBLyIH1DwlWMzlEQKBgQD6UTJ95yw/rXqoKX0/\nSOXiJn9r/lu7mmYO7vra01+GSbxX5AlepHcHiS2plJcFnCJ6ufn0XIc41jiEZGnR\ntFjUcwSfHib9fLPE8M3UWUtymnoVdjGrLvKYPXoVgjY8tj+FodnDR8K/IcPuQ8hS\nFH2ySGyvZJoZysu3Z2fr3gUFUQKBgQDpEDuXRq9hBjXtreKVqNILUOmW7Z/Kf1sg\naVjnHV+IC0DJmH9HiHhG2A3ufrMP5DrFt8DqP6RRYmhgEUinIzEegzAI/Ms7VWbN\nomgxkiwzRNFpZPFHvo9B2RmGrrZVFaGDZM7R5zAIktlPu0JZY0vWqZe1o21fU/XG\nKI5XGJWAlwKBgEJi6HY1qimVM7OHlV0EU1uABEk6409E6o5JWSRR7MKrqZTRuJ5u\nFddczUxtSQRG3WoZCq6BH6e2QLT0AJCKOQjXHEGq+II/4Vl4183ahMT3LSul9hRF\nVjeEDm3H4+SEHSKuwxckYATayqDVPzptjsyKorB9iNUQUKjqdsg6ULCRAoGAO29Z\nUw3CoeKclB1ZAEOKNTqQJ1439sMdsRlMg7vY5e/AuOh75PkneyGUA/MppO7WEh/3\nQYWzWNHYvk8KER2HZDmeYVxeU6ZGzkARhDq7rONq6A7G/T3aeLdtrAwYEYCvrLtj\nhuIHPNh+NLgThootB/Q97SNdPAdEUSF8kzeAwMcCgYEAlu1YKtItE2sKkYjnCfAP\narC366O7iXI5n+6TBDje3ilxou6LLtFTALa/cIx4UtZdGUPoUQYSiJBzlIcbfolL\n/xg8Nmxrw5ZX9cEOTtnxMHYXHsUOlRbDm6BsoaW0vNk9dYhjTWs4addck9AisUvJ\ncDo0EvMrTZzAGlLnuc6MO80=\n-----END PRIVATE KEY-----\n",
    client_email:
        "firebase-adminsdk-k05tt@aestra-jewellers-files.iam.gserviceaccount.com",
    client_id: "117075930024156217930",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-k05tt%40aestra-jewellers-files.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount), // replace this with your actual storage bucket name found in project settings
});

const bucket = admin.storage().bucket("aestra-jewellers-files.appspot.com"); // e.g. 'my-app-id.appspot.com'

const { Customer } = require("./models/customer");
const { Sales } = require("./models/sales");
const { Repair } = require("./models/repairs");

const fetchImageBuffer = async (media) => {
    try {
        const response = await axios({
            method: "get",
            url: media,
            responseType: "arraybuffer",
            auth: {
                username: process.env.TWILIO_ACCOUNT_SID,
                password: process.env.TWILIO_AUTH_TOKEN,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error downloading file:", error);
        throw new Error("Failed to fetch image buffer.");
    }
};
const testImageUpload = async () => {
    console.log("we are in the testing image from the image url");
    const twilioLink =
        "https://api.twilio.com/2010-04-01/Accounts/AC5d9f317e7593afd84d5d1ee669bdee40/Messages/MMf7afb0464b015086d9d874c1f0ff109c/Media/ME0be3f454ba7520a9f62f24da76a08aea";
    try {
        //we are going to fetch image buffer first and then we are going to use that buffer to fetch from api
        const imageBuffer = await fetchImageBuffer(twilioLink);
        console.log("fetched imagebuffer", imageBuffer);
        //
        const data = new FormData();
        data.append("image", imageBuffer, {
            filename: "image.jpg",
            contentType: "image/jpeg",
        }); // Assuming the image is in JPEG format

        //
        //
        const options = {
            method: "POST",
            url: "https://ocr-extract-text.p.rapidapi.com/ocr",
            headers: {
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY_4,
                "X-RapidAPI-Host": "ocr-extract-text.p.rapidapi.com",
                ...data.getHeaders(),
            },
            data: data,
        };
        const response = await axios.request(options);
        console.log("response from ocrextracttext", response.data);
    } catch (err) {
        console.log("error in extracting text", err.message);
        // await worker.terminate(); //commented because this is commented in aestra code where its is taken
    }
};
// testImageUpload()
const uploadImageBucket = async () => {
    console.log("we are in the firebase block");
    const twilioLink =
        "https://api.twilio.com/2010-04-01/Accounts/AC5d9f317e7593afd84d5d1ee669bdee40/Messages/MM39d1ab5a2372d76590c9518d967437f0/Media/MEb14ba48b4f631c2d36b4a333226b3dae";
    const imageBuffer = await fetchImageBuffer(twilioLink);
    console.log("fetched imagebuffer", imageBuffer);
    // const file = bucket.file('test.jpg');

    const options = {
        metadata: {
            contentType: "image/jpeg",
        },
        resumable: false,
    };

    const writable = file.createWriteStream(options);
    writable.write(imageBuffer);
    writable.end();

    return new Promise((resolve, reject) => {
        writable.on("finish", resolve);
        writable.on("error", reject);
    });
};
// uploadImageBucket()
const sendTheMessageThroughOcplTech = async (message) => {
    //this testing is done for ocpl.tech website which is actually done for contactus page and backend will run with aestra.ocpl.tech we just hit the api endpoint from the contact us page
    let prompt = `Based on the query of the user, which includes: ${message}, and considering this information about our organisation: At Ocpl Tech, we are a leading Blockchain Development Company dedicated to driving innovation for businesses in India and worldwide. Our talented team of experts skillfully leverages cutting-edge technology to create custom blockchain solutions and high-speed web, Android, and iOS applications. By partnering with us, you'll experience a powerful blend of dedication and advanced technology that simplifies processes and accelerates your business growth. Choose Ocpl Tech and embark on a journey toward remarkable success.Services.
    The idea behind OCPL Tech's service is to provide businesses with efficient, secure, and user-friendly solutions that enhance their processes and customer interactions. By offering various API integrations and features, OCPL Tech aims to cater to a wide range of industries and business requirements.AESTRA is a cutting-edge AI-powered chat integration for WhatsApp, designed by Opulentia Cresco (OCPL) to revolutionize the way you communicate. By harnessing the limitless potential of GPT-4, AESTRA brings you an extraordinary messaging experience that goes beyond simple text exchanges., recommend the solution to the user query.`;
    //getting response from openai from passing prompt
    //post request openai Url
    let reqUrl = "https://api.openai.com/v1/chat/completions";

    //openai post request headers
    let reqHeaders = {
        headers: {
            Authorization: `Bearer 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`,
            "Content-Type": "application/json",
        },
    };

    //openai post request body
    let reqBody = {
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],
        max_tokens: 150,
        temperature: 0.5,
    };

    //error handling
    try {
        //openai post request
        let response = await axios.post(reqUrl, reqBody, reqHeaders);
        //extract message from openai response
        let recommendation = response.data.choices[0].message.content;
        console.log("recommendation", recommendation);

        //generating message that sent to user whatsapp number
        // let message = `Hello ${customer.name}! Based on your preferences, we recommend the new collection of ${recommendation}. Discover more at our store!`;
        // console.log("message", message)
        // //send message to user whatsapp number using twilio client
        // await twilioClient.messages.create({
        //     body: message,
        //     from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        //     to: `whatsapp:+91${customer.contact}`
        // });
    } catch (error) {
        //handling error
        console.error("OpenAI Error:", error.response.data);
        throw error;
    }
};

const csvFileWriter = async () => {
    console.log("we are inside the csv file writer");
    const data = [
        { name: "John", address: "xyz city", contact: "9809090989" },
        { name: "Alice", address: "abc city", contact: "0123456789" },
        { name: "Bob", address: "efg city", contact: "0123456785" },
    ];

    // Specify the CSV file path
    const csvFilePath = "sampleCustomer.csv";

    // Create a CSV writer
    const csvWriter = createCsvWriter({
        path: csvFilePath,
        header: [
            { id: "name", title: "Name" },
            { id: "address", title: "Address" },
            { id: "contact", title: "Contact" },
        ],
    });

    // Write the data to the CSV file
    csvWriter
        .writeRecords(data)
        .then(() => {
            console.log(`CSV file "${csvFilePath}" has been generated successfully.`);
        })
        .catch((error) => {
            console.error("Error writing to CSV file:", error);
        });
};
// csvFileWriter()
async function saveData(data) {
    const customer = new Customer({
        name: data.name,
        address: data.address,
        contact: data.contact,
    });
    try {
        await customer.save();
    } catch (err) {
        console.log(err);
    }
}
const csvFileTester = async () => {
    const fileName = "sampleCustomer.csv"; // Replace with the actual file name you want to retrieve

    const file = bucket.file(fileName); // Create a reference to the file

    // Specify a local path to where you want to save the downloaded file

    try {
        // Download the file to your backend
        const readStream = file.createReadStream();
        let results = [];
        readStream
            .pipe(csv())
            .on("data", (data) => {
                // Process each row of data as it arrives
                results.push(data);
            })
            .on("end", async () => {
                // All data has been processed
                for (let data of results) {
                    console.log(data);
                    await saveData(data); // Replace with your data processing logic
                }
                console.log("Stream ended");
                // Send a response when all data is processed
                res.json({
                    message: "CSV Data processed successfully",
                });
            })
            .on("error", (error) => {
                // Handle any errors that occur during the stream
                console.error("Error reading stream:", error);
                res.status(500).send(`error-${error.message}`);
            });
    } catch (err) {
        console.log("error while downloading and parsing", err.message);
    }
};
// csvFileTester()
const pdfOcrTester = async () => {
    // //we will fetch the file from the google firebase then we will try to fetch the text from pdf first. if it goes well then we are gonna do it for multiple pages of the pdf okay!! we are planning to standardized the ai textraction to the 10 things per page
    const pdfFilePath = "bankStatement-final.pdf";  //extension is also neccessary
    // Download the PDF file from Firebase Storage
    const pdfFile = bucket.file(pdfFilePath);

    const [pdfFileBuffer] = await pdfFile.download();
    console.log("we are just here before converting pdf buffer to image buffer", pdfFileBuffer)
    // const pdfBuffer = fs.readFileSync("bankstatement-final.pdf");
    const dataBuffer = await pdf(pdfFileBuffer);
    const numberOfPages = dataBuffer.numpages;
    console.log("number of pages", numberOfPages);

    console.log("databuffer text1", dataBuffer.text.trim());
    const statementSections = dataBuffer.text.trim().split('\n');

    // Now, `statementSections` is an array containing the data separated by line breaks
    // console.log(statementSections);
    let foundDoubleLineBreak = false;
    let currentStatement = ''; // To store the content between double line breaks
    const statements = []; // To store all the statements

    for (let i = 0; i < statementSections.length; i++) {
        const currentLine = statementSections[i].trim(); // Remove leading and trailing whitespace

        // Check if we've reached the end of the document
        if (i === statementSections.length - 1) {
            currentStatement += currentLine + '\n'; // Append the current line
            statements.push(currentStatement); // Add the last statement
        } else if (currentLine.startsWith('Account Statement For Account:')) {
            // Start capturing data for a new statement
            if (currentStatement !== '') {
                statements.push(currentStatement); // Add the previous statement
            }
            currentStatement = currentLine + '\n'; // Initialize the current statement
        } else {
            // Append the current line to the current statement
            currentStatement += currentLine + '\n';
        }
    }

    // Print or process the collected statements
    // for (let i = 0; i < statements.length; i++) {  //it is working fine 
    //     console.log(`Statement ${i + 1}:`);
    //     console.log(statements[i]);
    // }    

    //now after putting the three page contents in the array we are now applying the maximum ten entries per page logic with the help of aitextraction - 
    //loop for using aitextraction per page
    for (let i = 0; i < statements.length; i++) {
        const options = {
            method: "POST",
            url: "https://ai-textraction.p.rapidapi.com/textraction",
            headers: {
                "content-type": "application/json",
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY_1,
                "X-RapidAPI-Host": "ai-textraction.p.rapidapi.com",
            },
            data: {
                text: statements[i],
                entities: [
                    {
                        var_name: "transaction_Date1",
                        type: "string",
                        description: "Transaction Date1",
                    },
                    {
                        var_name: "withdrawal1",
                        type: "string",
                        description: "Withdrawal Amount1 and if not present then simply revert with ''",
                    },
                    {
                        var_name: "deposit1",
                        type: "string",
                        description: "Deposit Amount1 and if not present then simply revert with ''",
                    },
                    {
                        var_name: "balance1",
                        type: "string",
                        description: "Balance Amount1",
                    },
                    {
                        var_name: "description1",
                        type: "string",
                        description: "Description1",
                    }, {
                        var_name: "transaction_Date2",
                        type: "string",
                        description: "Transaction Date2",
                    },
                    {
                        var_name: "withdrawal2",
                        type: "string",
                        description: "Withdrawal Amount2 and if not present then simply revert with ''",
                    },
                    {
                        var_name: "deposit2",
                        type: "string",
                        description: "Deposit Amount2 and if not present then simply revert with ''",
                    },
                    {
                        var_name: "balance2",
                        type: "string",
                        description: "Balance Amount2",
                    },
                    {
                        var_name: "description2",
                        type: "string",
                        description: "Description2",
                    },
                ],
            },
        };
        let name, address, contact;
        try {
            const response = await axios.request(options);
            console.log(`data from rapidai for loop ${i}\n\n`, response.data);
        } catch (err) {
            console.log("error", err.response.data.detail)
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}
// pdfOcrTester()
const pdfToExcelTester = async () => {
    var https = require("https");
    var path = require("path");
    var fs = require("fs");

    // `request` module is required for file upload.
    // Use "npm install request" command to install.
    var request = require("request");

    // The authentication key (API Key).
    // Get your own by registering at https://app.pdf.co
    const API_KEY = "dipesh@ocpl.tech_c8eb4454d0105a0b5df9f5143ea29c3172f4af1020e80e94570246945afdbf25da0da77f";


    // Source PDF file
    const SourceFile = "./bankStatement-final.pdf";
    // Comma-separated list of page indices (or ranges) to process. Leave empty for all pages. Example: '0,2-5,7-'.
    const Pages = "";
    // PDF document password. Leave empty for unprotected documents.
    const Password = "";
    // Destination XLS file name
    const DestinationFile = "./result.xls";


    // 1. RETRIEVE PRESIGNED URL TO UPLOAD FILE.
    getPresignedUrl(API_KEY, SourceFile)
        .then(([uploadUrl, uploadedFileUrl]) => {
            // 2. UPLOAD THE FILE TO CLOUD.
            uploadFile(API_KEY, SourceFile, uploadUrl)
                .then(() => {
                    // 3. CONVERT UPLOADED PDF FILE TO XLS
                    convertPdfToXls(API_KEY, uploadedFileUrl, Password, Pages, DestinationFile);
                })
                .catch(e => {
                    console.log(e);
                });
        })
        .catch(e => {
            console.log(e);
        });


    function getPresignedUrl(apiKey, localFile) {
        return new Promise(resolve => {
            // Prepare request to `Get Presigned URL` API endpoint
            let queryPath = `/v1/file/upload/get-presigned-url?contenttype=application/octet-stream&name=${path.basename(SourceFile)}`;
            let reqOptions = {
                host: "api.pdf.co",
                path: encodeURI(queryPath),
                headers: { "x-api-key": API_KEY }
            };
            // Send request
            https.get(reqOptions, (response) => {
                response.on("data", (d) => {
                    let data = JSON.parse(d);
                    if (data.error == false) {
                        // Return presigned url we received
                        resolve([data.presignedUrl, data.url]);
                    }
                    else {
                        // Service reported error
                        console.log("getPresignedUrl(): " + data.message);
                    }
                });
            })
                .on("error", (e) => {
                    // Request error
                    console.log("getPresignedUrl(): " + e);
                });
        });
    }

    function uploadFile(apiKey, localFile, uploadUrl) {
        return new Promise(resolve => {
            fs.readFile(SourceFile, (err, data) => {
                request({
                    method: "PUT",
                    url: uploadUrl,
                    body: data,
                    headers: {
                        "Content-Type": "application/octet-stream"
                    }
                }, (err, res, body) => {
                    if (!err) {
                        resolve();
                    }
                    else {
                        console.log("uploadFile() request error: " + e);
                    }
                });
            });
        });
    }

    function convertPdfToXls(apiKey, uploadedFileUrl, password, pages, destinationFile) {
        // Prepare request to `PDF To XLS` API endpoint
        var queryPath = `/v1/pdf/convert/to/xls`;

        // JSON payload for api request
        var jsonPayload = JSON.stringify({
            name: path.basename(destinationFile), password: password, pages: pages, url: uploadedFileUrl
        });

        var reqOptions = {
            host: "api.pdf.co",
            method: "POST",
            path: queryPath,
            headers: {
                "x-api-key": API_KEY,
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(jsonPayload, 'utf8')
            }
        };
        // Send request
        var postRequest = https.request(reqOptions, (response) => {
            response.on("data", (d) => {
                response.setEncoding("utf8");
                // Parse JSON response
                let data = JSON.parse(d);
                if (data.error == false) {
                    // Download XLS file
                    var file = fs.createWriteStream(destinationFile);
                    https.get(data.url, (response2) => {
                        response2.pipe(file)
                            .on("close", () => {
                                console.log(`Generated XLS file saved as "${destinationFile}" file.`);
                            });
                    });
                }
                else {
                    // Service reported error
                    console.log("readBarcodes(): " + data.message);
                }
            });
        })
            .on("error", (e) => {
                // Request error
                console.log("readBarcodes(): " + e);
            });

        // Write request data
        postRequest.write(jsonPayload);
        postRequest.end();
    }
}
// pdfToExcelTester()
const statementCsvToMongo = async () => {

}
const totalRevenue = async () => {
    console.log("we are in total revenue block")
    const totalSales = await Sales.find({})
    console.log("total sales", totalSales)
    const totalSalesProduct = await Sales.aggregate([
        {
            $lookup: {
                from: 'products', // Replace with the actual name of your products collection
                localField: 'productId',
                foreignField: 'productId',
                as: 'productInfo'
            }
        },
        {
            $unwind: '$productInfo'
        },
        {
            $project: {
                _id: 1,
                customerId: 1,
                productId: 1,
                saleDate: 1,
                quantity: 1,
                totalAmount: {
                    $multiply: [
                        { $toDecimal: '$productInfo.price' },
                        { $toInt: '$quantity' }
                    ]
                }
            }
        },
        {
            $group: {
                _id: null,
                totalSalesAmount: { $sum: '$totalAmount' }
            }
        }
    ])
        .exec() // Remove the callback function
    let totalAmount;
    if (totalSalesProduct.length > 0) {
        totalAmount = totalSalesProduct[0].totalSalesAmount.toString();
        console.log('Total Sales Amount:', totalAmount);
    } else {
        console.log('No sales data found.');
    }
    //now we are adding repair revenues in it as well
    const repairsTotal = await Repair.aggregate([
        {
            $group: {
                _id: null,
                totalRepairCost: { $sum: { $toInt: "$repairCost" } }
            }
        }
    ])
        .exec()
    let totalCost
    if (repairsTotal.length > 0) {
        totalCost = repairsTotal[0].totalRepairCost.toString();
        console.log('Total Repair Cost:', totalCost);
    } else {
        console.log('No repair data found.');
    }
    const grandTotal = parseInt(totalAmount, 10) + parseInt(totalCost, 10);
    console.log("totalamount of addition", grandTotal)
}

// totalRevenue()

const mailChecker = async () => {
    const transporter = nodemailer.createTransport({
        host: "smtpout.secureserver.net",
        port: 465,
        secure: true,
        auth: {
            user: "support@thenonditedit.com",
            pass: "TheNonDit@888",
        },
    });
    const mailOptions = {
        from: "support@thenonditedit.com",
        to: "dipeshsharma936@gmail.com",
        subject: "Order Successful.",
        text: `Hello,\n\nYour order has been placed with us. you will be notified once it will be Out for delivery. Order Id for reference - $`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email:", error.message);
            return res
                .status(500)
                .send(`internal Server Error. Please try again later.:${error}`);
        } else {
            console.log("Email sent:", info.response);
        }

    })
}
// mailChecker()
const fetchingAndWritingExcel = async () => {
    const fs = require('fs');
    const XLSX = require('xlsx');
    const extractedData = []
    for (const obj of dataFromEmailJsContactForm) {
        // Parse the template_params JSON string
        const templateParams = JSON.parse(obj.template_params);

        // Access data from template_params
        const from_name = templateParams.from_name;
        const from_email = templateParams.from_email;
        const message = templateParams.message;
        const mobile = templateParams.mobile;
        const organisation = templateParams.organisation;
        const designation = templateParams.designation;

        // ... (access other properties within template_params)
        // Print or process the extracted data from template_params as needed
        // console.log("essentials", from_email, from_name, message, mobile, organisation, designation) //its working
        // ... (print or process other properties from template_params)
        const extractedObj = {
            from_name,
            from_email,
            message,
            mobile,
            organisation,
            designation,
        };

        // Add the extracted object to the array
        extractedData.push(extractedObj);
    }
    const ws = XLSX.utils.json_to_sheet(extractedData);

    // Create a new workbook and add the worksheet to it
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ExtractedData');

    // Specify the Excel file name
    const excelFileName = 'emailjs_data.xlsx';

    // Write the workbook to an Excel file
    XLSX.writeFile(wb, excelFileName);

    console.log(`Data has been written to ${excelFileName}`);
}

// fetchingAndWritingExcel()
const resumeFeature = async () => {
    const pdfFilePath = "resume.pdf";  //extension is also neccessary
    // Download the PDF file from Firebase Storage
    const pdfFile = bucket.file(pdfFilePath);

    const [pdfFileBuffer] = await pdfFile.download();
    console.log("we are just here before converting pdf buffer to image buffer", pdfFileBuffer)
    // const pdfBuffer = fs.readFileSync("bankstatement-final.pdf");
    const dataBuffer = await pdf(pdfFileBuffer);
    const numberOfPages = dataBuffer.numpages;
    console.log("number of pages", numberOfPages);

    console.log("databuffer text1", dataBuffer.text.trim());
}
// resumeFeature()

const checkingNewId = async () => {
    const transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        auth: {
            user: "verify@ocpl.tech", ///this id password is not known! when sir will come back i will take it
            pass: "OcplTech555@",
        },
    });
    const mailOptions = {
        from: "verify@ocpl.tech",
        to: "dipeshsharma936@gmail.com",
        subject: "OTP Verification",
        text: `Hello,\n\. Please Enter the given OTP :\n\n Test`,
    };
    const response = await transporter.sendMail(mailOptions);
    console.log(
        "we are after sending the email to the user and the response is - ",
        response
    );
    if (response.messageId) {
        res.status(200).send("OTP Sent To Email. Please Verify it."); //dont modify this statement because frontend sweetalert works on its basis.
    } else {
        console.log("email cannot be sent for OTP and we cant proceed further");
        res.status(500).send("internal Server Error. Please try again later.");
    }
}
// checkingNewId()   //password for new id(verify@ocpl.tech) is not known when sir will come back then 

const testAddition = async () => {
    lastBalance = "-30000"
    amount = "10000"
    const total = (parseInt(lastBalance) - parseInt(amount));
    console.log("total", total)
    // return total
}

// testAddition()

const urlTester = async (url) => {
    try {
        const response = await axios.get(url, {
            maxRedirects: 5, // Don't follow redirects for the initial check
            validateStatus: (status) => status >= 200 && status < 400 // Accept any status code that's 2xx or 3xx
        });

        if (response.request.res.responseUrl.startsWith('https://')) {
            console.log("The website is running on HTTPS.");
        } else {
            console.log("The website is not running on HTTPS.");
        }
    } catch (error) {
        // Check if it's a redirect
        if (error.response && error.response.status >= 300 && error.response.status < 400) {
            const redirectURL = error.response.headers.location;
            if (redirectURL.startsWith('https://')) {
                console.log("The website redirects to HTTPS.");
            } else {
                console.log("The website redirects but not to HTTPS.");
            }
        } else {
            console.error("An error occurred:", error.message);
        }
    }
}
// urlTester("https://139.84.170.30")
const deleteCollections = async () => {
    const uri = 'mongodb://dipeshsharma936:JwgbKdSv9tGp9Y8Y@ac-qhr9xqq-shard-00-00.rsg13is.mongodb.net:27017,ac-qhr9xqq-shard-00-01.rsg13is.mongodb.net:27017,ac-qhr9xqq-shard-00-02.rsg13is.mongodb.net:27017/aestra-jewellers?ssl=true&replicaSet=atlas-qjjtxi-shard-0&authSource=admin&retryWrites=true&w=majority'; // Replace with your MongoDB Atlas connection URI
    const dbName = 'aestra-jewellers'; // Replace with your database name

    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: dbName,
    });

    const db = mongoose.connection;

    db.once('open', async () => {
        try {
            const collections = await mongoose.connection.db.listCollections().toArray();
            const collectionsToKeep = ['utilities']; // Replace 'collectionNameToKeep' with the name of the collection you want to keep.

            for (let collection of collections) {
                const collectionName = collection.name;
                if (!collectionsToKeep.includes(collectionName)) {
                    await mongoose.connection.db.dropCollection(collectionName);
                    console.log(`Collection ${collectionName} has been removed.`);
                }
            }

            console.log('All collections except the specified one have been removed.');
            mongoose.connection.close();
        } catch (error) {
            console.error('Error:', error);
        }
    });
}
// deleteCollections()