const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const slugify = require("slugify");
const geoCoder = require("../utils/geocoder")

const BootcampSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is Required"],
        trim: true,
        unique: true,
        maxlength: [50, "Name must contain more tha 50 characters"]
    },

    slug: String,

    description: {
        type: String,
        required: [true, 'Please add  description'],
        maxlength: [500, "Slug must contain less tha 500 characters"]
    },

    website: {
        type: String,
        match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, "Website must be formatted correctly"]
    },

    phone: {
        type: "String",
        maxlength: [20, "Phone must contain less than 20 charcters"]
    },

    email: {
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Email Must be formatted correctly"]
    },

    address: {
        type: String,
        required: [true, "Address Field is required"]
    },

    location: {
        type: {
            type: String,
            enum: ['Point'],
            //required:true
        },

        coordinates: {
            type: [Number],
            index: '2dsphere'
        },

        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String

    },

    careers: {
        type: [String],
        required: true,
        enum: ['Web Development', 'Mobile Development', 'UI/UX', 'Data Science', 'Business', 'Other']
    },

    averageRating: {
        type: Number,
        min: [1, "Must be More than 1"],
        max: [1, "Must be less than 10"]
    },

    averageCost: Number,

    photo: {
        type: String,
        default: "no-photo.jpg"
    },

    housing: {
        type: Boolean,
        default: false
    },

    jobAssistance: {
        type: Boolean,
        default: false
    },

    jobGuarantee: {
        type: Boolean,
        default: false
    },

    acceptGi: {
        type: Boolean,
        default: false
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})


//create bootcamp slug from name
BootcampSchema.pre('remove', async function (next) {

    try {
        await this.model('Courses').deleteMany({
            bootcamp: this._id
        })
        console.log(this._id)
        next()
    } catch (err) {
        console.log(err)
    }
})
BootcampSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {
        lower: true
    })

    next();
})

BootcampSchema.pre('save', async function (next) {

    const loc = await geoCoder.geocode(this.address)
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipCode: loc[0].zipCode,
        country: loc[0].countryCode,
    }

    this.address = undefined
    next()
})



module.exports = mongoose.model("Bootcamp", BootcampSchema)