const axios = require("axios");
const twilio = require("twilio");
// const admin = require("firebase-admin");
const FormData = require('form-data');
const { Vendor } = require("../../models/vendor");
const { JobWork } = require("../../models/jobWork");
const dotenv = require("dotenv");
dotenv.config();


const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
// const bucket = admin.storage().bucket('aestra-jewellers-files.appspot.com');
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

const getTextFromImage = async (imageBuffer) => {
  const min = 1;
  const max = 4;
  const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

  // Perform logic based on the random number
  switch (randomNum) {
    case 1:
      console.log("Random number is 1. Perform action 1.");
      // Add your logic for case 1 here
      try {
        const data = new FormData();
        data.append('image', imageBuffer, { filename: 'image.jpg', contentType: 'image/jpeg' });  // Assuming the image is in JPEG format

        //
        //
        const options = {
          method: 'POST',
          url: 'https://ocr-extract-text.p.rapidapi.com/ocr',
          headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY_1,
            'X-RapidAPI-Host': 'ocr-extract-text.p.rapidapi.com',
            ...data.getHeaders(),
          },
          data: data
        };
        const response = await axios.request(options);
        console.log("response from ocrextracttext", response.data.text);
        return response.data.text

      } catch (err) {
        console.log("error while extracting text from image", err.message)
      }
      break;
    case 2:
      console.log("Random number is 2. Perform action 2.");
      // Add your logic for case 2 here
      try {
        const data = new FormData();
        data.append('image', imageBuffer, { filename: 'image.jpg', contentType: 'image/jpeg' });  // Assuming the image is in JPEG format

        //
        //
        const options = {
          method: 'POST',
          url: 'https://ocr-extract-text.p.rapidapi.com/ocr',
          headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY_2,
            'X-RapidAPI-Host': 'ocr-extract-text.p.rapidapi.com',
            ...data.getHeaders(),
          },
          data: data
        };
        const response = await axios.request(options);
        console.log("response from ocrextracttext", response.data.text);
        return response.data.text

      } catch (err) {
        console.log("error while extracting text from image", err.message)
      }
      break;
    case 3:
      console.log("Random number is 3. Perform action 3.");
      // Add your logic for case 3 here
      try {
        const data = new FormData();
        data.append('image', imageBuffer, { filename: 'image.jpg', contentType: 'image/jpeg' });  // Assuming the image is in JPEG format

        //
        //
        const options = {
          method: 'POST',
          url: 'https://ocr-extract-text.p.rapidapi.com/ocr',
          headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY_3,
            'X-RapidAPI-Host': 'ocr-extract-text.p.rapidapi.com',
            ...data.getHeaders(),
          },
          data: data
        };
        const response = await axios.request(options);
        console.log("response from ocrextracttext", response.data.text);
        return response.data.text

      } catch (err) {
        console.log("error while extracting text from image", err.message)
      }
      break;
    case 4:
      console.log("Random number is 4. Perform action 4.");
      // Add your logic for case 4 here
      try {
        const data = new FormData();
        data.append('image', imageBuffer, { filename: 'image.jpg', contentType: 'image/jpeg' });  // Assuming the image is in JPEG format

        //
        //
        const options = {
          method: 'POST',
          url: 'https://ocr-extract-text.p.rapidapi.com/ocr',
          headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY_4,
            'X-RapidAPI-Host': 'ocr-extract-text.p.rapidapi.com',
            ...data.getHeaders(),
          },
          data: data
        };
        const response = await axios.request(options);
        console.log("response from ocrextracttext", response.data.text);
        return response.data.text

      } catch (err) {
        console.log("error while extracting text from image", err.message)
      }
      break;
    default:
      console.log("Random number is outside the expected range.");
      // Handle unexpected cases here
      break;
  }
};

const extractEntities = async (text) => {
  const options = {
    method: "POST",
    url: "https://ai-textraction.p.rapidapi.com/textraction",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": process.env.RAPIDAPI_KEY_1,
      "X-RapidAPI-Host": "ai-textraction.p.rapidapi.com",
    },
    data: {
      text,
      entities: [
        {
          var_name: "vendorName",
          type: "string",
          description: "Name of the vendor",
        },
        {
          var_name: "contact",
          type: "string",
          description: "Contact of the vendor",
        },
        {
          var_name: "address",
          type: "string",
          description: "Address of the vendor",
        },
        {
          var_name: "rawMaterialName",
          type: "string",
          description: "name of the raw material",
        },
        {
          var_name: "rawMaterialType",
          type: "string",
          description: "type of the raw material",
        },
        {
          var_name: "givenPurity",
          type: "string",
          description: "purity of the raw material",
        },
        {
          var_name: "givenWeight",
          type: "string",
          description: "weight of the raw material",
        },
        {
          var_name: "priceDecided",
          type: "string",
          description: "price of the job",
        },
        {
          var_name: "description",
          type: "string",
          description: "description of the job",
        },
      ],
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.results;
  } catch (error) {
    console.error("Error in rapid api response:", error);
    throw new Error("Failed to extract entities from text.");
  }
};

