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

  res.render("home.ejs", { schools });
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

//inserting in school collection:

const insertToDb = async () => {
  School.insertMany({
    name: "School of Management",
    courses: [
      {
        name: "BBA",
        semesters: [
          {
            number: 1,
            subjects: [
              {
                name: "basic Accounting",
                questionPapers: [
                  { year: 2021 },
                  { year: 2022 },
                  { year: 2023 },
                  { year: 2024 },
                ],
              },
              {
                name: "social financial systems",
                questionPapers: [
                  { year: 2021 },
                  { year: 2022 },
                  { year: 2023 },
                  { year: 2024 },
                ],
              },
              {
                name: "social  systems",
                questionPapers: [
                  { year: 2021 },
                  { year: 2022 },
                  { year: 2023 },
                  { year: 2024 },
                ],
              },

              // Other subjects for this semester
            ],
          },
          {
            number: 2,
            subjects: [
              {
                name: "high level eco",
                questionPapers: [
                  { year: 2021 },
                  { year: 2022 },
                  { year: 2023 },
                  { year: 2024 },
                ],
              },
              {
                name: "democracy and eco",
                questionPapers: [
                  { year: 2021 },
                  { year: 2022 },
                  { year: 2023 },
                  { year: 2024 },
                ],
              },
              {
                name: " and eco",
                questionPapers: [
                  { year: 2021 },
                  { year: 2022 },
                  { year: 2023 },
                  { year: 2024 },
                ],
              },

              // Other subjects for this semester
            ],
          },
          // Other semesters for this program
        ],
      },
      {
        name: "MBA",
        semesters: [
          {
            number: 1,
            subjects: [
              {
                name: "masters business",
                questionPapers: [
                  { year: 2021 },
                  { year: 2022 },
                  { year: 2023 },
                  { year: 2024 },
                ],
              },
              {
                name: "masters social justice business poilicyies",
                questionPapers: [
                  { year: 2021 },
                  { year: 2022 },
                  { year: 2023 },
                  { year: 2024 },
                ],
              },

              // Other subjects for this semester
            ],
          },
          {
            number: 2,
            subjects: [
              {
                name: "high mst master level accounts",
                questionPapers: [
                  { year: 2021 },
                  { year: 2022 },
                  { year: 2023 },
                  { year: 2024 },
                ],
              },
              {
                name: "democracy  master andasdlafjsdf mst and india",
                questionPapers: [
                  { year: 2021 },
                  { year: 2022 },
                  { year: 2023 },
                  { year: 2024 },
                ],
              },

              // Other subjects for this semester
            ],
          },
          // Other semesters for this program
        ],
      },
      // Other programs for this school
    ],
  });
};

// insertToDb();
app.get("/index", (req, res) => {
  res.render("index.ejs");
});

app.get("/questionyear", (req, res) => {
  res.render("quesroutes/ques.ejs");
});

app.get("/quesdata", (req, res) => {
  res.render("quesroutes/quesdata.ejs");
});

app.get("/subject", async (req, res) => {
  let selections = req.query;
  let school = await School.find({ name: selections.school });
  let course =
    school[0].courses.find((item) => item.name === selections.course) || "";
  let semObj =
    course.semesters.find((item) => item.number == selections.semester) || "";
  let subjects = semObj.subjects;
  res.render("subject.ejs", { subjects });
});

app.get("/references", (req, res) => {
  res.render("refs.ejs");
});
