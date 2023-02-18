const express = require("express");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (req, res) => {
  let { data: customer, error } = await supabase.from("customer").select("*");
  let { data: planner, err } = await supabase
    .from("sevendays")
    .select("*")
    .order("date");
  if (error) {
    console.error(error);
  }
  // console.log(planner);
  res.render("index.ejs", { cus: customer, plan: planner });
});

app.post("/addslot", async (req, res) => {
  // console.log(req.body);
  let slot1 = req.body.slotNumber1;
  let slot2 = req.body.slotNumber2;
  let slot3 = req.body.slotNumber3;
  let slot4 = req.body.slotNumber4;
  let date = req.body.date;

  let { data, error } = await supabase
    .from("planner")
    .update({
      slot_1: slot1,
      slot_2: slot2,
      slot_3: slot3,
      slot_4: slot4,
    })
    .eq("date", date);
  if (error) {
    console.error(error);
  }
  res.redirect("/");
});

app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
});
