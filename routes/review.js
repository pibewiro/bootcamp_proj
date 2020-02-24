const express = require("express");
const router = express.Router();
const review = require('../controller/review')
const {
  protect
} = require("../middleware/auth")


router.get("/", protect, review.getReviews)
router.get("/:id", protect, review.getReview)
router.post("/:bootcampID", protect, review.addReview)


module.exports = router