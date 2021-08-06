const mongoose = require("mongoose");

const Product = require("./models/product");

mongoose
  .connect("mongodb://localhost:27017/farmStandTake2", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongoose Connected!"))
  .catch((err) => console.log(`Error Occured.\n${err}`));

const addToDB = async function (products) {
  try {
    const data = await Product.insertMany(products);
    console.log(data);
  } catch (err) {
    console.log(`Error occured!\n${err}`);
  }
};

const clearDB = async function () {
  try {
    const response = await Product.deleteMany({});
    console.log(response);
  } catch (err) {
    console.log(`Error occured!\n${err}`);
  }
};

const seedProducts = [
  {
    name: "Oranges",
    price: 2.99,
    category: "Fruit",
  },
  {
    name: "Apples",
    price: 3.99,
    category: "fruit",
  },
  {
    name: "Ladyfinger (Long)",
    price: 1.99,
    category: "vegetable",
  },
  {
    name: "Cottage Cheese (Paneer)",
    price: 13.99,
    category: "dairy",
  },
  {
    name: "Organic Celery",
    price: 1.99,
    category: "vegetable",
  },
  {
    name: "Milk",
    price: 2.5,
    category: "dairy",
  },
];

addToDB(seedProducts);
