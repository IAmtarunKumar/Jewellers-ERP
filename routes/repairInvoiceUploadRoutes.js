const express = require("express");
const { Taxes } = require("../models/taxes");
const Product = require("../models/product");
const { Customer } = require("../models/customer");
const { Income } = require("../models/income");
const { Asset } = require("../models/assets");
// const { Sales } = require("../models/sales");
const { default: axios } = require("axios");
const { Repair } = require("../models/repairs");

const router = express.Router();

// Create an taxes
router.post("/", async (req, res) => {
  console.log("whatscoming in bodyin repair invoice routes", req.body);
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
      paymentCash,
      paymentDueDate,
      roundedTotal,
      tableData,
      taxCategory,
      taxType,
      totalAdvance,
      totalAmount,
      totalQuantity,
      address,
      pincode,
      returnDate,
      bankArray,
      cashArray,
    } = req.body;
    console.log("tabledata", tableData);
    if (paymentCash === "No") {
      console.log("req.bodyhere", req.body);

      let repairArray = tableData;

      const newRepair = Repair({
        invoiceNumber,
        totalAmount,
        date,
        repairArray,
      });
      await newRepair.save();

      const allIncomes = await Income.find();

      if (!allIncomes || allIncomes.length === 0) {
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
        return res.status(200).send("the Repaire has been added successfully!");
      }

      console.log("show all incomes", allIncomes);

      let lastBalance;
      //last expense bal
      if (allIncomes[allIncomes.length - 1].balance) {
        lastBalance = +allIncomes[allIncomes.length - 1].balance;
      } else {
        lastBalance = 0;
      }

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
      return res.status(200).send("the Repair has been added successfully!");
    } else {
      // const date = new Date();
      // const foundProduct = await Product.findOne({
      //   productName: data3.productName,
      // });
      // const foundCustomer = await Customer.findOne({
      //   name: req.body.customerName,
      // });

      const newRepair = Repair({
        invoiceNumber,
        totalAmount,
        date,
        repairArray,
      });
      await newRepair.save();

      //now all the products updations are done now chart of account logic is left!
      // const creditedPrice = foundProduct.price * data3.quantity;
      // console.log("creditedprice", creditedPrice);
      // const customerName = foundCustomer.name;

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

        console.log("working //////////////////////////////");
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
          .send("the Repair as Cash in hand has been added successfully!");
      }

      console.log("show all assets", allAssets);

      let lastBalance;
      //last expense bal
      if (allAssets[allAssets.length - 1].balance) {
        lastBalance = +allAssets[allAssets.length - 1].balance;
      } else {
        lastBalance = 0;
      }

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

      // const newAsset = Asset({
      //   // add Data work is done

      //   type: "Cash in hand",
      //   date: date, // You should use the appropriate date format
      //   debit: "",
      //   credit: creditedPrice,
      //   balance: newBalance,
      //   receivedBy: "Own",
      //   givenTo: "",
      //   partyName: customerName,
      //   reference: "Invoice",
      //   description: "",
      //   picture: invoiceNumber,
      // });
      // await newAsset.save();
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
        .send("the Repair as Cash in hand has been added successfully!");
    }
  } catch (error) {
    return res.status(500).send(`Internal Server Error${error}`);
  }
});

// as

