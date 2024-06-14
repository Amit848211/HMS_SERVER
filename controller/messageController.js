import { catchAsyncErrors } from "../middleware/catchAsyncError.js";
import ErrorHandler, { errorMiddleware } from "../middleware/errorMiddleware.js";
import { Message } from "../models/messageSchema.js";

export const sendMessage =catchAsyncErrors( async (req,res,next)=>{
  const{firstName,lastName,email,phone,message}=req.body;
  if(!firstName || !lastName || !email || !phone || !message){
    return next(new ErrorHandler("Please fill full form!",400))
      
  }
  await Message.create({firstName,lastName,email,phone,message})
  res.status(200).json({
    success:true,message:"Message send successfully"
  })
})


export const getsAllMessage =catchAsyncErrors(async (req,res,next)=>{
  const messages = await Message.find();
  res.status(200).json({
    success:true,
    messages
  })
})