const jwt = require("jsonwebtoken")
const User = require("../Model/User")

exports.protect = async (req, res, next) => {

  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(404).json({
      success: false,
      error: "No Token Found"
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    console.log(req.user)

    next();
  } catch (err) {
    return res.status(404).json({
      success: false,
      error: "Invalid Token"
    })
  }

}

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized Role'
      })
    }

    next();
  }
}