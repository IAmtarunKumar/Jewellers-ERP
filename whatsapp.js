// const EventSource = require("eventsource");
const dotenv = require("dotenv");
dotenv.config();
// const admin = require("firebase-admin");
const { Configuration, OpenAIApi } = require("openai");
// const { MongoClient } = require("mongodb");  //delete it later after commenting
const { PineconeClient } = require("@pinecone-database/pinecone");
const axios = require("axios");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = require("twilio");
const twilioClient = twilio(accountSid, authToken);
const extractTextFromAudioMessage = require("./controllers/whatsappControllers/extractTextFromAudioMessage");
const { User } = require("./models/user");
const get_top_intent = require("./controllers/whatsappControllers/Top_Intent");
const {
  checkSentimentAnalysis,
} = require("./controllers/whatsappControllers/sentiment_analysis");
const securityAndPrivacy = require("./controllers/whatsappControllers/security");
const registerUser = require("./controllers/whatsappControllers/registerUser");
const extractInfoFromSupplierBill = require("./controllers/whatsappControllers/extractInfoFromSupplierBill");
const extractInfoFromVendorChallan = require("./controllers/whatsappControllers/extractInfoFromVendorChallan");
const addingRepairs = require("./controllers/whatsappControllers/addingRepairs");
const addingAppraisals = require("./controllers/whatsappControllers/addingAppraisals");
const addingHallmark = require("./controllers/whatsappControllers/addingHallmark");
const addingCustomOrder = require("./controllers/whatsappControllers/addingCustomOrder");
const splitFunction = require("./utils/splitFunction");
const addingSuppliers = require("./controllers/whatsappControllers/adding_suppliers");
const addingVendor = require("./controllers/whatsappControllers/adding_vendor");
const addingProduct = require("./controllers/whatsappControllers/adding_product");
const addingCustomer = require("./controllers/whatsappControllers/adding_customer");
const addingHallMarkCenter = require("./controllers/whatsappControllers/adding_hallmark_center");
const addingSale = require("./controllers/whatsappControllers/adding_sale");
const makingSale = require("./controllers/whatsappControllers/making_sale");
const creatingBusinessMeetings = require("./controllers/whatsappControllers/creatingBusinessMeetings");
const MessagingResponse = require("twilio").twiml.MessagingResponse;



