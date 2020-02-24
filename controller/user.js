const User = require("../Model/User")

exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    user.save();
    return res.status(201).json({
      data: user
    })
  } catch (error) {
    console.log(error)
  }
}

exports.getUsers = async (req, res, next) => {
  try {
    const user = await User.find();
    return res.status(200).json({
      success: true,
      length: user.length,
      data: user
    })
  } catch (err) {
    console.log(err)
  }

}

exports.getUser = async (req, res, next) => {

  try {
    const user = await User.findById(req.params.id);
    return res.status(200).json(user)
  } catch (err) {
    console.log(err)
  }
}

exports.updateUser = async (req, res, next) => {

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    return res.status(200).json(user)
  } catch (err) {
    console.log(err)
  }
}

exports.deleteUser = async (req, res, next) => {

  try {
    const user = await User.findById(req.params.id);
    user.remove()
    return res.status(200).json({
      success: true,
      data: `User with ID ${req.params.id} Deleted`
    })
  } catch (err) {
    console.log(err)
  }
}