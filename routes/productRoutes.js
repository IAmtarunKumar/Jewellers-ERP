const express = require("express");
const admin = require("firebase-admin");
const getAllProducts = require("../controllers/crmControllers/getAllProducts.js");
const editProduct = require("../controllers/crmControllers/editApis/editProduct.js");
const Product = require("../models/product.js");

const router = express.Router();

// router.get("/", getAllProducts);  //veer code
router.post("/edit", editProduct);

router.get('/fetch', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
router.post('/fetchOne', async (req, res) => {
    console.log("whats coming in body", req.body)
    const { productId } = req.body
    try {
        const product = await Product.findOne({ productId });
        if (!product) return res.status(400).send("No product of desired Id is found!")
        return res.status(200).send(product);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// POST a new product

router.post('/update', async (req, res) => {

    console.log(
        "we are in the add product block and checking whatsin body after parsing",
        req.body,
    );

    const { productName, sku, material, price, size, type, weight, design, gemStones, purity, description, initialStock, fileNameToSave } = req.body
    try {
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        const product = new Product({ productName, sku, material, price, size, type, weight, design, gemStones, initialStock, currentStock: initialStock, productId: randomNum, description, purity, imageUrl: fileNameToSave });
        const response = await product.save();
        console.log("newproduct is save and response is", response)
        res.status(200).send("the new product has been saved successfully!");
    } catch (error) {
        res.status(400).send(`error has occured - ${error.message}`);
    }
});



module.exports = router;
