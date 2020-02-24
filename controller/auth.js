const User = require("../Model/User")
const sendMail = require("../utils/sendEmail")
const crypto = require("crypto")


exports.register = async (req, res, next) => {

  const {
    name,
    email,
    password,
    role
  } = req.body;


  const user = await User.create({
    name,
    email,
    password,
    role
  })

  const token = user.getSignedToken()

  res.status(201).json({
    success: true,
    data: user,
    token
  })
}

exports.login = async (req, res, next) => {
  const {
    email,
    password
  } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Email is required'
    })
  }

  if (!password) {
    return res.status(400).json({
      success: false,
      error: 'Password is required'
    })
  }

  const user = await User.findOne({
    email
  }).select("+password")

  if (!user) {
    return res.status(400).json({
      success: false,
      error: 'Invalid Login Credentials'
    })
  }

  const isMatch = await user.matchPasswords(password)

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      error: 'Invalid Login Credentials'
    })
  }

  const token = user.getSignedToken();
  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true
  }

  return res.status(200).cookie('token', token, options).json({
    success: true,
    data: user
  })
}

exports.forgotPassword = async (req, res, next) => {

  try {
    const user = await User.findOne({
      email: req.body.email
    })

    if (!user) {
      return res.status(400).json({
        error: 'No User Found'
      })
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({
      validateBeforeSave: false
    });

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
    const message = `This link to reset the password ${resetURL}`;
    try {
      await sendMail({
        email: user.email,
        subject: "Reset Password",
        message
      })

      res.status(200).json({
        success: true,
        data: 'Email Sent'
      })
    } catch (err) {
      console.log(err)
    }
  } catch (err) {
    console.log(err)
  }
}

exports.resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now()
    }
  })
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'No User Found'
    })
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = user.getSignedToken();
  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true
  }

  return res.status(200).cookie('token', token, options).json({
    success: true,
    data: 'Password Reset'
  })
}

exports.updateDetails = async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  }

  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "No User Found"
      })
    }

    return res.status(200).json({
      success: true,
      data: user
    })
  } catch (err) {
    console.log(err)
  }
}

exports.updatePassword = async (req, res, next) => {

  try {
    const user = await User.findById(req.params.id).select('+password')

    if (!user) {
      return res.status(404).json({
        success: false,
        data: "User Does not exist"
      })
    }

    if (!await user.matchPasswords(req.body.currentPassword)) {
      return res.status(400).json({
        success: false,
        data: "Passwords Don't Match"
      })
    }

    user.password = req.body.newPassword;
    await user.save();

    const token = user.getSignedToken();
    const options = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true
    }

    return res.status(200).cookie('token', token, options).json({
      success: true,
      data: user
    })

  } catch (err) {
    console.log(err)
  }
}