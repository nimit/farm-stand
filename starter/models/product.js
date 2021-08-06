const mongoose = require("mongoose");
const { Schema } = mongoose;
const { categories } = require("../static_data.js");
const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: {
    type: Number,
    required: true,
    min: [0, "Can't have any items less than 0"],
  },
  category: {
    type: String,
    lowercase: true,
    enum: categories,
  },
  farm: {
    type: Schema.Types.ObjectId,
    ref: "Farm",
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
