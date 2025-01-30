const express = require("express");
const serverless = require("serverless-http");

const Db = require("./utils/db");
const Port = require("./utils/port");
const admin = require("firebase-admin");
const multer = require("multer");
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
dotenv.config();

//schedule jobs using cron-job
// require('./jobs/schedulePromotionMessage');

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const rawMaterialRoutes = require("./routes/rawMaterialRoutes");
const suppliersRoutes = require("./routes/suppliersRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const businessHolderRoutes = require("./routes/businessHolderRoutes");
const whatsappRoutes = require("./routes/whatsappRoute");
const appraisalsRoutes = require("./routes/appraisalsRoutes");
const customerRoutes = require("./routes/customerRoutes");
const customOrderRoutes = require("./routes/customOrderRoutes");
const jobWorkRoutes = require("./routes/jobWorkRoutes");
const repairRoutes = require("./routes/repairRoutes");
const hallmarkRoutes = require("./routes/hallmarkRoutes");
const hallmarkCenterRoutes = require("./routes/hallmarkCenterRoutes");
const salesRoutes = require("./routes/salesRoutes");
const chartRoutes = require("./routes/chartRoutes");
const revenueRoutes = require("./routes/revenueRoutes");
const attendanceRoute = require("./routes/attandence");
const fetchPrices = require("./routes/fetchPrices");
const filesRoutes = require("./routes/filesRoutes");
const utilsRoutes = require("./routes/utilsRoutes");
const employeeTypesRoutes = require("./routes/employeeTypesRoutes");
const assetAccountRoutes = require("./routes/assetAccountRoutes");
const liabilityAccountRoutes = require("./routes/liabilityAccountRoutes");
const incomeAccountRoutes = require("./routes/incomeAccountRoutes");
const expenseAccountRoutes = require("./routes/expenseAccountRoutes");
const chartBalanceRoutes = require("./routes/chartLastBalanceRoutes");
const demoDataRoutes = require("./routes/demoDataRoutes");
const taxesRoutes = require("./routes/taxesRoutes");
const invoiceUploadRoutes = require("./routes/invoiceUploadRoutes");
const repairInvoiceUploadRoutes = require("./routes/repairInvoiceUploadRoutes");
const stringSecurityRoutes = require("./routes/securityStringRoutes");

const MiddleWares = require("./middlewares/extra");
const sendRecommendations = require("./controllers/crmControllers/sendRecommendations");
const Signup = require("./controllers/crmControllers/signup");
const Login = require("./controllers/crmControllers/login");
const { User, Verification } = require("./models/user");
const sendOtp = require("./controllers/crmControllers/sendOtp");
const verifyOtp = require("./controllers/crmControllers/verifyOtp");
const notifications = require("./controllers/crmControllers/notifications");
const crmBusinessMeetings = require("./controllers/crmControllers/crmBusinessMeetings");
const subDomain = require("./controllers/crmControllers/subDomain");
const uploadAllImages = require("./controllers/crmControllers/uploadAllImages");

const app = express();

MiddleWares(app);

let serviceAccount1 = {
    "type": "service_account",
    "project_id": "aestra-jewellers-files",
    "private_key_id": "829cbddeaa8d55c8e80b6eeb2a6696c9c397debe",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDj48ZMYOs1cjVM\nfbgUB9ypeAc51uYflBUXb3jvmxUbM9ivncVHPhnMRNOZOopd14Sz7PAm825pmRWX\n4EKfqnNymoj1mK44vhq25LaQSCI862CeFKdhymmwPd3V7DZdNraJh+y58/He3EGx\nYsVuSK02oP0PcFDAojkhxz4LTeLbAzbkVhb9cpnxFDmLnLQfb/oYyPOD3ZM5dAuR\n99ri1FzLdyWgOEP0CVnDdA//xrKNJE30QQvgZRX8vJBannh07r/tBDiwDdBVDgbf\nks8erSpL+MnRmNcwDEIV+bSjBmz+ofmQjr5FvUyJqJsuVajUqQERMIdT2FH9hDJc\nqRUnw6LHAgMBAAECggEADkFLwLBZVjUIL3o3vw0E2Rb4gL44E+ab8STYcEiHp/V0\nyvt4AS5Zx8TQZafbSuZ11xltpkoY8IMSbjcpg7pSUWtoQNClqUf+/MzOvLS+a4gf\nuZO6KqxSMyOTklOdzPPktDKr9K/VQ+cMNu/iQLVMHHwyiDoy2vHq1/mSIHvlQmTR\nWAFyR41+lr/6WAZswXvfUmLhdma+AmsaSoLAyrfZeiDEzISqPm+bIbA9lC3xVwDG\nkBEbmMZuvzwp4v5+NVa+WXv/Y8xfjGH1Nueg8FKbL38hjswuFJl6yueUhOKoKwMV\nqNKcZGATsg3tbM1ojtwts+l7VbnBLyIH1DwlWMzlEQKBgQD6UTJ95yw/rXqoKX0/\nSOXiJn9r/lu7mmYO7vra01+GSbxX5AlepHcHiS2plJcFnCJ6ufn0XIc41jiEZGnR\ntFjUcwSfHib9fLPE8M3UWUtymnoVdjGrLvKYPXoVgjY8tj+FodnDR8K/IcPuQ8hS\nFH2ySGyvZJoZysu3Z2fr3gUFUQKBgQDpEDuXRq9hBjXtreKVqNILUOmW7Z/Kf1sg\naVjnHV+IC0DJmH9HiHhG2A3ufrMP5DrFt8DqP6RRYmhgEUinIzEegzAI/Ms7VWbN\nomgxkiwzRNFpZPFHvo9B2RmGrrZVFaGDZM7R5zAIktlPu0JZY0vWqZe1o21fU/XG\nKI5XGJWAlwKBgEJi6HY1qimVM7OHlV0EU1uABEk6409E6o5JWSRR7MKrqZTRuJ5u\nFddczUxtSQRG3WoZCq6BH6e2QLT0AJCKOQjXHEGq+II/4Vl4183ahMT3LSul9hRF\nVjeEDm3H4+SEHSKuwxckYATayqDVPzptjsyKorB9iNUQUKjqdsg6ULCRAoGAO29Z\nUw3CoeKclB1ZAEOKNTqQJ1439sMdsRlMg7vY5e/AuOh75PkneyGUA/MppO7WEh/3\nQYWzWNHYvk8KER2HZDmeYVxeU6ZGzkARhDq7rONq6A7G/T3aeLdtrAwYEYCvrLtj\nhuIHPNh+NLgThootB/Q97SNdPAdEUSF8kzeAwMcCgYEAlu1YKtItE2sKkYjnCfAP\narC366O7iXI5n+6TBDje3ilxou6LLtFTALa/cIx4UtZdGUPoUQYSiJBzlIcbfolL\n/xg8Nmxrw5ZX9cEOTtnxMHYXHsUOlRbDm6BsoaW0vNk9dYhjTWs4addck9AisUvJ\ncDo0EvMrTZzAGlLnuc6MO80=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-k05tt@aestra-jewellers-files.iam.gserviceaccount.com",
    "client_id": "117075930024156217930",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-k05tt%40aestra-jewellers-files.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}

const firstApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount1), // replace this with your actual storage bucket name found in project settings
}, 'firstApp');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.get("/home", (req, res) => {
    res.status(200).send("welcome to aestra jewellers");
});

