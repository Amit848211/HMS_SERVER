import { catchAsyncErrors } from "../middleware/catchAsyncError.js";
import ErrorHandler, { errorMiddleware } from "../middleware/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtTokens.js";
import cloudinary from "cloudinary"





export const patientRegister = catchAsyncErrors(async (req,res,next)=>{
     const{firstName,lastName,email,phone,dob,role,gender,password,nic} =req.body;
     if(!firstName || !lastName || !email || !password || !phone || !gender || !nic || !dob || !role){
        return next(new ErrorHandler("Please fill full form!",400))
     }
     const isRegistered = await User.findOne({email})
     if(isRegistered){
        return next(new ErrorHandler("User Already Registerd!",400))
     }
     const user =await User.create({
        firstName,lastName,email,phone,password,gender,dob,nic,role,
     });
     generateToken(user,"User Registered!",200,res)
})


export const login = catchAsyncErrors(async (req,res,next)=>{
   const {email,password,confirmPassword,role}=req.body;
   if(!email || !password || !confirmPassword || !role){
      return next(new ErrorHandler("Please fill full form!",400))
   }
   if(password !==confirmPassword){
      return next(new ErrorHandler("Password and Confirm Password Do Not Match!",400))
   }
   const user = await User.findOne({email}).select("+password")
   if(!user){
      return next(new ErrorHandler("Invalid password or Email!",400))
   }
   const isPasswordMatched = await user.comparePassword(password)
   if(!isPasswordMatched){
      return next(new ErrorHandler("Invalid password or Email!",400))
   }
   if(role !==user.role){
      return next(new ErrorHandler("User with this role not found!",400))
   }
    generateToken(user,"User User Loggin successfully!",200,res)
   
   
   
})


export const addNewAdmin = catchAsyncErrors(async (req,res,next)=>{
   const{firstName,lastName,email,phone,dob,gender,password,nic} =req.body;
   if(!firstName || !lastName || !email || !password || !phone || !gender || !nic || !dob ){
      return next(new ErrorHandler("Please fill full form!",400))
   }


   const isRegistered =await User.findOne({email});
   if(isRegistered){
      return next(new ErrorHandler(`${isRegistered.role} User Already Registerd!`,400))
   }
   const user =await User.create({
      firstName,lastName,email,phone,password,gender,dob,nic,role:"Admin"
   });
   res.status(200).json({
      success:true,
      message:"New Admin Registerd!"
   })
})


export const getAllDoctors = catchAsyncErrors(async (req,res,next)=>{
   const doctors =await User.find({role:"Doctor"}
   );
   res.status(200).json({
       success:true,
       doctors
   })
})

export const getUserDetails = catchAsyncErrors(async (req,res)=>{
   const user =req.user;
   res.status(200).json({
       success:true,
       user
   })
})


export const logoutAdmin = catchAsyncErrors(async (req,res,next)=>{
   res.status(200).cookie("adminToken","",{
       httpOnly:true,
       expires:new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
       secure:true,
       sameSite:"None"
   }).json({
       success:true,
       message:"Admin Log Out Successfully!"
   })
})


export const logoutPatient = catchAsyncErrors(async (req,res,next)=>{
   res.status(200).cookie("patientToken","",{
       httpOnly:true,
       expires:new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
       secure:true,
       sameSite:"None"
   }).json({
       success:true,
       message:"Patient Log Out Successfully!"
   })
})



 // add new doctor


export const addNewDoctor =catchAsyncErrors(async (req,res,next)=>{
   if(!req.files || Object.keys(req.files).length === 0){
      return next(new ErrorHandler("Doctor Avatar Required!",400))
   }
   const {docAvatar}=req.files;
   const allowedFormats =["image/png","image/jpg","image/jpeg","image/webp"];
   if(!allowedFormats.includes(docAvatar.mimetype)){
      return next(new ErrorHandler("Files Format Not Supported!",400));
   }
   const{
      firstName,lastName,email,phone,password,gender,dob,nic,doctorDepartment
   }=req.body;
   if(!firstName || !lastName || !email || !password || !phone || !gender || !nic || !dob || !doctorDepartment ){
      return next(new ErrorHandler("Please fill full form!",400))
   }

   const isRegistered =await User.findOne({email});
   if(isRegistered){
   return next(new ErrorHandler(`${isRegistered.role} User Already Registerd!`,400))
}  

const cloudinaryResponse =await cloudinary.uploader.upload(docAvatar.tempFilePath)
if(!cloudinaryResponse || cloudinaryResponse.error){
   console.error("cloudinary Error",cloudinaryResponse.error || "Unknown cloudinary Error");
}
const user =await User.create({
   firstName,lastName,email,phone,password,gender,dob,nic, doctorDepartment,role:"Doctor",docAvatar:{
      public_id:cloudinaryResponse.public_id,
      url:cloudinaryResponse.secure_url
   }
});
res.status(200).json({
   success:true,
   message:"New Doctor Registerd!"
})



})