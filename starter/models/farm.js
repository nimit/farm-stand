const mongoose = require("mongoose");
const { Schema } = mongoose;

const Product = require("./product");

const farmSchema = Schema({
  name: {
    type: String,
    required: [true, "Name of farm is required."],
  },
  city: String,
  email: {
    type: String,
    required: [true, "A method of contact is required"],
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

farmSchema.post("findOneAndDelete", async (farm) => {
  if (farm.products.length > 0) {
    const res = await Product.deleteMany({ _id: { $in: farm.products } });
  }
});

const Farm = mongoose.model("Farm", farmSchema);

module.exports = Farm;
