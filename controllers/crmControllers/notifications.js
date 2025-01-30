const Product = require("../../models/product");
const { RawMaterial } = require("../../models/rawMaterial");

async function notifications(req, res) {
    const arrayToSend = [];
    const products = await Product.find({});
    console.log("products", products);
    for (const product of products) {
        // console.log("product", product);
        // Iterate over each property of the product
        let count = 0;
        for (const propertyName in product["_doc"]) {
            // console.log("property name", propertyName);
            //
            const propertyValue = product["_doc"][propertyName];
            // console.log("property values of property one by one", propertyValue);
            // Check if the property value is equal to "Define In CRM"
            if (propertyValue === "Define In CRM") {
                // console.log(`Property "${propertyName}" in product:`, product);
                count++;
            }
        }
        // console.log("check the final count of each product", count);
        if (count !== 0) {
            const object = {}
            object.id = product.productId
            object.name = product.productName
            object.schema = "editProducts"
            object.message = `you have to define ${count} property in this product`
            arrayToSend.push(object)
        }
    }
    console.log("logging the final array to send with only products", arrayToSend)
    const rawMaterials = await RawMaterial.find({});
    // console.log("raw materials", rawMaterials);
    for (const rawMaterial of rawMaterials) {
        // console.log("raw materials", rawMaterial);
        // Iterate over each property of the product
        let count = 0;
        for (const propertyName in rawMaterial["_doc"]) {
            // console.log("property name", propertyName);
            //
            const propertyValue = rawMaterial["_doc"][propertyName];
            // console.log("property values of property one by one", propertyValue);
            // Check if the property value is equal to "Define In CRM"
            if (propertyValue === "Define In CRM") {
                // console.log(`Property "${propertyName}" in rawmaterial:`, rawMaterial);
                count++;
            }
        }
        // console.log("check the final count of each product", count);
        if (count !== 0) {

            const object = {}
            object.id = rawMaterial.supplierId
            object.name = rawMaterial.name
            object.schema = "editRawMaterial"
            object.message = `you have to define ${count} property in this raw material`
            arrayToSend.push(object)
        }
    }
    console.log("logging the final array to send in the last", arrayToSend)
    return res.status(200).send(arrayToSend)
}
module.exports = notifications;
