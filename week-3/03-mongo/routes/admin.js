const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const { Course, User, Admin } = require("../db");

// Admin Routes
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const newAdmin = await Admin.create({
      username: username,
      password: password,
    });
    res.status(200).send({ message: "Admin created successfully" });
  } catch (e) {
    res.status(404).send(e);
  }
});

router.post("/courses", adminMiddleware, async (req, res) => {
  try {
    const { title, description, price, imageLink } = req.body;
    // zod - Input Validations
    const newCourse = await Course.create({
      title: title,
      description: description,
      price: price,
      imageLink: imageLink,
      published: true,
    });
    res
      .status(200)
      .send({
        message: "Course Created Successfully",
        courseId: newCourse._id,
      });
  } catch (e) {
    res.status(512).send(e);
  }
});

router.get("/courses", adminMiddleware, async (req, res) => {
  try {
    const courses = await Course.find({});
    if (courses.length === 0) {
      console.log("No courses found.");
      return res.status(204).send("No courses found");
    }
    res.status(200).send({ courses: courses });
  } catch (err) {
    console.error(err);
    res.status(512).send(err);
  }
});

module.exports = router;
