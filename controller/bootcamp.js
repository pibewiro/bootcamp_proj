const mongoose = require("mongoose")
const Bootcamp = require("../Model/Bootcamp")
const ErrorResponse = require("../utils/errorResponse")
const geoCoder = require("../utils/geocoder")
const path = require("path")
exports.getBootCamps = async (req, res, next) => {
    let queryStr = JSON.stringify(req.query)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    //console.log(queryStr)
    let query = JSON.parse(queryStr)

    try {
        const bootCamps = await Bootcamp.find();
        return res.status(200).json({
            success: true,
            length: bootCamps.length,
            data: bootCamps
        })
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            success: false
        })
    }
}

exports.postBootCamp = async (req, res, next) => {

    req.body.user = req.user.id
    const publishedBootcamp = await Bootcamp.findOne({
        user: req.user.id
    })

    if (publishedBootcamp && req.user.role !== 'admin') {
        return res.status(401).json({
            success: false,
            error: `Unauthorized User ${req.user.id} already has one bootcamp created`
        })
    }

    try {
        const bootcamp = await Bootcamp.create(req.body)
        return res.status(201).json({
            success: true,
            data: bootcamp
        })
    } catch (err) {
        next(err)
    }

}

exports.getBootCamp = async (req, res, next) => {

    try {
        const bootcamp = await Bootcamp.findById(req.params.id)

        if (!bootcamp) {
            return next(new ErrorResponse(`ID does not exist ${req.params.id}`, 404))
        }

        return res.status(200).json({
            success: true,
            data: bootcamp
        })
    } catch (err) {
        next(err)
    }
}

exports.deleteBootCamp = async (req, res, next) => {

    try {
        const bootcamp = await Bootcamp.findById(req.params.id)

        if (!bootcamp) {
            return res.status(400).json({
                success: false
            })
        }
        console.log(bootcamp.user.toString(), req.user._id.toString())
        if (req.user._id.toString() !== bootcamp.user.toString() || req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                error: "Unauthorized"
            })
        }

        await bootcamp.remove();

        return res.status(200).json({
            success: true,
            msg: "Info Deleted"
        })



    } catch (err) {
        return res.status(500).json({
            success: false,
            err
        })
    }
}

exports.updateBootCamp = async (req, res, next) => {

    try {
        let bootcamp = await Bootcamp.findById(req.params.id)

        console.log(bootcamp.user)
        console.log(req.user._id)

        if (req.user._id.toString() !== bootcamp.user.toString() || req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                error: "Unauthorized"
            })
        }

        if (!bootcamp) {
            return res.status(500).json({
                success: false,
                msg: "Id does not exist"
            })
        }

        bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })



        return res.status(200).json({
            success: true,
            msg: bootcamp
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            err
        })
    }

}

//@get bootcamps within  a radius
//route get /api/v1/bootcamps/radius/:zipCode/:distance
exports.getBootCampsInRadius = async (req, res, next) => {

    const {
        zipCode,
        distance
    } = req.params;
    const loc = await geoCoder.geocode(zipCode);
    const lng = loc[0].longitude;
    const lat = loc[0].latitude;
    const radius = distance / 3963;

    try {
        const bootcamps = await Bootcamp.find({
            location: {
                $geoWithin: {
                    $centerSphere: [
                        [lng, lat], radius
                    ]
                }
            }
        })

        return res.status(200).json({
            success: true,
            count: bootcamps.count,
            data: bootcamps
        })
    } catch (err) {
        console.log(err)
    }
}

exports.uploadPhoto = async (req, res, next) => {
    console.log(req.files.file.name)
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return res.status(404).json({
            success: false,
            message: 'No bootcamp found'
        })
    }

    if (!req.files) {
        return res.status(400).json({
            success: false,
            message: 'No file found'
        })
    }


    if (!req.files.file.mimetype.startsWith('image')) {
        return res.status(400).json("Upload an image damnit")
    }

    if (req.files.file.size > process.env.MAX_FILE_UPLOAD) {
        return res.status(400).json("File size is too damn big")
    }

    const orginalfilename = req.files.file.name.split('.')[0]
    console.log(orginalfilename)
    const customName = `photo_${bootcamp._id}${orginalfilename}${path.parse(req.files.file.name).ext}`
    console.log(customName)
    req.files.file.mv(`${process.env.FILE_UPLOAD_PATH}/${customName}`, async (err) => {
        if (err) {
            console.log(err)
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, {
            photo: customName
        })

        return res.status(200).json({
            success: true,
            data: customName
        })
    })
}