if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const School = require("./models/school");
const session = require("express-session");
const User = require("./models/User");
const { userSchema } = require("./models/User");
const { isLoggedIn } = require("./middleware");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const flash = require("connect-flash");
const multer = require("multer");
const { storage } = require("./cloudConfig.js");
const upload = multer({ storage });

const sessionOptions = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

//make it semantic

app.get("/showfile", (req, res) => {
  res.render("showfile.ejs");
});

app.get("/upload", isLoggedIn, async (req, res) => {
  let user = req.user;
  // console.log(user);
  // let school = await School.find({ name: user.school });
  // let course = "";
  // for (c of school[0].courses) {
  //   if (c.name == user.course) {
  //     course = c;
  //   }
  // }
  let school = await School.find({ name: user.school });
  let course =
    school[0].courses.find((item) => item.name === user.course) || "";
  let semObj =
    course.semesters.find((item) => item.number == user.semester) || "";
  let subjects = semObj.subjects;
  res.render("upload.ejs", { subjects });
});

app.post("/upload", upload.single("file"), (req, res) => {
  res.send("file uploaded sucessfully");
});


app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome back to the qbon !");
    res.redirect("/upload");
  }
);

app.get("/register", async (req, res) => {
  let schools = await School.find({});

  res.render("register.ejs", { schools });
});

app.get("/getcourses", async (req, res) => {
  const { school } = req.query;
  try {
    const schoolData = await School.findOne({ name: school });
    res.json(schoolData.courses);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/getsemesters", async (req, res) => {
  const { course } = req.query;
  try {
    const courseData = await School.findOne({ "courses.name": course });
    if (courseData) {
      const selectedCourse = courseData.courses.find((c) => c.name === course);
      res.json(selectedCourse.semesters);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/register", async (req, res) => {
  try {
    let { username, email, name, school, course, semester, password } =
      req.body;
    const newUser = new User({
      username,
      email,
      name,
      school,
      course,
      semester,
    });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      } else {
        req.flash("success", "Welcome to the qbon  !");
        res.redirect("/");
      }
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/");
  }
});
