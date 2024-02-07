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

app.get("/", (req, res) => {
  res.render("home.ejs");
});

let createNewSchool = async () => {
  const newSchool = new School({
    name: "Your School Name",
    courses: [
      {
        name: "Course 1",
        semesters: [{ number: 1 }, { number: 2 }],
      },
      {
        name: "Course 2",
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
