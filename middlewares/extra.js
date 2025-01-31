function MiddleWares(app) {
  // const cookieParser = require("cookie-parser");
  const express = require("express");
  const { Configuration, OpenAIApi } = require("openai");
  const bodyParser = require("body-parser");
  const cors = require("cors");
  const dotenv = require("dotenv");
  dotenv.config();
  app.use(express.json());

  // Set up OpenAI API
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  // app.use(cookieParser());
  // Create a new express app

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  // app.use(cors());
  app.use(
    cors({
      origin: ["http://localhost:3000", "http://localhost:3001", "https://jewellers-erp-fe.vercel.app" ],
      credentials: true,
      exposedHeaders: ['x-auth-token'],
      allowedHeaders: ['Content-Type', 'x-auth-token']
    })
  );
  app.options('*', cors());
}

module.exports = MiddleWares;
