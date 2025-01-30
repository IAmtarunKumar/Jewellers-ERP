const express = require("express");
const { Liability } = require("../models/liabilities");

const csv = require("csvtojson")

const router = express.Router();
const multer = require("multer")
const upload = multer()
router.get("/liability", async (req, res) => {
    try {
        const allLiability = await Liability.find();
        if (!allLiability || allLiability.length === 0) return res.status(400).send("No liability type was found!")
        res.status(200).send(allLiability);
    } catch (error) {
        res.status(500).send(`Internal Server Error${error.message}`);
    }
});

// Create an liability
router.post("/liability", async (req, res) => {
    console.log("whats coming in body", req.body)
    const payload = req.body;
    const { amount, date, description, partyName, receivedOrSent, reference, type, liabilityType, pictureName } = req.body //just take the image name as well so that you can assign it in mongodb
    if (reference !== "Others" && pictureName === "") return res.status(400).send("image file is required for documentation purpose!")

    //first we will check that cashinhand is empty or not if it is empty then we add balance as the credit/debit account otherwise we will check the last one and then add or remove the credit or debit amount to update the balance.

    switch (liabilityType) {
        case "Creditors":
            console.log("we are in Creditors block");
            try {
                let partyName2;//this is the party name when receivedOrSent is set "own"
                if (receivedOrSent === "Own") {
                    partyName2 = "Self"
                } else { partyName2 = partyName }
                const allLiabilities = await Liability.find({ type: "Creditors" })
                let picture2; //this is the picture namewhen reference is others
                if (reference === "Others") {
                    picture2 = ''
                } else {
                    picture2 = pictureName
                }
                if (allLiabilities.length === 0) { //when no cashinhand is there
                    if (type === "Debit") {
                        const newLiability = new Liability({ type: liabilityType, date, debit: amount, balance: `-${amount}`, givenTo: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newLiability.save();

                        return res.status(200).send("Creditors Posted Successfully");
                    }
                    if (type === "Credit") {
                        const newLiability = new Liability({ type: liabilityType, date, credit: amount, balance: `${amount}`, receivedBy: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newLiability.save();

                        return res.status(200).send("Creditors Posted Successfully");
                    }

                } else {
                    //now we will first fetch the last balance amount 
                    const lastBalance = allLiabilities[allLiabilities.length - 1].balance
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
                        const newLiability = new Liability({ type: liabilityType, date, debit: amount, balance: debitBalanceFunction(amount), givenTo: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        // console.log("new Liability before saving", newLiability)
                        await newLiability.save();
                        return res.status(200).send("Creditors Posted Successfully");
                    }
                    if (type === "Credit") {
                        // console.log("checking the received orsent", receivedOrSent)
                        const newLiability = new Liability({ type: liabilityType, date, credit: amount, balance: creditBalanceFunction(amount), receivedBy: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        // console.log("new Liability before saving", newLiability)

                        await newLiability.save();
                        return res.status(200).send("Creditors Posted Successfully");
                    }
                }
            } catch (error) {
                res.status(500).send(`Internal Server Error${error.message}`);
            }
            break;
        case "Duty and taxes":
            console.log("we are in Duty and taxes block");
            try {
                let partyName2;//this is the party name when receivedOrSent is set "own"
                if (receivedOrSent === "Own") {
                    partyName2 = "Self"
                } else { partyName2 = partyName }
                const allLiabilities = await Liability.find({ type: "Duty and taxes" })
                let picture2; //this is the picture namewhen reference is others
                if (reference === "Others") {
                    picture2 = ''
                } else {
                    picture2 = pictureName
                }
                if (allLiabilities.length === 0) { //when no cashinhand is there
                    if (type === "Debit") {
                        const newLiability = new Liability({ type: liabilityType, date, debit: amount, balance: `-${amount}`, givenTo: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newLiability.save();

                        return res.status(200).send("Duty and taxes Posted Successfully");
                    }
                    if (type === "Credit") {
                        const newLiability = new Liability({ type: liabilityType, date, credit: amount, balance: `${amount}`, receivedBy: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newLiability.save();

                        return res.status(200).send("Duty and taxes Posted Successfully");
                    }

                } else {
                    //now we will first fetch the last balance amount 
                    const lastBalance = allLiabilities[allLiabilities.length - 1].balance
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
                        const newLiability = new Liability({ type: liabilityType, date, debit: amount, balance: debitBalanceFunction(amount), givenTo: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        // console.log("new Liability before saving", newLiability)
                        await newLiability.save();
                        return res.status(200).send("Duty and taxes Posted Successfully");
                    }
                    if (type === "Credit") {
                        // console.log("checking the received orsent", receivedOrSent)
                        const newLiability = new Liability({ type: liabilityType, date, credit: amount, balance: creditBalanceFunction(amount), receivedBy: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        // console.log("new Liability before saving", newLiability)

                        await newLiability.save();
                        return res.status(200).send("Duty and taxes Posted Successfully");
                    }
                }
            } catch (error) {
                res.status(500).send(`Internal Server Error${error.message}`);
            }
            break;
        case "Loans":
            console.log("we are in Loans block");
            try {
                let partyName2;//this is the party name when receivedOrSent is set "own"
                if (receivedOrSent === "Own") {
                    partyName2 = "Self"
                } else { partyName2 = partyName }
                const allLiabilities = await Liability.find({ type: "Loans" })
                let picture2; //this is the picture namewhen reference is others
                if (reference === "Others") {
                    picture2 = ''
                } else {
                    picture2 = pictureName
                }
                if (allLiabilities.length === 0) { //when no cashinhand is there
                    if (type === "Debit") {
                        const newLiability = new Liability({ type: liabilityType, date, debit: amount, balance: `-${amount}`, givenTo: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newLiability.save();

                        return res.status(200).send("Loans Posted Successfully");
                    }
                    if (type === "Credit") {
                        const newLiability = new Liability({ type: liabilityType, date, credit: amount, balance: `${amount}`, receivedBy: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newLiability.save();

                        return res.status(200).send("Loans Posted Successfully");
                    }

                } else {
                    //now we will first fetch the last balance amount 
                    const lastBalance = allLiabilities[allLiabilities.length - 1].balance
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
                        const newLiability = new Liability({ type: liabilityType, date, debit: amount, balance: debitBalanceFunction(amount), givenTo: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        // console.log("new Liability before saving", newLiability)
                        await newLiability.save();
                        return res.status(200).send("Loans Posted Successfully");
                    }
                    if (type === "Credit") {
                        // console.log("checking the received orsent", receivedOrSent)
                        const newLiability = new Liability({ type: liabilityType, date, credit: amount, balance: creditBalanceFunction(amount), receivedBy: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        // console.log("new Liability before saving", newLiability)

                        await newLiability.save();
                        return res.status(200).send("Loans Posted Successfully");
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

// Update liability data
router.patch("/liability", async (req, res) => {
    const payload = req.body;
    const id = req.body.id;

    try {
        const updateLiability = await Liability.findByIdAndUpdate(id, payload);
        if (!updateLiability) {
            return res.status(400).send(`liability not found`);
        }
        res.status(200).send("liability Update successfully");
    } catch (error) {
        res.status(500).send(`Internal Server Error${error.message}`);
    }
});

// Delete an liability
router.delete("/liability", async (req, res) => {
    const id = req.body.id;

    try {
        const deletedLiability = await Liability.findByIdAndRemove(id);
        if (!deletedLiability) {
            return res.status(400).send(`liability not found`);
        }
        res.status(200).send("liability Delete successfully");
    } catch (error) {
        res.status(500).send(`Internal Server Error${error.message}`);
    }
});

router.post("/csvCreditors", upload.single("csvFile"), async (req, res) => {
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

            if (data.type === "Creditors") {
                let csvRowData = await new Liability(data)
                await csvRowData.save()
            } else {
                checker++
            }
        }

        console.log("num check", checker, jsonArray.length)

        if (checker === jsonArray.length) {
            return res.status(400).send("Please select 'type' Creditors")
        }

        if (checker !== 0) {
            return res.status(200).send(" 'type' Creditors is save rest data not save")
        }

        // await Asset.insertMany(jsonArray);

        console.log("Data saved to MongoDB successfully.");
        return res.status(200).send("Data saved to MongoDB successfully.");
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send(`Error processing the CSV file ${error.message}`);
    }
});



router.post("/csvDutyAndTaxes", upload.single("csvFile"), async (req, res) => {
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

            if (data.type === "Duty and taxes") {
                let csvRowData = await new Liability(data)
                await csvRowData.save()
            } else {
                checker++
            }
        }

        console.log("num check", checker, jsonArray.length)

        if (checker === jsonArray.length) {
            return res.status(400).send("Please select 'type' Duty and taxes")
        }

        if (checker !== 0) {
            return res.status(200).send(" 'type' Duty and taxes is save rest data not save")
        }

        // await Asset.insertMany(jsonArray);

        console.log("Data saved to MongoDB successfully.");
        return res.status(200).send("Data saved to MongoDB successfully.");
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send(`Error processing the CSV file ${error.message}`);
    }
});




router.post("/csvLoans", upload.single("csvFile"), async (req, res) => {
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

            if (data.type === "Loans") {
                let csvRowData = await new Liability(data)
                await csvRowData.save()
            } else {
                checker++
            }
        }

        console.log("num check", checker, jsonArray.length)

        if (checker === jsonArray.length) {
            return res.status(400).send("Please select 'type' Loans")
        }

        if (checker !== 0) {
            return res.status(200).send(" 'type' Loans is save rest data not save")
        }

        // await Asset.insertMany(jsonArray);

        console.log("Data saved to MongoDB successfully.");
        return res.status(200).send("Data saved to MongoDB successfully.");
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send(`Error processing the CSV file ${error.message}`);
    }
});

module.exports = router 
