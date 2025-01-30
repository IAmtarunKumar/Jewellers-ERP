const { Utility } = require("../../models/utilityCollection");

const getInvoiceNumber = async (req, res) => {
    console.log("we hit the getInvoice number api")
    const foundInvoiceNumberDocument = await Utility.findOne({ type: "invoiceNumber" })
    if (!foundInvoiceNumberDocument) return res.status(500).send("there's some issue. we can't find invoice number!")

    try {
        const stringNumber = foundInvoiceNumberDocument.number
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
        return res.status(500).send(`Error while getting invoice number - ${err.message}`)

    }
}
const postInvoiceNumber = async (req, res) => {
    console.log("we hit the postInvoice number api and check whats in the body", req.body)
    const foundInvoiceNumberDocument = await Utility.findOne({ type: "invoiceNumber" })
    if (!foundInvoiceNumberDocument) return res.status(500).send("there's some issue. we can't generate invoice number!")
    try {
        // const newInvoiceNumber = new Utility({   //uncomment this if you wanna create a new document
        //     type: "invoiceNumber", number: req.body.number
        // });
        // const success = await newInvoiceNumber.save();
        const updatedInvoiceNumber = await Utility.findOneAndUpdate({ type: "invoiceNumber" }, {
            $set: {
                number: req.body.number,
            },
        },
            { new: true })
        console.log("updatedinvoice number", updatedInvoiceNumber)
        return res.status(200).send("successfully created Invoice Number")
    } catch (err) {
        console.log("error in uploading the invoice number", err.message)
        return res.status(500).send(`Error while creating invoice number - ${err.message}`)

    }
}
module.exports = { getInvoiceNumber, postInvoiceNumber }