const express = require("express");
app.use(express.json());

const app = express();
const PORT = 5000;

app.use(express.json());
require('dotenv').config();


app.get("/", (req, res) => {
  res.send("Hello from backend, its FoodCraft!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});