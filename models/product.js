const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    unique: true,
  },
  productId: {
    type: String,
    required: true,
    unique: true,
  },
  material: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  purity: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
  gemStones: {
    type: [String],
    default: [],
  },
  type: {
    type: String,
    required: true,
  },
  hallmarkCertified: {
    type: Boolean,
    default: false,
  },
  sku: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  imageUrl: {
    type: String,
    default: "",
  },
  design: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "",
  },
  barcode: {
    type: String,
    default: "",
  },
  initialStock: {
    type: String,
    required: true,
  },
  currentStock: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
