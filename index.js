import express from "express"
import { configDotenv } from "dotenv"
import cors from "cors"
import fileUpload from "express-fileupload"
import { connectDB } from "./config/db.js"
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary"
import messageRoute from "./route/messageRoute.js"
import userRoute from "./route/userRouter.js"
import appointmentRouter from "./route/appointmentRouter.js"
import { errorMiddleware } from "./middleware/errorMiddleware.js"




configDotenv()



const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(
    cors({
      origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL],
      method: ["GET", "POST", "DELETE", "PUT"],
      credentials: true,
    })
  );
  
app.use(cookieParser());
app.use(fileUpload({useTempFiles:true,tempFileDir:"/tmp/"}))



const port =process.env.PORT || 4040


connectDB()

cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})



app.use("/api/v1/message",messageRoute)
app.use("/api/v1/user",userRoute)
app.use("/api/v1/appointment",appointmentRouter)




app.use(errorMiddleware)
app.listen(port,()=>{
    console.log(`app is running on http://localhost:${port}`);
})