const express = require("express")
const { Asset } = require("../models/assets")
const { Income } = require("../models/income")
const { Liability } = require("../models/liabilities")
const { Expense } = require("../models/expenses")

const router = express.Router()


router.get("/", async (req, res) => {

    const arr = []

    const asset = ["Cash in hand", "Bank account", "Properties", "Plant and machineries"]
    const income = ["Sales", "Repairs"]
    const laibility = ["Duty and taxes", "Creditors", "Loans"]
    const expense = ["Raw materials", "Job works"]


    //asset
    const assetBal = await Asset.find()
    // if (!assetBal || assetBal.length === 0) {
    //     res.status(400).send("Asset not found")
    // }
    console.log(assetBal)
    for (let j = 0; j < asset.length; j++)
        for (let i = assetBal.length - 1; i >= 0; i--) {
            // console.log(i)

            if (assetBal[i]["type"] === asset[j]) {
                arr.push({ "name": asset[j], "balance": assetBal[i]["balance"] })
                break;
            }
        }


    //income
    const incomeBal = await Income.find()

    // if (!incomeBal || incomeBal.length === 0) {
    //     res.status(400).send("Income not found")
    // }
    console.log(incomeBal)
    for (let j = 0; j < income.length; j++)
        for (let i = incomeBal.length - 1; i >= 0; i--) {
            // console.log(i)

            if (incomeBal[i]["type"] === income[j]) {
                arr.push({ "name": income[j], "balance": incomeBal[i]["balance"] })
                break;
            }
        }

    //libility

    const libilityBal = await Liability.find()
    // if (!libilityBal || libilityBal.length === 0) {
    //     res.status(400).send("Income not found")
    // }
    console.log(libilityBal)
    for (let j = 0; j < laibility.length; j++)
        for (let i = libilityBal.length - 1; i >= 0; i--) {
            // console.log(i)

            if (libilityBal[i]["type"] === laibility[j]) {
                arr.push({ "name": laibility[j], "balance": libilityBal[i]["balance"] })
                break;
            }
        }

    //expense

    const expenseBal = await Expense.find()
    // if (!expenseBal || expenseBal.length === 0) {
    //     res.status(400).send("Income not found")
    // }
    console.log(expenseBal)
    for (let j = 0; j < expense.length; j++)
        for (let i = expenseBal.length - 1; i >= 0; i--) {
            // console.log(i)

            if (expenseBal[i]["type"] === expense[j]) {
                arr.push({ "name": expense[j], "balance": expenseBal[i]["balance"] })
                break;
            }
        }

    console.log(arr)

    res.send(arr)

})

module.exports = router