const Review = require("../Model/Review")
const Bootcamp = require("../Model/Bootcamp")


exports.getReviews = async (req, res, next) => {
  try {
    const review = await Review.find()

    return res.status(200).json({
      success: true,
      length: review.length,
      data: review
    })

  } catch (err) {
    console.log(err)
  }
}

exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id).populate({
      path: 'bootcamp',
      select: 'name description'
    })

    if (!review) {
      return res.status(404).json({
        success: false,
        error: "No Review FOund"
      })
    }

    return res.status(200).json(review)

  } catch (err) {
    console.log(err)
  }
}

exports.addReview = async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampID,
    req.body.user = req.user.id


  try {
    const bootcamp = await Bootcamp.findById(req.params.bootcampID)

    if (!bootcamp) {
      return res.status(404).json({
        success: false,
        error: "No Bootcamp Found"
      })
    }

    const review = await Review.create(req.body)
    return res.status(201).json({
      success: true,
      data: review
    })
  } catch (err) {
    console.log(err)
  }


}