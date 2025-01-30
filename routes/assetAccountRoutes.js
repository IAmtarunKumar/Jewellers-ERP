const express = require("express");
const { Asset } = require("../models/assets");
const csv = require("csvtojson")
const router = express.Router();
const multer = require("multer")
const upload = multer()
router.get("/asset", async (req, res) => {
    try {
        const allAsset = await Asset.find();
        if (!allAsset || allAsset.length === 0) return res.status(400).send("No Asset type was found!")
        res.status(200).send(allAsset);
    } catch (error) {
        res.status(500).send(`Internal Server Error${error.message}`);
    }
});

// Create an Asset
router.post("/asset", async (req, res) => {
    console.log("whats coming in body", req.body)
    const payload = req.body;
    const { amount, date, description, partyName, receivedOrSent, reference, type, assetType, pictureName } = req.body //just take the image name as well so that you can assign it in mongodb
    if (reference !== "Others" && pictureName === "") return res.status(400).send("image file is required for documentation purpose!")

    //first we will check that cashinhand is empty or not if it is empty then we add balance as the credit/debit account otherwise we will check the last one and then add or remove the credit or debit amount to update the balance.

    switch (assetType) {
        case "Cash in hand":
            console.log("we are in cash in hand block");
            try {
                let partyName2;//this is the party name when receivedOrSent is set "own"
                if (receivedOrSent === "Own") {
                    partyName2 = "Self"
                } else { partyName2 = partyName }
                const allCashInHands = await Asset.find({ type: "Cash in hand" })
                let picture2; //this is the picture namewhen reference is others
                if (reference === "Others") {
                    picture2 = ''
                } else {
                    picture2 = pictureName
                }
                if (allCashInHands.length === 0) { //when no cashinhand is there
                    if (type === "Debit") {
                        const newAsset = new Asset({ type: assetType, date, debit: amount, balance: `-${amount}`, givenTo: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newAsset.save();

                        return res.status(200).send("Cash in hand Posted Successfully");
                    }
                    if (type === "Credit") {
                        const newAsset = new Asset({ type: assetType, date, credit: amount, balance: `${amount}`, receivedBy: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newAsset.save();

                        return res.status(200).send("Cash in hand Posted Successfully");
                    }

                } else {
                    //now we will first fetch the last balance amount 
                    const lastBalance = allCashInHands[allCashInHands.length - 1].balance
                    console.log("last balance", lastBalance)
                    function debitBalanceFunction(amount) {

                        const total = (parseInt(lastBalance) - parseInt(amount)).toString();
                        return total
                    }
                    function creditBalanceFunction(amount) {
                        const total = (parseInt(lastBalance) + parseInt(amount)).toString();
                        return total
                    }
                    if (type === "Debit") {
                        // console.log("checking the received orsent", receivedOrSent)
                        const newAsset = new Asset({ type: assetType, date, debit: amount, balance: debitBalanceFunction(amount), givenTo: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        // console.log("new asset before saving", newAsset)
                        await newAsset.save();
                        return res.status(200).send("Cash in hand Posted Successfully");
                    }
                    if (type === "Credit") {
                        // console.log("checking the received orsent", receivedOrSent)
                        const newAsset = new Asset({ type: assetType, date, credit: amount, balance: creditBalanceFunction(amount), receivedBy: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        // console.log("new asset before saving", newAsset)

                        await newAsset.save();
                        return res.status(200).send("Cash in hand Posted Successfully");
                    }
                }
            } catch (error) {
                res.status(500).send(`Internal Server Error${error.message}`);
            }
            break;
        case "Bank account":
            console.log("we are in bank account block");
            try {
                let partyName2;//this is the party name when receivedOrSent is set "own"
                if (receivedOrSent === "Own") {
                    partyName2 = "Self"
                } else { partyName2 = partyName }
                const allBankAccounts = await Asset.find({ type: "Bank account" })
                let picture2; //this is the picture namewhen reference is others
                if (reference === "Others") {
                    picture2 = ''
                } else {
                    picture2 = pictureName
                }
                if (allBankAccounts.length === 0) { //when no cashinhand is there
                    if (type === "Debit") {
                        const newAsset = new Asset({ type: assetType, date, debit: amount, balance: `-${amount}`, givenTo: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newAsset.save();

                        return res.status(200).send("Bank account Posted Successfully");
                    }
                    if (type === "Credit") {
                        const newAsset = new Asset({ type: assetType, date, credit: amount, balance: `${amount}`, receivedBy: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newAsset.save();

                        return res.status(200).send("Bank account Posted Successfully");
                    }

                } else {
                    //now we will first fetch the last balance amount 
                    const lastBalance = allBankAccounts[allBankAccounts.length - 1].balance
                    console.log("last balance", lastBalance)
                    function debitBalanceFunction(amount) {

                        const total = (parseInt(lastBalance) - parseInt(amount)).toString();
                        return total
                    }
                    function creditBalanceFunction(amount) {
                        const total = (parseInt(lastBalance) + parseInt(amount)).toString();
                        return total
                    }
                    if (type === "Debit") {
                        const newAsset = new Asset({ type: assetType, date, debit: amount, balance: debitBalanceFunction(amount), givenTo: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newAsset.save();
                        return res.status(200).send("Bank account Posted Successfully");
                    }
                    if (type === "Credit") {
                        const newAsset = new Asset({ type: assetType, date, credit: amount, balance: creditBalanceFunction(amount), receivedBy: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newAsset.save();
                        return res.status(200).send("Bank account Posted Successfully");
                    }
                }
            } catch (error) {
                res.status(500).send(`Internal Server Error${error.message}`);
            }
            break;
        case "Properties":
            console.log("we are in properties block");
            try {
                let partyName2;//this is the party name when receivedOrSent is set "own"
                if (receivedOrSent === "Own") {
                    partyName2 = "Self"
                } else { partyName2 = partyName }
                const allProperties = await Asset.find({ type: "Properties" })
                let picture2; //this is the picture namewhen reference is others
                if (reference === "Others") {
                    picture2 = ''
                } else {
                    picture2 = pictureName
                }
                if (allProperties.length === 0) { //when no cashinhand is there
                    if (type === "Debit") {
                        const newAsset = new Asset({ type: assetType, date, debit: amount, balance: `-${amount}`, givenTo: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newAsset.save();

                        return res.status(200).send("Properties Posted Successfully");
                    }
                    if (type === "Credit") {
                        const newAsset = new Asset({ type: assetType, date, credit: amount, balance: `${amount}`, receivedBy: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newAsset.save();

                        return res.status(200).send("Properties Posted Successfully");
                    }

                } else {
                    //now we will first fetch the last balance amount 
                    const lastBalance = allProperties[allProperties.length - 1].balance
                    console.log("last balance", lastBalance)
                    function debitBalanceFunction(amount) {

                        const total = (parseInt(lastBalance) - parseInt(amount)).toString();
                        return total
                    }
                    function creditBalanceFunction(amount) {
                        const total = (parseInt(lastBalance) + parseInt(amount)).toString();
                        return total
                    }
                    if (type === "Debit") {
                        const newAsset = new Asset({ type: assetType, date, debit: amount, balance: debitBalanceFunction(amount), givenTo: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newAsset.save();
                        return res.status(200).send("Properties Posted Successfully");
                    }
                    if (type === "Credit") {
                        const newAsset = new Asset({ type: assetType, date, credit: amount, balance: creditBalanceFunction(amount), receivedBy: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newAsset.save();
                        return res.status(200).send("Properties Posted Successfully");
                    }
                }
            } catch (error) {
                res.status(500).send(`Internal Server Error${error.message}`);
            }
            break;
        case "Plant and machineries":
            console.log("we are in plant and machineries block");
            try {
                let partyName2;//this is the party name when receivedOrSent is set "own"
                if (receivedOrSent === "Own") {
                    partyName2 = "Self"
                } else { partyName2 = partyName }
                const allPlantAndMachineries = await Asset.find({ type: "Plant and machineries" })
                let picture2; //this is the picture namewhen reference is others
                if (reference === "Others") {
                    picture2 = ''
                } else {
                    picture2 = pictureName
                }
                if (allPlantAndMachineries.length === 0) { //when no cashinhand is there
                    if (type === "Debit") {
                        const newAsset = new Asset({ type: assetType, date, debit: amount, balance: `-${amount}`, givenTo: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newAsset.save();

                        return res.status(200).send("Plant and machineries Posted Successfully");
                    }
                    if (type === "Credit") {
                        const newAsset = new Asset({ type: assetType, date, credit: amount, balance: `${amount}`, receivedBy: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newAsset.save();

                        return res.status(200).send("Plant and machineries Posted Successfully");
                    }

                } else {
                    //now we will first fetch the last balance amount 
                    const lastBalance = allPlantAndMachineries[allPlantAndMachineries.length - 1].balance
                    console.log("last balance", lastBalance)
                    function debitBalanceFunction(amount) {

                        const total = (parseInt(lastBalance) - parseInt(amount)).toString();
                        return total
                    }
                    function creditBalanceFunction(amount) {
                        const total = (parseInt(lastBalance) + parseInt(amount)).toString();
                        return total
                    }
                    if (type === "Debit") {
                        const newAsset = new Asset({ type: assetType, date, debit: amount, balance: debitBalanceFunction(amount), givenTo: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newAsset.save();
                        return res.status(200).send("Plant and machineries Posted Successfully");
                    }
                    if (type === "Credit") {
                        const newAsset = new Asset({ type: assetType, date, credit: amount, balance: creditBalanceFunction(amount), receivedBy: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newAsset.save();
                        return res.status(200).send("Plant and machineries Posted Successfully");
                    }
                }
            } catch (error) {
                res.status(500).send(`Internal Server Error${error.message}`);
            }
            break;
        default:
            console.log("we are in default block");
    }

});

// Update Asset data
router.patch("/asset", async (req, res) => {
    const payload = req.body;
    const id = req.body.id;

    try {
        const updateAsset = await Asset.findByIdAndUpdate(id, payload);
        if (!updateAsset) {
            return res.status(400).send(`Asset not found`);
        }
        res.status(200).send("Asset Update successfully");
    } catch (error) {

        res.status(500).send(`Internal Server Error${error.message}`);
    }
});

// Delete an Asset
router.delete("/asset", async (req, res) => {
    const id = req.body.id;
    try {
        const deletedAsset = await Asset.findByIdAndRemove(id);
        if (!deletedAsset) {
            return res.status(400).send(`Asset not found`);
        }
        res.status(200).send("Asset Delete successfully");
    } catch (error) {

        res.status(500).send(`Internal Server Error${error.message}`);
    }
});
router.post("/csvCashInHand", upload.single("csvFile"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }
        console.log("req.file", req.file)
        const jsonArray = await csv().fromString(req.file.buffer.toString());
        console.log("csv data", jsonArray)

        let checker = 0;
        for (let data of jsonArray) {
            console.log("data", data)
            console.log("type", data.type)

            if (data.type === "Cash in hand") {
                let csvRowData = await new Asset(data)
                await csvRowData.save()
            } else {
                checker++
            }
        }

        // console.log("num check" , checker , jsonArray.length)

        if (checker === jsonArray.length) {
            return res.status(400).send("Please select 'type' Cash in hand")
        }

        if (checker !== 0) {
            return res.status(200).send(" 'type' Cash in hand is save rest data not save")
        }

        // await Asset.insertMany(jsonArray);

        console.log("Data saved to MongoDB successfully.");
        return res.status(200).send("Data saved to MongoDB successfully.");
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send(`Error processing the CSV file ${error.message}`);
    }
});


//Bank account


router.post("/csvBankAccount", upload.single("csvFile"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const jsonArray = await csv().fromString(req.file.buffer.toString());
        console.log("csv data", jsonArray)

        let checker = 0;
        for (let data of jsonArray) {
            console.log("data", data)
            console.log("type", data.type)

            if (data.type === "Bank account") {
                let csvRowData = await new Asset(data)
                await csvRowData.save()
            } else {
                checker++
            }
        }

        console.log("num check", checker, jsonArray.length)

        if (checker === jsonArray.length) {
            return res.status(400).send("Please select 'type' Bank account")
        }
        if (checker !== 0) {
            return res.status(200).send(" 'type' Bank account is save rest data not save")
        }
        // await Asset.insertMany(jsonArray);

        console.log("Data saved to MongoDB successfully.");
        return res.status(200).send("Data saved to MongoDB successfully.");
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send(`Error processing the CSV file ${error.message}`);
    }
});


// Properties

router.post("/csvProperties", upload.single("csvFile"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const jsonArray = await csv().fromString(req.file.buffer.toString());
        console.log("csv data", jsonArray)

        let checker = 0;
        for (let data of jsonArray) {
            console.log("data", data)
            console.log("type", data.type)

            if (data.type === "Properties") {
                let csvRowData = await new Asset(data)
                await csvRowData.save()
            } else {
                checker++
            }
        }

        console.log("num check", checker, jsonArray.length)

        if (checker === jsonArray.length) {
            return res.status(400).send("Please select 'type' Properties")
        }

        if (checker !== 0) {
            return res.status(200).send(" 'type' Properties is save rest data not save")
        }

        // await Asset.insertMany(jsonArray);

        console.log("Data saved to MongoDB successfully.");
        return res.status(200).send("Data saved to MongoDB successfully.");
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send(`Error processing the CSV file ${error.message}`);
    }
});

//Plant and machineries

router.post("/csvPlantAndMachineries", upload.single("csvFile"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const jsonArray = await csv().fromString(req.file.buffer.toString());
        console.log("csv data", jsonArray)

        let checker = 0;
        for (let data of jsonArray) {
            console.log("data", data)
            console.log("type", data.type)

            if (data.type === "Plant and machineries") {
                let csvRowData = await new Asset(data)
                await csvRowData.save()
            } else {
                checker++
            }
        }

        console.log("num check", checker, jsonArray.length)

        if (checker === jsonArray.length) {
            return res.status(400).send("Please select 'type' Plant and machineries")
        }

        if (checker !== 0) {
            return res.status(200).send(" 'type' Plant and machineries is save rest data not save")
        }

        // await Asset.insertMany(jsonArray);

        console.log("Data saved to MongoDB successfully.");
        return res.status(200).send("Data saved to MongoDB successfully.");
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send(`Error processing the CSV file ${error.message}`);
    }
});
module.exports = router;
