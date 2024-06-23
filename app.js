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
const flash = require("connect-flash");
const session = require("express-session");
const User = require("./models/user.js");
const { userSchema } = require("./models/user.js");
const { isLoggedIn, isAuthenticated } = require("./middleware.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");

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
const cloudinary = require("cloudinary");
const { isValidResetLink } = require("./middleware.js");
const { ObjectId } = require("mongodb");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const { wrap } = require("module");
const MongoStore = require("connect-mongo");
const dbUrl = process.env.ATLASDB_URL;
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
store.on("error", () => {
  console.log("ERROR in Mongo Session Store ", err);
});

const sessionOptions = {
  store,
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

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(isAuthenticated);
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

main()
  .then(() => {
    console.log("Connected To db");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});

app.get(
  "/",
  wrapAsync(async (req, res) => {
    let schools = await School.find({});
    let courses = await Course.find({});
    let semesters = await Semester.find({});

    res.render("home.ejs", {
      schools: schools,
      courses: courses,
      semesters: semesters,
    });
  })
);

app.get("/index", (req, res) => {
  let subject = req.query.subject;
  res.render("index.ejs", { subject: subject });
});

app.get("/questionyear/:subname", (req, res) => {
  let { subname } = req.params;
  res.render("quesroutes/ques.ejs", { subname: subname });
});

app.get(
  "/quesdata/:subname",
  wrapAsync(async (req, res) => {
    try {
      // Find the subject by name
      const subject = await Subject.findOne({ name: req.params.subname });

      // If subject doesn't exist, handle the case appropriately (e.g., return an error message)
      if (!subject) {
        return res.status(404).send("Subject not found");
      }

      // Retrieve the year and subject ID from query parameters
      const quesyear = req.query.quesyear;

      // Query question papers based on the provided year and subject ID
      const questionPapers = await Quespaper.find({
        year: quesyear,
        subject: subject._id, // Assuming 'subject' field in QuestionPaper model holds subject ID
      });

      // Render the response using the retrieved question papers
      res.render("quesroutes/quesdata.ejs", { questionPapers });
    } catch (error) {
      // Handle errors
      console.error("Error fetching question papers:", error);
      res.status(500).send("Error fetching question papers");
    }
  })
);

app.get(
  "/subject",
  wrapAsync(async (req, res) => {
    let selections = req.query;
    let school = (await School.findOne({ name: selections.school })) || "";
    console.log(school);
    let course = (await Course.findOne({ _id: { $in: school.courses } })) || "";
    console.log(course);
    let sem = await Semester.findOne({
      _id: { $in: course.semesters },
    });
    console.log(sem);

    let subjects = (await Subject.find({ _id: { $in: sem.subjects } })) || "";

    res.render("subject.ejs", {
      subjects: subjects,
      semester: sem,
      course: course,
      school: school,
    });
  })
);

app.get(
  "/references/:subname",
  wrapAsync(async (req, res) => {
    let { subname } = req.params;

    try {
      // Find the subject by name
      const subject = await Subject.findOne({ name: subname });

      // If subject doesn't exist, handle the case appropriately (e.g., return an error message)
      if (!subject) {
        return res.status(404).send("Subject not found");
      }

      // Query question papers based on the provided year and subject ID
      const refMaterials = await Refmaterial.find({
        subject: subject._id, // Assuming 'subject' field in QuestionPaper model holds subject ID
      });
      // questionPapers;
      // Render the response using the retrieved question papers
      res.render("refs.ejs", { refMaterials: refMaterials });
    } catch (error) {
      // Handle errors
      console.error("Error fetching question papers:", error);
      res.status(500).send("Error fetching question papers");
    }
  })
);

app.get(
  "/showfile",
  wrapAsync(async (req, res) => {
    let { link } = req.query;
    res.render("showfile.ejs", { link: link });
  })
);

app.get(
  "/upload",
  isLoggedIn,
  wrapAsync(async (req, res) => {
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
  })
);

app.post(
  "/upload",
  upload.array("files"),
  wrapAsync(async (req, res) => {
    try {
      const files = req.files;
      const userId = req.user._id; // Assuming you have authenticated user and have access to user's ID

      // Save file links to database
      if (req.body.filetype == "quespaper") {
        const filePromises = files.map(async (file) => {
          const questionPaper = new Quespaper({
            year: new Date().getFullYear(), // Assuming you want to save current year
            link: file.path, // Cloudinary file path
            user: userId,
            subject: req.body.subject,
            name: req.body.filename,
          });

          // Upload file to Cloudinary with the desired filename
          // await cloudinary.uploader.upload(file.path, {
          //   public_id: req.body.filename, // Set public ID (filename) to match name field in Quespaper model
          //   resource_type: "auto",
          // });

          await questionPaper.save(); //.save() returns a promise
        });
        await Promise.all(filePromises);
      } else {
        const filePromises = files.map(async (file) => {
          const referenceMaterial = new Refmaterial({
            link: file.path, // Cloudinary file path
            user: userId,
            subject: req.body.subject,
            name: req.body.filename,
          });

          // Upload file to Cloudinary with the desired filename
          // await cloudinary.uploader.upload(file.path, {
          //   public_id: req.body.filename, // Set public ID (filename) to match name field in Quespaper model
          //   resource_type: "auto",
          // });

          await referenceMaterial.save(); //.save() returns a promise
        });
        await Promise.all(filePromises);
      }

      req.flash("success", "Your Upload was successfull !");
      res.redirect("/upload");
    } catch (error) {
      console.error("Error uploading files:", error);
      req.flash(
        "error",
        "Your Upload was NOT successfull ! Kindly Try Again ."
      );
      res.status(500).redirect("/upload");
    }
  })
);

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

app.get(
  "/account",
  wrapAsync(async (req, res) => {
    let schoolName = (await School.findOne({ _id: req.user.school })).name;
    let courseName = (await Course.findOne({ _id: req.user.course })).name;
    let courseData = await Course.findOne({ _id: req.user.course }).populate(
      "semesters"
    );
    const semesterNumbers = courseData.semesters.map(
      (semester) => semester.number
    );
    let semNo = (await Semester.findOne({ _id: req.user.semester })).number;

    let matUploaded = [];
    let quesUploaded = await Quespaper.find({ user: req.user._id });
    let refsUploaded = await Refmaterial.find({ user: req.user._id });
    matUploaded = matUploaded.concat(quesUploaded, refsUploaded);

    res.render("account.ejs", {
      userDetails: req.user,
      schoolName: schoolName,
      courseName: courseName,
      semno: semNo,
      semesterNumbers: semesterNumbers,
      matUploaded: matUploaded,
    });
  })
);

app.post(
  "/updatesem",
  wrapAsync(async (req, res) => {
    let myCourse = await Course.findOne({ _id: req.user.course });

    const desiredSemNumber = req.body.newsem;
    let newSemId = [];
    await myCourse.semesters.forEach(async (semId) => {
      let semObj = await Semester.findOne({ _id: semId });
      if (semObj.number == desiredSemNumber) {
        newSemId.push(semObj._id);
      }
    });

    let user = await User.findOne({ username: req.user.username });
    user.semester = newSemId[0];
    let result = await user.save();
    res.redirect("/account");
  })
);

app.get("/resetpass/:token", isValidResetLink, (req, res) => {
  res.render("resetpass.ejs");
});
app.post(
  "/resetpass",
  wrapAsync(async (req, res) => {
    try {
      const user1 = await User.findOne({ username: req.body.username });

      if (!user1) {
        return res.status(404).send("User not found");
      }

      await User.findByUsername(req.body.username, async (err, user) => {
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
                email: user1.email,
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
  })
);

app.get("/forgetpass", (req, res) => {
  let email = " ";
  if (req.user) {
    email = req.user.email;
  }
  res.render("forgetpass.ejs", { email: email });
});

app.post("/forgetpass", (req, res) => {
  const userEmail = req.body.email;
  // Generate unique token and store it in the database along with the email
  // Send email with reset link
  let loginChecker = req.isAuthenticated();
  sendResetEmail(userEmail, loginChecker);
  res.status(200);
});

function generateExpiryTime() {
  const now = new Date();
  const expiryTime = new Date(now.getTime() + 60 * 60 * 1000); // Add 1 hour (in milliseconds)
  return expiryTime;
}
// Function to store the generated token and expiry time in the database
wrapAsync(async function storeToken(email, token, expiryTime) {
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
});

function sendResetEmail(email, loginChecker) {
  // Craft the email content with the reset link
  const token = uuid.v4();
  const expiry_time = generateExpiryTime();
  storeToken(email, token, expiry_time);
  let resetLink = " ";
  if (loginChecker) {
    resetLink = `http://localhost:8080/resetpass/${token}`;
  } else {
    resetLink = `http://localhost:8080/resetpass/${token}?notlogged=true`;
  }
  const message = `<p style="color: red;">Hey Dear Fellow NFSUian !</p>
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
  wrapAsync(async (req, res) => {
    req.flash("success", "Welcome back to the qbon !");
    res.redirect("/upload");
  })
);

app.get(
  "/register",
  wrapAsync(async (req, res) => {
    let schools = await School.find({});

    res.render("register.ejs", { schools });
  })
);

app.get(
  "/getcourses",
  wrapAsync(async (req, res) => {
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
  })
);

app.get(
  "/getsemesters",
  wrapAsync(async (req, res) => {
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
  })
);

app.post(
  "/register",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, name, school, course, semester, password } =
        req.body;
      //finding school id from school name
      let schoolObj = await School.findOne({ name: school });
      schoolId = schoolObj._id;
      let courseObj = await Course.findOne({ _id: { $in: schoolObj.courses } });
      courseId = courseObj._id;
      let semObj = await Semester.findOne({
        _id: { $in: courseObj.semesters },
      });
      semId = semObj._id;
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
  })
);

app.get("/signout", function (req, res, next) {
  if (isAuthenticated) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  }
});

app.get("/note", (req, res) => {
  res.render("note.ejs");
});

let insert = async () => {
  let qps = [
    // {
    //   year: 2024,
    //   link: "https://docs.google.com/document/d/1uExDXHsxk0D_fY1sQC7py3t_wyfh804UmklF7U2aSO0/edit",
    // },
    // {
    //   year: 2931,
    //   link: "https://docs.google.com/document/d/1uExDXHsxk0D_fY1sQC7py3t_wyfh804UmklF7U2aSO0/edit",
    // },
    // {
    //   year: 9999,
    //   link: "https://docs.google.com/document/d/1uExDXHsxk0D_fY1sQC7py3t_wyfh804UmklF7U2aSO0/edit",
    // },
    // {
    //   year: 1212,
    //   link: "https://docs.google.com/document/d/1uExDXHsxk0D_fY1sQC7py3t_wyfh804UmklF7U2aSO0/edit",
    // },
  ];

  let res = await Quespaper.insertMany(qps);

  // let subs1 = await Subject.insertMany(
  //   {
  //     name: "Engineering Chemistry",
  //     questionPapers: res.map((qp) => {
  //       return qp._id;
  //     }),
  //   },
  //   {
  //     name: "Engineering",
  //     questionPapers: res.map((qp) => {
  //       return qp._id;
  //     }),
  //   }
  // );
  let subs2 = await Subject.insertMany([
    {
      name: "Engineering Chemistry",
      questionPapers: res.map((qp) => {
        return qp._id;
      }),
    },
    {
      name: "Engineering Mathematics-2",
      questionPapers: res.map((qp) => {
        return qp._id;
      }),
    },
    {
      name: "Professional Ethics",
      questionPapers: res.map((qp) => {
        return qp._id;
      }),
    },
    {
      name: "Environmental Sciences",
      questionPapers: res.map((qp) => {
        return qp._id;
      }),
    },
    {
      name: "Digital Logic Design",
      questionPapers: res.map((qp) => {
        return qp._id;
      }),
    },
    {
      name: "Programming with CPP",
      questionPapers: res.map((qp) => {
        return qp._id;
      }),
    },
    {
      name: "Forensic Sciences and Cyber Laws",
      questionPapers: res.map((qp) => {
        return qp._id;
      }),
    },
  ]);
  let sem = await Semester.insertMany(
    // {
    //   number: "1",
    //   subjects: subs1.map((sub) => {
    //     return sub._id;
    //   }),
    // },
    {
      number: "2",
      subjects: subs2.map((sub) => {
        return sub._id;
      }),
    }
  );

  let course = await Course.insertMany({
    name: "Btech",
    semesters: sem.map((qp) => {
      return qp._id;
    }),
  });

  let school = await School.insertMany({
    name: "School of Cybersecurity and Digital Forensics",
    courses: course.map((qp) => {
      return qp._id;
    }),
  });

  console.log("added succsss");
};

// insert();

let func = async () => {
  let sems = await Semester.find({
    _id: { $in: ["65cd0b8728a2f5e8e79ae142", "65d4995f143b88279b99ed41"] },
  });

  // await Course.updateOne(
  //   { _id: "65cd0b8728a2f5e8e79ae144" },
  //   {
  //     _id: ObjectId("65cd0b8728a2f5e8e79ae144"),
  //     name: "B.tech",
  //     semesters: sems,
  //     __v: 0,
  //   },
  //   {
  //     multi: true, // Update all matching documents
  //   }
  // );

  const updatedCourse = {
    name: "B.tech",
    semesters: sems,
  };

  await Course.updateOne({ _id: "65cd0b8728a2f5e8e79ae144" }, updatedCourse);

  console.log(await Course.find());
};

// func();

// delete route
app.delete(
  "/delete",
  wrapAsync(async (req, res) => {
    let { matid, matyear } = req.body;
    if (matyear) {
      let qp = await Quespaper.findByIdAndDelete(matid);
    } else {
      let refmat = await Refmaterial.findByIdAndDelete(matid);
    }
    res.redirect("/account");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found !"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
});
