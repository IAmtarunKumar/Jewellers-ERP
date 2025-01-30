const fs = require("fs");
const axios = require("axios");
// const ffmpeg = require("fluent-ffmpeg");
// const ffmpegPath = require("ffmpeg-static");
const FormData = require("form-data");
const path = require("path");

async function convertToMp3(inputPath, outputPath, sessionId) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .format("mp3")
      .on("end", () => {
        console.log("OGG converted to MP3 successfully");
        resolve();
      })
      .on("error", (error) => {
        console.error("Error during conversion:", error.message);
        reject(error);
      })
      .run();
  });
}

async function makeApiCall(form) {
  const options = {
    method: "POST",
    url: "https://api.edenai.run/v2/audio/speech_to_text_async",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZDYyYjNlNzctYzYwNC00OGVjLTk5M2QtNGJhNDdhZjBiY2IzIiwidHlwZSI6ImFwaV90b2tlbiJ9.xB92n0eg43MwHevGRgix39kcCr-u0kHVVVgpazSeRjc",
      "Content-Type": "multipart/form-data; boundary=" + form.getBoundary(),
    },
    data: form,
  };

  const response = await axios.request(options);
  console.log("Public ID:", response.data.public_id);
  return response.data.public_id;
}

async function getTextFromPublicId(publicId) {
  const response = await axios.get(
    `https://api.edenai.run/v2/audio/speech_to_text_async/${publicId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZDYyYjNlNzctYzYwNC00OGVjLTk5M2QtNGJhNDdhZjBiY2IzIiwidHlwZSI6ImFwaV90b2tlbiJ9.xB92n0eg43MwHevGRgix39kcCr-u0kHVVVgpazSeRjc",
      },
    }
  );

  const data = response.data;
  return data.results.openai.text;
}

async function extractTextFromAudioMessage(media, mediaFormat, sessionId) {
  const folderPath = path.join(__dirname, "voice_messages");
  if (!fs.existsSync(folderPath)) {
    console.log("Folder does not exist, creating folder...");
    fs.mkdirSync(folderPath);
    console.log("Folder created successfully");
  } else {
    console.log("Folder already exists");
  }

  try {
    // Download the media file from the URL
    const TWILIO_ACCOUNT_SID = "AC5d9f317e7593afd84d5d1ee669bdee40";
    const TWILIO_AUTH_TOKEN = "7eddff3e6abb6e266612ca67102429e8";

    const axiosInstance = axios.create({
      auth: {
        username: TWILIO_ACCOUNT_SID,
        password: TWILIO_AUTH_TOKEN,
      },
    });
    console.log("url: ", media);
    const response = await axiosInstance.get(media, {
      responseType: "arraybuffer",
    });
    //console.log("response while downloading the file", response);
    const file_path = path.join(__dirname, `voice_messages/${sessionId}.ogg`);

    if (fs.existsSync(file_path)) {
      try {
        fs.unlinkSync(file_path);
        console.log(`File deleted: ${file_path}`);
      } catch (error) {
        console.error(`Error deleting file: ${error.message}`);
      }
    } else {
      console.log(`File does not exist: ${file_path}`);
    }

    // Save the media file to the specified file path
    fs.writeFileSync(file_path, Buffer.from(response.data));
    console.log(`Media file (${mediaFormat}) saved at ${file_path}`);

    ffmpeg.setFfmpegPath(ffmpegPath);

    const output_file_path = path.join(
      __dirname,
      `voice_messages/${sessionId}.mp3`
    );
    if (fs.existsSync(output_file_path)) {
      try {
        fs.unlinkSync(output_file_path);
        console.log(`File deleted: ${output_file_path}`);
      } catch (error) {
        console.error(`Error deleting file: ${error.message}`);
      }
    } else {
      console.log(`File does not exist: ${output_file_path}`);
    }

    // Convert OGG to MP3
    await convertToMp3(file_path, output_file_path);

    // Prepare the form for the API call
    const form = new FormData();
    form.append("providers", "assembly,openai");
    form.append("file", fs.createReadStream(output_file_path));
    form.append("language", "en");

    // Call the API
    const publicId = await makeApiCall(form);
    const extractedMessage = await getTextFromPublicId(publicId);
    console.log("extracted message", extractedMessage);
    return extractedMessage;
  } catch (error) {
    console.error("Error:", error.message);
    //we have to do something while error occurs in extracting text
  }
}

module.exports = extractTextFromAudioMessage;
