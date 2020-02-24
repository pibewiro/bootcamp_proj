const mongoose = require("mongoose");
const Schema = mongoose.Schema

const courseSchema = new Schema({
  title: {
    type: String,
    trim: true,
    require: [true, 'Title is required']
  },
  description: {
    type: String,
    require: [true, 'Descriptiion is required']
  },
  weeks: {
    type: String,
    require: [true, 'Weeks is required']
  },
  tuition: {
    type: Number,
    required: [true, 'Tuition is required']
  },
  minimumSkill: {
    type: String,
    required: [true, 'Skill is required'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
    required: true
  },

  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  }
})

courseSchema.statics.getAverageCost = async function (bootcampID) {
  const obj = await this.aggregate([{
      $match: {
        bootcamp: bootcampID
      }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: {
          $avg: '$tuition'
        }
      }
    }
  ])

  console.log(obj)

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampID, {
      averageCost: obj[0].averageCost
    })
  } catch (err) {
    console.log(err)
  }
}

courseSchema.post('save', function () {
  this.constructor.getAverageCost(this.bootcamp)
})

courseSchema.pre('remove', function () {
  this.constructor.getAverageCost(this.bootcamp)
})



module.exports = mongoose.model('Courses', courseSchema)