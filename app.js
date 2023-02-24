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
  const user = await supabase.from("customer").select("*");
  const slot = await supabase.from("sevendays").select("*").order("date");
  const [userResult, slotResult] = await Promise.allSettled([user, slot]);

  if (userResult.status === "rejected") {
    const err = userResult.reason;
    console.error(err);
  } 
  if (slotResult.status === "rejected") {
    const err = userResult.reason;
    console.error(err);
  } 
  res.render("index.ejs", {
    cus: userResult.value.data,
    plan: slotResult.value.data,
  });
});

app.post("/addslot", async (req, res) => {
  const body = req.body
  let slot1 = body.slotNumber1 === "" ? null : body.slotNumber1;
  let slot2 = body.slotNumber2 === "" ? null : body.slotNumber2;
  let slot3 = body.slotNumber3 === "" ? null : body.slotNumber3;
  let slot4 = body.slotNumber4 === "" ? null : body.slotNumber4;
  let date = body.date;
  console.log(body)

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
