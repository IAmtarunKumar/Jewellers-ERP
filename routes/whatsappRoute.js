const Whatsapp = require("../whatsapp");
const express = require("express");

// let serviceAccount = require("../utils/firebaseCredentials.json"); //commented because its not read by aws serverless
const router = express.Router();

router.post("/", async (req, res) => {
  await Whatsapp(req, res);
});

module.exports = router;
