const csv = require("csv-parser");
const { PassThrough } = require("stream");

const { Customer } = require("../../models/customer");
const { Supplier } = require("../../models/supplier");
const { Vendor } = require("../../models/vendor");
const { Sales } = require("../../models/sales");
const { BusinessHolder } = require("../../models/businessHolder");
const { HallMarkCenter } = require("../../models/hallmarkCenter");
const Product = require("../../models/product");

async function streamFile(files, filetype, res) {
    for (let file of files) {
        const fileBuffer = file.buffer;
        const results = [];
        const bufferStream = new PassThrough();
        bufferStream.end(fileBuffer);
        const stream = bufferStream
            .pipe(csv())
            .on("data", (data) => {
                // Process each row of data as it arrives
                results.push(data);
            })
            .on("end", async () => {
                for (let data of results) {
                    console.log(data);
                    switch (filetype) {
                        case "customer":
                            console.log("we are in customer block");
                            await saveCustomer(data); // Replace with your data processing logic
                            break;
                        case "supplier":
                            console.log("we are in supplier block");
                            await saveSupplier(data); // Replace with your data processing logic
                            break;
                        case "vendor":
                            console.log("we are in vendor block");
                            await saveVendor(data); // Replace with your data processing logic
                            break;
                        case "sales":
                            console.log("we are in sales block");
                            await saveSales(data); // Replace with your data processing logic
                            break;
                        case "businessHolder":
                            console.log("we are in businessHolder block");
                            await saveBusinessHolder(data); // Replace with your data processing logic
                            break;
                        case "hallmarkCenter":
                            console.log("we are in hallmarkCenter block");
                            await savehallmarkCenters(data); // Replace with your data processing logic
                            break;
                        case "product":
                            console.log("we are in product block");
                            await saveProducts(data); // Replace with your data processing logic
                            break;
                        default:
                            console.log("filetype doesnt match to any of the cases");
                    }
                }
                console.log("Stream ended");
                // Send a response when all data is processed
                res.status(200).send("CSV Data processed successfully");
            })
            .on("error", (error) => {
                // Handle any errors that occur during the stream
                console.error("Error reading stream:", error);
                res.status(400).send(`error in uploading the data - ${error.message}`);
            });
    }
}
async function saveCustomer(data) {
    console.log("data", data);
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const customer = new Customer({
        name: data.Name,
        address: data.Address,
        contact: data.Contact,
        customerId: randomNum,
    });
    try {
        await customer.save();
    } catch (err) {
        console.log("error whilesaving th csv data", err.message);
    }
}
async function saveSupplier(data) {
    console.log("data", data);
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const supplier = new Supplier({
        name: data.Name,
        address: data.Address,
        contact: data.Contact,
        supplierId: randomNum,
    });
    try {
        await supplier.save();
    } catch (err) {
        console.log("error whilesaving the supplier csv data", err.message);
    }
}
async function saveVendor(data) {
    console.log("data", data);
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const vendor = new Vendor({
        name: data.Name,
        address: data.Address,
        contact: data.Contact,
        vendorId: randomNum,
    });
    try {
        await vendor.save();
    } catch (err) {
        console.log("error whilesaving the vendor csv data", err.message);
    }
}
async function saveBusinessHolder(data) {
    console.log("data", data);
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const businessHolder = new BusinessHolder({
        name: data.Name,
        address: data.Address,
        contact: data.Contact,
        businessHolderId: randomNum,
    });
    try {
        await businessHolder.save();
    } catch (err) {
        console.log("error whilesaving the businessholder csv data", err.message);
    }
}
async function saveSales(data) {
    console.log("data", data);
    const date = new Date();


    // Format the date as a string in the desired format
    const formattedDate = date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    const sale = new Sales({
        customerId: data.CustomerId,
        productId: data.ProductId,
        quantity: data.Quantity,
        saleDate: formattedDate,
    });
    try {
        await sale.save();
    } catch (err) {
        console.log("error whilesaving the sales csv data", err.message);
    }
}
async function savehallmarkCenters(data) {
    console.log("data", data);
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const hallmarkCenter = new HallMarkCenter({
        centerName: data.CenterName,
        address: data.Address,
        contact: data.Contact,
        email: data.Email,
        authorizedBy: data.AuthorizedBy,
        hallmarkCenterId: randomNum,
    });
    try {
        await hallmarkCenter.save();
    } catch (err) {
        console.log("error whilesaving the hallmark center csv data", err.message);
    }
}
async function saveProducts(data) {
    console.log("data", data);
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const product = new Product({
        productName: data.ProductName,
        productId: randomNum,
        material: data.Material,
        price: data.Price,
        purity: data.Purity,
        weight: data.Weight,
        gemstones: data.Gemstones,
        type: data.Type,
        sku: data.Sku,
        description: data.Description,
        imageUrl: "Define In CRM",
        design: data.Design,
        size: data.Size,
        initialStock: data.InitialStock,
        currentStock: data.InitialStock,
    });
    try {
        await product.save();
    } catch (err) {
        console.log("error whilesaving the product csv data", err.message);
    }
}

module.exports = streamFile