// POST a new raw material
router.post("/update", async (req, res) => {
  // const { name, type, initialWeight, price, description, initialStockDate, supplierId  , paymentCash} = req.body
  console.log("lets check whats coming in body", req.body);
  const {
    address,
    customerName,
    date,
    grandTotal,
    invoiceNumber,
    orgName,
    paymentCash,
    pincode,
    returnDate,
    taxCategory,
    totalAdvance,
    totalAmount,
    totalQuantity,
    totalTax,
    tableData,
    cashArray,
    bankArray,
  } = req.body;
  let loweredName = customerName.toLowerCase();

  try {
    const foundRawMaterial = await Repair.findOne({ name: loweredName });
    if (!foundRawMaterial) {
      if (paymentCash === "No") {
        console.log("we are first no");

        /////////////////////
        // //check supplierID exist or not
        // const checkSupplier = await Supplier.findOne({ supplierId })
        // if (!checkSupplier) {
        //     return res.status(400).send("Supplier with the desired ID is not found! Please get it checked!")
        // }

        // console.log("check supplier details", checkSupplier)

        // //get supplier name

        // const supplierName = checkSupplier.name
        // console.log(supplierName)

        //save row material in db

        let repairArray = tableData;

        const rawMaterial = new Repair({
          address,
          customerName,
          date,
          grandTotal,
          invoiceNumber,
          orgName,
          paymentCash,
          pincode,
          returnDate,
          taxCategory,
          totalAdvance,
          totalAmount,
          totalQuantity,
          totalTax,
          tableData: repairArray,
        });
        await rawMaterial.save();

        //get all expense
        const allExpense = await Income.find({ type: "Repairs" });
        if (!allExpense || allExpense.length === 0) {
          const newExpense = await new Income({
            //add new exp data
            type: "Repairs",
            date: date,
            debit: totalAmount,
            credit: "",
            balance: `-${totalAmount}`,
            receivedBy: "",
            givenTo: "Supplier",
            partyName: customerName,
            reference: "Other",
            description: "",
            picture: pictureName,
          });

          await newExpense.save();
        } else {
          console.log("all expense", allExpense);
          //last expense bal
          let expenseBalance;
          //last expense bal
          if (allExpense[allExpense.length - 1].balance) {
            expenseBalance = +allExpense[allExpense.length - 1].balance;
          } else {
            expenseBalance = 0;
          }
          //get new expense bal
          const newExpenseBalance = expenseBalance - +price;

          //new expense update in db
          const newExpense = await new Income({
            //add new exp data

            type: "Repairs",
            date: date,
            debit: "",
            credit: totalAmount,
            balance: newExpenseBalance,
            receivedBy: "",
            givenTo: "Supplier",
            partyName: customerName,
            reference: "Other",
            description: "",
            picture: pictureName,
          });

          await newExpense.save();
        }

        ////////////////
        res.status(200).send("raw material has been saved successfully!");
      } else {
        console.log("we are firstyes");
        /////////////////////
        //check supplierID exist or not
        const checkSupplier = await Supplier.findOne({ supplierId });
        if (!checkSupplier) {
          return res
            .status(400)
            .send(
              "Supplier with the desired ID is not found! Please get it checked!"
            );
        }

        console.log("check supplier details", checkSupplier);

        const supplierName = checkSupplier.name;
        console.log(supplierName);

        //save row material in db

        //get all expense
        const allAssets = await Asset.find({ type: "Cash in hand" });
        if (!allAssets || allAssets.length === 0) {
          const newAsset = await new Asset({
            //add new exp data
            type: "Cash in hand",
            date: date,
            debit: price,
            credit: "",
            balance: `-${price}`,
            receivedBy: "",
            givenTo: "Supplier",
            partyName: supplierName,
            reference: "Other",
            description: "",
            picture: "",
          });

          await newAsset.save();
        } else {
          console.log("all asset", allAssets);
          let assetBalance;
          //last expense bal
          if (allAssets[allAssets.length - 1].balance) {
            assetBalance = +allAssets[allAssets.length - 1].balance;
          } else {
            assetBalance = 0;
          }
          const newAssetBalance = assetBalance - +price;
          //new expense update in db
          const newAsset = await new Asset({
            //add new exp data
            type: "Cash in hand",
            date: date,
            debit: price,
            credit: "",
            balance: newAssetBalance,
            receivedBy: "",
            givenTo: "Supplier",
            partyName: supplierName,
            reference: "Other",
            description: "",
            picture: "",
          });

          await newAsset.save();
        }
        ////////////////
        res.status(200).send("raw material has been saved successfully!");
      }
    } else {
      if (paymentCash === "No") {
        console.log("we are in secondno");

        /////////////////////
        //check supplierID exist or not
        const checkSupplier = await Supplier.findOne({ supplierId });
        if (!checkSupplier) {
          return res
            .status(400)
            .send(
              "Supplier with the desired ID is not found! Please get it checked!"
            );
        }

        console.log("check supplier details", checkSupplier);

        //get supplier name

        const supplierName = checkSupplier.name;
        console.log(supplierName);

        //save row material in db
        const foundRawMaterial = await RawMaterial.findOne({
          name: loweredName,
        });
        const currentWeight1 = +foundRawMaterial.currentWeight + +weight;

        let object = {
          description,
          price,
          type: "Supplier",
          supplierId,
          date,
          weight,
        };
        const arrayToUpdate = foundRawMaterial.rawMaterialEntryArray;
        arrayToUpdate.push(object);
        console.log("loggingarray before updating", arrayToUpdate);
        const updatedRawMaterial = await RawMaterial.findOneAndUpdate(
          { name: loweredName },
          {
            $set: {
              rawMaterialEntryArray: arrayToUpdate,
              currentWeight: currentWeight1,
              lastStockDate: date,
              lastBoughtPrice: price,
            },
          },
          { new: true }
        );
        console.log("updated RawMaterial", updatedRawMaterial);

        //get all expense
        const allExpense = await Expense.find({ type: "Raw materials" });
        if (!allExpense || allExpense.length === 0) {
          const newExpense = await new Expense({
            //add new exp data

            type: "Raw materials",
            date: date,
            debit: price,
            credit: "",
            balance: `-${price}`,
            receivedBy: "",
            givenTo: "Supplier",
            partyName: supplierName,
            reference: "Other",
            description: "",
            picture: pictureName,
          });

          await newExpense.save();
        } else {
          console.log("all expense", allExpense);
          //last expense bal

          let expenseBalance;
          //last expense bal
          if (allExpense[allExpense.length - 1].balance) {
            expenseBalance = +allExpense[allExpense.length - 1].balance;
          } else {
            expenseBalance = 0;
          }
          //get new expense bal
          const newExpenseBalance = expenseBalance - +price;

          //new expense update in db
          const newExpense = await new Expense({
            //add new exp data

            type: "Raw materials",
            date: date,
            debit: price,
            credit: "",
            balance: newExpenseBalance,
            receivedBy: "",
            givenTo: "Supplier",
            partyName: supplierName,
            reference: "Other",
            description: "",
            picture: pictureName,
          });

          await newExpense.save();
        }
        ////////////////
        res.status(200).send("raw material has been saved successfully!");
      } else {
        console.log("we are in secondyes");

        ////////////////////////////////////////////////////////////////////////////

        //check supplierID exist or not
        const checkSupplier = await Supplier.findOne({ supplierId });
        if (!checkSupplier) {
          return res
            .status(400)
            .send(
              "Supplier with the desired ID is not found! Please get it checked!"
            );
        }

        console.log("check supplier details", checkSupplier);

        const supplierName = checkSupplier.name;
        console.log(supplierName);

        //save row material in db
        const foundRawMaterial = await RawMaterial.findOne({
          name: loweredName,
        });
        const currentWeight1 = +foundRawMaterial.currentWeight + +weight;

        let object = {
          description,
          price,
          type: "Supplier",
          supplierId,
          date,
          weight,
        };
        const arrayToUpdate = foundRawMaterial.rawMaterialEntryArray;
        arrayToUpdate.push(object);
        console.log("loggingarray before updating", arrayToUpdate);
        const updatedRawMaterial = await RawMaterial.findOneAndUpdate(
          { name: loweredName },
          {
            $set: {
              rawMaterialEntryArray: arrayToUpdate,
              currentWeight: currentWeight1,
              lastStockDate: date,
              lastBoughtPrice: price,
            },
          },
          { new: true }
        );
        console.log("updated RawMaterial", updatedRawMaterial);

        //get all expense
        const allAssets = await Asset.find({ type: "Cash in hand" });
        if (!allAssets || allAssets.length === 0) {
          const newAsset = await new Asset({
            //add new exp data

            type: "Cash in hand",
            date: date,
            debit: price,
            credit: "",
            balance: `-${price}`,
            receivedBy: "",
            givenTo: "Supplier",
            partyName: supplierName,
            reference: "Other",
            description: "",
            picture: pictureName,
          });

          await newAsset.save();
        } else {
          console.log("all asset", allAssets);
          let assetBalance;
          //last expense bal
          if (allAssets[allAssets.length - 1].balance) {
            assetBalance = +allAssets[allAssets.length - 1].balance;
          } else {
            assetBalance = 0;
          }
          //get new expense bal
          const newAssetBalance = assetBalance - +price;

          //new expense update in db
          const newAsset = await new Asset({
            //add new exp data
            type: "Cash in hand",
            date: date,
            debit: price,
            credit: "",
            balance: newAssetBalance,
            receivedBy: "",
            givenTo: "Supplier",
            partyName: supplierName,
            reference: "Other",
            description: "",
            picture: pictureName,
          });

          await newAsset.save();
        }
        ////////////////
        res.status(200).send("raw material has been saved successfully!");
      }
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