async function Whatsapp(req, res) {


  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  // const userMessage = req.body.Body;
  let media = req.body.MediaUrl0;
  const mediaFormat = req.body.MediaContentType0;
  let userMessage = req.body.Body;
  console.log("usermessagehere", userMessage);
  const smallUserMessage = userMessage;
  const sessionId = req.body.From;

  // const uri = process.env.MONGODB_URI;  //we commented this code because we are using the mongoose method later we can delete it

  // const client = new MongoClient(uri, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });
  // const User = client.db("aestra-organisation").User("users");
  const pinecone = new PineconeClient();
  await pinecone.init({
    environment: "gcp-starter",
    apiKey: "82e8981f-8da7-4b19-8e3c-10bc444104f9",
  });

  // Search for a user based on their unique ID
  let user = await User.findOne({ sessionId });
  console.log("user that came", user);

  // Check if the user exists
  if (!user) {
    if (!userMessage.includes("Name")) {
      const twiml = new MessagingResponse();
      // twiml.message(
      //   "AESTRA:\n\nThank you!\nBut you're not registered with us yet\nKindly provide your details for registration \n1) Name:\n2) Email ID:\n3) Phone no:"
      // );
      twiml.message(
        "AESTRA:\n\nThank you!\nBut you're not registered with us yet\nKindly register as an employee with your details on our CRM page\n\nhttps://crm-dashboard-git-aestrajewellers-nexgenauth.vercel.app"
      );
      res.writeHead(200, { "Content-Type": "text/xml" });
      res.end(twiml.toString());
      return;
    }
    let name, email, mobile, calendarId, gituserName;

    // const data = await axios.post("http://139.84.168.68:8080/get-entity", {
    //   entities: ["name", "email", "mobile"],
    //   text: userMessage,
    // });
    // console.log(data.data.openai.items);
    // if (data.data.openai.items[0].category === "name")
    //   name = data.data.openai.items[0].entity;
    // if (data.data.openai.items[1].category === "email")
    //   email = data.data.openai.items[1].entity;
    // if (data.data.openai.items[2].category === "mobile")
    //   mobile = data.data.openai.items[2].entity;
    //
    //
    // const options = {
    //   method: "POST",
    //   url: "https://ai-textraction.p.rapidapi.com/textraction",
    //   headers: {
    //     'content-type': 'application/json',
    //     'X-RapidAPI-Key': process.env.RAPIDAPI_KEY_1,
    //     'X-RapidAPI-Host': 'ai-textraction.p.rapidapi.com'
    //   },
    //   data: {
    //     text: userMessage,
    //     entities: [
    //       {
    //         var_name: "name",
    //         type: "string",
    //         description: "name of the person",
    //       },
    //       {
    //         var_name: "email",
    //         type: "string",
    //         description: "email of the person",
    //       },
    //       {
    //         var_name: "mobile",
    //         type: "string",
    //         description: "Phone number of the person",
    //       },
    //     ],
    //   },
    // };

    // try {
    //   const response = await axios.request(options);
    //   console.log("response of openai", response.data);
    //   name = response.data.results.name;
    //   email = response.data.results.email;
    //   mobile = response.data.results.mobile;
    // } catch (error) {
    //   console.error(error);
    // }
    // //
    // //
    // console.log(name, email, mobile);
    // await registerUser(sessionId, name, email, mobile);
    // user = await User.findOne({ sessionId });

    // const twiml = new MessagingResponse();
    // twiml.message(
    //   `Thank you for registering! By registering with AESTRA:JEWELLERS, you'll get personalized assistance, faster response times, and access to exclusive features and and you have agreed to our terms and conditions for Fair Use of this Product/Service. Please Wait for sometime we are setting up your personal AI.`,
    //   {
    //     to: `whatsapp:${req.body.From}`,
    //     from: `whatsapp:${req.body.To}`,
    //   }
    // );
    // twiml.message(
    //   `Hello ${user.name},\nAESTRA:JEWELLERS Your Personal AI Assistant is ready to go.\nI'm here to assist you with exciting features included for an easy going\n\n1. Supplier Bill Management\n2. Vendor Challan Management\n3. Customer Invoice Management\n4. Hallmarked Jewellery management\n5. Repair Management\n6. Appraisal Management\n7. Custom Order Management`
    // );
    // // twiml.messsage(
    // //   '🚧 AESTRA is currently in testing phase. If you encounter any errors, please send a screenshot to AESTRA and name it as "error-(featurename)". Thank you! 🙏'
    // // );
    // res.writeHead(200, { "Content-Type": "text/xml" });
    // res.end(twiml.toString());
    return;
  } else {
    let newUser = await User.findOne({ sessionId });
    const continueBlockFlag = newUser.continueBlockFlag;

    if (mediaFormat === "audio/ogg") {
      //get the text out of the audio message
      const response = await extractTextFromAudioMessage(
        media,
        mediaFormat,
        sessionId
      );
      userMessage = response;
      //userMessage = 'hello';
      //making media false so that it dont go inside media storage feature.
      media = false;
    }

    console.log("hi");
    let top_intent = {};
    if (!continueBlockFlag && !media) {
      console.log("Generating TOP INTENT");
      top_intent = await get_top_intent(userMessage);
      console.log("TOP-Intentabc", top_intent);
    }
    // top_intent.score = 0.85; //commment this when done testing
    if (
      continueBlockFlag ||
      media ||
      top_intent.score > 0.845 ||  //earlier in every chatbot we used it as 0.83 but here in saying hello as well it is going in schedule meetings
      checkSentimentAnalysis(userMessage) === "Yes" ||
      userMessage.startsWith("https://www.youtube.com/watch")
    ) {
      if (continueBlockFlag) {
        top_intent.id = newUser.continueBlock_top_intent; //--> make update in schema
      } else if (checkSentimentAnalysis(userMessage) === "Yes") {
        top_intent.id = "sentiment_analysis";
      }
      if (userMessage === "start") {
        top_intent.id = "activity_report";
      }
      if (userMessage.startsWith("https://www.youtube.com/watch")) {
        top_intent.id = "summary";
      }
      // top_intent.id = "supplier_bill_upload"
      console.log("top_intent", top_intent);
      switch (top_intent.id) {
        case "add_supplier": {
          console.log("inside add supplier");
          await User.updateOne(
            { sessionId },
            {
              $set: {
                continueBlockFlag: true,
                continueBlock_top_intent: "add_supplier",
              },
            }
          );
          const stepNumber = newUser.continueBlock_step;
          console.log("stepnumber", stepNumber);
          switch (stepNumber) {
            case 1: {
              console.log("entered step 1");
              //           name: { type: String, required: true },
              // contact: { type: String, required: true },
              // address
              const twiml = new MessagingResponse();
              twiml.message(
                `AESTRA: Please upload the following information to add the supplier in the list.\n\n~Name:\n~Address:\n~Contact:`,
                {
                  to: `whatsapp:${req.body.From}`,
                  from: `whatsapp:${req.body.To}`,
                }
              );
              res.writeHead(200, { "Content-Type": "text/xml" });
              res.end(twiml.toString());
              console.log("message send");
              //update step number in schema.
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 2,
                  },
                }
              );
              console.log("getting out of first step");
              return;
            }
            case 2: {
              console.log("inside step 2");
              console.log("before waiting");
              //twilioClient.messages
              //      .create({
              //      body: `AESTRA: Wait while we are processing your report..`,
              //    from: `whatsapp:${req.body.To}`,
              //  to: `whatsapp:${req.body.From}`,
              // })
              console.log("after waiting");

              const response = await addingSuppliers(
                req,
                res,
                sessionId,
                userMessage,
              );
              if (response) {
                console.log(
                  "response from extractinfofrom supplier bill in whatsapp file",
                  response
                );
                const twiml = new MessagingResponse();
                twiml.message(
                  `AESTRA: ${response}`,
                  {
                    to: `whatsapp:${req.body.From}`,
                    from: `whatsapp:${req.body.To}`,
                  }
                );
                res.writeHead(200, { "Content-Type": "text/xml" });
                res.end(twiml.toString());
              }
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 1,
                    continueBlockFlag: false,
                    continueBlock_top_intent: null,
                  },
                }
              );
              return;
            }
            default: {
              //update step to 1
              //update users schema for continueBlock_top_intent->null and flag->false
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 1,
                    continueBlockFlag: false,
                    continueBlock_top_intent: null,
                  },
                }
              );
              return;
            }
          }
        }
        case "add_vendor": {
          console.log("inside add vendor");
          await User.updateOne(
            { sessionId },
            {
              $set: {
                continueBlockFlag: true,
                continueBlock_top_intent: "add_vendor",
              },
            }
          );
          const stepNumber = newUser.continueBlock_step;
          console.log("stepnumber", stepNumber);
          switch (stepNumber) {
            case 1: {
              console.log("entered step 1");
              const twiml = new MessagingResponse();
              twiml.message(
                `AESTRA: Please upload the following information to add the supplier in the list.\n\n~Name:\n~Address:\n~Contact:`,
                {
                  to: `whatsapp:${req.body.From}`,
                  from: `whatsapp:${req.body.To}`,
                }
              );
              res.writeHead(200, { "Content-Type": "text/xml" });
              res.end(twiml.toString());
              console.log("message send");
              //update step number in schema.
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 2,
                  },
                }
              );
              console.log("getting out of first step");
              return;
            }
            case 2: {
              console.log("inside step 2");
              console.log("before waiting");
              //twilioClient.messages
              //      .create({
              //      body: `AESTRA: Wait while we are processing your report..`,
              //    from: `whatsapp:${req.body.To}`,
              //  to: `whatsapp:${req.body.From}`,
              // })
              console.log("after waiting");

              const response = await addingVendor(
                req,
                res,
                sessionId,
                userMessage,
              );
              if (response) {
                console.log(
                  "response from extractinfo from supplier bill in whatsapp file",
                  response
                );
                const twiml = new MessagingResponse();
                twiml.message(
                  `AESTRA: ${response}`,
                  {
                    to: `whatsapp:${req.body.From}`,
                    from: `whatsapp:${req.body.To}`,
                  }
                );
                res.writeHead(200, { "Content-Type": "text/xml" });
                res.end(twiml.toString());
              }
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 1,
                    continueBlockFlag: false,
                    continueBlock_top_intent: null,
                  },
                }
              );
              return;
            }
            default: {
              //update step to 1
              //update users schema for continueBlock_top_intent->null and flag->false
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 1,
                    continueBlockFlag: false,
                    continueBlock_top_intent: null,
                  },
                }
              );
              return;
            }
          }
        }
        case "add_product": {
          console.log("inside add Product");
          await User.updateOne(
            { sessionId },
            {
              $set: {
                continueBlockFlag: true,
                continueBlock_top_intent: "add_product",
              },
            }
          );
          const stepNumber = newUser.continueBlock_step;
          console.log("stepnumber", stepNumber);
          switch (stepNumber) {
            case 1: {
              console.log("entered step 1");
              const twiml = new MessagingResponse();
              twiml.message(
                `AESTRA: Please upload the following information to add the supplier in the list.\n\n~Product Name:\n~Material:\n~Price:\n~Purity:\n~Weight:\n~Gems Stones:\n~Type:\n~SKU:\n~Description:\n~Design:\n~Size:\n~Initial Stock:`,
                {
                  to: `whatsapp:${req.body.From}`,
                  from: `whatsapp:${req.body.To}`,
                }
              );
              res.writeHead(200, { "Content-Type": "text/xml" });
              res.end(twiml.toString());
              console.log("message send");
              //update step number in schema.
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 2,
                  },
                }
              );
              console.log("getting out of first step");
              return;
            }
            case 2: {
              console.log("inside step 2");
              console.log("before waiting");
              //twilioClient.messages
              //      .create({
              //      body: `AESTRA: Wait while we are processing your report..`,
              //    from: `whatsapp:${req.body.To}`,
              //  to: `whatsapp:${req.body.From}`,
              // })
              console.log("after waiting");

              const response = await addingProduct(
                req,
                res,
                sessionId,
                userMessage,
              );
              if (response) {
                console.log(
                  "response from extractinfofrom supplier bill in whatsapp file",
                  response
                );
                const twiml = new MessagingResponse();
                twiml.message(
                  `AESTRA: ${response}`,
                  {
                    to: `whatsapp:${req.body.From}`,
                    from: `whatsapp:${req.body.To}`,
                  }
                );
                res.writeHead(200, { "Content-Type": "text/xml" });
                res.end(twiml.toString());
              }
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 1,
                    continueBlockFlag: false,
                    continueBlock_top_intent: null,
                  },
                }
              );
              return;
            }
            default: {
              //update step to 1
              //update users schema for continueBlock_top_intent->null and flag->false
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 1,
                    continueBlockFlag: false,
                    continueBlock_top_intent: null,
                  },
                }
              );
              return;
            }
          }
        }
        case "add_customer": {
          console.log("inside add customer");
          await User.updateOne(
            { sessionId },
            {
              $set: {
                continueBlockFlag: true,
                continueBlock_top_intent: "add_customer",
              },
            }
          );
          const stepNumber = newUser.continueBlock_step;
          console.log("stepnumber", stepNumber);
          switch (stepNumber) {
            case 1: {
              console.log("entered step 1");
              const twiml = new MessagingResponse();
              twiml.message(
                `AESTRA: Please upload the following information to add the supplier in the list.\n\n~Name:\n~Address:\n~Contact:`,
                {
                  to: `whatsapp:${req.body.From}`,
                  from: `whatsapp:${req.body.To}`,
                }
              );
              res.writeHead(200, { "Content-Type": "text/xml" });
              res.end(twiml.toString());
              console.log("message send");
              //update step number in schema.
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 2,
                  },
                }
              );
              console.log("getting out of first step");
              return;
            }
            case 2: {
              console.log("inside step 2");
              console.log("before waiting");
              //twilioClient.messages
              //      .create({
              //      body: `AESTRA: Wait while we are processing your report..`,
              //    from: `whatsapp:${req.body.To}`,
              //  to: `whatsapp:${req.body.From}`,
              // })
              console.log("after waiting");

              const response = await addingCustomer(
                req,
                res,
                sessionId,
                userMessage,
              );
              if (response) {
                console.log(
                  "response from extractinfofrom supplier bill in whatsapp file",
                  response
                );
                const twiml = new MessagingResponse();
                twiml.message(
                  `AESTRA: ${response}`,
                  {
                    to: `whatsapp:${req.body.From}`,
                    from: `whatsapp:${req.body.To}`,
                  }
                );
                res.writeHead(200, { "Content-Type": "text/xml" });
                res.end(twiml.toString());
              }
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 1,
                    continueBlockFlag: false,
                    continueBlock_top_intent: null,
                  },
                }
              );
              return;
            }
            default: {
              //update step to 1
              //update users schema for continueBlock_top_intent->null and flag->false
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 1,
                    continueBlockFlag: false,
                    continueBlock_top_intent: null,
                  },
                }
              );
              return;
            }
          }
        }
        case "add_hallmark_center": {
          console.log("inside add supplier");
          await User.updateOne(
            { sessionId },
            {
              $set: {
                continueBlockFlag: true,
                continueBlock_top_intent: "add_hallmark_center",
              },
            }
          );
          const stepNumber = newUser.continueBlock_step;
          console.log("stepnumber", stepNumber);
          switch (stepNumber) {
            case 1: {
              console.log("entered step 1");
              const twiml = new MessagingResponse();
              twiml.message(
                `AESTRA: Please upload the following information to add the supplier in the list.\n\n~Center Name:\n~Address:\n~Contact:\n~Email:\n~Authorized By:`,
                {
                  to: `whatsapp:${req.body.From}`,
                  from: `whatsapp:${req.body.To}`,
                }
              );
              res.writeHead(200, { "Content-Type": "text/xml" });
              res.end(twiml.toString());
              console.log("message send");
              //update step number in schema.
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 2,
                  },
                }
              );
              console.log("getting out of first step");
              return;
            }
            case 2: {
              console.log("inside step 2");
              console.log("before waiting");
              //twilioClient.messages
              //      .create({
              //      body: `AESTRA: Wait while we are processing your report..`,
              //    from: `whatsapp:${req.body.To}`,
              //  to: `whatsapp:${req.body.From}`,
              // })
              console.log("after waiting");

              const response = await addingHallMarkCenter(
                req,
                res,
                sessionId,
                userMessage,
              );
              if (response) {
                console.log(
                  "response from extractinfofrom user",
                  response
                );
                const twiml = new MessagingResponse();
                twiml.message(
                  `AESTRA: ${response}`,
                  {
                    to: `whatsapp:${req.body.From}`,
                    from: `whatsapp:${req.body.To}`,
                  }
                );
                res.writeHead(200, { "Content-Type": "text/xml" });
                res.end(twiml.toString());
              }
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 1,
                    continueBlockFlag: false,
                    continueBlock_top_intent: null,
                  },
                }
              );
              return;
            }
            default: {
              //update step to 1
              //update users schema for continueBlock_top_intent->null and flag->false
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 1,
                    continueBlockFlag: false,
                    continueBlock_top_intent: null,
                  },
                }
              );
              return;
            }
          }
        }
        case "make_sale": {
          console.log("inside add supplier");
          await User.updateOne(
            { sessionId },
            {
              $set: {
                continueBlockFlag: true,
                continueBlock_top_intent: "make_sale",
              },
            }
          );
          const stepNumber = newUser.continueBlock_step;
          console.log("stepnumber", stepNumber);
          switch (stepNumber) {
            case 1: {
              console.log("entered step 1");
              const twiml = new MessagingResponse();
              twiml.message(
                `AESTRA: Please upload the following information to add the supplier in the list.\n\n~Customer Id:\n~Product Id:\n~Sale Date:\n~Quantity:`,
                {
                  to: `whatsapp:${req.body.From}`,
                  from: `whatsapp:${req.body.To}`,
                }
              );
              res.writeHead(200, { "Content-Type": "text/xml" });
              res.end(twiml.toString());
              console.log("message send");
              //update step number in schema.
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 2,
                  },
                }
              );
              console.log("getting out of first step");
              return;
            }
            case 2: {
              console.log("inside step 2");
              console.log("before waiting");
              //twilioClient.messages
              //      .create({
              //      body: `AESTRA: Wait while we are processing your report..`,
              //    from: `whatsapp:${req.body.To}`,
              //  to: `whatsapp:${req.body.From}`,
              // })
              console.log("after waiting");

              const response = await makingSale(
                req,
                res,
                sessionId,
                userMessage,
              );
              if (response) {
                console.log(
                  "response from extractinfofrom supplier bill in whatsapp file",
                  response
                );
                const twiml = new MessagingResponse();
                twiml.message(
                  `AESTRA: ${response}`,
                  {
                    to: `whatsapp:${req.body.From}`,
                    from: `whatsapp:${req.body.To}`,
                  }
                );
                res.writeHead(200, { "Content-Type": "text/xml" });
                res.end(twiml.toString());
              }
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 1,
                    continueBlockFlag: false,
                    continueBlock_top_intent: null,
                  },
                }
              );
              return;
            }
            default: {
              //update step to 1
              //update users schema for continueBlock_top_intent->null and flag->false
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 1,
                    continueBlockFlag: false,
                    continueBlock_top_intent: null,
                  },
                }
              );
              return;
            }
          }
        }
        case "add_sale": {
          console.log("inside add supplier");
          await User.updateOne(
            { sessionId },
            {
              $set: {
                continueBlockFlag: true,
                continueBlock_top_intent: "add_sale",
              },
            }
          );
          const stepNumber = newUser.continueBlock_step;
          console.log("stepnumber", stepNumber);
          switch (stepNumber) {
            case 1: {
              console.log("entered step 1");
              const twiml = new MessagingResponse();
              twiml.message(
                `AESTRA: Please upload the following information to add the supplier in the list.\n\n~Customer Id:\n~Product Id:\n~Sale Date:\n~Quantity:`,
                {
                  to: `whatsapp:${req.body.From}`,
                  from: `whatsapp:${req.body.To}`,
                }
              );
              res.writeHead(200, { "Content-Type": "text/xml" });
              res.end(twiml.toString());
              console.log("message send");
              //update step number in schema.
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 2,
                  },
                }
              );
              console.log("getting out of first step");
              return;
            }
            case 2: {
              console.log("inside step 2");
              console.log("before waiting");
              //twilioClient.messages
              //      .create({
              //      body: `AESTRA: Wait while we are processing your report..`,
              //    from: `whatsapp:${req.body.To}`,
              //  to: `whatsapp:${req.body.From}`,
              // })
              console.log("after waiting");

              const response = await addingSale(
                req,
                res,
                sessionId,
                userMessage,
              );
              if (response) {
                console.log(
                  "response from extractinfofrom supplier bill in whatsapp file",
                  response
                );
                const twiml = new MessagingResponse();
                twiml.message(
                  `AESTRA: ${response}`,
                  {
                    to: `whatsapp:${req.body.From}`,
                    from: `whatsapp:${req.body.To}`,
                  }
                );
                res.writeHead(200, { "Content-Type": "text/xml" });
                res.end(twiml.toString());
              }
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 1,
                    continueBlockFlag: false,
                    continueBlock_top_intent: null,
                  },
                }
              );
              return;
            }
            default: {
              //update step to 1
              //update users schema for continueBlock_top_intent->null and flag->false
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 1,
                    continueBlockFlag: false,
                    continueBlock_top_intent: null,
                  },
                }
              );
              return;
            }
          }
        }
        case "supplier_bill_upload": {
          console.log("inside extract info from image");
          await User.updateOne(
            { sessionId },
            {
              $set: {
                continueBlockFlag: true,
                continueBlock_top_intent: "supplier_bill_upload",
              },
            }
          );
          const stepNumber = newUser.continueBlock_step;
          console.log("stepnumber", stepNumber);
          switch (stepNumber) {
            case 1: {
              console.log("entered step 1");
              const twiml = new MessagingResponse();
              twiml.message(
                `AESTRA: Please upload the bill for reviewing.`,
                {
                  to: `whatsapp:${req.body.From}`,
                  from: `whatsapp:${req.body.To}`,
                }
              );
              res.writeHead(200, { "Content-Type": "text/xml" });
              res.end(twiml.toString());
              console.log("message send");
              //update step number in schema.
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 2,
                  },
                }
              );
              console.log("getting out of first step");
              return;
            }
            case 2: {
              console.log("inside step 2");
              console.log("before waiting");
              //twilioClient.messages
              //      .create({
              //      body: `AESTRA: Wait while we are processing your report..`,
              //    from: `whatsapp:${req.body.To}`,
              //  to: `whatsapp:${req.body.From}`,
              // })
              console.log("after waiting");

              const response = await extractInfoFromSupplierBill(
                req,
                res,
                media,
                mediaFormat,
                sessionId,
                stepNumber
              );
              if (response) {
                console.log(
                  "response from extractinfofrom supplier bill in whatsapp file",
                  response
                );
                const twiml = new MessagingResponse();
                twiml.message(
                  `AESTRA: ${response}`,
                  {
                    to: `whatsapp:${req.body.From}`,
                    from: `whatsapp:${req.body.To}`,
                  }
                );
                res.writeHead(200, { "Content-Type": "text/xml" });
                res.end(twiml.toString());
              }
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 1,
                    continueBlockFlag: false,
                    continueBlock_top_intent: null,
                  },
                }
              );
              return;
            }
            default: {
              //update step to 1
              //update users schema for continueBlock_top_intent->null and flag->false
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 1,
                    continueBlockFlag: false,
                    continueBlock_top_intent: null,
                  },
                }
              );
              return;
            }
          }
        }
        case "vendor_challan_upload": {
          console.log("inside extract info from image");
          await User.updateOne(
            { sessionId },
            {
              $set: {
                continueBlockFlag: true,
                continueBlock_top_intent: "vendor_challan_upload",
              },
            }
          );
          const stepNumber = newUser.continueBlock_step;
          console.log("stepnumber", stepNumber);
          switch (stepNumber) {
            case 1: {
              console.log("entered step 1");
              const twiml = new MessagingResponse();
              twiml.message(
                `AESTRA: Please upload the Challan for reviewing.`,
                {
                  to: `whatsapp:${req.body.From}`,
                  from: `whatsapp:${req.body.To}`,
                }
              );
              res.writeHead(200, { "Content-Type": "text/xml" });
              res.end(twiml.toString());
              console.log("message send");
              //update step number in schema.
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 2,
                  },
                }
              );
              console.log("getting out of first step");
              return;
            }
            case 2: {
              console.log("inside step 2");
              console.log("before waiting");
              //twilioClient.messages
              //      .create({
              //      body: `AESTRA: Wait while we are processing your report..`,
              //    from: `whatsapp:${req.body.To}`,
              //  to: `whatsapp:${req.body.From}`,
              // })
              console.log("after waiting");

              const response = await extractInfoFromVendorChallan(
                req,
                res,
                media,
                mediaFormat,
                sessionId,
                stepNumber
              );
              if (response) {
                console.log(
                  "response from extractinfofrom vendor challan in whatsapp file",
                  response
                );
                const twiml = new MessagingResponse();
                twiml.message(
                  `AESTRA: ${response}`,
                  {
                    to: `whatsapp:${req.body.From}`,
                    from: `whatsapp:${req.body.To}`,
                  }
                );
                res.writeHead(200, { "Content-Type": "text/xml" });
                res.end(twiml.toString());
              }

              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 1,
                    continueBlockFlag: false,
                    continueBlock_top_intent: null,
                  },
                }
              );
              return;
            }
            default: {
              //update step to 1
              //update users schema for continueBlock_top_intent->null and flag->false
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 1,
                    continueBlockFlag: false,
                    continueBlock_top_intent: null,
                  },
                }
              );
              return;
            }
          }
        }
        case "repair_list_update": {
          console.log("inside repair list update");
          await User.updateOne(
            { sessionId },
            {
              $set: {
                continueBlockFlag: true,
                continueBlock_top_intent: "repair_list_update",
              },
            }
          );
          const stepNumber = newUser.continueBlock_step;
          console.log("stepnumber", stepNumber);
          switch (stepNumber) {
            case 1: {
              console.log("entered step 1");
              const twiml = new MessagingResponse();
              twiml.message(
                `AESTRA: Please upload the following information to update the data in repairs list.\n\n~Product ID:\n~Customer ID:\n~Issue description:\n~Repair Date:\n~Expected return Date:\n~Repair Cost\n\nIf there is a new customer or new product then you can ignore:\n~Product ID\n~Customer ID\nand you can provide\n~Product Name:\n~Product Description:\n~Customer Name:\n~Customer address:\n~Customer Contact:`,
                {
                  to: `whatsapp:${req.body.From}`,
                  from: `whatsapp:${req.body.To}`,
                }
              );
              res.writeHead(200, { "Content-Type": "text/xml" });
              res.end(twiml.toString());
              console.log("message send");
              //update step number in schema.
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 2,
                  },
                }
              );
              console.log("getting out of first step");
              return;
            }
            case 2: {
              console.log("inside step 2");
              console.log("before waiting");
              //twilioClient.messages
              //      .create({
              //      body: `AESTRA: Wait while we are processing your report..`,
              //    from: `whatsapp:${req.body.To}`,
              //  to: `whatsapp:${req.body.From}`,
              // })
              console.log("after waiting");

              const response = await addingRepairs(
                req,
                res,
                sessionId,
                userMessage
              );
              console.log(
                "response from addingRepairs in whatsapp file",
                response
              );
              if (response) {
                const twiml = new MessagingResponse();
                twiml.message(`AESTRA: ${response}`, {
                  to: `whatsapp:${req.body.From}`,
                  from: `whatsapp:${req.body.To}`,
                });

                res.writeHead(200, { "Content-Type": "text/xml" });
                res.end(twiml.toString());
              }
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 1,
                    continueBlockFlag: false,
                    continueBlock_top_intent: null,
                  },
                }
              );
              return;
            }
            default: {
              //update step to 1
              //update users schema for continueBlock_top_intent->null and flag->false
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 1,
                    continueBlockFlag: false,
                    continueBlock_top_intent: null,
                  },
                }
              );
              return;
            }
          }
        }
        case "appraisals_list_update": {
          console.log("inside appraisal list update");
          await User.updateOne(
            { sessionId },
            {
              $set: {
                continueBlockFlag: true,
                continueBlock_top_intent: "appraisals_list_update",
              },
            }
          );
          const stepNumber = newUser.continueBlock_step;
          console.log("stepnumber", stepNumber);
          switch (stepNumber) {
            case 1: {
              console.log("entered step 1");
              const twiml = new MessagingResponse();
              twiml.message(
                `AESTRA: Please upload the following information to update the data in appraisals list.\n\n~Product ID:\n~Customer ID:\n~Appraised Value:\n~Appraisal Date:\n\nIf there is a new customer or new product then you can ignore:\n~Product ID\n~Customer ID\nand you can provide\n~Product Name:\n~Product Description:\n~Customer Name:\n~Customer address:\n~Customer Contact:`,
                {
                  to: `whatsapp:${req.body.From}`,
                  from: `whatsapp:${req.body.To}`,
                }
              );
              res.writeHead(200, { "Content-Type": "text/xml" });
              res.end(twiml.toString());
              console.log("message send");
              //update step number in schema.
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 2,
                  },
                }
              );
              console.log("getting out of first step");
              return;
            }
            case 2: {
              console.log("inside step 2");
              console.log("before waiting");
              //twilioClient.messages
              //      .create({
              //      body: `AESTRA: Wait while we are processing your report..`,
              //    from: `whatsapp:${req.body.To}`,
              //  to: `whatsapp:${req.body.From}`,
              // })
              console.log("after waiting");

              const response = await addingAppraisals(
                req,
                res,
                sessionId,
                userMessage
              );
              console.log(
                "response from addingRepairs in whatsapp file",
                response
              );
              if (response) {
                const twiml = new MessagingResponse();
                twiml.message(`AESTRA: ${response}`, {
                  to: `whatsapp:${req.body.From}`,
                  from: `whatsapp:${req.body.To}`,
                });

                res.writeHead(200, { "Content-Type": "text/xml" });
                res.end(twiml.toString());
              }
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 1,
                    continueBlockFlag: false,
                    continueBlock_top_intent: null,
                  },
                }
              );
              return;
            }
            default: {
              //update step to 1
              //update users schema for continueBlock_top_intent->null and flag->false
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 1,
                    continueBlockFlag: false,
                    continueBlock_top_intent: null,
                  },
                }
              );
              return;
            }
          }
        }
        case "hallmark_list_update": {
          console.log("inside hallmark list update");
          await User.updateOne(
            { sessionId },
            {
              $set: {
                continueBlockFlag: true,
                continueBlock_top_intent: "hallmark_list_update",
              },
            }
          );
          const stepNumber = newUser.continueBlock_step;
          console.log("stepnumber", stepNumber);
          switch (stepNumber) {
            case 1: {
              console.log("entered step 1");
              const twiml = new MessagingResponse();
              twiml.message(
                `AESTRA: Please upload the following information to update the data in hallmark list.\n\n~Hallmark ID(HUID):\n~Product ID:\n~HallMark Center Id:\n~HallMark Date:\n~Purity:\n~Weight:\n~HallMark Logo:\n\n`,
                {
                  to: `whatsapp:${req.body.From}`,
                  from: `whatsapp:${req.body.To}`,
                }
              );
              res.writeHead(200, { "Content-Type": "text/xml" });
              res.end(twiml.toString());
              console.log("message send");
              //update step number in schema.
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 2,
                  },
                }
              );
              console.log("getting out of first step");
              return;
            }
            case 2: {
              console.log("inside step 2");
              console.log("before waiting");
              //twilioClient.messages
              //      .create({
              //      body: `AESTRA: Wait while we are processing your report..`,
              //    from: `whatsapp:${req.body.To}`,
              //  to: `whatsapp:${req.body.From}`,
              // })
              console.log("after waiting");

              const response = await addingHallmark(req, res, sessionId, userMessage);
              console.log(
                "response from addingHallmark in whatsapp file",
                response
              );
              if (response) {
                const twiml = new MessagingResponse();
                twiml.message(`AESTRA: ${response}`, {
                  to: `whatsapp:${req.body.From}`,
                  from: `whatsapp:${req.body.To}`,
                });

                res.writeHead(200, { "Content-Type": "text/xml" });
                res.end(twiml.toString());
              }
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 1,
                    continueBlockFlag: false,
                    continueBlock_top_intent: null,
                  },
                }
              );
              return;
            }
            default: {
              //update step to 1
              //update users schema for continueBlock_top_intent->null and flag->false
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 1,
                    continueBlockFlag: false,
                    continueBlock_top_intent: null,
                  },
                }
              );
              return;
            }
          }
        }
        case "custom_orders_update": {
          console.log("inside custom order update");
          await User.updateOne(
            { sessionId },
            {
              $set: {
                continueBlockFlag: true,
                continueBlock_top_intent: "custom_orders_update",
              },
            }
          );
          const stepNumber = newUser.continueBlock_step;
          console.log("stepnumber", stepNumber);
          switch (stepNumber) {
            case 1: {
              console.log("entered step 1");
              const twiml = new MessagingResponse();
              twiml.message(
                `AESTRA: Please upload the following information to update the data in custom order.\n\n~Customer ID:\n~Order Date:\n~Expected Completion Date:\n~Product Name:\n~Product Description:\n\nIf you dont have customer id then you can ignore:\n~Customer id\n and provide\n~Customer name:\n~Customer Address:\n~Customer Contact:`,
                {
                  to: `whatsapp:${req.body.From}`,
                  from: `whatsapp:${req.body.To}`,
                }
              );
              res.writeHead(200, { "Content-Type": "text/xml" });
              res.end(twiml.toString());
              console.log("message send");
              //update step number in schema.
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 2,
                  },
                }
              );
              console.log("getting out of first step");
              return;
            }
            case 2: {
              console.log("inside step 2");
              console.log("before waiting");
              //twilioClient.messages
              //      .create({
              //      body: `AESTRA: Wait while we are processing your report..`,
              //    from: `whatsapp:${req.body.To}`,
              //  to: `whatsapp:${req.body.From}`,
              // })
              console.log("after waiting");

              const response = await addingCustomOrder(
                req,
                res,
                sessionId,
                userMessage
              );
              console.log(
                "response from addingcustom order in whatsapp file",
                response
              );
              if (response) {
                const twiml = new MessagingResponse();
                twiml.message(`AESTRA: ${response}`, {
                  to: `whatsapp:${req.body.From}`,
                  from: `whatsapp:${req.body.To}`,
                });

                res.writeHead(200, { "Content-Type": "text/xml" });
                res.end(twiml.toString());
              }
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 1,
                    continueBlockFlag: false,
                    continueBlock_top_intent: null,
                  },
                }
              );
              return;
            }
            default: {
              //update step to 1
              //update users schema for continueBlock_top_intent->null and flag->false
              await User.updateOne(
                { sessionId },
                {
                  $set: {
                    continueBlock_step: 1,
                    continueBlockFlag: false,
                    continueBlock_top_intent: null,
                  },
                }
              );
              return;
            }
          }
        }
        case "schedule_meeting": {
          const message = await creatingBusinessMeetings(req, res, sessionId, userMessage, user);
          if (message) {
            const twiml = new MessagingResponse();
            twiml.message(`AESTRA: ${message}`, {
              to: `whatsapp:${req.body.From}`,
              from: `whatsapp:${req.body.To}`,
            });

            res.writeHead(200, { "Content-Type": "text/xml" });
            res.end(twiml.toString());
            return;
          } return;
        }
        case "security": {
          const message = await securityAndPrivacy();
          const twiml = new MessagingResponse();
          twiml.message(`AESTRA: ${message}`, {
            to: `whatsapp:${req.body.From}`,
            from: `whatsapp:${req.body.To}`,
          });

          res.writeHead(200, { "Content-Type": "text/xml" });
          res.end(twiml.toString());
          return;
        }
        default: {
          console.log("chat relavance try");
          try {
            console.log("chat relavanve inside try");
            try {
              console.log("chat relavanve inside try");
              const response = await axios.post(
                "http://aestra1.ocpl.tech:12501/api/chat",
                {
                  message: userMessage,
                  number: user.mobile,
                }
              );

              console.log("chat relavance response", response.data.response);

              splitFunction(req, res, response.data.response, user); // const twiml = new MessagingResponse();
              // twiml.message(`${response.data.response}`, {
              // to: `whatsapp:${req.body.From}`,
              //  from: `whatsapp:${req.body.To}`,
              // });

              //res.writeHead(200, { "Content-Type": "text/xml" });
              // res.end(twiml.toString());
            } catch (error) {
              console.error(error);
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    } else {
      console.log("chat relavance try");
      try {
        console.log("chat relavanve inside try");
        const response = await axios.post(
          "http://aestra1.ocpl.tech:12501/api/chat",
          {
            message: userMessage,
            number: user.mobile,
          }
        );

        console.log("chat relavance response", response.data.response);

        splitFunction(req, res, response.data.response, user); // const twiml = new MessagingResponse();
        // twiml.message(`${response.data.response}`, {
        // to: `whatsapp:${req.body.From}`,
        //  from: `whatsapp:${req.body.To}`,
        // });

        //res.writeHead(200, { "Content-Type": "text/xml" });
        // res.end(twiml.toString());
      } catch (error) {
        console.error(error);
      }
    }
  }
}

module.exports = Whatsapp;
