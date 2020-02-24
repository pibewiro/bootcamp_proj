const ErrorResponse = require("../utils/errorResponse")
const Course = require("../Model/Course")

//@getCoourse
//@ route GET /api/v1/course
//@ route GET /api/v1/bootcamps/:bootcampId/courses
//@ access public

exports.postCourse = async (req, res, next) => {
  req.body.user = req.user._id
  try {
    const course = await Course.create(req.body)
    return res.status(201).json({
      success: true,
      data: course
    })
  } catch (err) {
    next(err)
  }

}

exports.updateCourse = async (req, res, next) => {

  console.log(req.params.courseId)
  try {
    let course = await Course.findById(req.params.courseId)
    if (req.user._id.toString() !== course.user.toString() || req.user.role !== 'publisher') {
      return res.status(401).json({
        success: false,
        error: "Unauthorized"
      })
    }

    course = await Course.findOneAndUpdate(req.params.courseId, req.body, {
      new: true,
      runValidators: true
    })

    if (!course) {
      return res.status(404).json({
        success: false,
      })
    }

    return res.status(200).json({
      success: true,
      data: course
    })
  } catch (err) {
    console.log(err)
  }
}

exports.getCourses = async (req, res, next) => {

  try {
    let query;

    if (req.params.bootcampId) {
      query = await Course.find({
        bootcamp: req.params.bootcampId
      })

      return res.status(200).json({
        length: query.length,
        data: query
      })
    } else {
      query = await Course.find();

      return res.status(200).json({
        length: query.length,
        data: query
      })
    }
  } catch (err) {
    console.log(err)
  }
}

exports.getCourse = async (req, res, next) => {

  try {
    const course = await Course.findById(req.params.courseId).populate({
      path: "bootcamp",
      select: "name description website"
    })

    if (!course) {
      return next(new ErrorResponse(`ID does not exist ${req.params.courseId}`, 404))
    }

    return res.status(200).json({
      success: true,
      data: course
    })

  } catch (err) {
    console.log(err)
  }

}



exports.deleteCourse = async (req, res, next) => {

  try {
    let course = await Course.findById(req.params.courseId)
    if (req.user._id.toString() !== course.user.toString() || req.user.role !== 'publisher') {
      return res.status(401).json({
        success: false,
        error: "Unauthorized"
      })
    }

    if (!course) {
      return res.status(404).json({
        success: false
      })
    }

    course.remove()
    return res.status(200).json({
      success: true,
      error: "Course Deleted"
    })
  } catch (err) {
    console.log(err)
  }
}