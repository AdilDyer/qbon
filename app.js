const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const School = require("./models/school");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main()
  .then(() => {
    console.log("Connected To db");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/qbon");
}

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});

app.get("/", async (req, res) => {
  let schools = await School.find({});
  // console.log(schools);
  res.render("home.ejs", {schools});
});

let createNewSchool = async () => {
  const newSchool = new School({
    name: "medico legal",
    courses: [
      {
        name: "bsc",
        semesters: [{ number: 1 }, { number: 2 }],
      },
      {
        name: "mscc",
        semesters: [{ number: 1 }, { number: 2 }, { number: 3 }],
      },
    ],
  });

  newSchool
    .save()
    .then((savedSchool) => {
      console.log("School saved:", savedSchool);
    })
    .catch((err) => {
      console.error("Error saving school:", err);
    });
};

// createNewSchool();

app.get("/schools", (req, res) => {
  res.render("selections/schools.ejs");
});
