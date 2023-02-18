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
    "select * from customer left join planner on planner.order_date between curdate() and date_add(curdate(), interval 7 day) order by order_date";
  connection.query(sql, function (error, results) {
    if (error) throw error;
    // console.log(results)
    res.render("index.ejs", { cus: results });
  });
});

app.get("/planner", (req, res) => {
  let sql =
    "select DISTINCT * from planner where order_date between curdate() and date_add(curdate(), interval 6 day) order by order_date";

  connection.query(sql, function (error, results) {
    if (error) throw error;
    // console.log(results)
    res.json(results);
  });
});

app.get("/planners", (req, res) => {
  let sql =
    "select order_date, concat(c1.customer_name, ' (', c1.pickup_location, ' to ', c1.dropoff_location, ')') as slot_1_customer,concat(c2.customer_name, ' (', c2.pickup_location, ' to ', c2.dropoff_location, ')') as slot_2_customer,concat(c3.customer_name, ' (', c3.pickup_location, ' to ', c3.dropoff_location, ')') as slot_3_customer,concat(c4.customer_name, ' (', c4.pickup_location, ' to ', c4.dropoff_location, ')') as slot_4_customer from planner left join customer c1 on planner.slot_1_customer_id = c1.customer_id left join customer c2 on planner.slot_2_customer_id = c2.customer_id left join customer c3 on planner.slot_3_customer_id = c3.customer_id left join customer c4 on planner.slot_4_customer_id = c4.customer_id where order_date between curdate() and date_add(curdate(), interval 6 day) order by order_date";

  connection.query(sql, function (error, results) {
    if (error) throw error;
    res.render("planner.ejs", { plan: results });
    // res.json(results);
  });
});

app.post("/addslot", (req, res) => {
  console.log(req.body);
  let sql =
    "update planner set slot_1_customer_id = req.body.slotNumber1 , slot_2_customer_id = req.body.slotNumber2, slot_3_customer_id = req.body.slotNumber3, slot_4_customer_id = req.body.slotNumber4 where order_date = req.body.date'";
  connection.query(sql, function (error, results) {
    if (error) throw error;
    console.log(results);
  });
  res.redirect("/");
});

app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
});
