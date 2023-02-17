const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();

const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.USER,
  password: process.env.PSD,
  database: process.env.DB,
});

connection.connect();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  let sql =
    "select * from customer left join planner on planner.customer_id = customer.customer_id";
  connection.query(sql, function (error, results) {
    if (error) throw error;
    // console.log(results)
    res.render("index.ejs", { cus: results });
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
});