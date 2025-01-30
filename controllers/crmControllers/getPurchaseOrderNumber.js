const { Utility } = require("../../models/utilityCollection");

const getPurchaseNumber = async (req, res) => {
    console.log("we hit the getPurchase number api")
    const foundPurchaseNumberDocument = await Utility.findOne({ type: "purchaseNumber" })
    if (!foundPurchaseNumberDocument) return res.status(500).send("there's some issue. we can't find purchase number!")

    try {
        const stringNumber = foundPurchaseNumberDocument.number
        console.log("stringnumber", stringNumber)
        const num = parseInt(stringNumber, 10);

        const incrementedNum = num + 1;

        // Check if the length of the incremented number is greater than the original number
        const lengthDiff = stringNumber.length - incrementedNum.toString().length;
        const padding = lengthDiff >= 0 ? "0".repeat(lengthDiff) : "";

        const result = padding + incrementedNum.toString();

        console.log(result);
        return res.status(200).send(result)
    } catch (err) {
        console.log("error", err.message)
        return res.status(500).send(`Error while getting purchase number - ${err.message}`)

    }
}
const postPurchaseNumber = async (req, res) => {
    console.log("we hit the postpurchase number api and check whats in the body", req.body)
    const foundPurchaseNumberDocument = await Utility.findOne({ type: "purchaseNumber" })
    if (!foundPurchaseNumberDocument) return res.status(500).send("there's some issue. we can't generate Purchase Order number!")
    try {
        // const newInvoiceNumber = new Utility({   //uncomment this if you wanna create a new document
        //     type: "purchaseNumber", number: req.body.number
        // });
        // const success = await newInvoiceNumber.save();
        const partsPurchaseNumber = req.body.purchaseNumber.trim().split('-');
        const desiredPurchaseNumber = partsPurchaseNumber[partsPurchaseNumber.length - 1];
        console.log("desiredPurchasenumber", desiredPurchaseNumber)
        const updatedPurchaseNumber = await Utility.findOneAndUpdate({ type: "purchaseNumber" }, {
            $set: {
                number: desiredPurchaseNumber,
            },
        },
            { new: true })
        console.log("updatedpurchase order number", updatedPurchaseNumber)
        return res.status(200).send("successfully created Purchase Order Number")
    } catch (err) {
        console.log("error in uploading the purchase order number", err.message)
        return res.status(500).send(`Error while creating purchase order number - ${err.message}`)

    }
}
module.exports = { getPurchaseNumber, postPurchaseNumber }