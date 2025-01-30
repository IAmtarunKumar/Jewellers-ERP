const express = require("express");
const getAllRawMaterials = require("../controllers/crmControllers/getAllRawMaterials.js");
const editRawMaterial = require("../controllers/crmControllers/editApis/editRawMaterial.js");
const { RawMaterial } = require("../models/rawMaterial.js");
const { Supplier } = require("../models/supplier.js");
const { Expense } = require("../models/expenses.js");
const { Asset } = require("../models/assets.js");

const router = express.Router();

// router.get("/", getAllRawMaterials); //veer code
router.post("/edit", editRawMaterial);

router.get("/fetch", async (req, res) => {
  try {
    const rawMaterials = await RawMaterial.find();
    res.json(rawMaterials);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// POST a new raw material
router.post("/update", async (req, res) => {
  // const { name, type, initialWeight, price, description, initialStockDate, supplierId  , paymentCash} = req.body
  console.log("lets check whats coming in body", req.body);
  const {
    name,
    type,
    price,
    description,
    supplierId,
    paymentCash,
    weight,
    date,
    pictureName,
  } = req.body;
  let loweredName = name.toLowerCase();

  try {
    const foundRawMaterial = await RawMaterial.findOne({ name: loweredName });
    if (!foundRawMaterial) {
      if (paymentCash === "No") {
        console.log("we are firstno");

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

        let rawMaterialArray = [
          {
            description,
            price,
            type: "Supplier",
            supplierId,
            date,
            weight,
            picture: pictureName,
          },
        ];

        const rawMaterial = new RawMaterial({
          name: loweredName,
          type,
          initialWeight: weight,
          currentWeight: weight,
          initialStockDate: date,
          lastStockDate: date,
          rawMaterialEntryArray: rawMaterialArray,
          lastBoughtPrice: price,
        });
        await rawMaterial.save();
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

        let rawMaterialArray = [
          {
            description,
            price,
            type: "Supplier",
            supplierId,
            date,
            weight,
            picture: pictureName,
          },
        ];
        console.log(
          "we are console logging rawmaterialarray",
          rawMaterialArray
        );
        const rawMaterial = new RawMaterial({
          name: loweredName,
          type,
          initialWeight: weight,
          currentWeight: weight,
          initialStockDate: date,
          lastStockDate: date,
          rawMaterialEntryArray: rawMaterialArray,
          lastBoughtPrice: price,
        });

        await rawMaterial.save();
        console.log("we are after rawmaterialsave");

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