const sendMessage = async (body, from, to) => {
  try {
    await client.messages.create({ body, from, to });
  } catch (error) {
    console.error("Error sending message via Twilio:", error);
    throw new Error("Failed to send message.");
  }
};

const saveVendorIfNotExist = async (vendorData) => {
  const existingVendor = await Vendor.findOne({ name: vendorData.vendorName });
  if (!existingVendor) {
    console.log("vendor with a given name doesnot exist")

    const vendorId = Math.floor(100000 + Math.random() * 900000);

    const newVendor = new Vendor({ name: vendorData.vendorName, contact: vendorData.contact, address: vendorData.address, vendorId });
    await newVendor.save();
    return vendorData.vendorName
  }
  return existingVendor.name
};

const saveJobWork = async (jobWorkData) => {
  console.log("we are in the save jobworkblock");
  let { description,
    priceDecided,
    givenWeight,
    givenPurity,
    givenDate,
    rawMaterialType,
    rawMaterialName, vendorName } = jobWorkData;
  if (!rawMaterialName) {
    rawMaterialName = 'Define In CRM'
  }
  if (!rawMaterialType) {
    rawMaterialType = "Define In CRM"
  }
  if (!givenWeight) {
    givenWeight = "Define In CRM"
  } if (!givenPurity) {
    givenPurity = "Define In CRM"
  } if (!givenDate) {
    givenDate = "Define In CRM"
  }
  if (!priceDecided) {
    priceDecided = "Define In CRM"
  }
  if (!description) {
    description = "Define In CRM"
  }
  //finding the vendor by vendorId so that we can get its name
  const newJobWork = new JobWork({
    description,
    priceDecided,
    givenWeight,
    givenPurity,
    givenDate,
    rawMaterialType,
    rawMaterialName, vendorName
  });
  await newJobWork.save();
  return "new Job Work saved successfully!!"

};

