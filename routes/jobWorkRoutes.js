const express = require("express");
const { JobWork } = require("../models/jobWork");
const { Expense } = require("../models/expenses");
const { Asset } = require("../models/assets");
const { RawMaterial } = require("../models/rawMaterial");
const { Vendor } = require("../models/vendor");
const router = express.Router();

router.post("/edit", async (req, res) => {
    console.log("logging what came in body", req.body);
    const {
        rawMaterialName, rawMaterialType, vendorName, givenDate, givenPurity, givenWeight, returnDate, returnPurity, returnWeight, priceDecided, description, pictureName1, pictureName2, jobWorkId } = req.body;

    try {
        const foundJobWork = await JobWork.find({ jobWorkId });
        if (!foundJobWork)
            return res
                .status(400)
                .send(
                    "JobWork with the raw material is not found! Please get it checked!"
                );
        //for the image- we are saving the image actual name in the database so that we can take it and search for it in the google firebase bucket
        const updatedJobWork = await JobWork.findOneAndUpdate(
            { jobWorkId },
            {
                $set: {
                    rawMaterialType, vendorName, givenDate, givenPurity, givenWeight, returnDate, returnPurity, returnWeight, priceDecided, description, pictureName1, pictureName2
                },
            },
            { new: true }
        );
        console.log("updated JobWork", updatedJobWork)

        //now after updating that we have to update the corresponding asset or expense so that we can add the other picture2
        //firstwe are finding in asset 
        const foundAsset = await Asset.findOne({ description: jobWorkId })
        if (foundAsset) {
            const updateAsset = await Asset.findOneAndUpdate({ description: jobWorkId }, {
                $set: {
                    picture2: pictureName2
                }
            })

            console.log("updated asset", updateAsset)

        }
        const foundExpense = await Expense.findOne({ description: jobWorkId })
        if (foundExpense) {
            const updateExpense = await Expense.findOneAndUpdate({ description: jobWorkId }, {
                $set: {
                    picture2: pictureName2
                }
            })

            console.log("updated Expense", updateExpense)
        }
        res.status(200).send("the JobWork has been updated successfully!");
    } catch (error) {
        console.log("something went wrong", error.message); res.status(500).send(`internal server error - ${error.message}`)
    }
});

