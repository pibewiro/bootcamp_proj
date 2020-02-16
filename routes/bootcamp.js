const express = require("express")
const router = express.Router();
const bootcamp = require("../controller/bootcamp")

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


module.exports = router;