const express = require("express");
const { Expense } = require("../models/expenses");
const csv = require("csvtojson")


const router = express.Router();
const multer = require("multer")
const upload = multer()
router.get("/expense", async (req, res) => {
    try {
        const allexpense = await Expense.find();
        if (!allexpense || allexpense.length === 0) return res.status(400).send("No expense type was found!")
        res.status(200).send(allexpense);
    } catch (error) {
        res.status(500).send(`Internal Server Error${error.message}`);
    }
});

// Create an expense
router.post("/expense", async (req, res) => {
    console.log("whats coming in body", req.body)
    const payload = req.body;
    const { amount, date, description, partyName, receivedOrSent, reference, type, expenseType, pictureName } = req.body //just take the image name as well so that you can assign it in mongodb
    if (reference !== "Others" && pictureName === "") return res.status(400).send("image file is required for documentation purpose!")

    //first we will check that cashinhand is empty or not if it is empty then we add balance as the credit/debit account otherwise we will check the last one and then add or remove the credit or debit amount to update the balance.

    switch (expenseType) {
        case "Job works":
            console.log("we are in Jobwork block");
            try {
                let partyName2;//this is the party name when receivedOrSent is set "own"
                if (receivedOrSent === "Own") {
                    partyName2 = "Self"
                } else { partyName2 = partyName }
                const allJobWorks = await Expense.find({ type: "Job works" })
                let picture2; //this is the picture namewhen reference is others
                if (reference === "Others") {
                    picture2 = ''
                } else {
                    picture2 = pictureName
                }
                if (allJobWorks.length === 0) { //when no cashinhand is there
                    if (type === "Debit") {
                        const newExpense = new Expense({ type: expenseType, date, debit: amount, balance: `-${amount}`, givenTo: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newExpense.save();

                        return res.status(200).send("Jobwork Posted Successfully");
                    }
                    if (type === "Credit") {
                        const newExpense = new Expense({ type: expenseType, date, credit: amount, balance: `${amount}`, receivedBy: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newExpense.save();

                        return res.status(200).send("Jobwork Posted Successfully");
                    }

                } else {
                    //now we will first fetch the last balance amount 
                    const lastBalance = allJobWorks[allJobWorks.length - 1].balance
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
                        const newExpense = new Expense({ type: expenseType, date, debit: amount, balance: debitBalanceFunction(amount), givenTo: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        // console.log("new Expense before saving", newExpense)
                        await newExpense.save();
                        return res.status(200).send("Jobwork Posted Successfully");
                    }
                    if (type === "Credit") {
                        // console.log("checking the received orsent", receivedOrSent)
                        const newExpense = new Expense({ type: expenseType, date, credit: amount, balance: creditBalanceFunction(amount), receivedBy: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        // console.log("new Expense before saving", newExpense)

                        await newExpense.save();
                        return res.status(200).send("Jobwork Posted Successfully");
                    }
                }
            } catch (error) {
                res.status(500).send(`Internal Server Error${error.message}`);
            }
            break;
        case "Raw materials":
            console.log("we are in Raw materials block");
            try {
                let partyName2;//this is the party name when receivedOrSent is set "own"
                if (receivedOrSent === "Own") {
                    partyName2 = "Self"
                } else { partyName2 = partyName }
                const allRawMaterials = await Expense.find({ type: "Raw materials" })
                let picture2; //this is the picture namewhen reference is others
                if (reference === "Others") {
                    picture2 = ''
                } else {
                    picture2 = pictureName
                }
                if (allRawMaterials.length === 0) { //when no cashinhand is there
                    if (type === "Debit") {
                        const newExpense = new Expense({ type: expenseType, date, debit: amount, balance: `-${amount}`, givenTo: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newExpense.save();

                        return res.status(200).send("Raw material Posted Successfully");
                    }
                    if (type === "Credit") {
                        const newExpense = new Expense({ type: expenseType, date, credit: amount, balance: `${amount}`, receivedBy: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        await newExpense.save();

                        return res.status(200).send("Raw material Posted Successfully");
                    }

                } else {
                    //now we will first fetch the last balance amount 
                    const lastBalance = allJobWorks[allJobWorks.length - 1].balance
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
                        const newExpense = new Expense({ type: expenseType, date, debit: amount, balance: debitBalanceFunction(amount), givenTo: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        // console.log("new Expense before saving", newExpense)
                        await newExpense.save();
                        return res.status(200).send("Raw material Posted Successfully");
                    }
                    if (type === "Credit") {
                        // console.log("checking the received orsent", receivedOrSent)
                        const newExpense = new Expense({ type: expenseType, date, credit: amount, balance: creditBalanceFunction(amount), receivedBy: receivedOrSent, partyName: partyName2, reference, description, picture: picture2 });
                        // console.log("new Expense before saving", newExpense)

                        await newExpense.save();
                        return res.status(200).send("Raw material Posted Successfully");
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

// Update expense data
router.patch("/expense", async (req, res) => {
    const payload = req.body;
    const id = req.body.id;

    try {
        const updateExpense = await Expense.findByIdAndUpdate(id, payload);
        if (!updateExpense) {
            return res.status(400).send(`expense not found`);
        }
        res.status(200).send("expense Update successfully");
    } catch (error) {
        res.status(500).send(`Internal Server Error${error.message}`);
    }
});

// Delete an expense
router.delete("/expense", async (req, res) => {
    const id = req.body.id;

    try {
        const deletedExpense = await Expense.findByIdAndRemove(id);
        if (!deletedExpense) {
            return res.status(400).send(`expense not found `);
        }
        res.status(200).send("expense Delete successfully");
    } catch (error) {
        res.status(500).send(`Internal Server Error${error.message}`);
    }
});
router.post("/csvRawMaterials", upload.single("csvFile"), async (req, res) => {
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

            if (data.type === "Raw Materials") {
                let csvRowData = await new Expense(data)
                await csvRowData.save()
            } else {
                checker++
            }
        }

        console.log("num check", checker, jsonArray.length)

        if (checker === jsonArray.length) {
            return res.status(400).send("Please select 'type' Raw Materials")
        }

        if (checker !== 0) {
            return res.status(200).send(" 'type' Raw Materials is save rest data not save")
        }

        // await Asset.insertMany(jsonArray);

        console.log("Data saved to MongoDB successfully.");
        return res.status(200).send("Data saved to MongoDB successfully.");
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send(`Error processing the CSV file ${error.message}`);
    }
});



router.post("/csvJobWorks", upload.single("csvFile"), async (req, res) => {
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

            if (data.type === "Job Works") {
                let csvRowData = await new Expense(data)
                await csvRowData.save()
            } else {
                checker++
            }
        }

        console.log("num check", checker, jsonArray.length)

        if (checker === jsonArray.length) {
            return res.status(400).send("Please select 'type' Job Works")
        }

        if (checker !== 0) {
            return res.status(200).send(" 'type' Job Works is save rest data not save")
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
