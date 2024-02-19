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
const User = require("./models/user.js");
const { userSchema } = require("./models/user.js");
const { isLoggedIn, isAuthenticated } = require("./middleware");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const flash = require("connect-flash");
const multer = require("multer");
const { storage } = require("./cloudConfig.js");
const upload = multer({ storage });

const Course = require("./models/course");
const Semester = require("./models/semester");
const Subject = require("./models/subject");
const Quespaper = require("./models/quespaper");
const Refmaterial = require("./models/refmaterial");
const PasswordResetToken = require("./models/resetpass.js");
const nodemailer = require("nodemailer");
const uuid = require("uuid");
const { isValidResetLink } = require("./middleware.js");

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

app.use(isAuthenticated);
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
  let courses = await Course.find({});
  let semesters = await Semester.find({});

  res.render("home.ejs", {
    schools: schools,
    courses: courses,
    semesters: semesters,
  });
});

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
  let school = (await School.find({ name: selections.school })) || "";
  let course = (await Course.find({ name: selections.course })) || "";
  let sem = (await Semester.find({ number: selections.semester })) || "";
  let subjects = (await Subject.find({ _id: { $in: sem[0].subjects } })) || "";

  res.render("subject.ejs", {
    subjects: subjects,
    semester: sem,
    course: course,
    school: school,
  });
});

app.get("/references", (req, res) => {
  res.render("refs.ejs");
});

app.get("/showfile", (req, res) => {
  res.render("showfile.ejs");
});

// app.get("/upload", isLoggedIn, async (req, res) => {
//   let user = req.user;
//   let sem = await Semester.findOne({ _id: user.semester });
//   let subIds = sem.subjects;
//   let subs = [];
//   await subIds.forEach(async (idno) => {
//     let sub = await Subject.findOne({ _id: idno });
//     subs.push(sub);
//   });
//   console.log(subs);
//   res.render("upload.ejs", { subs: subs });
// });
app.get("/upload", isLoggedIn, async (req, res) => {
  try {
    let user = req.user;
    let sem = await Semester.findOne({ _id: user.semester });
    let subIds = sem.subjects;

    // Use map with Promise.all to fetch subjects asynchronously
    let subs = await Promise.all(
      subIds.map(async (idno) => {
        let sub = await Subject.findOne({ _id: idno });
        return sub;
      })
    );

    res.render("upload.ejs", { subs: subs });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/upload", upload.single("file"), (req, res) => {
  res.send("file uploaded sucessfully");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/signout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      req.flash("success", "You have been logged out successfully !");
      res.redirect("/");
    }
  });
});
app.get("/account", async (req, res) => {
  let schoolName = (await School.findOne({ _id: req.user.school })).name;
  let courseName = (await Course.findOne({ _id: req.user.course })).name;
  let semNo = (await Semester.findOne({ _id: req.user.semester })).number;
  res.render("account.ejs", {
    userDetails: req.user,
    schoolName: schoolName,
    courseName: courseName,
    semno: semNo,
  });
});

app.get("/resetpass/:token", isValidResetLink, (req, res) => {
  res.render("resetpass.ejs");
});
app.post("/resetpass", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });

    if (!user) {
      return res.status(404).send("User not found");
    }

    await User.findByUsername(req.user.username, async (err, user) => {
      if (err) {
        res.send(err);
      } else {
        user.setPassword(req.body.password, async function (err) {
          if (err) {
            res.send(err);
          } else {
            await user.save();
            console.log("password changed successfully.");
            await PasswordResetToken.deleteMany({
              email: req.user.email,
            });
            res.redirect("/");
          }
        });
      }
    });
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/forgetpass", (req, res) => {
  let email = req.user.email;
  res.render("forgetpass.ejs", { email: email });
});

app.post("/forgetpass", (req, res) => {
  const userEmail = req.body.email;
  // Generate unique token and store it in the database along with the email
  // Send email with reset link
  sendResetEmail(userEmail);
  res.status(200);
});

