import jwt from "jsonwebtoken";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./errorMiddleware.js";
import { User } from "../models/userSchema.js";

export const isAdminAuthenticated =catchAsyncErrors(async (req,res,next)=>{
      console.log(req.cookies.adminToken);
    const token = req.cookies.adminToken;
    if(!token){
        return next(new ErrorHandler("Admin Not Authenticated!",400))
    }
    const decode = jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user =await User.findById(decode.id);
    if(req.user.role !== "Admin"){
        return next(new ErrorHandler(`${isRegistered.role} User Already Registerd!`,403))
    }
    next()
})

export const isPatientAuthenticated =catchAsyncErrors(async (req,res,next)=>{
    const token =req.cookies.patientToken;
    if(!token){
        return next(new ErrorHandler("Patient Not Authenticated!",400))
    }
    const decode = jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user =await User.findById(decode.id);
    console.log(res.user);
    if(req.user.role !== "Patient"){
        return next(new ErrorHandler(`${req.user.role} User Already Registerd!`,403))
    }
    next()
})

























