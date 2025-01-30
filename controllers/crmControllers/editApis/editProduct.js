const Product = require("../../../models/product");

const editProduct = async (req, res) => {
    console.log("logging what came in body", req.body);
    const {
        productId,
        productName,
        material,
        price,
        purity,
        weight,
        gemstones,
        type,
        hallmarkCertified,
        sku,
        description,
        fileNameToSave,
        design,
        size,
        barcode, currentStock
    } = req.body;
    try {
        const foundProduct = await Product.find({ productId });
        if (!foundProduct)
            return res
                .status(400)
                .send(
                    "Product with the desired ID is not found! Please get it checked!"
                );
        //for the image- we are saving the image actual name in the database so that we can take it and search for it in the google firebase bucket
        const updatedProduct = await Product.findOneAndUpdate(
            { productId },
            {
                $set: {
                    productName,
                    material,
                    price,
                    purity,
                    weight,
                    gemstones,
                    type,
                    hallmarkCertified,
                    sku,
                    description,
                    imageURL: fileNameToSave,
                    design,
                    size,
                    barcode, currentStock
                },
            },
            { new: true }
        );
        console.log("updated product", updatedProduct)

        res.status(200).send("the product has been updated successfully!");
    } catch (error) {
        console.log("something went wrong", error.message); res.status(500).send(`internal server error - ${error.message}`)
    }
};
module.exports = editProduct;