const extractInfoFromVendorChallan = async (req, res, media, mediaFormat) => {

  // let serviceAccount = {
  //   "type": "service_account",
  //   "project_id": "aestra-jewellers-files",
  //   "private_key_id": "829cbddeaa8d55c8e80b6eeb2a6696c9c397debe",
  //   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDj48ZMYOs1cjVM\nfbgUB9ypeAc51uYflBUXb3jvmxUbM9ivncVHPhnMRNOZOopd14Sz7PAm825pmRWX\n4EKfqnNymoj1mK44vhq25LaQSCI862CeFKdhymmwPd3V7DZdNraJh+y58/He3EGx\nYsVuSK02oP0PcFDAojkhxz4LTeLbAzbkVhb9cpnxFDmLnLQfb/oYyPOD3ZM5dAuR\n99ri1FzLdyWgOEP0CVnDdA//xrKNJE30QQvgZRX8vJBannh07r/tBDiwDdBVDgbf\nks8erSpL+MnRmNcwDEIV+bSjBmz+ofmQjr5FvUyJqJsuVajUqQERMIdT2FH9hDJc\nqRUnw6LHAgMBAAECggEADkFLwLBZVjUIL3o3vw0E2Rb4gL44E+ab8STYcEiHp/V0\nyvt4AS5Zx8TQZafbSuZ11xltpkoY8IMSbjcpg7pSUWtoQNClqUf+/MzOvLS+a4gf\nuZO6KqxSMyOTklOdzPPktDKr9K/VQ+cMNu/iQLVMHHwyiDoy2vHq1/mSIHvlQmTR\nWAFyR41+lr/6WAZswXvfUmLhdma+AmsaSoLAyrfZeiDEzISqPm+bIbA9lC3xVwDG\nkBEbmMZuvzwp4v5+NVa+WXv/Y8xfjGH1Nueg8FKbL38hjswuFJl6yueUhOKoKwMV\nqNKcZGATsg3tbM1ojtwts+l7VbnBLyIH1DwlWMzlEQKBgQD6UTJ95yw/rXqoKX0/\nSOXiJn9r/lu7mmYO7vra01+GSbxX5AlepHcHiS2plJcFnCJ6ufn0XIc41jiEZGnR\ntFjUcwSfHib9fLPE8M3UWUtymnoVdjGrLvKYPXoVgjY8tj+FodnDR8K/IcPuQ8hS\nFH2ySGyvZJoZysu3Z2fr3gUFUQKBgQDpEDuXRq9hBjXtreKVqNILUOmW7Z/Kf1sg\naVjnHV+IC0DJmH9HiHhG2A3ufrMP5DrFt8DqP6RRYmhgEUinIzEegzAI/Ms7VWbN\nomgxkiwzRNFpZPFHvo9B2RmGrrZVFaGDZM7R5zAIktlPu0JZY0vWqZe1o21fU/XG\nKI5XGJWAlwKBgEJi6HY1qimVM7OHlV0EU1uABEk6409E6o5JWSRR7MKrqZTRuJ5u\nFddczUxtSQRG3WoZCq6BH6e2QLT0AJCKOQjXHEGq+II/4Vl4183ahMT3LSul9hRF\nVjeEDm3H4+SEHSKuwxckYATayqDVPzptjsyKorB9iNUQUKjqdsg6ULCRAoGAO29Z\nUw3CoeKclB1ZAEOKNTqQJ1439sMdsRlMg7vY5e/AuOh75PkneyGUA/MppO7WEh/3\nQYWzWNHYvk8KER2HZDmeYVxeU6ZGzkARhDq7rONq6A7G/T3aeLdtrAwYEYCvrLtj\nhuIHPNh+NLgThootB/Q97SNdPAdEUSF8kzeAwMcCgYEAlu1YKtItE2sKkYjnCfAP\narC366O7iXI5n+6TBDje3ilxou6LLtFTALa/cIx4UtZdGUPoUQYSiJBzlIcbfolL\n/xg8Nmxrw5ZX9cEOTtnxMHYXHsUOlRbDm6BsoaW0vNk9dYhjTWs4addck9AisUvJ\ncDo0EvMrTZzAGlLnuc6MO80=\n-----END PRIVATE KEY-----\n",
  //   "client_email": "firebase-adminsdk-k05tt@aestra-jewellers-files.iam.gserviceaccount.com",
  //   "client_id": "117075930024156217930",
  //   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  //   "token_uri": "https://oauth2.googleapis.com/token",
  //   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  //   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-k05tt%40aestra-jewellers-files.iam.gserviceaccount.com",
  //   "universe_domain": "googleapis.com"
  // }
  // admin.initializeApp({
  //   credential: admin.credential.cert(serviceAccount),
  //   storageBucket: "aestra-jewellers-files.appspot.com", // replace this with your actual storage bucket name found in project settings
  // });

  // const bucket = admin.storage().bucket('aestra-jewellers-files.appspot.com');
  if (!mediaFormat?.includes("image/"))
    return "Invalid media format"

  try {
    const imageBuffer = await fetchImageBuffer(media);
    const extractedText = await getTextFromImage(imageBuffer);
    const {
      vendorName,
      address,
      contact,
      description,
      priceDecided,
      givenWeight,
      givenPurity,
      // givenDate, commenting givendate because we are saving our own date
      rawMaterialType,
      rawMaterialName,
    } = await extractEntities(extractedText);
    if (!vendorName) return "Make sure the vendor Name is correctly visible."
    //first we are saving the image buffer to the google firebase bucket we are writing the logic here because we have to save date and supplier name in the name of the file`

    const date = new Date();


    // Format the date as a string in the desired format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate);
    let fileNameToSave = `vendout-${req.body.From}-${vendorName}-${formattedDate}.${mediaFormat}`
    fileNameToSave = fileNameToSave.replace("image/", "");
    fileNameToSave = fileNameToSave.replace("/", "");
    fileNameToSave = fileNameToSave.replace("/", "");
    console.log("filenametosave", fileNameToSave)
    //
    //
    let body = {}
    body.fileNameToSave = fileNameToSave
    body.media = media
    console.log("logging body before sending it to aestra1", body)
    const response = await axios
      .post(
        `https://aestra1.ocpl.tech/jewellers/uploadSupplier`,
        body, {
        maxContentLength: Infinity
      },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    //
    //
    if (response.status === 200) {
      const extractedVendorName = await saveVendorIfNotExist({ vendorName, address, contact });
      const message = await saveJobWork({
        description,
        priceDecided,
        givenWeight,
        givenPurity,
        givenDate: formattedDate,
        rawMaterialType,
        rawMaterialName, vendorName: extractedVendorName
      });
      return message
    }
    if (response.status === 400) return response.data;
    if (response.status === 500) return response.data;
  } catch (error) {
    console.error("Error in extractInfoFromBill:", error);
    res
      .status(500)
      .send({ error: "Internal server error. Please try again later." });
  }
};

module.exports = extractInfoFromVendorChallan;
