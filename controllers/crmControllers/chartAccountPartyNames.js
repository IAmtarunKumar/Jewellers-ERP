const { Customer } = require("../../models/customer")
const { Supplier } = require("../../models/supplier")
const { Vendor } = require("../../models/vendor")

const partyNames = async (req, res) => {
    const allArray = []
    try {
        const allSuppliers = await Supplier.find({})
        for (const supplier of allSuppliers) {
            let object = {}
            object.name = supplier.name
            object.type = "Supplier"
            allArray.push(object)
        }
        const allVendors = await Vendor.find({})
        for (const vendor of allVendors) {
            let object = {}
            object.name = vendor.name
            object.type = "Vendor"
            allArray.push(object)
        }
        const allCustomers = await Customer.find({})
        for (const customer of allCustomers) {
            let object = {}
            object.name = customer.name
            object.type = "Customer"
            allArray.push(object)
        }
        if (allArray.length === 0) return res.status(400).send("Desired data is not available")
        return res.status(200).send(allArray)
    } catch (err) {
        console.log("error", err.message)
        return res.status(500).send(`internal server error - ${err.message}`)
    }
}

module.exports = partyNames