function generateExpiryTime() {
  const now = new Date();
  const expiryTime = new Date(now.getTime() + 60 * 60 * 1000); // Add 1 hour (in milliseconds)
  return expiryTime;
}
// Function to store the generated token and expiry time in the database
async function storeToken(email, token, expiryTime) {
  try {
    // Create a new document using the PasswordResetToken model
    const resetToken = new PasswordResetToken({
      email: email,
      token: token,
      expiryTime: expiryTime,
    });

    // Save the document to the database
    await resetToken.save();
    console.log("Token stored successfully.");
  } catch (error) {
    console.error("Error storing token:", error);
  }
}
function sendResetEmail(email) {
  // Craft the email content with the reset link
  const token = uuid.v4();
  const expiry_time = generateExpiryTime();
  storeToken(email, token, expiry_time);
  const resetLink = `http://localhost:8080/resetpass/${token}`;
  const message = `<p style="color: red;">Hey NFSUian !</p>
<br/>
We received a request to reset the password associated with your account. If you did not make this request, you can safely ignore this email.
<br/><br/>
To reset your password, please click on the <strong>Following link</strong>:
<br/><br/>
<a href="${resetLink}" >${resetLink}</a>
<br/><br/>
If clicking the link doesn't work, you can copy and paste it into your browser's address bar.
<br/><br/>
This link will expire on ${expiry_time}, so please reset your password as soon as possible.
<br/><br/>
<strong>Thank you,</strong><br/>
<p style="color: red;">Qbon Team .</p>
<br/>
<div>
<img
      src="https://res.cloudinary.com/ddxv0iwcs/image/upload/v1707926485/qbon_DEV/Screenshot_2024-02-07_at_10.01.59_AM_mbeifo.png"
      style="border-radius:2rem;width:60%;"
      alt="..."
    />
</div>
`;

  // Set up nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "smile.itsadil@gmail.com",
      pass: process.env.APP_PASSWORD,
    },
  });

  // Set up email options
  const mailOptions = {
    from: "ceo@qbon<smile.itsadil@gmail.com>",
    to: email,
    subject: "Password Reset Request",
    html: message,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

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
    let courses = [];
    let allcourses = await Course.find({});
    for (courseId of schoolData.courses) {
      for (c of allcourses) {
        if (courseId.equals(c._id)) {
          courses.push(c.name);
        }
      }
    }
    res.send(courses);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/getsemesters", async (req, res) => {
  const { course } = req.query;
  try {
    const courseData = await Course.findOne({ name: course });
    //     {
    //   _id: new ObjectId('65cc91451e71feebdf65e0c5'),
    //   name: 'B.tech',
    //   semesters: [ new ObjectId('65cc91451e71feebdf65e0c3') ],
    //   __v: 0
    // }
    if (courseData) {
      let semesters = [];
      let allsems = await Semester.find({});
      for (semId of courseData.semesters) {
        for (s of allsems) {
          if (semId.equals(s._id)) {
            semesters.push(s.number);
          }
        }
      }
      res.send(semesters);
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
    //finding school id from school name
    let schoolId = await School.findOne({ name: school });
    schoolId = schoolId._id;
    let courseId = await Course.findOne({ name: course });
    courseId = courseId._id;
    let semId = await Semester.findOne({ number: semester });
    semId = semId._id;
    const newUser = new User({
      username: username,
      email: email,
      name: name,
      school: schoolId,
      course: courseId,
      semester: semId,
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

let insert = async () => {
  let qps = [
    {
      year: 2000,
      link: "https://docs.google.com/document/d/1uExDXHsxk0D_fY1sQC7py3t_wyfh804UmklF7U2aSO0/edit",
    },
    {
      year: 2001,
      link: "https://docs.google.com/document/d/1uExDXHsxk0D_fY1sQC7py3t_wyfh804UmklF7U2aSO0/edit",
    },
  ];

  let res = await Quespaper.insertMany(qps);

  let subs = await Subject.insertMany({
    name: "Fundamental of C Programming",
    questionPapers: res.map((qp) => {
      return qp._id;
    }),
  });
  let sem = await Semester.insertMany({
    number: "1",
    subjects: subs.map((qp) => {
      return qp._id;
    }),
  });
  let course = await Course.insertMany({
    name: "B.tech",
    semesters: sem.map((qp) => {
      return qp._id;
    }),
  });
  let school = await School.insertMany({
    name: "School of cybersecurity and digital forensics",
    courses: course.map((qp) => {
      return qp._id;
    }),
  });
};

// insert();
