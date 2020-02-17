const mongoose = require("mongoose")
const Bootcamp = require("../Model/Bootcamp")
const ErrorResponse = require("../utils/errorResponse")
const geoCoder = require("../utils/geocoder")

exports.getBootCamps = async(req, res, next) => {

    let queryStr = JSON.stringify(req.query)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);
    console.log(queryStr)
    let query = JSON.parse(queryStr)

    try{
        const bootCamps = await Bootcamp.find().skip(0).limit(1);
        return res.status(200).json({success:true, length:bootCamps.length, data:bootCamps})
    }

    catch(err)
    {
        console.log(err)
        return res.status(400).json({success:false})
    }
}

exports.postBootCamp = async(req, res, next) => {
    
    try{
        const bootcamp = await Bootcamp.create(req.body)
        return res.status(201).json({success:true, data:bootcamp})
    }

    catch(err)
    {
        next(err)
    }

}

exports.getBootCamp = async(req, res, next) => {
    
    try{
        const bootcamp = await Bootcamp.findById(req.params.id) 

        if(!bootcamp){
            return next(new ErrorResponse(`ID does not exist ${req.params.id}`, 404))
        }

        return res.status(200).json({success:true, data:bootcamp})
    }

    catch(err)
    {
        next(err)
    }
}

exports.deleteBootCamp = async(req, res, next) => {
    
    try{
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id) 

        if(!bootcamp){
            return res.status(400).json({success:false})
        }

        return res.status(200).json({success:true, msg:"Info Deleted"})

    }

    catch(err)
    {
        return res.status(500).json({success:false, err})
    }
}

exports.updateBootCamp = async(req,res,next) => {

        try{
            const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true})
            return res.status(200).json({success:true, msg:bootcamp})

            if(!bootcamp)
            {
                return res.status(500).json({success:false, msg:"Id does not exist"})
            }
        }

        catch(err)
        {
            return res.status(500).json({success:false, err})
        }
    
}

//@get bootcamps within  a radius
//route get /api/v1/bootcamps/radius/:zipCode/:distance
exports.getBootCampsInRadius = async(req,res, next) => {

    const {zipCode, distance} = req.params;
    const loc = await geoCoder.geocode(zipCode);
    const lng = loc[0].longitude;
    const lat = loc[0].latitude;
    const radius = distance/3963;

    try{
        const bootcamps = await Bootcamp.find({
            location:{$geoWithin:{$centerSphere:[[lng, lat], radius]}}
        })

        return res.status(200).json({success:true, count:bootcamps.count, data:bootcamps})
    }

    catch(err)
    {
        console.log(err)
    }


}