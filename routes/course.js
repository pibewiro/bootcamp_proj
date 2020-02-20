const express = require("express");
const router = express.Router({
  mergeParams: true
})
const CourseController = require("../controller/course")

router.get("/", CourseController.getCourses);
router.post("/", CourseController.postCourse);
router.get("/:courseId", CourseController.getCourse);
router.get("/update/:courseId", CourseController.updateCourse);
router.delete("/:courseId", CourseController.deleteCourse);





module.exports = router