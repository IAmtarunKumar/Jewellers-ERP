const express = require("express");
const { Repair } = require("../models/repairs");
const editRepair = require("../controllers/crmControllers/editApis/editRepair");
const { Customer } = require("../models/customer");
const Product = require("../models/product");
const { Income } = require("../models/income");
const { Liability } = require("../models/liabilities");
const router = express.Router();


router.post("/edit", editRepair);

// GET all repairs
router.get('/fetch', async (req, res) => {
    try {
        const repairs = await Repair.find();
        res.json(repairs);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// POST a new repair
router.post('/update', async (req, res) => {
    const {
        repairCost, expectedReturnDate, repairDate, issueDescription, productId, customerId
    } = req.body;
    const foundCustomer = await Customer.findOne({ customerId })
    if (!foundCustomer) return res.status(400).send("Customer for the given customerId was not found! try again later.");
    const foundProduct = await Product.findOne({ productId })
    if (!foundProduct) return res.status(400).send("Product for the given productId was not found! try again later.");

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const repair = new Repair({ repairCost, expectedReturnDate, repairDate, issueDescription, productId, customerId, repairId: randomNum });
    repair.repairId = randomNum;
    try {
        await repair.save();
        ////////////////////////////


        //find customer with customer id and get customer name

        const getCustomer = await Customer.findOne({ customerId })
        console.log("get customer", getCustomer)
        console.log("partyName", getCustomer.name)
        if (!getCustomer)
            return res
                .status(400)
                .send(
                    "Customer with the desired ID is not found! Please get it checked!"
                );

        const customerName = getCustomer.name


        const allIncomes = await Income.find()

        if (!allIncomes || allIncomes.length === 0) {
            const newIncome = new Income({ type: "Repairs", date: repairDate, credit: repairCost, balance: repairCost, receivedBy: "Own", partyName: customerName, reference: "Other", });
            await newIncome.save();

            return res.status(200).send("Sales Posted Successfully");
        }



        console.log("show all incomes", allIncomes)
        let lastBalance
        //last expense bal
        if (allIncomes[allIncomes.length - 1].balance) {
            lastBalance = +(allIncomes[allIncomes.length - 1].balance)
        } else {
            lastBalance = 0
        }
        const newBalance = lastBalance + +repairCost
        console.log("newbal", newBalance)
        const newIncome = Income({
            // add Data work is done 
            type: "Repairs",
            date: repairDate, // You should use the appropriate date format
            debit: "",
            credit: repairCost,
            balance: newBalance,
            receivedBy: "Own",
            givenTo: "",
            partyName: customerName,
            reference: "Other",
            description: "",
            picture: ""
        });
        await newIncome.save();



        /////////////////////////////////////////////
        //code by tarun
        //add in duty and taxes

        const allLaibility = await Liability.find()

        if (!allLaibility || allLaibility.length === 0) {
            const newLiability = new Liability({ type: "Duty and taxes", date: formattedDate, debit: gst, balance: -`${gst}`, receivedBy: "Own", partyName: customerName, reference: "Other", picture: picture2 });
            await newLiability.save();

            return res.status(200).send("the Duty and Taxes has been added successfully!");
        }


        console.log("show all liablity", allLaibility)
        const lastLiabilityBalance = +(allLaibility[allLaibility.length - 1].balance)
        console.log("last bal", lastLiabilityBalance)
        const newLabilityBalance = lastLiabilityBalance - +gst
        console.log("newbal", newLabilityBalance)
        const newLiability = new Liability({
            // add Data work is done 

            type: "Duty and taxes",
            date: formattedDate, // You should use the appropriate date format
            debit: gst,
            credit: "",
            balance: newLabilityBalance,
            receivedBy: "Own",
            givenTo: "",
            partyName: customerName,
            reference: "Other",
            description: "",
            picture: ""


        });
        await newLiability.save();


        /////////////////////////////////////////



        /////////////////////////
        res.status(200).send("Repair has been successfully added");
    } catch (error) {
        res.status(400).send(error.message);
    }
});




module.exports = router;