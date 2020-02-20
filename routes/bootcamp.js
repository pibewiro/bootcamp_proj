const express = require("express")
const router = express.Router();
const bootcamp = require("../controller/bootcamp")
const courseRouter = require("./course");

//@ get all bootcamps
//@api/v1/bootcamps
//access public
router.get("/", bootcamp.getBootCamps)

//@ post a bootcamp
//@api/v1/bootcamps
//access public
router.post("/", bootcamp.postBootCamp)

//@ get single bootcamp
//@api/v1/bootcamps/:id
//access public
router.get("/:id", bootcamp.getBootCamp)

//@delete bootcamp
//@api/v1/bootcamps/:id
//access private
router.delete("/:id", bootcamp.deleteBootCamp)

router.put("/:id", bootcamp.updateBootCamp)

router.get('/radius/:zipCode/:distance', bootcamp.getBootCampsInRadius)

//include other resource routers
router.use("/:bootcampId/courses", courseRouter)


module.exports = router;