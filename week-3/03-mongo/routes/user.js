const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");

// User Routes
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = await User.create({
      username: username,
      password: password,
    });
    res.status(200).send({ message: "User created successfully" });
  } catch (e) {
    res.status(404).send(e);
  }
});

router.get("/courses", async (req, res) => {
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
    const { username, password } = req.headers;
    // Defining filter criteria
    const filter = { username, password };

    // #push operator used in qurey to update
    const user = await User.findOne(filter);
    if (!user) {
      return res.status(404).send("User not found");
    }
    // Make changes to user
    user.purchasedCourses.push(courseId);
    // Save the updated user doc.
    await user.save();

    res.status(200).send("Course added to user's purchased courses");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  try {
    const { username, password } = req.headers;
    const filter = { username, password };
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
