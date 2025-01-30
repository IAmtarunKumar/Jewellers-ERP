const express = require("express");

const csv = require("csvtojson");

const router = express.Router();

const { Asset } = require("../models/assets");

// const { AssetModel } = require("../model/asset.model")
const { Income } = require("../models/income");
const { Expense } = require("../models/expenses");
const { Liability } = require("../models/liabilities");

const { csvData } = require("../utils/csvData");
const { database } = require("firebase-admin");

let jsonArray;

csv()
  .fromString(csvData)
  .then((data) => {
    jsonArray = data;
  })
  .catch((error) => {
    console.error("Error:", error);
  });

router.get("/a", (req, res) => {
  res.send(jsonArray);
});

//Upload Csv file

router.get("/add", async (req, res) => {
  // let i = 0
  try {
    let asset = await Asset.find();
    let expense = await Expense.find();
    let income = await Income.find();
    let laibility = await Liability.find();

    if (
      asset.length > 0 ||
      expense.length > 0 ||
      income.length > 0 ||
      laibility.length > 0
    ) {
      return res.status(200).send("Data is Already Added");
    } else {
      for (let i = 0; i < 5; i++) {
        // console.log("data" , data)

        //asstel
        if (
          jsonArray[i].type === "Cash in hand" ||
          jsonArray[i].type === "Bank account" ||
          jsonArray[i].type === "Properties" ||
          jsonArray[i].type === "Plant and machineries"
        ) {
          if (i === 0) {
            console.log("this is zero and this run n times");
            // const debitValue = Math.floor(Math.random() * 100) * 100;
            const creditValue = Math.floor(Math.random() * 100) * 100;
            // jsonArray[i].debit = debitValue
            jsonArray[i].credit = creditValue;

            // if (i === 0) {
            // i++
            let balanceValue = 0;
            balanceValue = +creditValue;
            console.log(balanceValue, "bal value in first iteration");
            jsonArray[i].balance = +balanceValue;
            console.log(
              "logging the json array corresponding row",
              jsonArray[i]
            );

            let csvRowData = await new Asset(jsonArray[i]);
            await csvRowData.save();
          }
          if (i === 1 || i === 2) {
            console.log("this is 1&2 and this run n times");

            const debitValue = Math.floor(Math.random() * 100) * 100;
            // const creditValue = Math.floor(Math.random() * 100) * 100;
            jsonArray[i].debit = debitValue;
            // jsonArray[i].credit = creditValue

            let bal = jsonArray[i - 1].balance;
            console.log("previous balance", bal);

            let newBal = +bal - +jsonArray[i].debit;
            console.log("new balance", newBal);
            jsonArray[i].balance = newBal;
            console.log("bal", newBal, "type", typeof newBal);
            console.log("logging the iteration ", jsonArray[i]);
            let csvRowData = await new Asset(jsonArray[i]);
            await csvRowData.save();
          }
          if (i === 3 || i === 4) {
            console.log("this is 3&4 and this run n times");

            // const debitValue = Math.floor(Math.random() * 100) * 100;
            const creditValue = Math.floor(Math.random() * 100) * 100;
            // jsonArray[i].debit = debitValue
            jsonArray[i].credit = creditValue;

            let bal = jsonArray[i - 1].balance;
            console.log("previous balance", bal);

            let newBal = +bal + +jsonArray[i].credit;
            console.log("new balance", newBal);
            jsonArray[i].balance = newBal;
            console.log("bal", newBal, "type", typeof newBal);
            console.log("logging the iteration ", jsonArray[i]);
            let csvRowData = await new Asset(jsonArray[i]);
            await csvRowData.save();
          }
        }
      }
      for (let i = 5; i < 10; i++) {
        // console.log("data" , data)

        //asstel
        if (
          jsonArray[i].type === "Cash in hand" ||
          jsonArray[i].type === "Bank account" ||
          jsonArray[i].type === "Properties" ||
          jsonArray[i].type === "Plant and machineries"
        ) {
          if (i === 5) {
            console.log("this is zero and this run n times");
            // const debitValue = Math.floor(Math.random() * 100) * 100;
            const creditValue = Math.floor(Math.random() * 100) * 100;
            // jsonArray[i].debit = debitValue
            jsonArray[i].credit = creditValue;

            // if (i === 0) {
            // i++
            let balanceValue = 0;
            balanceValue = +creditValue;
            console.log(balanceValue, "bal value in first iteration");
            jsonArray[i].balance = +balanceValue;
            console.log(
              "logging the json array corresponding row",
              jsonArray[i]
            );

            let csvRowData = await Asset(jsonArray[i]);
            await csvRowData.save();
          }
          if (i === 6 || i === 7) {
            console.log("this is 1&2 and this run n times");

            const debitValue = Math.floor(Math.random() * 100) * 100;
            // const creditValue = Math.floor(Math.random() * 100) * 100;
            jsonArray[i].debit = debitValue;
            // jsonArray[i].credit = creditValue

            let bal = jsonArray[i - 1].balance;
            console.log("previous balance", bal);

            let newBal = +bal - +jsonArray[i].debit;
            console.log("new balance", newBal);
            jsonArray[i].balance = newBal;
            console.log("bal", newBal, "type", typeof newBal);
            console.log("logging the iteration ", jsonArray[i]);
            let csvRowData = await new Asset(jsonArray[i]);
            await csvRowData.save();
          }
          if (i === 8 || i === 9) {
            console.log("this is 3&4 and this run n times");

            // const debitValue = Math.floor(Math.random() * 100) * 100;
            const creditValue = Math.floor(Math.random() * 100) * 100;
            // jsonArray[i].debit = debitValue
            jsonArray[i].credit = creditValue;

            let bal = jsonArray[i - 1].balance;
            console.log("previous balance", bal);

            let newBal = +bal + +jsonArray[i].credit;
            console.log("new balance", newBal);
            jsonArray[i].balance = newBal;
            console.log("bal", newBal, "type", typeof newBal);
            console.log("logging the iteration ", jsonArray[i]);
            let csvRowData = await new Asset(jsonArray[i]);
            await csvRowData.save();
          }
        }
      }
      for (let i = 10; i < 15; i++) {
        // console.log("data" , data)

        //asstel
        if (
          jsonArray[i].type === "Cash in hand" ||
          jsonArray[i].type === "Bank account" ||
          jsonArray[i].type === "Properties" ||
          jsonArray[i].type === "Plant and machineries"
        ) {
          if (i === 10) {
            console.log("this is zero and this run n times");
            // const debitValue = Math.floor(Math.random() * 100) * 100;
            const creditValue = Math.floor(Math.random() * 100) * 100;
            // jsonArray[i].debit = debitValue
            jsonArray[i].credit = creditValue;

            // if (i === 0) {
            // i++
            let balanceValue = 0;
            balanceValue = +creditValue;
            console.log(balanceValue, "bal value in first iteration");
            jsonArray[i].balance = +balanceValue;
            console.log(
              "logging the json array corresponding row",
              jsonArray[i]
            );

            let csvRowData = await Asset(jsonArray[i]);
            await csvRowData.save();
          }
          if (i === 11 || i === 12) {
            console.log("this is 1&2 and this run n times");

            const debitValue = Math.floor(Math.random() * 100) * 100;
            // const creditValue = Math.floor(Math.random() * 100) * 100;
            jsonArray[i].debit = debitValue;
            // jsonArray[i].credit = creditValue

            let bal = jsonArray[i - 1].balance;
            console.log("previous balance", bal);

            let newBal = +bal - +jsonArray[i].debit;
            console.log("new balance", newBal);
            jsonArray[i].balance = newBal;
            console.log("bal", newBal, "type", typeof newBal);
            console.log("logging the iteration ", jsonArray[i]);
            let csvRowData = await new Asset(jsonArray[i]);
            await csvRowData.save();
          }
          if (i === 13 || i === 14) {
            console.log("this is 3&4 and this run n times");

            // const debitValue = Math.floor(Math.random() * 100) * 100;
            const creditValue = Math.floor(Math.random() * 100) * 100;
            // jsonArray[i].debit = debitValue
            jsonArray[i].credit = creditValue;

            let bal = jsonArray[i - 1].balance;
            console.log("previous balance", bal);

            let newBal = +bal + +jsonArray[i].credit;
            console.log("new balance", newBal);
            jsonArray[i].balance = newBal;
            console.log("bal", newBal, "type", typeof newBal);
            console.log("logging the iteration ", jsonArray[i]);
            let csvRowData = await new Asset(jsonArray[i]);
            await csvRowData.save();
          }
        }
      }
      for (let i = 15; i < 20; i++) {
        // console.log("data" , data)

        //asstel
        if (
          jsonArray[i].type === "Cash in hand" ||
          jsonArray[i].type === "Bank account" ||
          jsonArray[i].type === "Properties" ||
          jsonArray[i].type === "Plant and machineries"
        ) {
          if (i === 15) {
            console.log("this is zero and this run n times");
            // const debitValue = Math.floor(Math.random() * 100) * 100;
            const creditValue = Math.floor(Math.random() * 100) * 100;
            // jsonArray[i].debit = debitValue
            jsonArray[i].credit = creditValue;

            // if (i === 0) {
            // i++
            let balanceValue = 0;
            balanceValue = +creditValue;
            console.log(balanceValue, "bal value in first iteration");
            jsonArray[i].balance = +balanceValue;
            console.log(
              "logging the json array corresponding row",
              jsonArray[i]
            );

            let csvRowData = await Asset(jsonArray[i]);
            await csvRowData.save();
          }
          if (i === 16 || i === 17) {
            console.log("this is 1&2 and this run n times");

            const debitValue = Math.floor(Math.random() * 100) * 100;
            // const creditValue = Math.floor(Math.random() * 100) * 100;
            jsonArray[i].debit = debitValue;
            // jsonArray[i].credit = creditValue

            let bal = jsonArray[i - 1].balance;
            console.log("previous balance", bal);

            let newBal = +bal - +jsonArray[i].debit;
            console.log("new balance", newBal);
            jsonArray[i].balance = newBal;
            console.log("bal", newBal, "type", typeof newBal);
            console.log("logging the iteration ", jsonArray[i]);
            let csvRowData = await new Asset(jsonArray[i]);
            await csvRowData.save();
          }
          if (i === 18 || i === 19) {
            console.log("this is 3&4 and this run n times");

            // const debitValue = Math.floor(Math.random() * 100) * 100;
            const creditValue = Math.floor(Math.random() * 100) * 100;
            // jsonArray[i].debit = debitValue
            jsonArray[i].credit = creditValue;

            let bal = jsonArray[i - 1].balance;
            console.log("previous balance", bal);

            let newBal = +bal + +jsonArray[i].credit;
            console.log("new balance", newBal);
            jsonArray[i].balance = newBal;
            console.log("bal", newBal, "type", typeof newBal);
            console.log("logging the iteration ", jsonArray[i]);
            let csvRowData = await new Asset(jsonArray[i]);
            await csvRowData.save();
          }
        }
      }
      for (let i = 20; i < 25; i++) {
        // console.log("data" , data)
        //asstel
        if (jsonArray[i].type === "Sales" || jsonArray[i].type === "Repairs") {
          if (i === 20) {
            console.log("this is zero and this run n times");
            // const debitValue = Math.floor(Math.random() * 100) * 100;
            const creditValue = Math.floor(Math.random() * 100) * 100;
            // jsonArray[i].debit = debitValue
            jsonArray[i].credit = creditValue;

            // if (i === 0) {
            // i++
            let balanceValue = 0;
            balanceValue = +creditValue;
            console.log(balanceValue, "bal value in first iteration");
            jsonArray[i].balance = +balanceValue;
            console.log(
              "logging the json array corresponding row",
              jsonArray[i]
            );

            let csvRowData = await Income(jsonArray[i]);
            await csvRowData.save();
          }
          if (i === 21 || i === 22) {
            console.log("this is 1&2 and this run n times");

            const debitValue = Math.floor(Math.random() * 100) * 100;
            // const creditValue = Math.floor(Math.random() * 100) * 100;
            jsonArray[i].debit = debitValue;
            // jsonArray[i].credit = creditValue

            let bal = jsonArray[i - 1].balance;
            console.log("previous balance", bal);

            let newBal = +bal - +jsonArray[i].debit;
            console.log("new balance", newBal);
            jsonArray[i].balance = newBal;
            console.log("bal", newBal, "type", typeof newBal);
            console.log("logging the iteration ", jsonArray[i]);
            let csvRowData = await new Income(jsonArray[i]);
            await csvRowData.save();
          }
          if (i === 23 || i === 24) {
            console.log("this is 3&4 and this run n times");

            // const debitValue = Math.floor(Math.random() * 100) * 100;
            const creditValue = Math.floor(Math.random() * 100) * 100;
            // jsonArray[i].debit = debitValue
            jsonArray[i].credit = creditValue;

            let bal = jsonArray[i - 1].balance;
            console.log("previous balance", bal);

            let newBal = +bal + +jsonArray[i].credit;
            console.log("new balance", newBal);
            jsonArray[i].balance = newBal;
            console.log("bal", newBal, "type", typeof newBal);
            console.log("logging the iteration ", jsonArray[i]);
            let csvRowData = await new Income(jsonArray[i]);
            await csvRowData.save();
          }
        }
      }
      for (let i = 25; i < 30; i++) {
        // console.log("data" , data)
        //asstel
        if (jsonArray[i].type === "Sales" || jsonArray[i].type === "Repairs") {
          if (i === 25) {
            console.log("this is zero and this run n times");
            // const debitValue = Math.floor(Math.random() * 100) * 100;
            const creditValue = Math.floor(Math.random() * 100) * 100;
            // jsonArray[i].debit = debitValue
            jsonArray[i].credit = creditValue;

            // if (i === 0) {
            // i++
            let balanceValue = 0;
            balanceValue = +creditValue;
            console.log(balanceValue, "bal value in first iteration");
            jsonArray[i].balance = +balanceValue;
            console.log(
              "logging the json array corresponding row",
              jsonArray[i]
            );

            let csvRowData = await Income(jsonArray[i]);
            await csvRowData.save();
          }
          if (i === 26 || i === 27) {
            console.log("this is 1&2 and this run n times");

            const debitValue = Math.floor(Math.random() * 100) * 100;
            // const creditValue = Math.floor(Math.random() * 100) * 100;
            jsonArray[i].debit = debitValue;
            // jsonArray[i].credit = creditValue

            let bal = jsonArray[i - 1].balance;
            console.log("previous balance", bal);

            let newBal = +bal - +jsonArray[i].debit;
            console.log("new balance", newBal);
            jsonArray[i].balance = newBal;
            console.log("bal", newBal, "type", typeof newBal);
            console.log("logging the iteration ", jsonArray[i]);
            let csvRowData = await new Income(jsonArray[i]);
            await csvRowData.save();
          }
          if (i === 28 || i === 29) {
            console.log("this is 3&4 and this run n times");

            // const debitValue = Math.floor(Math.random() * 100) * 100;
            const creditValue = Math.floor(Math.random() * 100) * 100;
            // jsonArray[i].debit = debitValue
            jsonArray[i].credit = creditValue;

            let bal = jsonArray[i - 1].balance;
            console.log("previous balance", bal);

            let newBal = +bal + +jsonArray[i].credit;
            console.log("new balance", newBal);
            jsonArray[i].balance = newBal;
            console.log("bal", newBal, "type", typeof newBal);
            console.log("logging the iteration ", jsonArray[i]);
            let csvRowData = await new Income(jsonArray[i]);
            await csvRowData.save();
          }
        }
      }

      for (let i = 30; i < 35; i++) {
        // console.log("data" , data)
        //asstel
        if (
          jsonArray[i].type === "Raw materials" ||
          jsonArray[i].type === "Job works"
        ) {
          if (i === 30) {
            console.log("this is zero and this run n times");
            // const debitValue = Math.floor(Math.random() * 100) * 100;
            const creditValue = Math.floor(Math.random() * 100) * 100;
            // jsonArray[i].debit = debitValue
            jsonArray[i].credit = creditValue;

            // if (i === 0) {
            // i++
            let balanceValue = 0;
            balanceValue = +creditValue;
            console.log(balanceValue, "bal value in first iteration");
            jsonArray[i].balance = +balanceValue;
            console.log(
              "logging the json array corresponding row",
              jsonArray[i]
            );

            let csvRowData = await Expense(jsonArray[i]);
            await csvRowData.save();
          }
          if (i === 31 || i === 32) {
            console.log("this is 1&2 and this run n times");

            const debitValue = Math.floor(Math.random() * 100) * 100;
            // const creditValue = Math.floor(Math.random() * 100) * 100;
            jsonArray[i].debit = debitValue;
            // jsonArray[i].credit = creditValue

            let bal = jsonArray[i - 1].balance;
            console.log("previous balance", bal);

            let newBal = +bal - +jsonArray[i].debit;
            console.log("new balance", newBal);
            jsonArray[i].balance = newBal;
            console.log("bal", newBal, "type", typeof newBal);
            console.log("logging the iteration ", jsonArray[i]);
            let csvRowData = await new Expense(jsonArray[i]);
            await csvRowData.save();
          }
          if (i === 33 || i === 34) {
            console.log("this is 3&4 and this run n times");

            // const debitValue = Math.floor(Math.random() * 100) * 100;
            const creditValue = Math.floor(Math.random() * 100) * 100;
            // jsonArray[i].debit = debitValue
            jsonArray[i].credit = creditValue;

            let bal = jsonArray[i - 1].balance;
            console.log("previous balance", bal);

            let newBal = +bal + +jsonArray[i].credit;
            console.log("new balance", newBal);
            jsonArray[i].balance = newBal;
            console.log("bal", newBal, "type", typeof newBal);
            console.log("logging the iteration ", jsonArray[i]);
            let csvRowData = await new Expense(jsonArray[i]);
            await csvRowData.save();
          }
        }
      }
      for (let i = 35; i < 40; i++) {
        // console.log("data" , data)
        //asstel
        if (
          jsonArray[i].type === "Raw materials" ||
          jsonArray[i].type === "Job works"
        ) {
          if (i === 35) {
            console.log("this is zero and this run n times");
            // const debitValue = Math.floor(Math.random() * 100) * 100;
            const creditValue = Math.floor(Math.random() * 100) * 100;
            // jsonArray[i].debit = debitValue
            jsonArray[i].credit = creditValue;

            // if (i === 0) {
            // i++
            let balanceValue = 0;
            balanceValue = +creditValue;
            console.log(balanceValue, "bal value in first iteration");
            jsonArray[i].balance = +balanceValue;
            console.log(
              "logging the json array corresponding row",
              jsonArray[i]
            );

            let csvRowData = await Expense(jsonArray[i]);
            await csvRowData.save();
          }
          if (i === 36 || i === 37) {
            console.log("this is 1&2 and this run n times");

            const debitValue = Math.floor(Math.random() * 100) * 100;
            // const creditValue = Math.floor(Math.random() * 100) * 100;
            jsonArray[i].debit = debitValue;
            // jsonArray[i].credit = creditValue

            let bal = jsonArray[i - 1].balance;
            console.log("previous balance", bal);

            let newBal = +bal - +jsonArray[i].debit;
            console.log("new balance", newBal);
            jsonArray[i].balance = newBal;
            console.log("bal", newBal, "type", typeof newBal);
            console.log("logging the iteration ", jsonArray[i]);
            let csvRowData = await new Expense(jsonArray[i]);
            await csvRowData.save();
          }
          if (i === 38 || i === 39) {
            console.log("this is 3&4 and this run n times");

            // const debitValue = Math.floor(Math.random() * 100) * 100;
            const creditValue = Math.floor(Math.random() * 100) * 100;
            // jsonArray[i].debit = debitValue
            jsonArray[i].credit = creditValue;

            let bal = jsonArray[i - 1].balance;
            console.log("previous balance", bal);

            let newBal = +bal + +jsonArray[i].credit;
            console.log("new balance", newBal);
            jsonArray[i].balance = newBal;
            console.log("bal", newBal, "type", typeof newBal);
            console.log("logging the iteration ", jsonArray[i]);
            let csvRowData = await new Expense(jsonArray[i]);
            await csvRowData.save();
          }
        }
      }
      for (let i = 40; i < 45; i++) {
        // console.log("data" , data)
        //asstel
        if (
          jsonArray[i].type === "Duty and taxes" ||
          jsonArray[i].type === "Creditors" ||
          jsonArray[i].type === "Loans"
        ) {
          if (i === 40) {
            console.log("this is zero and this run n times");
            // const debitValue = Math.floor(Math.random() * 100) * 100;
            const creditValue = Math.floor(Math.random() * 100) * 100;
            // jsonArray[i].debit = debitValue
            jsonArray[i].credit = creditValue;

            // if (i === 0) {
            // i++
            let balanceValue = 0;
            balanceValue = +creditValue;
            console.log(balanceValue, "bal value in first iteration");
            jsonArray[i].balance = +balanceValue;
            console.log(
              "logging the json array corresponding row",
              jsonArray[i]
            );

            let csvRowData = await Liability(jsonArray[i]);
            await csvRowData.save();
          }
          if (i === 41 || i === 42) {
            console.log("this is 1&2 and this run n times");

            const debitValue = Math.floor(Math.random() * 100) * 100;
            // const creditValue = Math.floor(Math.random() * 100) * 100;
            jsonArray[i].debit = debitValue;
            // jsonArray[i].credit = creditValue

            let bal = jsonArray[i - 1].balance;
            console.log("previous balance", bal);

            let newBal = +bal - +jsonArray[i].debit;
            console.log("new balance", newBal);
            jsonArray[i].balance = newBal;
            console.log("bal", newBal, "type", typeof newBal);
            console.log("logging the iteration ", jsonArray[i]);
            let csvRowData = await new Liability(jsonArray[i]);
            await csvRowData.save();
          }
          if (i === 43 || i === 44) {
            console.log("this is 3&4 and this run n times");

            // const debitValue = Math.floor(Math.random() * 100) * 100;
            const creditValue = Math.floor(Math.random() * 100) * 100;
            // jsonArray[i].debit = debitValue
            jsonArray[i].credit = creditValue;

            let bal = jsonArray[i - 1].balance;
            console.log("previous balance", bal);

            let newBal = +bal + +jsonArray[i].credit;
            console.log("new balance", newBal);
            jsonArray[i].balance = newBal;
            console.log("bal", newBal, "type", typeof newBal);
            console.log("logging the iteration ", jsonArray[i]);
            let csvRowData = await new Liability(jsonArray[i]);
            await csvRowData.save();
          }
        }
      }
      for (let i = 45; i < 50; i++) {
        // console.log("data" , data)
        //asstel
        if (
          jsonArray[i].type === "Duty and taxes" ||
          jsonArray[i].type === "Creditors" ||
          jsonArray[i].type === "Loans"
        ) {
          if (i === 45) {
            console.log("this is zero and this run n times");
            // const debitValue = Math.floor(Math.random() * 100) * 100;
            const creditValue = Math.floor(Math.random() * 100) * 100;
            // jsonArray[i].debit = debitValue
            jsonArray[i].credit = creditValue;

            // if (i === 0) {
            // i++
            let balanceValue = 0;
            balanceValue = +creditValue;
            console.log(balanceValue, "bal value in first iteration");
            jsonArray[i].balance = +balanceValue;
            console.log(
              "logging the json array corresponding row",
              jsonArray[i]
            );

            let csvRowData = await Liability(jsonArray[i]);
            await csvRowData.save();
          }
          if (i === 46 || i === 47) {
            console.log("this is 1&2 and this run n times");

            const debitValue = Math.floor(Math.random() * 100) * 100;
            // const creditValue = Math.floor(Math.random() * 100) * 100;
            jsonArray[i].debit = debitValue;
            // jsonArray[i].credit = creditValue

            let bal = jsonArray[i - 1].balance;
            console.log("previous balance", bal);

            let newBal = +bal - +jsonArray[i].debit;
            console.log("new balance", newBal);
            jsonArray[i].balance = newBal;
            console.log("bal", newBal, "type", typeof newBal);
            console.log("logging the iteration ", jsonArray[i]);
            let csvRowData = await new Liability(jsonArray[i]);
            await csvRowData.save();
          }
          if (i === 48 || i === 49) {
            console.log("this is 3&4 and this run n times");

            // const debitValue = Math.floor(Math.random() * 100) * 100;
            const creditValue = Math.floor(Math.random() * 100) * 100;
            // jsonArray[i].debit = debitValue
            jsonArray[i].credit = creditValue;

            let bal = jsonArray[i - 1].balance;
            console.log("previous balance", bal);

            let newBal = +bal + +jsonArray[i].credit;
            console.log("new balance", newBal);
            jsonArray[i].balance = newBal;
            console.log("bal", newBal, "type", typeof newBal);
            console.log("logging the iteration ", jsonArray[i]);
            let csvRowData = await new Liability(jsonArray[i]);
            await csvRowData.save();
          }
        }
      }
      for (let i = 50; i < 55; i++) {
        // console.log("data" , data)
        //asstel
        if (
          jsonArray[i].type === "Duty and taxes" ||
          jsonArray[i].type === "Creditors" ||
          jsonArray[i].type === "Loans"
        ) {
          if (i === 50) {
            console.log("this is zero and this run n times");
            // const debitValue = Math.floor(Math.random() * 100) * 100;
            const creditValue = Math.floor(Math.random() * 100) * 100;
            // jsonArray[i].debit = debitValue
            jsonArray[i].credit = creditValue;

            // if (i === 0) {
            // i++
            let balanceValue = 0;
            balanceValue = +creditValue;
            console.log(balanceValue, "bal value in first iteration");
            jsonArray[i].balance = +balanceValue;
            console.log(
              "logging the json array corresponding row",
              jsonArray[i]
            );

            let csvRowData = await Liability(jsonArray[i]);
            await csvRowData.save();
          }
          if (i === 51 || i === 52) {
            console.log("this is 1&2 and this run n times");

            const debitValue = Math.floor(Math.random() * 100) * 100;
            // const creditValue = Math.floor(Math.random() * 100) * 100;
            jsonArray[i].debit = debitValue;
            // jsonArray[i].credit = creditValue

            let bal = jsonArray[i - 1].balance;
            console.log("previous balance", bal);

            let newBal = +bal - +jsonArray[i].debit;
            console.log("new balance", newBal);
            jsonArray[i].balance = newBal;
            console.log("bal", newBal, "type", typeof newBal);
            console.log("logging the iteration ", jsonArray[i]);
            let csvRowData = await new Liability(jsonArray[i]);
            await csvRowData.save();
          }
          if (i === 53 || i === 54) {
            console.log("this is 3&4 and this run n times");

            // const debitValue = Math.floor(Math.random() * 100) * 100;
            const creditValue = Math.floor(Math.random() * 100) * 100;
            // jsonArray[i].debit = debitValue
            jsonArray[i].credit = creditValue;

            let bal = jsonArray[i - 1].balance;
            console.log("previous balance", bal);

            let newBal = +bal + +jsonArray[i].credit;
            console.log("new balance", newBal);
            jsonArray[i].balance = newBal;
            console.log("bal", newBal, "type", typeof newBal);
            console.log("logging the iteration ", jsonArray[i]);
            let csvRowData = await new Liability(jsonArray[i]);
            await csvRowData.save();
          }
        }
      }
      console.log("Data saved to MongoDB successfully.");
      return res.status(200).send("Data saved to MongoDB successfully.");
    }
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .send(`Error processing the CSV file ${error.message}`);
  }
});

// remove all data

router.delete("/remove", async (req, res) => {
  try {
    let asset = await Asset.find();
    let expense = await Expense.find();
    let income = await Income.find();
    let laibility = await Liability.find();

    if (
      asset.length > 0 ||
      expense.length > 0 ||
      income.length > 0 ||
      laibility.length > 0
    ) {
      await Asset.deleteMany({});
      await Income.deleteMany({});
      await Expense.deleteMany({});
      await Liability.deleteMany({});
      return res.status(200).send("All Data is removed");
    } else {
      return res.status(200).send("Data is Already Empty.");
    }
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .send(`Error processing the CSV file ${error.message}`);
  }
});

module.exports = router;
