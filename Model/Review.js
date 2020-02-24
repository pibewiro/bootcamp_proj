const mongoose = require("mongoose");
const Schema = mongoose.Schema

const ReviewSchema = new Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Titile Field is Required']
  },
  text: {
    type: String,
    required: [true, 'Titile Field is Required']
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp"
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }
})

ReviewSchema.index({
  bootcamp: 1,
  user: 1
}, {
  unique: true
})


ReviewSchema.statics.getAverageRating = async function (bootcampID) {
  const obj = await this.aggregate([{
      $match: {
        bootcamp: bootcampID
      }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: {
          $avg: '$rating'
        }
      }
    }
  ])

  console.log(obj)

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampID, {
      averageRating: obj[0].averageRating
    })
  } catch (err) {
    console.log(err)
  }
}

ReviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.bootcamp)
})

ReviewSchema.pre('remove', function () {
  this.constructor.getAverageRating(this.bootcamp)
})

module.exports = mongoose.model("Review", ReviewSchema)