app.use("/whatsapp", whatsappRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/rawmaterial", rawMaterialRoutes);
app.use("/supplier", suppliersRoutes);
app.use("/vendor", vendorRoutes);
app.use("/businessHolder", businessHolderRoutes);
app.use("/appraisals", appraisalsRoutes);
app.use("/customer", customerRoutes);
app.use("/customOrder", customOrderRoutes);
app.use("/jobWork", jobWorkRoutes);
app.use("/repair", repairRoutes);
app.use("/hallmark", hallmarkRoutes);
app.use("/hallmarkCenter", hallmarkCenterRoutes);
app.use("/sales", salesRoutes);
app.use("/chart", chartRoutes);
app.use("/revenue", revenueRoutes);
app.use("/", attendanceRoute);
app.use("/", fetchPrices);
app.use("/files", filesRoutes);
//
//
app.use("/utils", utilsRoutes);
app.use("/employeeTypes", employeeTypesRoutes);
app.use("/chartOfAccount", assetAccountRoutes);
app.use("/chartOfAccount", liabilityAccountRoutes);
app.use("/chartOfAccount", incomeAccountRoutes);
app.use("/chartOfAccount", expenseAccountRoutes);
app.use("/chartOfAccountBalance", chartBalanceRoutes);
app.use("/chartOfAccountDemo", demoDataRoutes);
app.use("/taxes", taxesRoutes);
app.use("/invoiceUpload", invoiceUploadRoutes);
app.use("/repairInvoiceUpload", repairInvoiceUploadRoutes)
app.use("/stringSecurity", stringSecurityRoutes)
//
//
app.post("/uploadAllImages", upload.array("productImage", 50), async (req, res) => { uploadAllImages(req, res, firstApp) })

app.post("/subDomain", async (req, res) => {
    subDomain(req, res)
});
app.post("/crmBusinessMeeting", async (req, res) => {
    crmBusinessMeetings(req, res)
});
app.post("/login", async (req, res) => {
    Login(req, res);
});
app.post("/signup", async (req, res) => {
    Signup(req, res);
});
app.post("/sendOtp", async (req, res) => {
    sendOtp(req, res)
});
app.post("/verifyotp", async (req, res) => {
    verifyOtp(req, res)
});
app.get("/notifications", async (req, res) => {
    notifications(req, res)
});


const bcrypt = require("bcrypt")

app.post('/changePassword', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Check if email and newPassword are provided
    if (!email || !newPassword) {
      return res.status(400).send({ message: 'Email and new password are required' });
    }

    // Find the user by email
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Hash the new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

 

    // Save the updated user
    const updateUser = await User.findOneAndUpdate({email : req.body.email} , {password : newPasswordHash })

    // Respond with success
    return res.status(200).send({ message: 'Password updated successfully', user: updateUser });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal Server Error', error });
  }
});


//
//
//
//tokentesterroute only for testing
// app.get("/tokenVerification", (req, res) => {
//     const token = req.headers.authorization
//     console.log(token)
//     jwt.verify(token, process.env.JWTPRIVATEKEY, function (err, decoded) {
//         if (decoded) {
//             console.log(decoded)
//             res.status(200).send("Token is valid")
//         } else {
//             console.log(decoded)
//             res.status(400).send("Token is expire")
//         }
//     });
// })

//
Db();
// sendRecommendations()
Port(app);   //comment this because its running on serverless
// module.exports.handler = serverless(app);