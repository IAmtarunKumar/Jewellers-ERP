const axios = require("axios");
const twilio = require("twilio");
// const admin = require("firebase-admin");
const FormData = require('form-data');
const { Supplier } = require("../../models/supplier");
const { RawMaterial } = require("../../models/rawMaterial");
const dotenv = require("dotenv");
dotenv.config();

const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

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
          var_name: "supplierName",
          type: "string",
          description: "name of the supplier",
        },
        {
          var_name: "address",
          type: "string",
          description: "complete address of the supplier",
        },
        {
          var_name: "contact",
          type: "string",
          description: "contact number of the supplier",
        },
        {
          var_name: "rawMaterialName",
          type: "string",
          description: "name of the raw material",
        },
        {
          var_name: "type",
          type: "string",
          description: "type of the raw material",
        },
        {
          var_name: "weight",
          type: "string",
          description: "weight of the raw material",
        },
        {
          var_name: "price",
          type: "string",
          description: "price of the raw material",
        },
        {
          var_name: "description",
          type: "string",
          description: "description of the raw material",
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

const saveSupplierIfNotExist = async (supplierData) => {
  const existingSupplier = await Supplier.findOne({ name: supplierData.supplierName });
  if (!existingSupplier) {
    console.log("supplier with a give name doesnot exist")
    const supplierId = Math.floor(100000 + Math.random() * 900000);
    const newSupplier = new Supplier({ name: supplierData.supplierName, contact: supplierData.contact, address: supplierData.address, supplierId });
    await newSupplier.save();
    return supplierId
  }
  return existingSupplier.supplierId
};
const saveRawMaterial = async (rawMaterialData) => {
  console.log("we are in the save rawmaterialblock");
  let { rawMaterialName, type, weight, price, description, formattedDate, supplierId } = rawMaterialData;
  if (!rawMaterialName) {
    rawMaterialName = 'Define In CRM'
  }
  if (!type) {
    type = "Define In CRM"
  }
  if (!weight) {
    weight = "Define In CRM"
  }
  if (!price) {
    price = "Define In CRM"
  }
  if (!description) {
    description = "Define In CRM"
  }
  //first we are checking raw material with same name exist or not
  const existingRawMaterial = await RawMaterial.findOne({ name: rawMaterialData.rawMaterialName });
  // if (!existingRawMaterial) {
  //   const newRawMaterial = new RawMaterial({ name: rawMaterialName, type, initialWeight: weight, price, description, initialStockDate: formattedDate, supplierId });
  //   await newRawMaterial.save();
  //   return "new Raw Material saved successfully!!"
  // } else  // we commented this parabecause we dont want to save a new raw material with "DefineIn CRM" name as it is unchangeable
  if (existingRawMaterial) {
    const updatedRawMaterial = await RawMaterial.findOneAndUpdate(
      { name: rawMaterialData.rawMaterialName },
      { $set: { lastStockDate: formattedDate, currentWight: weight, price } },
      { new: true }
    );
    console.log("updatedRawmaterial", updatedRawMaterial);
    return "existing raw material has been updated successfully!!"
  }
  return "Supplier and Bill has been added!!"
};

const extractInfoFromSupplierBill = async (req, res, media, mediaFormat) => {
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


  console.log("mediaurl checking", media)
  if (!mediaFormat?.includes("image/"))
    return "Invalid media format";


  try {
    const imageBuffer = await fetchImageBuffer(media);
    const extractedText = await getTextFromImage(imageBuffer);
    const {
      supplierName,
      address,
      contact,
      rawMaterialName,
      type,
      weight,
      price,
      description,
    } = await extractEntities(extractedText);
    //here we are checking the entities came here is right or not if not then it will throw the error to scan the bill again.
    if (!supplierName) return "Make sure the supplier Name is correctly visible."
    //first we are saving the image buffer to the google firebase bucket we are writing the logic here because we have to save date and supplier name in the name of the file`

    const date = new Date();





    // Format the date as a string in the desired format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate);

    let fileNameToSave = `suppfrom-${req.body.From}-${supplierName}-${formattedDate}.${mediaFormat}`
    fileNameToSave = fileNameToSave.replace("image/", "");
    fileNameToSave = fileNameToSave.replace("/", "");
    fileNameToSave = fileNameToSave.replace("/", "");
    console.log("filenametosave", fileNameToSave)
    //here we are sending the filename and imagebuffer to the aestra1server to upload the image
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
      const supplierId = await saveSupplierIfNotExist({ supplierName, address, contact });
      const message = await saveRawMaterial({
        rawMaterialName,
        type,
        weight,
        price, formattedDate,
        description, supplierId
      });
      return `${message}`;
    }
    if (response.status === 400) return response.data;
    if (response.status === 500) return response.data;
  } catch (error) {
    console.log("Error in extractInfoFromBill:", error.message);
    return "We cannot proceed with the operation. please try again later!";
  }
};

module.exports = extractInfoFromSupplierBill;
