const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")

const UserSchema = new Schema({
  name: {
    type: "string",
    required: [true, "Name is required"]
  },

  email: {
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Email Must be formatted correctly"],
    required: [true, 'Email is required'],
    unique: true

  },

  role: {
    type: String,
    enum: ['user', 'publisher'],
    default: "user"
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }

})

UserSchema.pre("save", async function (next) {

  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.getSignedToken = function () {
  return jwt.sign({
    id: this._id
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  })
}

UserSchema.methods.matchPasswords = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex')
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000
  return resetToken;
}



module.exports = mongoose.model('User', UserSchema)