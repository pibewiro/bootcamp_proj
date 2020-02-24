const express = require("express")
const router = express.Router();
const bootcamp = require("../controller/bootcamp")
const courseRouter = require("./course");
const {
  protect,
  authorize
} = require("../middleware/auth")

//@ get all bootcamps
//@api/v1/bootcamps
//access public
router.get("/", protect, authorize('admin'), bootcamp.getBootCamps)

//@ post a bootcamp
//@api/v1/bootcamps
//access public
router.post("/", protect, bootcamp.postBootCamp)

//@ get single bootcamp
//@api/v1/bootcamps/:id
//access public
router.get("/:id", bootcamp.getBootCamp)

//@delete bootcamp
//@api/v1/bootcamps/:id
//access private
router.delete("/:id", protect, bootcamp.deleteBootCamp)

router.put("/:id", protect, bootcamp.updateBootCamp)

router.get('/radius/:zipCode/:distance', bootcamp.getBootCampsInRadius)

router.put('/upload-photo/:id', bootcamp.uploadPhoto)


//include other resource routers
router.use("/:bootcampId/courses", courseRouter)




module.exports = router;