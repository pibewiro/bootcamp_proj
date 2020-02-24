const express = require("express")
const router = express.Router();
const auth = require("../controller/auth")
const {
  protect
} = require("../middleware/auth")

router.post("/register", auth.register)
router.post("/login", auth.login)
router.post("/forgot-password", auth.forgotPassword)
router.post("/resetpassword/:resetToken", auth.resetPassword)
router.put("/updateDetails/:id", protect, auth.updateDetails)
router.put("/updatePassword/:id", protect, auth.updatePassword)






module.exports = router;