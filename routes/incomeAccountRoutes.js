const express = require("express");
const { Income } = require("../models/income");
const csv = require("csvtojson")


const router = express.Router();
const multer = require("multer")
const upload = multer()

router.get("/income", async (req, res) => {
    try {
        const allIncome = await Income.find();
        if (!allIncome || allIncome.length === 0) return res.status(400).send("No income type was found!")
        res.status(200).send(allIncome);
    } catch (error) {
        res.status(500).send(`Internal Server Error${error.message}`);
    }
});

// Create an income
router.post("/income", async (req, res) => {
    console.log("whats coming in body", req.body)
    const payload = req.body;
    const { amount, date, description, partyName, receivedOrSent, reference, type, incomeType, pictureName } = req.body //just take the image name as well so that you can assign it in mongodb
    if (reference !== "Others" && pictureName === "") return res.status(400).send("image file is required for documentation purpose!")

    //first we will check that cashinhand is empty or not if it is empty then we add balance as the credit/debit account otherwise we will check the last one and then add or remove the credit or debit amount to update the balance.

    switch (incomeType) {
        case "Repairs":
            console.log("we are in Repairs block");
            try {
                let partyName2;//this is the party name when receivedOrSent is set "own"
                if (receivedOrSent === "Own") {
                    partyName2 = "Self"
                } else { partyName2 = partyName }
                const allRepairs = await Income.find({ type: "Repairs" })
                let picture2; //this is the picture namewhen reference is others
                if (reference === "Others") {
                    picture2 = ''
                } else {
                    picture2 = pictureName
                }
                if (allRepairs.length === 0) { //when no cashinhand is there
                    if (type === "Debit") {
                        const newIncome = new Income({ type: incomeType, date, debit: amount, balance: `-${amount}`, givenTo: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newIncome.save();

                        return res.status(200).send("Repairs Posted Successfully");
                    }
                    if (type === "Credit") {
                        const newIncome = new Income({ type: incomeType, date, credit: amount, balance: `${amount}`, receivedBy: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newIncome.save();

                        return res.status(200).send("Repairs Posted Successfully");
                    }

                } else {
                    //now we will first fetch the last balance amount 
                    const lastBalance = allRepairs[allRepairs.length - 1].balance
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
                        const newIncome = new Income({ type: incomeType, date, debit: amount, balance: debitBalanceFunction(amount), givenTo: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        // console.log("new Income before saving", newIncome)
                        await newIncome.save();
                        return res.status(200).send("Repairs Posted Successfully");
                    }
                    if (type === "Credit") {
                        // console.log("checking the received orsent", receivedOrSent)
                        const newIncome = new Income({ type: incomeType, date, credit: amount, balance: creditBalanceFunction(amount), receivedBy: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        // console.log("new Income before saving", newIncome)

                        await newIncome.save();
                        return res.status(200).send("Repairs Posted Successfully");
                    }
                }
            } catch (error) {
                res.status(500).send(`Internal Server Error${error.message}`);
            }
            break;
        case "Sales":
            console.log("we are in Sales block");
            try {
                let partyName2;//this is the party name when receivedOrSent is set "own"
                if (receivedOrSent === "Own") {
                    partyName2 = "Self"
                } else { partyName2 = partyName }
                const allSales = await Income.find({ type: "Sales" })
                let picture2; //this is the picture namewhen reference is others
                if (reference === "Others") {
                    picture2 = ''
                } else {
                    picture2 = pictureName
                }
                if (allSales.length === 0) { //when no cashinhand is there
                    if (type === "Debit") {
                        const newIncome = new Income({ type: incomeType, date, debit: amount, balance: `-${amount}`, givenTo: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newIncome.save();

                        return res.status(200).send("Sales Posted Successfully");
                    }
                    if (type === "Credit") {
                        const newIncome = new Income({ type: incomeType, date, credit: amount, balance: `${amount}`, receivedBy: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newIncome.save();

                        return res.status(200).send("Sales Posted Successfully");
                    }

                } else {
                    //now we will first fetch the last balance amount 
                    const lastBalance = allSales[allSales.length - 1].balance
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
                        const newIncome = new Income({ type: incomeType, date, debit: amount, balance: debitBalanceFunction(amount), givenTo: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        // console.log("new Income before saving", newIncome)
                        await newIncome.save();
                        return res.status(200).send("Sales Posted Successfully");
                    }
                    if (type === "Credit") {
                        // console.log("checking the received orsent", receivedOrSent)
                        const newIncome = new Income({ type: incomeType, date, credit: amount, balance: creditBalanceFunction(amount), receivedBy: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        // console.log("new Income before saving", newIncome)
                        await newIncome.save();
                        return res.status(200).send("Sales Posted Successfully");
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

// Update income data
router.patch("/income", async (req, res) => {
    const payload = req.body;
    const id = req.body.id;

    try {
        const updateIncome = await Income.findByIdAndUpdate(id, payload);
        if (!updateIncome) {
            return res.status(400).send(`income not found`);
        }
        res.status(200).send("income Update successfully");
    } catch (error) {

        res.status(500).send(`Internal Server Error${error.message}`);
    }
});

// Delete an income
router.delete("/income", async (req, res) => {
    const id = req.body.id;

    try {
        const deletedIncome = await Income.findByIdAndRemove(id);
        if (!deletedIncome) {
            return res.status(400).send(`income not found`);
        }
        res.status(200).send("income Delete successfully");
    } catch (error) {

        res.status(500).send(`Internal Server Error${error.message}`);
    }
});
router.post("/csvSales", upload.single("csvFile"), async (req, res) => {
    try {
        console.log("check whats coming in body", req.body)
        console.log("check whats coming in file", req.file)
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const jsonArray = await csv().fromString(req.file.buffer.toString());
        console.log("csv data", jsonArray)

        let checker = 0;
        for (let data of jsonArray) {
            console.log("data", data)
            console.log("type", data.type)

            if (data.type === "Sales") {  // we have to check whether all the properties are available or not! first check if mongoose have any model type so thatit can check one of two properties that are compulsary
                let csvRowData = await new Income(data)
                await csvRowData.save()
            } else {
                checker++
            }
        }

        // console.log("num check" , checker , jsonArray.length)

        if (checker === jsonArray.length) {
            return res.status(400).send("Please select 'type' Sales")
        }

        if (checker !== 0) {
            return res.status(200).send(" 'type' Sales is save rest data not save")
        }

        // await Asset.insertMany(jsonArray);

        console.log("Data saved to MongoDB successfully.");
        return res.status(200).send("Data saved to MongoDB successfully.");
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Error processing the CSV file.");
    }
});
router.post("/csvRepairs", upload.single("csvFile"), async (req, res) => {
    try {
        console.log("check whats coming in body", req.body)
        console.log("check whats coming in file", req.file)
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const jsonArray = await csv().fromString(req.file.buffer.toString());
        console.log("csv data", jsonArray)

        let checker = 0;
        for (let data of jsonArray) {
            console.log("data", data)
            console.log("type", data.type)

            if (data.type === "Repairs") {  // we have to check whether all the properties are available or not! first check if mongoose have any model type so thatit can check one of two properties that are compulsary
                let csvRowData = await new Income(data)
                await csvRowData.save()
            } else {
                checker++
            }
        }

        // console.log("num check" , checker , jsonArray.length)

        if (checker === jsonArray.length) {
            return res.status(400).send("Please select 'type' Repairs")
        }

        if (checker !== 0) {
            return res.status(200).send(" 'type' Repairs is save rest data not save")
        }

        // await Asset.insertMany(jsonArray);

        console.log("Data saved to MongoDB successfully.");
        return res.status(200).send("Data saved to MongoDB successfully.");
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Error processing the CSV file.");
    }
});

//Bank account




module.exports = router;
