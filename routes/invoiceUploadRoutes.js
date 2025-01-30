const express = require("express");
const { Taxes } = require("../models/taxes");
const Product = require("../models/product");
const { Customer } = require("../models/customer");
const { Income } = require("../models/income");
const { Asset } = require("../models/assets");
const { Sales } = require("../models/sales");
const { default: axios } = require("axios");

const router = express.Router();

// Create an taxes
router.post("/", async (req, res) => {
  for (const key in req.body) {
    if (typeof req.body[key] === "string") {
      try {
        // Only parse if the value is a JSON string
        const parsedValue = JSON.parse(req.body[key]);
        req.body[key] = parsedValue;
      } catch (error) {
        // If parsing fails, keep the value as is (non-array)
        console.log(
          "error in parsing the body from string to array",
          error.message
        );
      }
    }
  }
  console.log(
    "we are inthe invoiceupload route and whats coming in body after parsing",
    req.body
  );
  try {
    const {
      customerName,
      date,
      grandTotal,
      invoiceNumber,
      orgName,
      outstandingAmount,
      paymentCash,
      paymentDueDate,
      roundedTotal,
      tableData,
      taxCategory,
      taxType,
      totalAdvance,
      totalAmount,
      totalQuantity,
      cashArray,
      bankArray,
    } = req.body;
    console.log("tabledata", tableData);
    if (paymentCash === "No") {
      console.log("req.bodyhere", req.body);
      for (const data1 of tableData) {
        const foundProduct = await Product.findOne({
          productName: data1.productName,
        });
        if (foundProduct.currentStock === "Define In CRM")
          return res
            .status(400)
            .send(
              "Cannot add a sale. Product stock is not updated. kindly update the current stock and try again later!"
            );
        const quantityNumber = parseInt(data1.quantity, 10);
        console.log("quantitynumber", quantityNumber);
        console.log("founcproductcurrentstock", foundProduct.currentStock);
        const currentQuantity = parseInt(foundProduct.currentStock, 10);
        console.log("currentquantitu", currentQuantity);
        const updatedQuantity = currentQuantity - quantityNumber;
        console.log("updatedQuantity", updatedQuantity);
        if (updatedQuantity < 0)
          return res
            .status(400)
            .send(
              "Cannot add a sale. Stock is not sufficient as per your sale needs! you need to add more products."
            );
        const updatedProduct = await Product.findOneAndUpdate(
          { productName: data1.productName },
          {
            $set: {
              currentStock: updatedQuantity,
            },
          },
          { new: true }
        );
        console.log("updated product", updatedProduct);
        const date = new Date();

        // Format the date as a string in the desired format
        // const formattedDate = date.toLocaleString("en-IN", {
        //     timeZone: "Asia/Kolkata",
        //     year: "numeric",
        //     month: "2-digit",
        //     day: "2-digit",
        //     hour: "2-digit",
        //     minute: "2-digit",
        //     second: "2-digit",
        // });

        // console.log(formattedDate);  //comment because we are getting date from frontend

        //finding customer in mongodb for updating

        const foundCustomer = await Customer.findOne({
          name: req.body.customerName,
        });
        let customerBoughtArray = [];
        customerBoughtArray = foundCustomer.customerBought;
        console.log("customerbought", customerBoughtArray);
        if (customerBoughtArray === undefined) {
          console.log("yes we are in this");
          customerBoughtArray = [];
        }
        const object = {};
        object.productName = foundProduct.productName;
        object.productDescription = foundProduct.productDescription;
        object.dateBought = date;
        object.productQty = data1.quantity;
        console.log(
          "customer bought array before pushing",
          customerBoughtArray
        );
        customerBoughtArray.push(object);

        // console.log(
        //   "logging the array before updating the customer",
        //   customerBoughtArray
        // );
        const updatedCustomer = await Customer.findOneAndUpdate(
          { name: req.body.customerName },
          {
            $set: {
              customerBought: customerBoughtArray,
            },
          },
          { new: true }
        );
        console.log("updated customer", updatedCustomer);
        const newSale = Sales({
          customerId: foundCustomer.customerId,
          productId: foundProduct.productId,
          quantity: data1.quantity,
          saleDate: date,
        });
        await newSale.save();
        //now all the products updations are done now chart of account logic is left!
        const creditedPrice = foundProduct.price * data1.quantity;
        console.log("creditedprice", creditedPrice);
        const customerName = foundCustomer.name;

        console.log("////////////////////////////////////////////////");
        //now its cashtype no so we are saving directly into income
        const allIncomes = await Income.find();
        console.log("all incomes", allIncomes);

        if (!allIncomes || allIncomes.length === 0) {
          /// need work

          for (let i = 0; i < bankArray.length; i++) {
            if (i === 0) {
              let newBal = bankArray[i].amount;

              const newIncome = new Income({
                type: "Sales",
                date: date,
                credit: bankArray[i].amount,
                balance: newBal,
                receivedBy: "Own",
                partyName: customerName,
                reference: "Invoice",
                picture: invoiceNumber,
                description: `Payment Details: Bank Account: ${bankArray[i].bankAccount} || Amount: ${bankArray[i].amount} || Payment Type: ${bankArray[i].paymentType} || Transaction ID: ${bankArray[i].transactionId}`,
              });
              await newIncome.save();
            } else {
              const allIncomes = await Income.find();
              let lastBalance = +allIncomes[allIncomes.length - 1].balance;
              console.log("o last bal", lastBalance);
              let newBal = +lastBalance + +bankArray[i].amount;

              const newIncome = new Income({
                type: "Sales",
                date: date,
                credit: bankArray[i].amount,
                balance: newBal,
                receivedBy: "Own",
                partyName: customerName,
                reference: "Invoice",
                picture: invoiceNumber,
                description: `Payment Details: Bank Account: ${bankArray[i].bankAccount} || Amount: ${bankArray[i].amount} || Payment Type: ${bankArray[i].paymentType} || Transaction ID: ${bankArray[i].transactionId}`,
              });
              await newIncome.save();
            }
          }

          const partsInvoiceNumber = invoiceNumber.trim().split("-");
          const desiredInvoiceNumber =
            partsInvoiceNumber[partsInvoiceNumber.length - 1];
          console.log("desiredinvoicenumber", desiredInvoiceNumber);
          const response1 = await axios.post(
            "https://i4lq3shjzl.execute-api.us-east-1.amazonaws.com/dev/utils/invoiceNumber",
            { number: desiredInvoiceNumber },
            // "http://localhost:5000/utils/invoiceNumber", { number: desiredInvoiceNumber },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log("is invoice number updated", response1.data);
          return res.status(200).send("the Sale has been added successfully!");
        }



        console.log("show all incomes", allIncomes);
        let lastBalance;
        //last expense bal
        if (allIncomes[allIncomes.length - 1].balance) {
          lastBalance = +allIncomes[allIncomes.length - 1].balance;
        } else {
          lastBalance = 0;
        }
        // const newBalance = lastBalance + +creditedPrice
        // console.log("newbal", newBalance)

        // need work

        
        for (let data of bankArray) {
          lastBalance += +data.amount;

          console.log("newbal", lastBalance);

          const newIncome = Income({
            // add Data work is done

            type: "Sales",
            date: date, // You should use the appropriate date format
            debit: "",
            credit: data.amount,
            balance: lastBalance,
            receivedBy: "Own",
            givenTo: "",
            partyName: customerName,
            reference: "Invoice",
            description: `Payment Details: Bank Account: ${data.bankAccount}  || Amount: ${data.amount} || Payment Type: ${data.paymentType} || Transaction ID: ${data.transactionId}`,
            picture: invoiceNumber,
          });
          await newIncome.save();
        }
        ////////////////////////
      }
      const partsInvoiceNumber = invoiceNumber.trim().split("-");
      const desiredInvoiceNumber =
        partsInvoiceNumber[partsInvoiceNumber.length - 1];
      console.log("desiredinvoicenumber", desiredInvoiceNumber);
      const response1 = await axios.post(
        "https://i4lq3shjzl.execute-api.us-east-1.amazonaws.com/dev/utils/invoiceNumber",
        { number: desiredInvoiceNumber },
        // "http://localhost:5000/utils/invoiceNumber", { number: desiredInvoiceNumber },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("is invoice number updated", response1.data);
      return res.status(200).send("the Sale has been added successfully!");
    } else {
      console.log("we are in yes block");
      for (const data3 of tableData) {
        console.log("we are in forloop first", data3);
        const foundProduct = await Product.findOne({
          productName: data3.productName,
        });
        console.log("foundproductzzzz", foundProduct);
        if (foundProduct.currentStock === "Define In CRM")
          return res
            .status(400)
            .send(
              "Cannot add a sale. Product stock is not updated. kindly update the current stock and try again later!"
            );
        const quantityNumber = parseInt(data3.quantity, 10);
        console.log("quantitynumber", quantityNumber);
        console.log("founcproductcurrentstock", foundProduct.currentStock);
        const currentQuantity = parseInt(foundProduct.currentStock, 10);
        console.log("currentquantitu", currentQuantity);
        const updatedQuantity = currentQuantity - quantityNumber;
        console.log("updatedQuantity", updatedQuantity);
        if (updatedQuantity < 0)
          return res
            .status(400)
            .send(
              "Cannot add a sale. Stock is not sufficient as per your sale needs! you need to add more products."
            );
        const updatedProduct = await Product.findOneAndUpdate(
          { productName: data3.productName },
          {
            $set: {
              currentStock: updatedQuantity,
            },
          },
          { new: true }
        );
        console.log("updated product", updatedProduct);
        const date = new Date();

        // Format the date as a string in the desired format
        // const formattedDate = date.toLocaleString("en-IN", {
        //     timeZone: "Asia/Kolkata",
        //     year: "numeric",
        //     month: "2-digit",
        //     day: "2-digit",
        //     hour: "2-digit",
        //     minute: "2-digit",
        //     second: "2-digit",
        // });

        // console.log(formattedDate);  //comment because we are getting date from frontend

        //finding customer in mongodb for updating

        const foundCustomer = await Customer.findOne({
          name: req.body.customerName,
        });
        let customerBoughtArray = [];
        customerBoughtArray = foundCustomer.customerBought;
        console.log("customerbought", customerBoughtArray);
        if (customerBoughtArray === undefined) {
          console.log("yes we are in this");
          customerBoughtArray = [];
        }
        const object = {};
        object.productName = foundProduct.productName;
        object.productDescription = foundProduct.productDescription;
        object.dateBought = date;
        object.productQty = data3.quantity;
        console.log(
          "customer bought array before pushing",
          customerBoughtArray
        );
        customerBoughtArray.push(object);

        console.log(
          "logging the array before updating the customer".customerBoughtArray
        );
        const updatedCustomer = await Customer.findOneAndUpdate(
          { name: req.body.customerName },
          {
            $set: {
              customerBought: customerBoughtArray,
            },
          },
          { new: true }
        );
        console.log("updated customer", updatedCustomer);
        const newSale = Sales({
          customerId: foundCustomer.customerId,
          productId: foundProduct.productId,
          quantity: data3.quantity,
          saleDate: date,
        });
        await newSale.save();
        //now all the products updations are done now chart of account logic is left!
        const creditedPrice = foundProduct.price * data3.quantity;
        console.log("creditedprice", creditedPrice);

        const customerName = foundCustomer.name;

        //now its cashtype no so we are saving directly into income
        const allAssets = await Asset.find();

        if (!allAssets || allAssets.length === 0) {
          for (let i = 0; i < cashArray.length; i++) {
            if (i === 0) {
              let newBal = cashArray[i].amount;

              //need work

              const newAsset = new Asset({
                type: "Cash in hand",
                date: date,
                credit: cashArray[i].amount,
                balance: newBal,
                receivedBy: "Own",
                partyName: customerName,
                reference: "Invoice",
                picture: invoiceNumber,
                description: `Payment Details : Amount in ₹ : ${cashArray[i].amount} || Received By : ${cashArray[i].receivedBy}`,
              });
              await newAsset.save();
            } else {
              const allAsset = await Asset.find();
              let lastBalance = +allAsset[allAsset.length - 1].balance;
              console.log("o last bal", lastBalance);
              let newBal = +lastBalance + +cashArray[i].amount;

              const newAsset = new Asset({
                type: "Cash in hand",
                date: date,
                credit: cashArray[i].amount,
                balance: newBal,
                receivedBy: "Own",
                partyName: customerName,
                reference: "Invoice",
                picture: invoiceNumber,
                description: `Payment Details : Amount in ₹ : ${cashArray[i].amount} || Received By : ${cashArray[i].receivedBy}`,
              });
              await newAsset.save();
            }
          }

          // Check

          //
          //

          // Extracting string after the last '-'
          const partsInvoiceNumber = invoiceNumber.trim().split("-");
          const desiredInvoiceNumber =
            partsInvoiceNumber[partsInvoiceNumber.length - 1];
          console.log("desiredinvoicenumber", desiredInvoiceNumber);

          const response1 = await axios.post(
            "https://i4lq3shjzl.execute-api.us-east-1.amazonaws.com/dev/utils/invoiceNumber",
            { number: desiredInvoiceNumber },
            // "http://localhost:5000/utils/invoiceNumber", { number: desiredInvoiceNumber },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log("is invoice number updated", response1.data);
          return res
            .status(200)
            .send("the Sale as Cash in hand has been added successfully!");
        }

        console.log("show all assets", allAssets);

        let lastBalance;
        //last expense bal
        if (allAssets[allAssets.length - 1].balance) {
          lastBalance = +allAssets[allAssets.length - 1].balance;
        } else {
          lastBalance = 0;
        }
        // const newBalance = lastBalance + +creditedPrice;
        //   console.log("newbal", newBalance);

        //need work
        for (let data of cashArray) {
          lastBalance += +data.amount;

          console.log("newbal", lastBalance);

          const newAsset = Asset({
            // add Data work is done

            type: "Cash in hand",
            date: date, // You should use the appropriate date format
            debit: "",
            credit: data.amount,
            balance: lastBalance,
            receivedBy: "Own",
            givenTo: "",
            partyName: customerName,
            reference: "Invoice",
            picture: invoiceNumber,
            description: `Payment Details : Amount in ₹ : ${data.amount} || Received By : ${data.receivedBy}`,
          });
          await newAsset.save();
        }

        //
        //end
        //
        //
        const partsInvoiceNumber = invoiceNumber.trim().split("-");
        const desiredInvoiceNumber =
          partsInvoiceNumber[partsInvoiceNumber.length - 1];
        console.log("desiredinvoicenumber", desiredInvoiceNumber);
        const response1 = await axios.post(
          "https://i4lq3shjzl.execute-api.us-east-1.amazonaws.com/dev/utils/invoiceNumber",
          { number: desiredInvoiceNumber },
          // "http://localhost:5000/utils/invoiceNumber", { number: desiredInvoiceNumber },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("is invoice number updated", response1.data);
        return res
          .status(200)
          .send("the Sale as Cash in hand has been added successfully!");
      }
    }
  } catch (error) {
    return res.status(500).send(`Internal Server Error${error}`);
  }
});

module.exports = router;
