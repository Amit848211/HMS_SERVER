import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required:true,
    minLength: [3, "first name must contain at least 3 character"],
  },
  lastName: {
    type: String,
    required:true,
    minLength: [3, "last name must contain at least 3 character"],
  },
  email: {
    type: String,
    required:true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  phone: {
    type: String,
    required:true,
    minLength: [11, "Phone number must contain exact 11 digits"],
    maxLength: [11, "Phone number must contain exact 11 digits"],
  },
  message:{
    type: String,
    required:true,
    minLength: [10, "message must contain at least 10 character"],
  }
});



export const Message= mongoose.model("Message",messageSchema)
