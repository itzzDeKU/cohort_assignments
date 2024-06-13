const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");

// User Routes
router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const comparePassword = bcrypt.compare(password, user.password);
    if (user && comparePassword) {
      const jwtToken = jwt.sign(
        {
          username,
          type: "user",
        },
        JWT_SECRET
      );

      res.json({ jwtToken });
    } else {
      res.status(401).json({ msg: "Unauthorized" });
    }
  } catch (e) {
    res.status(512).send(e.message);
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username: username,
      password: hashedPassword,
    });
    res.status(200).send({ message: "User created successfully" });
  } catch (e) {
    res.status(404).send(e.message);
  }
});

router.get("/courses", userMiddleware, async (req, res) => {
  try {
    const courses = await Course.find({});
    if (courses.length === 0) {
      console.log("No courses found.");
      return res.status(204).send("No courses found");
    } else res.status(200).send({ courses: courses });
  } catch (err) {
    console.error(err);
    res.status(512).send(err);
  }
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  try {
    // Extracting courseId from req params
    const courseId = req.params.courseId;
    const { username } = req;
    // Defining filter criteria
    const filter = { username };

    // #push operator used in qurey to update
    const result = await User.updateOne(filter, {
      $push: {
        purchasedCourses: courseId,
      },
    });

    res.status(200).send("Course added to user's purchased courses");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  try {
    const { username } = req.headers;
    const filter = { username };
    const user = await User.findOne(filter);

    if (!user) {
      return res.status(404).send("User not found");
    }

    const purchasedCourseIds = user.purchasedCourses;
    const boughtCourses = await Course.find({
      _id: { $in: purchasedCourseIds },
    });

    res.status(200).send({ purchasedCourses: boughtCourses });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