router.get('/fetch', async (req, res) => {
    try {
        const jobWorks = await JobWork.find();
        res.status(200).send(jobWorks);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// POST a new job work
router.post('/update', async (req, res) => {
    const { rawMaterialName, rawMaterialType, vendorName, givenDate, givenPurity, givenWeight, priceDecided, description, paymentCash, pictureName } = req.body
    const randomNumber =
        Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    const jobWorkId = randomNumber.toString();
    let loweredName = rawMaterialName.toLowerCase()

    try {
        if (paymentCash === "No") {
            const jobWork = new JobWork({ rawMaterialName, rawMaterialType, vendorName, givenDate, givenPurity, givenWeight, priceDecided, description, paymentCash, pictureName1: pictureName, jobWorkId });
            await jobWork.save();
            /////////////////////


            
            // find rawMaterialName 
            const rawMaterialNameData = await RawMaterial.findOne({"name" : loweredName})

            if(rawMaterialNameData){
            // console.log("Rawmaterial data" , rawMaterialNameData)
            const currentWeight1 = +rawMaterialNameData.currentWeight - +givenWeight
            console.log("current weright" , currentWeight1)

            // verdorid 
            const vendorData = await Vendor.findOne({"name" : vendorName})
            const vendorId = vendorData.vendorId

            console.log("vendor id" , vendorId)

            let rawMaterilObj = {
                description,
                price : priceDecided,
                type: "Vendor",
                vendorId : vendorId,
                date : givenDate,
                weight : `-${givenWeight}`,
                picture: pictureName
            }

            console.log("row obj" , rawMaterilObj)
            //add raw Material array
          const rawMaterialArray =   rawMaterialNameData.rawMaterialEntryArray
          rawMaterialArray.push(rawMaterilObj)

            console.log("new arr" , rawMaterialNameData)


            //update rawMaterial Array

            const updatedRawMaterial = await RawMaterial.findOneAndUpdate(
                { name: loweredName },
                {
                    $set: {
                        rawMaterialEntryArray: rawMaterialArray,
                        currentWeight: currentWeight1,
                        lastStockDate: givenDate, lastBoughtPrice: priceDecided
                    },
                },
                { new: true }
            );
            console.log("updated RawMaterial", updatedRawMaterial);

            }else{
                return res.status(400).send("Please add rawMaterial first")
            }
///////////////////////////////////////////////////////////////////////////

          

            //get all expense
            const allExpense = await Expense.find({ type: "Job works" })
            console.log("all expense that should be jobworks only", allExpense)
            if (!allExpense || allExpense.length === 0) {
                const newExpense = await new Expense({
                    //add new exp data

                    "type": "Job works",
                    "date": givenDate,
                    "debit": priceDecided,
                    "credit": "",
                    "balance": `-${priceDecided}`,
                    "receivedBy": "",
                    "givenTo": "Vendor",
                    "partyName": vendorName,
                    "reference": "Other",
                    "description": jobWorkId,
                    "picture": pictureName
                })

                await newExpense.save()
            } else {

                console.log("all expense", allExpense)
                //last expense bal

                let expenseBalance
                //last expense bal
                if ((allExpense[allExpense.length - 1].balance)) {
                    expenseBalance = +(allExpense[allExpense.length - 1].balance)
                } else {
                    expenseBalance = 0
                }
                //get new expense bal
                const newExpenseBalance = expenseBalance - +priceDecided

                //new expense update in db

                const newExpense = await new Expense({
                    //add new exp data

                    "type": "Job works",
                    "date": givenDate,
                    "debit": priceDecided,
                    "credit": "",
                    "balance": newExpenseBalance,
                    "receivedBy": "",
                    "givenTo": "Own",
                    "partyName": vendorName,
                    "reference": "Other",
                    "description": jobWorkId,
                    "picture": pictureName
                })
                await newExpense.save()

            }
            ////////////////
            res.status(200).send("Job work has been saved successfully");
        } else {


            const jobWork = new JobWork({ rawMaterialName, rawMaterialType, vendorName, givenDate, givenPurity, givenWeight, priceDecided, description, paymentCash, pictureName1: pictureName, jobWorkId });
            await jobWork.save();


            ///////////////////////////////////////
                
            // find rawMaterialName 
            const rawMaterialNameData = await RawMaterial.findOne({"name" : loweredName})

            if(rawMaterialNameData){
            // console.log("Rawmaterial data" , rawMaterialNameData)
            const currentWeight1 = +rawMaterialNameData.currentWeight - +givenWeight

            console.log("current weright" , currentWeight1)

            const vendorData = await Vendor.findOne({"name" : vendorName})
            const vendorId = vendorData.vendorId

            console.log("vendor id" , vendorId)

            let rawMaterilObj = {
                description,
                price : priceDecided,
                type: "Vendor",
                vendorId : vendorId,
                date : givenDate,
                weight : `-${givenWeight}`,
                picture: pictureName
            }

            console.log("row obj" , rawMaterilObj)
            //add raw Material array
          const rawMaterialArray =   rawMaterialNameData.rawMaterialEntryArray
          rawMaterialArray.push(rawMaterilObj)

            console.log("new arr" , rawMaterialNameData)


            //update rawMaterial Array

            const updatedRawMaterial = await RawMaterial.findOneAndUpdate(
                { name: loweredName },
                {
                    $set: {
                        rawMaterialEntryArray: rawMaterialArray,
                        currentWeight: currentWeight1,
                        lastStockDate: givenDate, lastBoughtPrice: priceDecided
                    },
                },
                { new: true }
            );
            console.log("updated RawMaterial", updatedRawMaterial);

            }else{
                return res.status(400).send("Please add rawMaterial first")
            }


            /////////////////////////////////////////



            /////////////////////
            //get all expense
            const allAssets = await Asset.find({ type: "Cash in hand" })
            console.log("allassets that should be only cash in hand", allAssets)
            if (!allAssets || allAssets.length === 0) {
                const newAsset = await new Asset({
                    //add new exp data
                    "type": "Cash in hand",
                    "date": givenDate,
                    "debit": priceDecided,
                    "credit": "",
                    "balance": `-${priceDecided}`,
                    "receivedBy": "",
                    "givenTo": "Vendor",
                    "partyName": vendorName,
                    "reference": "Other",
                    "description": jobWorkId,
                    "picture": pictureName
                })
                await newAsset.save()
            } else {
                console.log("all asset", allAssets)
                //last expense bal
                let assetBalance
                //last expense bal
                if (allAssets[allAssets.length - 1].balance) {
                    assetBalance = +(allAssets[allAssets.length - 1].balance)
                } else {
                    assetBalance = 0
                }
                //get new expense bal
                const newAssetBalance = assetBalance - +priceDecided
                //new expense update in db
                const newAsset = await new Asset({
                    //add new exp data
                    "type": "Cash in hand",
                    "date": givenDate,
                    "debit": priceDecided,
                    "credit": "",
                    "balance": newAssetBalance,
                    "receivedBy": "",
                    "givenTo": "Own",
                    "partyName": vendorName,
                    "reference": "Other",
                    "description": jobWorkId,
                    "picture": pictureName
                })
                await newAsset.save()
            }
            ////////////////
            res.status(200).send("Job work has been saved successfully");
        }
    } catch (error) {
        res.status(400).send(error.message);
    }

});

module.exports = router;