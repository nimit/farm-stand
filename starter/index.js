const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

const Product = require("./models/product");
const Farm = require("./models/farm");
const staticData = require("./static_data");
const { static } = require("express");

mongoose
  .connect("mongodb://localhost:27017/farmStandTake2", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongoose Connected!"))
  .catch((err) => console.log(`Error Occured.\n${err}`));

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (_, res) => res.send("Welcome Home!"));

// FARM ROUTES

app.get("/farms", async (_, res) => {
  const farms = await Farm.find({});
  res.render("farms/index", { farms });
});

app.get("/farms/new", (_, res) => res.render("farms/new"));

app.post("/farms", async (req, res) => {
  const { name, city, email } = req.body;
  const f = new Farm({ name, city, email });
  await f.save();
  res.redirect(301, "/farms");
});

app.get("/farm/:id", async (req, res) => {
  const farm = await Farm.findById(req.params.id).populate("products");
  res.render("farms/details", { farm });
});

app.get("/farm/:id/products/new", async (req, res) => {
  const { id } = req.params;
  const farm = await Farm.findById(id);
  res.render("products/new", { ...staticData, farm });
});

app.post("/farm/:id/products", async (req, res) => {
  const { id } = req.params;
  const farm = await Farm.findById(id);
  const { name, price, category } = req.body;
  const product = new Product({ name, price, category });
  farm.products.push(product);
  product.farm = farm;
  await product.save();
  await farm.save();
  res.redirect(301, `/farm/${id}`);
});

app.get("/farm/:id/delete", async (req, res) => {
  await Farm.findByIdAndDelete(req.params["id"]);
  res.redirect(301, "/farms");
});

// PRODUCT ROUTES

app.get("/products", async (req, res) => {
  let category = req.query["category"];
  if (category) category = category.toLowerCase();
  let filter = category ? { category } : {};
  if (!staticData.categories.includes(category)) filter = {};
  const products = await Product.find(filter);
  res.render("products/index", { products, filter });
});

// app.get("/products/new", (_, res) => {
//   res.render("products/new", staticData);
// });

app.post("/products", async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const newProduct = await Product({
      name,
      price,
      category,
    });
    newProduct.save();
  } catch (err) {
    console.log(`An error occured.\n${err}`);
  }
  res.redirect(301, "/products");
});

app.get("/product/:id/edit", async (req, res) => {
  try {
    const product = await Product.findById(req.params["id"]);
    const { categories } = require("./static_data");
    res.render("products/edit", { product, categories });
  } catch (err) {
    console.log(err);
    res.redirect(301, "/404");
  }
});

app.put("/product/:id", async (req, res) => {
  try {
    const { name, price, category } = req.body;
    await Product.findByIdAndUpdate(
      req.params["id"],
      {
        name,
        price,
        category,
      },
      { runValidators: true }
    );
  } catch (err) {
    console.log(`An error occured.\n${err}`);
  }
  res.redirect(301, "/products");
});

app.get("/product/:id/delete", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params["id"]);
  } catch (err) {
    console.log(`An error occured.\n${err}`);
  }
  res.redirect(301, "/products");
});

app.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "farm",
      "name"
    );
    res.render("products/details", { product });
  } catch (err) {
    console.log(err);
    res.redirect(301, "/404");
  }
});

app.get("/404", (_, res) => res.render("notfound"));

app.use((_, res) => res.render("notfound"));

app.listen(3000, () => console.log("Server running on port 3000!"));
