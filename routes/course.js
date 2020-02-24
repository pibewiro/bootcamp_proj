const express = require("express");
const router = express.Router({
  mergeParams: true
})
const {
  protect
} = require("../middleware/auth")
const CourseController = require("../controller/course")

router.get("/", CourseController.getCourses);
router.post("/", protect, CourseController.postCourse);
router.get("/:courseId", CourseController.getCourse);
router.get("/update/:courseId", protect, CourseController.updateCourse);
router.delete("/:courseId", protect, CourseController.deleteCourse);





module.exports = router